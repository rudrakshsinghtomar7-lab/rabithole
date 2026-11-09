import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { ArrowLeft, Bookmark, ChevronDown, ChevronUp, ListTree, NotebookPen, Quote, ArrowRight, Flag, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { actionLabelForPath, allTopics, locateTopic, themeForPath, visibleReels, findReel, type TopicLocation } from '../content'
import type { Path, Reel } from '../content/types'
import { useStore } from '../store/store'
import { completeCheckpoint, openTopic, recordAttempt, setReelPosition, topicKey, topicStatus, totalXp, uid, weakFoundation, type QuestionResult } from '../learning/engine'
import { Sheet } from '../ui/Sheet'
import { QuizRunner, newProgress, type QuizProgress } from '../ui/Quiz'
import { ReelContent } from '../ui/ReelView'
import { SourceList } from '../ui/Sources'
import { StatusDot, Ticks, statusText, toast } from '../ui/common'
import { challengeUrl, getPath, learnUrl, overviewUrl } from '../ui/paths'
import { setThemeOverride } from '../ui/themeColor'

// One learning session spans topics until the learner finishes it.
let sessionStart = Date.now()
const prefersReducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function Player() {
  const { pathId, topicId } = useParams<{ tab: string; pathId: string; topicId: string }>()
  const { state } = useStore()
  const [, navigate] = useLocation()
  const path = getPath(state, pathId)
  const loc = path ? locateTopic(path, topicId) : undefined
  if (!path || !loc)
    return (
      <div className="page">
        <button type="button" className="back-link" onClick={() => navigate('/interests')}>
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
        <p className="h1 mt-16">This topic isn’t available.</p>
      </div>
    )
  return <TopicPlayer key={`${path.id}:${loc.topic.id}`} path={path} loc={loc} />
}

type SheetKind = 'quiz' | 'sources' | 'outline' | 'note' | 'recap' | null

function TopicPlayer({ path, loc }: { path: Path; loc: TopicLocation }) {
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const { topic, module } = loc
  const fam = state.enrollments[path.id]?.familiarity ?? 'new'
  const reels = useMemo(() => visibleReels(topic, fam), [topic, fam])
  const key = topicKey(path.id, topic.id)
  const [initialIdx] = useState(() => Math.min(state.feed[key]?.reelIndex ?? 0, reels.length))
  const [idx, setIdx] = useState(initialIdx)
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [noteReel, setNoteReel] = useState<Reel | null>(null)
  const [quiz, setQuiz] = useState<QuizProgress>(newProgress)
  const [quizPhase, setQuizPhase] = useState<'run' | 'results'>('run')
  const [xpGain, setXpGain] = useState(0)
  const feedRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])
  const theme = themeForPath(path)
  const actionLabel = actionLabelForPath(path)
  const status = topicStatus(state, path.id, topic.id)
  const checkpoint = state.checkpoints[key]
  const weak = weakFoundation(state, path, topic.id)
  const topics = allTopics(path)
  const nextLoc = topics[loc.flatIndex + 1]
  const isLastInModule = loc.topicIndex === module.topics.length - 1
  const current: Reel | undefined = reels[Math.min(idx, reels.length - 1)]
  const onCheckpoint = idx >= reels.length

  useEffect(() => {
    update((s) => openTopic(s, path.id, topic.id))
  }, [update, path.id, topic.id])

  // The reel fills the screen, so the status bar takes the subject's colour.
  useEffect(() => {
    const reel = feedRef.current?.querySelector('.reel')
    if (reel) setThemeOverride(getComputedStyle(reel).backgroundColor)
    return () => setThemeOverride(null)
  }, [theme, state.theme])

  useEffect(() => {
    update((s) => setReelPosition(s, path.id, topic.id, idx, reels.length))
  }, [idx, update, path.id, topic.id, reels.length])

  // Restore position without animation. Scroll-snap can re-snap to the first reel after
  // initial layout, so re-apply on the next frames and ignore observer events until settled.
  const restored = useRef(false)
  useLayoutEffect(() => {
    restored.current = false
    const apply = () => {
      const el = itemRefs.current[initialIdx]
      const feed = feedRef.current
      if (el && feed && Math.abs(feed.scrollTop - el.offsetTop) > 2) feed.scrollTop = el.offsetTop
    }
    apply()
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      apply()
      raf2 = requestAnimationFrame(() => {
        apply()
        restored.current = true
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [initialIdx])

  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!restored.current) return
        for (const e of entries) if (e.isIntersecting) setIdx(Number((e.target as HTMLElement).dataset.index))
      },
      { root: feed, threshold: 0.6 },
    )
    itemRefs.current.forEach((el) => el && io.observe(el))
    // Also track scroll directly so the index is right once restoration finishes.
    const onScroll = () => {
      if (!restored.current) return
      const i = Math.round(feed.scrollTop / Math.max(1, feed.clientHeight))
      setIdx(Math.min(i, itemRefs.current.length - 1))
    }
    feed.addEventListener('scrollend', onScroll)
    return () => {
      io.disconnect()
      feed.removeEventListener('scrollend', onScroll)
    }
  }, [reels.length])

  const goTo = useCallback((i: number) => {
    const el = itemRefs.current[Math.max(0, Math.min(i, itemRefs.current.length - 1))]
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    if (sheet) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input,textarea,select,[contenteditable]')) return
      if (['ArrowDown', 'PageDown', 'j'].includes(e.key)) {
        e.preventDefault()
        goTo(idx + 1)
      } else if (['ArrowUp', 'PageUp', 'k'].includes(e.key)) {
        e.preventDefault()
        goTo(idx - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheet, idx, goTo])

  const bookmarkFor = (reel: Reel) => state.bookmarks.find((b) => b.reelId === reel.id && b.pathId === path.id)
  const toggleBookmark = (reel: Reel) => {
    const existing = bookmarkFor(reel)
    if (existing) {
      update((s) => ({ ...s, bookmarks: s.bookmarks.filter((b) => b.id !== existing.id) }))
      toast('Removed from saved')
    } else {
      update((s) => ({ ...s, bookmarks: [...s.bookmarks, { id: uid('bm'), pathId: path.id, topicId: topic.id, reelId: reel.id, createdAt: Date.now(), note: '' }] }))
      toast('Saved to My Interests › Saved')
    }
  }

  const openQuiz = (retake = false) => {
    if (retake || quizPhase === 'results' || quiz.index >= topic.quiz.length) {
      setQuiz(newProgress())
      setQuizPhase('run')
    }
    setSheet('quiz')
  }

  const onDone = (results: QuestionResult[]) => {
    const args = { pathId: path.id, checkpointKey: key, kind: 'topic' as const, title: topic.title, results }
    setXpGain(totalXp(completeCheckpoint(state, args)) - totalXp(state))
    update((s) => completeCheckpoint(s, args))
    setQuizPhase('results')
  }

  const goNext = () => {
    setSheet(null)
    if (isLastInModule && module.challenge) navigate(challengeUrl(path, module.id))
    else if (nextLoc) navigate(learnUrl(path, nextLoc.topic.id))
    else navigate(overviewUrl(path))
  }

  const explanation = (reelId: string) => {
    const r = findReel(path, reelId)?.reel
    if (!r) return null
    return (
      <div className="surface" data-subject={theme}>
        <ReelContent reel={r} actionLabel={actionLabel} compact />
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={() => {
            setSheet(null)
            const i = reels.findIndex((x) => x.id === reelId)
            if (i >= 0) setTimeout(() => goTo(i), 50)
          }}
        >
          Go to this reel
        </button>
      </div>
    )
  }

  const crumb = (
    <span className="reel-crumb">
      <b>Module {loc.moduleIndex + 1}</b> · Topic {loc.topicIndex + 1}/{module.topics.length} · {topic.title}
    </span>
  )

  return (
    <div className="player">
      <div className="stage">
        <div className="feed" ref={feedRef} data-locked={sheet ? 'true' : undefined} aria-label={`${topic.title}: reels`} role="region" tabIndex={-1}>
          {reels.map((reel, i) => (
            <article key={reel.id} ref={(el) => void (itemRefs.current[i] = el)} data-index={i} className="reel surface" data-subject={theme} aria-roledescription="reel" aria-label={`Reel ${i + 1} of ${reels.length}: ${reel.title}`}>
              <div className="reel-top">
                <button type="button" className="icon-btn" aria-label="Back to path" onClick={() => navigate(overviewUrl(path))}>
                  <ArrowLeft size={20} />
                </button>
                {crumb}
                <button type="button" className="icon-btn" aria-label="Path outline" onClick={() => setSheet('outline')}>
                  <ListTree size={20} />
                </button>
                {!!reel.sources?.length && (
                  <button type="button" className="icon-btn" aria-label="Sources for this reel" onClick={() => setSheet('sources')}>
                    <Quote size={19} />
                  </button>
                )}
              </div>
              <div className="reel-body">
                {i === 0 && (
                  <div className="stack" style={{ gap: 8 }}>
                    <span className="small">
                      <b>Objective:</b> {topic.objective}
                    </span>
                    {weak && (
                      <span className="tag" style={{ alignSelf: 'start', whiteSpace: 'normal' }}>
                        <AlertTriangle size={12} aria-hidden="true" /> Builds on “{weak}” — that checkpoint isn’t solid yet
                      </span>
                    )}
                  </div>
                )}
                <ReelContent reel={reel} actionLabel={actionLabel} />
              </div>
              <div className="reel-bottom">
                <div className="reel-progress">
                  <Ticks total={reels.length + 1} done={i + 1} />
                  <div className="small">
                    Reel {i + 1} of {reels.length} · {reels.length - 1 - i === 0 ? 'checkpoint next' : `checkpoint in ${reels.length - 1 - i}`}
                  </div>
                </div>
                <button type="button" className="icon-btn" aria-pressed={!!bookmarkFor(reel)} aria-label={bookmarkFor(reel) ? 'Remove bookmark' : 'Bookmark this idea'} onClick={() => toggleBookmark(reel)}>
                  <Bookmark size={20} />
                </button>
                <button type="button" className="icon-btn" aria-label={bookmarkFor(reel)?.note ? 'Edit your note' : 'Add a note'} onClick={() => { setNoteReel(reel); setSheet('note') }}>
                  <NotebookPen size={20} />
                </button>
                <button type="button" className="icon-btn" aria-label="Previous reel" disabled={i === 0} onClick={() => goTo(i - 1)}>
                  <ChevronUp size={22} />
                </button>
                <button type="button" className="icon-btn" aria-label={i === reels.length - 1 ? 'Go to checkpoint' : 'Next reel'} onClick={() => goTo(i + 1)}>
                  <ChevronDown size={22} />
                </button>
              </div>
            </article>
          ))}

          <article ref={(el) => void (itemRefs.current[reels.length] = el)} data-index={reels.length} className="reel surface checkpoint" data-subject={theme} aria-label="Checkpoint">
            <div className="reel-top">
              <button type="button" className="icon-btn" aria-label="Back to path" onClick={() => navigate(overviewUrl(path))}>
                <ArrowLeft size={20} />
              </button>
              {crumb}
            </div>
            <div className="reel-body">
              <span className="eyebrow muted">Checkpoint · {topic.quiz.length} questions</span>
              <h2 className="reel-title">{checkpoint ? 'Checkpoint done.' : 'Check your understanding.'}</h2>
              <p style={{ fontSize: 16 }}>{topic.objective}</p>
              {checkpoint ? (
                <>
                  <p className="muted">
                    Last attempt: {checkpoint.independent} of {checkpoint.total} without help
                    {checkpoint.assisted ? `, ${checkpoint.assisted} with help` : ''}
                    {checkpoint.missed ? `, ${checkpoint.missed} to revisit` : ''}.
                  </p>
                  <div className="cluster">
                    <button type="button" className="btn" onClick={goNext}>
                      {isLastInModule && module.challenge ? 'Module challenge' : nextLoc ? `Next: ${nextLoc.topic.title}` : 'Back to path'} <ArrowRight size={18} aria-hidden="true" />
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => openQuiz(true)}>
                      Retake
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="muted">Viewing the reels doesn’t complete the topic — the checkpoint does. You can come back to it any time.</p>
                  <div className="cluster">
                    <button type="button" className="btn" onClick={() => openQuiz()}>
                      {quiz.index > 0 && quiz.index < topic.quiz.length ? 'Resume checkpoint' : 'Start checkpoint'} <ArrowRight size={18} aria-hidden="true" />
                    </button>
                    {nextLoc && (
                      <button type="button" className="btn btn-ghost" onClick={() => navigate(learnUrl(path, nextLoc.topic.id))}>
                        Skip for now
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="reel-bottom">
              <div className="reel-progress">
                <Ticks total={reels.length + 1} done={reels.length + 1} />
                <div className="small">{statusText(status)}</div>
              </div>
              <button type="button" className="icon-btn" aria-label="Previous reel" onClick={() => goTo(reels.length - 1)}>
                <ChevronUp size={22} />
              </button>
            </div>
          </article>
        </div>
      </div>

      <aside className="aside" aria-label="Where you are">
        <span className="eyebrow">{path.title}</span>
        <p className="h2 mt-8">{topic.title}</p>
        <p className="small mt-8">
          <b>Objective.</b> {topic.objective}
        </p>
        {topic.prerequisite && (
          <p className="small muted">
            <b>Before this:</b> {topic.prerequisite}
          </p>
        )}
        <h3 className="eyebrow mt-24">In this topic</h3>
        <ol className="outline mt-8">
          {reels.map((r, i) => (
            <li key={r.id}>
              <button type="button" className="outline-item" aria-current={i === idx} onClick={() => goTo(i)}>
                <span className="muted">{i + 1}</span>
                <span>{r.title}</span>
              </button>
            </li>
          ))}
          <li>
            <button type="button" className="outline-item" aria-current={onCheckpoint} onClick={() => goTo(reels.length)}>
              <StatusDot status={status} />
              <span>Checkpoint · {statusText(status)}</span>
            </button>
          </li>
        </ol>
        {current?.sources?.length && !onCheckpoint ? (
          <>
            <h3 className="eyebrow mt-24">Sources for this reel</h3>
            <SourceList path={path} refs={current.sources} />
          </>
        ) : null}
        <h3 className="eyebrow mt-24">Module {loc.moduleIndex + 1}</h3>
        <ol className="outline mt-8">
          {module.topics.map((t) => (
            <li key={t.id}>
              <button type="button" className="outline-item" aria-current={t.id === topic.id} onClick={() => navigate(learnUrl(path, t.id))}>
                <StatusDot status={topicStatus(state, path.id, t.id)} />
                <span>{t.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="hint mt-24">Keyboard: ↑ ↓ or J K to move between reels. 1–4 to answer in quizzes.</p>
      </aside>

      {sheet === 'quiz' && (
        <Sheet title={`Checkpoint · ${topic.title}`} onClose={() => setSheet(null)} tall>
          {quizPhase === 'run' ? (
            <QuizRunner
              questions={topic.quiz}
              progress={quiz}
              setProgress={setQuiz}
              mode="quiz"
              onAttempt={(a) => update((s) => recordAttempt(s, { pathId: path.id, topicId: topic.id, checkpointKey: key, questionId: a.question.id, conceptId: a.question.conceptId, mode: a.mode, correct: a.correct, assisted: a.assisted, solutionShown: a.solutionShown, selfAssessed: a.selfAssessed, response: a.response }))}
              onDone={onDone}
              renderExplanation={explanation}
            />
          ) : (
            <Results path={path} topicTitle={topic.title} xpGained={xpGain} checkpointKey={key} nextLabel={isLastInModule && module.challenge ? 'Module challenge' : nextLoc ? `Next: ${nextLoc.topic.title}` : 'Back to path'} nextStep={topic.nextStep} onNext={goNext} onRetake={() => openQuiz(true)} onFinish={() => setSheet('recap')} onRevisit={(reelId) => { setSheet(null); const i = reels.findIndex((r) => r.id === reelId); if (i >= 0) setTimeout(() => goTo(i), 50) }} />
          )}
        </Sheet>
      )}
      {sheet === 'sources' && current && (
        <Sheet title={`Sources · ${current.title}`} onClose={() => setSheet(null)}>
          <SourceList path={path} refs={current.sources ?? []} onNavigate={() => setSheet(null)} />
          {path.courseId && <p className="hint mt-16">“From your course material” reels cite your documents. Supplementary reels add explanation beyond them.</p>}
        </Sheet>
      )}
      {sheet === 'outline' && (
        <Sheet title={path.title} onClose={() => setSheet(null)}>
          {path.modules.map((m, mi) => (
            <div key={m.id} className={mi ? 'mt-24' : ''}>
              <h3 className="eyebrow">
                Module {mi + 1} · {m.title}
              </h3>
              <ol className="outline mt-8">
                {m.topics.map((t) => (
                  <li key={t.id}>
                    <button type="button" className="outline-item" aria-current={t.id === topic.id} onClick={() => { setSheet(null); navigate(learnUrl(path, t.id)) }}>
                      <StatusDot status={topicStatus(state, path.id, t.id)} />
                      <span>
                        {t.title}
                        <span className="small muted" style={{ display: 'block', fontWeight: 400 }}>
                          {statusText(topicStatus(state, path.id, t.id))}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
                {m.challenge && (
                  <li>
                    <button type="button" className="outline-item" onClick={() => { setSheet(null); navigate(challengeUrl(path, m.id)) }}>
                      <Flag size={16} aria-hidden="true" />
                      <span>Module challenge: {m.challenge.title}</span>
                    </button>
                  </li>
                )}
              </ol>
            </div>
          ))}
        </Sheet>
      )}
      {sheet === 'note' && noteReel && <NoteSheet path={path} topicId={topic.id} reel={noteReel} onClose={() => setSheet(null)} />}
      {sheet === 'recap' && (
        <RecapSheet
          onClose={() => {
            sessionStart = Date.now()
            setSheet(null)
            navigate(overviewUrl(path))
          }}
        />
      )}
    </div>
  )
}

function Results({ path, topicTitle, xpGained, checkpointKey, nextLabel, nextStep, onNext, onRetake, onFinish, onRevisit }: { path: Path; topicTitle: string; xpGained: number; checkpointKey: string; nextLabel: string; nextStep?: string; onNext: () => void; onRetake: () => void; onFinish: () => void; onRevisit: (reelId: string) => void }) {
  const { state } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.closest('.sheet-body')?.scrollTo({ top: 0 })
  }, [])
  const cp = state.checkpoints[checkpointKey]
  if (!cp) return null
  const loc = locateTopic(path, checkpointKey.split(':').slice(1).join(':'))
  const flagged = loc ? loc.topic.quiz.filter((q) => cp.conceptsToReview.includes(q.conceptId)) : []
  return (
    <div ref={ref}>
      <span className="eyebrow">Checkpoint complete · {topicTitle}</span>
      <p className="result-big mt-8">
        {cp.independent}/{cp.total}
      </p>
      <p className="muted">answered without help</p>
      <div className="stat-row" role="list">
        <div role="listitem">
          <div className="stat-num">{cp.independent}</div>
          <div className="small muted">Independent</div>
        </div>
        <div role="listitem">
          <div className="stat-num">{cp.assisted}</div>
          <div className="small muted">With help</div>
        </div>
        <div role="listitem">
          <div className="stat-num">{cp.missed}</div>
          <div className="small muted">To revisit</div>
        </div>
      </div>
      <p aria-live="polite">
        {xpGained > 0 ? (
          <span className="xp-pop">
            <Sparkles size={16} aria-hidden="true" /> +{xpGained} XP
          </span>
        ) : (
          <span className="small muted">No new XP — this checkpoint’s rewards were already earned. Your latest result is still recorded.</span>
        )}
      </p>
      <p className="hint">XP tracks effort. The breakdown above is the evidence of understanding.</p>
      {flagged.length > 0 ? (
        <div className="mt-16">
          <h3 className="h3">Flagged for review</h3>
          <p className="small muted">These will come back in Review with fresh questions.</p>
          <ul className="rows">
            {flagged.map((q) => {
              const reel = findReel(path, q.reelId)?.reel
              return (
                <li key={q.id}>
                  <button type="button" className="row" onClick={() => onRevisit(q.reelId)}>
                    <AlertTriangle size={18} aria-hidden="true" />
                    <span>
                      <span className="row-title">{reel?.title}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        {q.explanation}
                      </span>
                    </span>
                    <span className="tag">Revisit</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="notice notice-good mt-16">
          <CheckCircle2 size={18} aria-hidden="true" /> Every question answered without help. These ideas are scheduled for a light review later.
        </p>
      )}
      {nextStep && <p className="mt-16">{nextStep}</p>}
      <div className="stack mt-16">
        <button type="button" className="btn btn-accent btn-block" onClick={onNext}>
          {nextLabel} <ArrowRight size={18} aria-hidden="true" />
        </button>
        <div className="cluster">
          <button type="button" className="btn btn-ghost" onClick={onRetake}>
            Retake checkpoint
          </button>
          <button type="button" className="btn btn-quiet" onClick={onFinish}>
            Finish session
          </button>
        </div>
      </div>
    </div>
  )
}

function NoteSheet({ path, topicId, reel, onClose }: { path: Path; topicId: string; reel: Reel; onClose: () => void }) {
  const { state, update } = useStore()
  const existing = state.bookmarks.find((b) => b.reelId === reel.id && b.pathId === path.id)
  const [text, setText] = useState(existing?.note ?? '')
  const save = () => {
    update((s) => {
      const ex = s.bookmarks.find((b) => b.reelId === reel.id && b.pathId === path.id)
      if (ex) return { ...s, bookmarks: s.bookmarks.map((b) => (b.id === ex.id ? { ...b, note: text } : b)) }
      return { ...s, bookmarks: [...s.bookmarks, { id: uid('bm'), pathId: path.id, topicId, reelId: reel.id, createdAt: Date.now(), note: text }] }
    })
    toast('Note saved')
    onClose()
  }
  return (
    <Sheet
      title={`Note · ${reel.title}`}
      onClose={onClose}
      footer={
        <button type="button" className="btn" onClick={save}>
          Save note
        </button>
      }
    >
      <label className="label" htmlFor="note">
        Your note
      </label>
      <textarea id="note" className="textarea mt-8" value={text} onChange={(e) => setText(e.target.value)} placeholder="A question, a connection, an example of your own…" />
      <p className="hint mt-8">Notes are saved with a bookmark so you can find them in My Interests › Saved.</p>
    </Sheet>
  )
}

function RecapSheet({ onClose }: { onClose: () => void }) {
  const { state } = useStore()
  const xp = state.xp.filter((e) => e.at >= sessionStart).reduce((n, e) => n + e.amount, 0)
  const cps = Object.entries(state.checkpoints).filter(([, c]) => c.lastCompletedAt >= sessionStart)
  const reviewDue = cps.reduce((n, [, c]) => n + c.conceptsToReview.length, 0)
  const topicsTouched = new Set(state.attempts.filter((a) => a.at >= sessionStart && a.topicId).map((a) => a.topicId)).size
  return (
    <Sheet
      title="Session recap"
      onClose={onClose}
      footer={
        <button type="button" className="btn" onClick={onClose}>
          Done
        </button>
      }
    >
      <p className="h2">Good session.</p>
      <div className="stat-row">
        <div>
          <div className="stat-num">{cps.length}</div>
          <div className="small muted">Checkpoints</div>
        </div>
        <div>
          <div className="stat-num">{topicsTouched}</div>
          <div className="small muted">Topics practised</div>
        </div>
        <div>
          <div className="stat-num">{xp}</div>
          <div className="small muted">XP earned</div>
        </div>
      </div>
      {cps.length > 0 && (
        <ul className="rows">
          {cps.map(([k, c]) => {
            const [pid, ...rest] = k.split(':')
            const path = getPath(state, pid)
            const t = path ? locateTopic(path, rest.join(':')) : undefined
            return (
              <li key={k} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                <span>
                  <span className="row-title">{t?.topic.title ?? 'Module challenge'}</span>
                  <span className="row-sub" style={{ display: 'block' }}>
                    {c.independent}/{c.total} independent{c.assisted ? ` · ${c.assisted} with help` : ''}
                  </span>
                </span>
                {c.conceptsToReview.length ? <span className="tag tag-warn">{c.conceptsToReview.length} to review</span> : <span className="tag tag-good">Solid</span>}
              </li>
            )
          })}
        </ul>
      )}
      <p className="mt-16">{reviewDue > 0 ? `${reviewDue} concept${reviewDue > 1 ? 's' : ''} from this session will come back in Review.` : 'Everything from this session is scheduled for a light review later.'}</p>
    </Sheet>
  )
}
