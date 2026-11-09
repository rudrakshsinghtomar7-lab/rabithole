import { useMemo, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { ArrowLeft, ArrowRight, Clock, HelpCircle, Shuffle, Sparkles, Settings2, LifeBuoy } from 'lucide-react'
import { allTopics, findReel, questionsByConcept, themeForPath, actionLabelForPath } from '../content'
import type { Path, Question } from '../content/types'
import { useStore } from '../store/store'
import type { AppState, ReviewCard, Scope } from '../store/schema'
import { DEFAULT_INTERVALS } from '../store/schema'
import { applyReviewAnswer, conceptKey, dueCards, helpCards, isCheckpointDone, recordAttempt, scheduleReview, scopeOf, topicKey, topicStatus, totalXp, type QuestionResult } from '../learning/engine'
import { QuizRunner, newProgress, type QuizProgress } from '../ui/Quiz'
import { ReelContent } from '../ui/ReelView'
import { Empty, ThemeToggle, Wordmark, relTime } from '../ui/common'
import { getPath } from '../ui/paths'
import { Sheet } from '../ui/Sheet'

type ScopeFilter = 'interest' | 'course' | 'both'
const asScope = (f: ScopeFilter): Scope | undefined => (f === 'both' ? undefined : f)

const ACRONYMS: Record<string, string> = { r: 'R' }
function humanise(conceptId: string, pathId: string): string {
  const words = conceptId.replace(`${pathId}-`, '').replace(/^econ-/, '').split('-')
  const text = words.map((w) => ACRONYMS[w] ?? w).join(' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function conceptLabel(state: AppState, card: Pick<ReviewCard, 'pathId' | 'conceptId'>): { title: string; path?: Path; reelTitle?: string } {
  const path = getPath(state, card.pathId)
  if (!path) return { title: humanise(card.conceptId, card.pathId) }
  const q = questionsByConcept(path).get(card.conceptId)?.[0]
  const reel = q ? findReel(path, q.reelId) : undefined
  return { title: humanise(card.conceptId, path.id), path, reelTitle: reel?.reel.title }
}

function practiceTopics(state: AppState, scope?: Scope) {
  const out: { path: Path; topicId: string }[] = []
  for (const k of Object.keys(state.checkpoints)) {
    if (k.includes(':challenge:')) continue
    const [pid, ...rest] = k.split(':')
    const path = getPath(state, pid)
    if (!path || (scope && scopeOf(path) !== scope)) continue
    out.push({ path, topicId: rest.join(':') })
  }
  return out
}

export function ReviewHome() {
  const { state } = useStore()
  const [, navigate] = useLocation()
  const [filter, setFilter] = useState<ScopeFilter>('both')
  const [settings, setSettings] = useState(false)
  const scope = asScope(filter)
  const due = dueCards(state, scope)
  const help = helpCards(state, scope)
  const practice = practiceTopics(state, scope)
  const upcoming = Object.values(state.review)
    .filter((c) => (!scope || c.scope === scope) && c.dueAt > Date.now())
    .sort((a, b) => a.dueAt - b.dueAt)
  const history = Object.values(state.review)
    .filter((c) => !scope || c.scope === scope)
    .flatMap((c) => c.history.filter((h) => h.mode === 'review' || h.mode === 'practice').map((h) => ({ ...h, card: c })))
    .sort((a, b) => b.at - a.at)
    .slice(0, 8)
  const start = (kind: string) => navigate(`/review/session/${kind}/${filter}`)
  const nothing = Object.keys(state.review).length === 0

  return (
    <div className="page">
      <header className="page-head">
        <Wordmark />
        <div className="cluster" style={{ marginLeft: 'auto' }}>
          <button type="button" className="icon-btn" aria-label="Review settings" onClick={() => setSettings(true)}>
            <Settings2 size={20} />
          </button>
          <ThemeToggle />
        </div>
      </header>
      <span className="eyebrow">Review</span>
      <h1 className="h1 mt-8">Come back to what you’ve learned.</h1>
      <div className="seg mt-16" role="group" aria-label="Show review from">
        {(
          [
            ['interest', 'Interests'],
            ['course', 'Courses'],
            ['both', 'Both'],
          ] as const
        ).map(([v, l]) => (
          <button key={v} type="button" aria-pressed={filter === v} onClick={() => setFilter(v)}>
            {l}
          </button>
        ))}
      </div>

      {nothing ? (
        <Empty title="Nothing to review yet.">
          <p>Finish a topic checkpoint and its ideas will appear here on a schedule.</p>
          <button type="button" className="btn mt-8" onClick={() => navigate('/interests')}>
            Go to My Interests
          </button>
        </Empty>
      ) : (
        <div className="grid-2 section">
          <div>
            <ReviewBlock
              icon={<Clock size={20} aria-hidden="true" />}
              title="Due for review"
              count={due.length}
              sub={due.length ? 'Scheduled from your past answers.' : upcoming[0] ? `Nothing due. Next one ${relTime(upcoming[0].dueAt)}.` : 'Nothing scheduled.'}
              action={due.length ? () => start('due') : undefined}
              actionLabel="Start review"
            >
              <ConceptRows cards={due.slice(0, 5)} />
            </ReviewBlock>
            <ReviewBlock icon={<LifeBuoy size={20} aria-hidden="true" />} title="Where you needed help" count={help.length} sub={help.length ? 'Concepts where your last answer used help or missed.' : 'No weak spots right now.'} action={help.length ? () => start('help') : undefined} actionLabel="Practise these">
              <ConceptRows cards={help.slice(0, 5)} />
            </ReviewBlock>
            <ReviewBlock icon={<Sparkles size={20} aria-hidden="true" />} title="Fresh practice" count={practice.length} sub={practice.length ? 'New questions on topics you’ve completed. Doesn’t change your schedule unless you miss one.' : 'Complete a checkpoint to unlock.'} action={practice.length ? () => start('fresh') : undefined} actionLabel="Practise" countLabel="topics" />
            <ReviewBlock icon={<Shuffle size={20} aria-hidden="true" />} title="Mixed questions" count={practice.length} sub={practice.length >= 2 ? 'Questions across related topics, shuffled — closer to how ideas show up in real problems.' : 'Complete two checkpoints to unlock.'} action={practice.length >= 2 ? () => start('mixed') : undefined} actionLabel="Mix it up" countLabel="topics" />
          </div>
          <div>
            <div className="section-head">
              <h2 className="eyebrow">Coming up</h2>
            </div>
            {upcoming.length ? (
              <ul className="rows">
                {upcoming.slice(0, 6).map((c) => (
                  <li key={c.key} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                    <span>
                      <span className="row-title">{conceptLabel(state, c).title}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        {conceptLabel(state, c).path?.title}
                      </span>
                    </span>
                    <span className="small muted">{relTime(c.dueAt)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small mt-8">Nothing scheduled ahead.</p>
            )}
            <div className="section-head mt-24">
              <h2 className="eyebrow">Recent reviews</h2>
            </div>
            {history.length ? (
              <ul className="rows">
                {history.map((h, i) => (
                  <li key={i} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                    <span>
                      <span className="row-title">{conceptLabel(state, h.card).title}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        {h.mode === 'review' ? 'Scheduled review' : 'Practice'} · {relTime(h.at)}
                      </span>
                    </span>
                    <OutcomeTag o={h.result} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small mt-8">No reviews yet.</p>
            )}
            <button type="button" className="btn btn-quiet btn-sm mt-16" onClick={() => setSettings(true)}>
              <HelpCircle size={16} aria-hidden="true" /> How scheduling works
            </button>
          </div>
        </div>
      )}
      {settings && <ScheduleSettings onClose={() => setSettings(false)} />}
    </div>
  )
}

export function OutcomeTag({ o }: { o: 'independent' | 'assisted' | 'missed' }) {
  return o === 'independent' ? <span className="tag tag-good">Independent</span> : o === 'assisted' ? <span className="tag tag-warn">With help</span> : <span className="tag tag-bad">Missed</span>
}

function ReviewBlock({ icon, title, count, sub, action, actionLabel, children, countLabel }: { icon: React.ReactNode; title: string; count: number; sub: string; action?: () => void; actionLabel: string; children?: React.ReactNode; countLabel?: string }) {
  return (
    <section className="section mt-0" style={{ marginBottom: 32 }}>
      <div className="section-head">
        <h2 className="h3 cluster">
          {icon} {title}
        </h2>
        <span className="small muted">
          {count} {countLabel ?? (count === 1 ? 'concept' : 'concepts')}
        </span>
      </div>
      <p className="small muted mt-8">{sub}</p>
      {children}
      {action && (
        <button type="button" className="btn btn-sm mt-8" onClick={action}>
          {actionLabel} <ArrowRight size={16} aria-hidden="true" />
        </button>
      )}
    </section>
  )
}

function ConceptRows({ cards }: { cards: ReviewCard[] }) {
  const { state } = useStore()
  if (!cards.length) return null
  return (
    <ul className="rows">
      {cards.map((c) => {
        const { title, reelTitle } = conceptLabel(state, c)
        const last = c.history[c.history.length - 1]
        return (
          <li key={c.key} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', minHeight: 56, padding: '10px 0' }}>
            <span>
              <span className="row-title">{title}</span>
              <span className="row-sub" style={{ display: 'block' }}>
                {reelTitle ? `${reelTitle} · ` : ''}last {relTime(c.lastAt)} · step {c.box + 1} of {state.settings.reviewIntervalsDays.length}
              </span>
            </span>
            {last && <OutcomeTag o={last.result} />}
          </li>
        )
      })}
    </ul>
  )
}

function ScheduleSettings({ onClose }: { onClose: () => void }) {
  const { state, update } = useStore()
  const [vals, setVals] = useState(state.settings.reviewIntervalsDays.join(', '))
  const [goal, setGoal] = useState(String(state.settings.dailyGoalXp))
  const parsed = vals
    .split(/[,\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0 && n <= 365)
  const valid = parsed.length >= 2 && parsed.every((n, i) => i === 0 || n >= parsed[i - 1])
  const goalN = Number(goal)
  return (
    <Sheet
      title="How review scheduling works"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => setVals(DEFAULT_INTERVALS.join(', '))}>
            Reset
          </button>
          <button
            type="button"
            className="btn"
            disabled={!valid || !(goalN >= 5 && goalN <= 500)}
            onClick={() => {
              update((s) => ({ ...s, settings: { ...s.settings, reviewIntervalsDays: parsed, dailyGoalXp: Math.round(goalN) } }))
              onClose()
            }}
          >
            Save
          </button>
        </>
      }
    >
      <p>
        Rudra uses a simple, visible rule — not a prediction of when you’ll forget. Each concept sits on a step. After a checkpoint or review:
      </p>
      <ul>
        <li>
          <b>Answered without help</b> → move up one step (longer gap).
        </li>
        <li>
          <b>Answered with help</b> → stay on the same step.
        </li>
        <li>
          <b>Missed</b> → back to the first step.
        </li>
      </ul>
      <p>The next review is due after the gap for that step. Practising early never pushes a concept further out; missing it brings it back.</p>
      <div className="field mt-16">
        <label htmlFor="iv">Gaps between reviews, in days (one per step)</label>
        <input id="iv" className="input" value={vals} onChange={(e) => setVals(e.target.value)} inputMode="numeric" aria-describedby="iv-h" />
        <span id="iv-h" className={`hint ${valid ? '' : 'tag-bad'}`}>
          {valid ? `Steps: ${parsed.map((n) => `${n}d`).join(' → ')}` : 'Enter at least two increasing numbers between 1 and 365.'}
        </span>
      </div>
      <div className="field">
        <label htmlFor="dg">Daily goal (XP)</label>
        <input id="dg" className="input" value={goal} onChange={(e) => setGoal(e.target.value)} inputMode="numeric" />
        <span className="hint">A checkpoint is worth 20 XP plus 5 for each answer you get without help. 5–500.</span>
      </div>
      <p className="hint">Changes apply to the next time each concept is scheduled.</p>
    </Sheet>
  )
}

interface SessionItem {
  question: Question
  pathId: string
  cardKey?: string
  cardDueAt?: number
}

function pickQuestion(path: Path, conceptId: string, seed: number): Question | undefined {
  const qs = questionsByConcept(path).get(conceptId) ?? []
  if (!qs.length) return undefined
  // Prefer a variant other than the first-seen one so review isn't just recall of the same wording.
  return qs[(seed + 1) % qs.length]
}

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildSession(state: AppState, kind: string, scope?: Scope): SessionItem[] {
  const fromCards = (cards: ReviewCard[]) =>
    cards.slice(0, 10).flatMap((c) => {
      const path = getPath(state, c.pathId)
      const q = path ? pickQuestion(path, c.conceptId, c.history.length) : undefined
      return q ? [{ question: { ...q, fresh: undefined } as Question, pathId: c.pathId, cardKey: c.key, cardDueAt: c.dueAt }] : []
    })
  if (kind === 'due') return fromCards(dueCards(state, scope))
  if (kind === 'help') return fromCards(helpCards(state, scope))
  const topics = practiceTopics(state, scope)
  if (kind === 'fresh') {
    return shuffle(
      topics.flatMap(({ path, topicId }) => {
        const t = allTopics(path).find((x) => x.topic.id === topicId)?.topic
        return (t?.quiz ?? []).map((q) => ({ question: { ...((q.fresh as Question) ?? q), fresh: undefined } as Question, pathId: path.id, cardKey: conceptKey(path.id, q.conceptId) }))
      }),
    ).slice(0, 8)
  }
  // mixed: one question per completed topic plus module challenge items, interleaved across topics
  const items = topics.flatMap(({ path, topicId }) => {
    const loc = allTopics(path).find((x) => x.topic.id === topicId)
    if (!loc) return []
    const pool = [...loc.topic.quiz, ...(loc.module.challenge?.questions ?? [])].filter((q) => q.skill !== 'recognise')
    const q = pool[Math.floor(Math.random() * pool.length)]
    return q ? [{ question: { ...q, fresh: undefined } as Question, pathId: path.id, cardKey: conceptKey(path.id, q.conceptId) }] : []
  })
  return shuffle(items).slice(0, 6)
}

export function ReviewSession() {
  const { kind, scope: scopeParam } = useParams<{ kind: string; scope: string }>()
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const scope = asScope((['interest', 'course', 'both'].includes(scopeParam) ? scopeParam : 'both') as ScopeFilter)
  const [items] = useState(() => buildSession(state, kind, scope))
  const [progress, setProgress] = useState<QuizProgress>(newProgress)
  const [results, setResults] = useState<QuestionResult[] | null>(null)
  const [xpGain, setXpGain] = useState(0)
  const byQ = useMemo(() => new Map(items.map((i) => [i.question.id, i])), [items])
  const titles: Record<string, string> = { due: 'Scheduled review', help: 'Where you needed help', fresh: 'Fresh practice', mixed: 'Mixed questions' }

  const applyAll = (base: AppState, res: QuestionResult[]): AppState => {
    let next = base
    for (const r of res) {
      const item = byQ.get(r.question.id)
      if (!item) continue
      const card = item.cardKey ? next.review[item.cardKey] : undefined
      if (card) {
        // For scheduled reviews use the instance that was due when the session started (stable XP identity).
        const instance = kind === 'due' || kind === 'help' ? { ...card, dueAt: item.cardDueAt ?? card.dueAt } : card
        next = applyReviewAnswer(next, instance, r.outcome)
      } else next = scheduleReview(next, item.pathId, r.question.conceptId, r.outcome, 'practice')
    }
    return next
  }

  const finish = (res: QuestionResult[]) => {
    setXpGain(totalXp(applyAll(state, res)) - totalXp(state))
    update((s) => applyAll(s, res))
    setResults(res)
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <button type="button" className="back-link" onClick={() => navigate('/review')}>
        <ArrowLeft size={16} aria-hidden="true" /> Review
      </button>
      <h1 className="h2 mt-8">{titles[kind] ?? 'Review'}</h1>
      {items.length === 0 ? (
        <Empty title="Nothing here right now.">
          <p>Come back when something is due, or try fresh practice.</p>
        </Empty>
      ) : results ? (
        <div className="mt-16">
          <p className="result-big">
            {results.filter((r) => r.outcome === 'independent').length}/{results.length}
          </p>
          <p className="muted">answered without help</p>
          <p aria-live="polite">
            {xpGain > 0 ? (
              <span className="xp-pop">
                <Sparkles size={16} aria-hidden="true" /> +{xpGain} XP for scheduled reviews
              </span>
            ) : (
              <span className="small muted">{kind === 'due' ? 'Review XP for these was already earned.' : 'Practice keeps ideas fresh; XP is given for scheduled reviews.'}</span>
            )}
          </p>
          <ul className="rows mt-16">
            {results.map((r) => {
              const item = byQ.get(r.question.id)
              const card = item?.cardKey ? state.review[item.cardKey] : undefined
              return (
                <li key={r.question.id} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                  <span>
                    <span className="row-title">{r.question.prompt}</span>
                    <span className="row-sub" style={{ display: 'block' }}>
                      {card ? `Next review ${relTime(card.dueAt)}` : ''}
                    </span>
                  </span>
                  <OutcomeTag o={r.outcome} />
                </li>
              )
            })}
          </ul>
          <button type="button" className="btn mt-16" onClick={() => navigate('/review')}>
            Done
          </button>
        </div>
      ) : (
        <div className="mt-16">
          <QuizRunner
            questions={items.map((i) => i.question)}
            progress={progress}
            setProgress={setProgress}
            mode={kind === 'due' ? 'review' : 'practice'}
            heading={<ItemContext item={byQ.get(items[Math.min(progress.index, items.length - 1)].question.id)!} />}
            onAttempt={(a) => {
              const item = byQ.get(a.question.id)
              if (item) update((s) => recordAttempt(s, { pathId: item.pathId, questionId: a.question.id, conceptId: a.question.conceptId, mode: a.mode, correct: a.correct, assisted: a.assisted, response: a.response, selfAssessed: a.selfAssessed }))
            }}
            onDone={finish}
            renderExplanation={(reelId) => {
              const item = byQ.get(items[Math.min(progress.index, items.length - 1)].question.id)
              const path = item ? getPath(state, item.pathId) : undefined
              const r = path ? findReel(path, reelId)?.reel : undefined
              return r && path ? (
                <div className="surface" data-subject={themeForPath(path)} style={{ padding: '16px 18px' }}>
                  <ReelContent reel={r} actionLabel={actionLabelForPath(path)} compact />
                </div>
              ) : null
            }}
          />
        </div>
      )}
    </div>
  )
}

function ItemContext({ item }: { item: SessionItem }) {
  const { state } = useStore()
  const path = getPath(state, item.pathId)
  if (!path) return null
  const card = item.cardKey ? state.review[item.cardKey] : undefined
  const topic = allTopics(path).find((t) => t.topic.quiz.some((q) => q.conceptId === item.question.conceptId))
  const done = topic ? isCheckpointDone(topicStatus(state, path.id, topic.topic.id)) : false
  return (
    <p className="small muted" style={{ marginBottom: 12 }}>
      {path.courseId ? 'Course' : 'Interest'} · {path.title}
      {topic ? ` · ${topic.topic.title}` : ''}
      {card && card.dueAt <= Date.now() ? ` · due ${relTime(card.dueAt)}` : ''}
      {!done && topic && state.checkpoints[topicKey(path.id, topic.topic.id)] === undefined ? ' · checkpoint unfinished' : ''}
      {card ? ` · gap if correct: ${state.settings.reviewIntervalsDays[Math.min(card.box + 1, state.settings.reviewIntervalsDays.length - 1)]}d` : ''}
    </p>
  )
}
