import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'wouter'
import { ArrowRight, Bookmark, ChevronRight, Sparkles, Info } from 'lucide-react'
import { subjects, getSubject, locateTopic, themeForPath } from '../content'
import type { Familiarity, Path } from '../content/types'
import { useStore } from '../store/store'
import { enroll, pathProgress, reelsUntilQuiz, uid, xpToday } from '../learning/engine'
import { Art, subjectMotif } from '../ui/Art'
import { GoalRing, ThemeToggle, Ticks, Wordmark, relTime, toast } from '../ui/common'
import { getPath, learnUrl, overviewUrl } from '../ui/paths'
import { Sheet } from '../ui/Sheet'
import { getGenerationStatus, requestGeneration } from '../services/ai'
import type { AppState, CustomRequest } from '../store/schema'

export function InterestsHome() {
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const [startPath, setStartPath] = useState<Path | null>(null)
  const needsOnboarding = !state.onboarded || state.interests.length === 0

  const active = useMemo(
    () =>
      Object.values(state.enrollments)
        .map((e) => ({ e, path: getPath(state, e.pathId) }))
        .filter((x): x is { e: typeof x.e; path: Path } => !!x.path && !x.path.courseId)
        .sort((a, b) => b.e.lastOpenedAt - a.e.lastOpenedAt),
    [state],
  )

  const start = (path: Path, fam: Familiarity) => {
    update((s) => enroll(s, path.id, fam))
    const first = path.modules[0]?.topics[0]
    setStartPath(null)
    if (first) navigate(learnUrl(path, first.id))
  }

  if (needsOnboarding) return <Onboarding />

  const [lead, ...others] = active
  const startable = subjects.filter((s) => state.interests.includes(s.id)).flatMap((s) => s.pathIds.map((id) => getPath(state, id)!).filter(Boolean))

  return (
    <div className="page">
      <Header />
      {lead ? <ContinueHero path={lead.path} /> : <FirstRun onStart={setStartPath} paths={startable} />}

      {others.length > 0 && (
        <section className="section" aria-labelledby="also">
          <div className="section-head">
            <h2 id="also" className="eyebrow">Also in progress</h2>
          </div>
          <ul className="rows">
            {others.map(({ path }) => {
              const p = pathProgress(state, path)
              const sub = getSubject(path.subjectId)
              return (
                <li key={path.id}>
                  <button type="button" className="row" onClick={() => navigate(p.nextTopicId ? learnUrl(path, p.nextTopicId) : overviewUrl(path))}>
                    <span className="swatch surface" data-subject={themeForPath(path)}>
                      <Art motif={subjectMotif[themeForPath(path)]} />
                    </span>
                    <span>
                      <span className="row-title">{path.title}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        {sub?.name} · {p.checkpointsDone}/{p.totalTopics} checkpoints
                      </span>
                    </span>
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {lead && (
        <section className="section" aria-labelledby="start">
          <div className="section-head">
            <h2 id="start" className="eyebrow">Start another path</h2>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => update((s) => ({ ...s, onboarded: false }))}>
              Edit interests
            </button>
          </div>
          <Spreads paths={startable} onStart={setStartPath} />
        </section>
      )}

      <CustomRequestSection />

      <section className="section" aria-labelledby="saved-h">
        <div className="section-head">
          <h2 id="saved-h" className="eyebrow">Saved</h2>
        </div>
        <ul className="rows">
          <li>
            <button type="button" className="row" onClick={() => navigate('/interests/saved')}>
              <Bookmark size={20} aria-hidden="true" />
              <span>
                <span className="row-title">Saved ideas and notes</span>
                <span className="row-sub" style={{ display: 'block' }}>
                  {state.bookmarks.length ? `${state.bookmarks.length} saved` : 'Bookmark any reel to keep it here'}
                </span>
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </li>
        </ul>
      </section>

      {startPath && <FamiliaritySheet path={startPath} onClose={() => setStartPath(null)} onStart={(f) => start(startPath, f)} />}
    </div>
  )
}

function Header() {
  const { state } = useStore()
  const today = xpToday(state)
  return (
    <header className="page-head">
      <Wordmark />
      <div className="cluster" style={{ marginLeft: 'auto' }}>
        <span className="cluster small muted" title="Daily goal">
          <GoalRing value={today} goal={state.settings.dailyGoalXp} />
          <span>
            {today}/{state.settings.dailyGoalXp} XP today
          </span>
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}

function ContinueHero({ path }: { path: Path }) {
  const { state } = useStore()
  const [, navigate] = useLocation()
  const prog = pathProgress(state, path)
  const topicId = prog.nextTopicId
  const loc = topicId ? locateTopic(path, topicId) : undefined
  const sub = getSubject(path.subjectId)
  const theme = themeForPath(path)
  const remaining = topicId ? reelsUntilQuiz(state, path, topicId) : 0
  const pending = topicId ? prog.pendingQuizTopicIds.includes(topicId) : false
  return (
    <section aria-labelledby="continue-h">
      <h2 id="continue-h" className="eyebrow" style={{ margin: '4px 0 12px' }}>
        Continue learning
      </h2>
      <div className="hero surface" data-subject={theme}>
        <div className="hero-art">
          <Art motif={loc?.topic.reels[0]?.visual.motif ?? subjectMotif[theme]} />
        </div>
        <div className="hero-body">
          <span className="eyebrow muted">
            {sub?.name} · {path.title}
          </span>
          {loc ? (
            <>
              <p className="display">{loc.topic.title}</p>
              <p style={{ maxWidth: '46ch', margin: 0 }}>{loc.topic.objective}</p>
              <div className="hero-meta muted">
                <span>
                  Module {loc.moduleIndex + 1}: {loc.module.title}
                </span>
                <span>
                  Topic {loc.topicIndex + 1} of {loc.module.topics.length}
                </span>
                <span>{pending ? 'Checkpoint quiz ready' : remaining === 0 ? 'Quiz after this reel' : `Quiz in ${remaining} reel${remaining > 1 ? 's' : ''}`}</span>
              </div>
              <div style={{ maxWidth: 360 }}>
                <Ticks total={prog.totalTopics} done={prog.checkpointsDone} />
                <span className="small muted">
                  {prog.checkpointsDone} of {prog.totalTopics} checkpoints passed
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="display">Path complete.</p>
              <p className="muted">Every checkpoint is done. Review keeps it fresh.</p>
            </>
          )}
          <div className="hero-actions">
            {loc && (
              <button type="button" className="btn" onClick={() => navigate(learnUrl(path, loc.topic.id))}>
                {pending ? 'Take the checkpoint' : 'Continue'} <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={() => navigate(overviewUrl(path))}>
              See the path
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FirstRun({ paths, onStart }: { paths: Path[]; onStart: (p: Path) => void }) {
  return (
    <section aria-labelledby="first">
      <p className="display" style={{ maxWidth: '11ch', margin: '12px 0 14px' }}>
        Turn curiosity into understanding.
      </p>
      <p className="muted" style={{ maxWidth: '52ch' }}>
        Pick a path. Each small topic is a few connected reels, then a three-question checkpoint that shows what you’ve understood.
      </p>
      <h2 id="first" className="eyebrow mt-24">
        Start a path
      </h2>
      <Spreads paths={paths} onStart={onStart} />
    </section>
  )
}

function Spreads({ paths, onStart }: { paths: Path[]; onStart: (p: Path) => void }) {
  const { state } = useStore()
  const [, navigate] = useLocation()
  if (!paths.length) return <p className="muted mt-16">Choose an interest to see paths.</p>
  return (
    <div className="spreads">
      {paths.map((path) => {
        const sub = getSubject(path.subjectId)!
        const enrolled = !!state.enrollments[path.id]
        const prog = pathProgress(state, path)
        const topics = path.modules.reduce((n, m) => n + m.topics.length, 0)
        return (
          <article key={path.id} className="spread surface" data-subject={sub.theme}>
            <div className="spread-art">
              <Art motif={path.modules[0].topics[0].reels[0].visual.motif} />
            </div>
            <div className="spread-body">
              <span className="cluster">
                <span className="eyebrow muted">{sub.name}</span>
                <span className="tag">Prepared path</span>
              </span>
              <h3 className="h2">{path.title}</h3>
              <p className="small muted" style={{ margin: 0 }}>
                {path.modules.length} module · {topics} topics · {sub.actionLabel.toLowerCase()}
              </p>
              <div className="cluster mt-8">
                {enrolled ? (
                  <button type="button" className="btn btn-sm" onClick={() => navigate(prog.nextTopicId ? learnUrl(path, prog.nextTopicId) : overviewUrl(path))}>
                    Continue
                  </button>
                ) : (
                  <button type="button" className="btn btn-sm" onClick={() => onStart(path)}>
                    Start
                  </button>
                )}
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(overviewUrl(path))}>
                  Topics
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function FamiliaritySheet({ path, onClose, onStart }: { path: Path; onClose: () => void; onStart: (f: Familiarity) => void }) {
  const [fam, setFam] = useState<Familiarity>('new')
  return (
    <Sheet
      title={`Start: ${path.title}`}
      onClose={onClose}
      footer={
        <button type="button" className="btn btn-accent" onClick={() => onStart(fam)}>
          Begin first topic <ArrowRight size={18} aria-hidden="true" />
        </button>
      }
    >
      <p className="h2" style={{ marginBottom: 10 }}>How familiar are you with {getSubject(path.subjectId)?.name.toLowerCase()}?</p>
      <p className="muted small">{path.familiarityNote}</p>
      <div role="radiogroup" aria-label="Familiarity" className="stack mt-16">
        {(
          [
            ['new', 'New to it', 'Include short primers on the basics.'],
            ['some', 'Some background', 'Skip the primers and go straight to the ideas.'],
          ] as const
        ).map(([v, label, sub]) => (
          <button key={v} type="button" role="radio" aria-checked={fam === v} className="q-opt" data-state={fam === v ? 'selected' : undefined} onClick={() => setFam(v)}>
            <span className="key">{fam === v ? '●' : ''}</span>
            <span>
              <b>{label}</b>
              <br />
              <span className="small muted">{sub}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="hint mt-16">You can change this later from the path page.</p>
    </Sheet>
  )
}

function Onboarding() {
  const { state, update } = useStore()
  const [picked, setPicked] = useState<string[]>(state.interests)
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  return (
    <div className="page">
      <header className="page-head">
        <Wordmark />
        <ThemeToggle />
      </header>
      <p className="display" style={{ maxWidth: '11ch', margin: '20px 0 16px' }}>
        Turn curiosity into understanding.
      </p>
      <p className="muted" style={{ maxWidth: '52ch' }}>
        Choose what you want to understand. Follow a structured path, and check your understanding as you go — across your interests and your courses.
      </p>
      <h2 className="eyebrow mt-24" id="pick">
        What are you curious about?
      </h2>
      <div className="spreads" role="group" aria-labelledby="pick">
        {subjects.map((s) => {
          const on = picked.includes(s.id)
          return (
            <button key={s.id} type="button" aria-pressed={on} className="spread surface" data-subject={s.theme} onClick={() => toggle(s.id)} style={{ border: 0, textAlign: 'left', padding: 0, outlineOffset: 3, boxShadow: on ? '0 0 0 3px var(--ink)' : undefined }}>
              <span className="spread-art">
                <Art motif={subjectMotif[s.theme]} />
              </span>
              <span className="spread-body">
                <span className="between">
                  <span className="h2">{s.name}</span>
                  <span className="tag">{on ? 'Selected' : 'Select'}</span>
                </span>
                <span className="small muted">{s.blurb}</span>
              </span>
            </button>
          )
        })}
      </div>
      <div className="cluster mt-24">
        <button
          type="button"
          className="btn btn-accent"
          disabled={!picked.length}
          onClick={() => {
            update((s) => ({ ...s, interests: picked, onboarded: true }))
            window.scrollTo(0, 0)
          }}
        >
          Continue <ArrowRight size={18} aria-hidden="true" />
        </button>
        <span className="small muted">{picked.length ? `${picked.length} selected` : 'Pick at least one'}</span>
      </div>
      <p className="hint mt-16">Something else in mind? You can ask for a custom topic on the next screen.</p>
    </div>
  )
}

function CustomRequestSection() {
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const [text, setText] = useState('')
  const [fam, setFam] = useState<Familiarity>('new')
  const [configured, setConfigured] = useState<boolean | null>(null)
  useEffect(() => {
    getGenerationStatus().then((s) => setConfigured(s.configured))
  }, [])

  const submit = async () => {
    const goal = text.trim()
    if (goal.length < 3) return
    const req: CustomRequest = { id: uid('req'), text: goal, familiarity: fam, createdAt: Date.now(), status: configured ? 'generating' : 'saved' }
    update((s) => ({ ...s, requests: [req, ...s.requests] }))
    setText('')
    if (!configured) {
      toast('Request saved')
      return
    }
    await runGeneration(req, update)
  }

  return (
    <section className="section" aria-labelledby="custom-h">
      <div className="section-head">
        <h2 id="custom-h" className="eyebrow">
          Ask for something specific
        </h2>
        <span className="tag">
          <Sparkles size={12} aria-hidden="true" /> Personalised
        </span>
      </div>
      <div className="grid-2 mt-16">
        <div>
          <div className="field">
            <label htmlFor="goal">What do you want to understand?</label>
            <textarea id="goal" className="textarea" placeholder="e.g. How do central banks actually set interest rates?" value={text} onChange={(e) => setText(e.target.value)} maxLength={600} />
          </div>
          <div className="field">
            <span className="label" id="fam-l">
              Your familiarity
            </span>
            <div className="seg" role="group" aria-labelledby="fam-l">
              <button type="button" aria-pressed={fam === 'new'} onClick={() => setFam('new')}>
                New to it
              </button>
              <button type="button" aria-pressed={fam === 'some'} onClick={() => setFam('some')}>
                Some background
              </button>
            </div>
          </div>
          <button type="button" className="btn" disabled={text.trim().length < 3 || configured === null} onClick={submit}>
            {configured ? 'Build my path' : 'Save request'}
          </button>
        </div>
        <div>
          {configured === false && (
            <div className="notice">
              <Info size={18} aria-hidden="true" />
              <div>
                <b>Personalised paths aren’t switched on here yet.</b>
                <p className="small muted" style={{ margin: '4px 0 0' }}>
                  Rudra will keep your request so nothing is lost. Prepared paths above are fully available. Custom paths appear once generation is set up for this app.
                </p>
              </div>
            </div>
          )}
          {state.requests.length > 0 && (
            <ul className="rows mt-8" aria-label="Your requests">
              {state.requests.map((r) => (
                <li key={r.id}>
                  <button type="button" className="row" onClick={() => navigate(`/interests/request/${r.id}`)}>
                    <Sparkles size={18} aria-hidden="true" />
                    <span>
                      <span className="row-title">{r.text}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        {relTime(r.createdAt)}
                      </span>
                    </span>
                    <RequestTag r={r} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export function RequestTag({ r }: { r: CustomRequest }) {
  switch (r.status) {
    case 'ready':
      return <span className="tag tag-good">Path ready</span>
    case 'generating':
      return <span className="tag tag-warn">Building…</span>
    case 'failed':
      return <span className="tag tag-bad">Failed</span>
    default:
      return <span className="tag">Saved · waiting</span>
  }
}

export async function runGeneration(req: CustomRequest, update: (fn: (s: AppState) => AppState) => void) {
  update((s) => ({ ...s, requests: s.requests.map((r) => (r.id === req.id ? { ...r, status: 'generating', error: undefined } : r)) }))
  try {
    const { path } = await requestGeneration({ kind: 'goal', goal: req.text, familiarity: req.familiarity })
    update((s) => ({
      ...s,
      generated: { ...s.generated, [path.id]: path },
      requests: s.requests.map((r) => (r.id === req.id ? { ...r, status: 'ready', pathId: path.id } : r)),
    }))
    toast('Your path is ready')
  } catch (err) {
    update((s) => ({ ...s, requests: s.requests.map((r) => (r.id === req.id ? { ...r, status: 'failed', error: err instanceof Error ? err.message : 'Generation failed' } : r)) }))
  }
}
