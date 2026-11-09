import { useEffect, useRef, type ReactNode } from 'react'
import { Check, X, Lightbulb, RefreshCw, Eye, ArrowRight, BookOpen } from 'lucide-react'
import type { ChoiceQuestion, Question, ShortQuestion } from '../content/types'
import type { Outcome, AttemptMode } from '../store/schema'
import type { QuestionResult } from '../learning/engine'

export interface QState {
  variant: 'orig' | 'fresh'
  selected?: string
  struck: string[]
  phase: 'answer' | 'right' | 'wrong' | 'solved'
  wrongOnce: boolean
  /** Explanation, retry or fresh question used before the final answer. */
  help: boolean
  solution: boolean
  shortText: string
  shortRevealed: boolean
  showExplain: boolean
  outcome?: Outcome
}

export interface QuizProgress {
  index: number
  results: QuestionResult[]
  q: QState
}

export const freshQ = (): QState => ({ variant: 'orig', struck: [], phase: 'answer', wrongOnce: false, help: false, solution: false, shortText: '', shortRevealed: false, showExplain: false })
export const newProgress = (): QuizProgress => ({ index: 0, results: [], q: freshQ() })

export interface AttemptInfo {
  question: Question
  correct: boolean
  assisted: boolean
  solutionShown?: boolean
  selfAssessed?: boolean
  response?: string
  mode: AttemptMode
}

/** Stable per-question shuffle so the correct answer isn't always in the same position. */
function ordered<T extends { id: string }>(qid: string, options: T[]): T[] {
  let h = 2166136261
  for (let i = 0; i < qid.length; i++) h = Math.imul(h ^ qid.charCodeAt(i), 16777619)
  const a = [...options]
  for (let i = a.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    const j = Math.abs(h) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const skillLabel = { recognise: 'Recognise', apply: 'Apply', reason: 'Reason' } as const

export function QuizRunner({
  questions,
  progress,
  setProgress,
  mode,
  onAttempt,
  onDone,
  renderExplanation,
  heading,
}: {
  questions: Question[]
  progress: QuizProgress
  setProgress: (p: QuizProgress) => void
  mode: AttemptMode
  onAttempt: (a: AttemptInfo) => void
  onDone: (results: QuestionResult[]) => void
  renderExplanation: (reelId: string) => ReactNode
  heading?: ReactNode
}) {
  const base = questions[progress.index]
  const q = progress.q
  const rootRef = useRef<HTMLDivElement>(null)
  // Each new question (or fresh variant) starts at the top of the sheet.
  useEffect(() => {
    rootRef.current?.closest('.sheet-body')?.scrollTo({ top: 0 })
  }, [progress.index, q.variant])
  const active: Question = q.variant === 'fresh' && base?.fresh ? (base.fresh as Question) : base
  const set = (patch: Partial<QState>) => setProgress({ ...progress, q: { ...q, ...patch } })

  const choose = (optId: string) => {
    if (active.type !== 'choice' || q.phase !== 'answer') return
    const correct = optId === active.correctId
    const assisted = q.wrongOnce || q.help
    onAttempt({ question: active, correct, assisted, mode: q.variant === 'fresh' ? 'fresh' : mode, response: optId })
    if (correct) set({ selected: optId, phase: 'right', outcome: assisted ? 'assisted' : 'independent' })
    else set({ selected: optId, phase: 'wrong', wrongOnce: true })
  }

  const next = () => {
    const outcome: Outcome = q.outcome ?? 'missed'
    const results = [...progress.results, { question: base, outcome }]
    if (progress.index + 1 >= questions.length) {
      setProgress({ index: progress.index + 1, results, q: freshQ() })
      onDone(results)
    } else setProgress({ index: progress.index + 1, results, q: freshQ() })
  }

  // Number keys pick options; Enter continues.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT') return
      if (active?.type === 'choice' && q.phase === 'answer') {
        const n = Number(e.key)
        const opt = ordered(active.id, active.options)[n - 1]
        if (opt && !q.struck.includes(opt.id)) {
          e.preventDefault()
          choose(opt.id)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!base) return null

  return (
    <div ref={rootRef}>
      {heading}
      <div className="q-step" aria-hidden="true">
        {questions.map((_, i) => (
          <i key={i} className={i < progress.index ? 'done' : i === progress.index ? 'now' : ''} />
        ))}
      </div>
      <div className="cluster">
        <span className="eyebrow">
          Question {progress.index + 1} of {questions.length} · {skillLabel[active.skill]}
        </span>
        {q.variant === 'fresh' && <span className="tag tag-accent">Fresh question · same idea</span>}
      </div>
      {active.passage && <div className="q-passage mt-16">{active.passage}</div>}
      <p className="q-prompt" id={`qp-${active.id}`}>
        {active.prompt}
      </p>

      {active.type === 'choice' ? <ChoiceBody q={active} st={q} onChoose={choose} /> : <ShortBody q={active} st={q} set={set} onAttempt={onAttempt} mode={mode} />}

      {q.phase === 'answer' && !q.help && active.type === 'choice' && (
        <button type="button" className="btn btn-quiet btn-sm mt-16" onClick={() => set({ help: true, showExplain: true })}>
          <Lightbulb size={16} aria-hidden="true" /> Revisit the explanation first
        </button>
      )}
      {q.phase === 'answer' && q.help && <p className="hint mt-8">Help used — this answer will count as assisted.</p>}

      {q.phase === 'right' && active.type === 'choice' && (
        <div className="feedback feedback-good" role="status">
          <span className="feedback-title">
            <Check size={18} aria-hidden="true" /> {q.outcome === 'independent' ? 'Correct' : 'Correct, with help'}
          </span>
          <span>{active.options.find((o) => o.id === q.selected)?.feedback}</span>
          <span className="muted">{active.explanation}</span>
        </div>
      )}

      {q.phase === 'wrong' && active.type === 'choice' && (
        <div className="feedback feedback-bad" role="alert">
          <span className="feedback-title">
            <X size={18} aria-hidden="true" /> Not quite
          </span>
          <span>{active.options.find((o) => o.id === q.selected)?.feedback}</span>
          {active.altExample && (
            <span>
              <b>Another way to see it:</b> {active.altExample}
            </span>
          )}
          <div className="feedback-actions">
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => set({ showExplain: !q.showExplain, help: true })} aria-expanded={q.showExplain}>
              <BookOpen size={15} aria-hidden="true" /> {q.showExplain ? 'Hide explanation' : 'Revisit explanation'}
            </button>
            {q.variant === 'orig' && base.fresh ? (
              <button type="button" className="btn btn-sm" onClick={() => set({ variant: 'fresh', phase: 'answer', selected: undefined, struck: [], help: true })}>
                <RefreshCw size={15} aria-hidden="true" /> Try a fresh question
              </button>
            ) : (
              <button type="button" className="btn btn-sm" onClick={() => set({ phase: 'answer', struck: [...q.struck, q.selected!], selected: undefined, help: true })}>
                <RefreshCw size={15} aria-hidden="true" /> Try again
              </button>
            )}
            <button type="button" className="btn btn-sm btn-quiet" onClick={() => set({ phase: 'solved', solution: true, outcome: 'missed' })}>
              <Eye size={15} aria-hidden="true" /> Show solution
            </button>
          </div>
        </div>
      )}

      {q.phase === 'solved' && active.type === 'choice' && (
        <div className="feedback" style={{ background: 'var(--bg-sunk)' }} role="status">
          <span className="feedback-title">Solution</span>
          <span>
            <b>{active.options.find((o) => o.id === active.correctId)?.text}</b>
          </span>
          <span>{active.explanation}</span>
          <span className="small muted">Marked for review — it’ll come back with a different question.</span>
        </div>
      )}

      {q.showExplain && <div className="explain-panel">{renderExplanation(active.reelId)}</div>}

      {(q.phase === 'right' || q.phase === 'solved') && (
        <button type="button" className="btn btn-accent btn-block mt-16" onClick={next} autoFocus>
          {progress.index + 1 >= questions.length ? 'See results' : 'Next question'} <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function ChoiceBody({ q, st, onChoose }: { q: ChoiceQuestion; st: QState; onChoose: (id: string) => void }) {
  const done = st.phase === 'right' || st.phase === 'solved'
  return (
    <ul className="q-options" role="list" aria-labelledby={`qp-${q.id}`}>
      {ordered(q.id, q.options).map((o, i) => {
        let state: string | undefined
        if (st.struck.includes(o.id)) state = 'struck'
        if (st.selected === o.id) state = st.phase === 'right' ? 'correct' : st.phase === 'wrong' || st.phase === 'solved' ? 'wrong' : 'selected'
        if (done && o.id === q.correctId) state = 'correct'
        const disabled = st.phase !== 'answer' || st.struck.includes(o.id)
        return (
          <li key={o.id}>
            <button type="button" className="q-opt" data-state={state} disabled={disabled} onClick={() => onChoose(o.id)} aria-describedby={state === 'correct' ? `${q.id}-ok` : undefined}>
              <span className="key" aria-hidden="true">
                {state === 'correct' ? <Check size={14} /> : state === 'wrong' ? <X size={14} /> : i + 1}
              </span>
              <span>{o.text}</span>
              {state === 'correct' && (
                <span id={`${q.id}-ok`} className="sr-only">
                  Correct answer
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function ShortBody({ q, st, set, onAttempt, mode }: { q: ShortQuestion; st: QState; set: (p: Partial<QState>) => void; onAttempt: (a: AttemptInfo) => void; mode: AttemptMode }) {
  const rate = (o: Outcome) => {
    const assisted = o !== 'independent' || st.help
    onAttempt({ question: q, correct: o !== 'missed', assisted, selfAssessed: true, response: st.shortText, mode })
    set({ phase: o === 'missed' ? 'solved' : 'right', outcome: o === 'independent' && !st.help ? 'independent' : o === 'missed' ? 'missed' : 'assisted' })
  }
  return (
    <div>
      <label className="sr-only" htmlFor={`sa-${q.id}`}>
        Your answer
      </label>
      <textarea id={`sa-${q.id}`} className="textarea" value={st.shortText} onChange={(e) => set({ shortText: e.target.value })} disabled={st.shortRevealed} placeholder="Write your answer in your own words…" />
      {!st.shortRevealed ? (
        <button type="button" className="btn mt-16" disabled={st.shortText.trim().length < 10} onClick={() => set({ shortRevealed: true })}>
          Compare with a model answer
        </button>
      ) : (
        <div className="feedback" style={{ background: 'var(--bg-sunk)' }}>
          <span className="feedback-title">Model answer</span>
          <span>{q.modelAnswer}</span>
          <span className="small">
            <b>A strong answer:</b>
          </span>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {q.lookFor.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          {st.phase === 'answer' && (
            <>
              <span className="small mt-8">
                <b>How did yours compare?</b> Be honest — it decides what comes back for review.
              </span>
              <div className="feedback-actions">
                <button type="button" className="btn btn-sm" onClick={() => rate('independent')}>
                  Covered it
                </button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => rate('assisted')}>
                  Partly
                </button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => rate('missed')}>
                  Missed it
                </button>
              </div>
            </>
          )}
          {st.phase !== 'answer' && <span className="small muted">Self-assessed. {q.explanation}</span>}
        </div>
      )}
    </div>
  )
}
