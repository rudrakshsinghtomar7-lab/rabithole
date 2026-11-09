import { useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { findReel, themeForPath, actionLabelForPath } from '../content'
import { useStore } from '../store/store'
import { challengeKey, completeCheckpoint, recordAttempt, totalXp, isCheckpointDone, topicStatus } from '../learning/engine'
import { QuizRunner, newProgress, type QuizProgress } from '../ui/Quiz'
import { ReelContent } from '../ui/ReelView'
import { Art } from '../ui/Art'
import { getPath, overviewUrl } from '../ui/paths'

export function Challenge() {
  const { pathId, moduleId } = useParams<{ pathId: string; moduleId: string }>()
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const path = getPath(state, pathId)
  const mod = path?.modules.find((m) => m.id === moduleId)
  const [progress, setProgress] = useState<QuizProgress>(newProgress)
  const [done, setDone] = useState(false)
  const [xpGain, setXpGain] = useState(0)
  if (!path || !mod?.challenge)
    return (
      <div className="page">
        <p className="h1">Challenge not found.</p>
      </div>
    )
  const ch = mod.challenge
  const key = challengeKey(path.id, ch.id)
  const prior = state.checkpoints[key]
  const theme = themeForPath(path)
  const unfinished = mod.topics.filter((t) => !isCheckpointDone(topicStatus(state, path.id, t.id)))
  const cp = state.checkpoints[key]

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <button type="button" className="back-link" onClick={() => navigate(overviewUrl(path))}>
        <ArrowLeft size={16} aria-hidden="true" /> {path.title}
      </button>
      <header className="hero hero-short surface mt-8" data-subject={theme} style={{ minHeight: 260 }}>
        <div className="hero-art">
          <Art motif="grid" />
        </div>
        <div className="hero-body">
          <span className="eyebrow muted">Module challenge · {mod.title}</span>
          <h1 className="display">{ch.title}</h1>
        </div>
      </header>
      {unfinished.length > 0 && !prior && (
        <p className="notice notice-warn mt-16">
          You haven’t passed {unfinished.length === 1 ? 'one topic checkpoint' : `${unfinished.length} topic checkpoints`} in this module yet ({unfinished.map((t) => t.title).join(', ')}). You can still try — the challenge will show which foundations need work.
        </p>
      )}
      <div className="q-passage mt-24" style={{ fontSize: 15.5 }}>
        {ch.scenario}
      </div>
      {!done ? (
        <div className="mt-24">
          <QuizRunner
            questions={ch.questions}
            progress={progress}
            setProgress={setProgress}
            mode="challenge"
            onAttempt={(a) => update((s) => recordAttempt(s, { pathId: path.id, checkpointKey: key, questionId: a.question.id, conceptId: a.question.conceptId, mode: a.mode, correct: a.correct, assisted: a.assisted, response: a.response, selfAssessed: a.selfAssessed }))}
            onDone={(results) => {
              const args = { pathId: path.id, checkpointKey: key, kind: 'challenge' as const, title: ch.title, results }
              setXpGain(totalXp(completeCheckpoint(state, args)) - totalXp(state))
              update((s) => completeCheckpoint(s, args))
              setDone(true)
            }}
            renderExplanation={(reelId) => {
              const r = findReel(path, reelId)?.reel
              return r ? (
                <div className="surface" data-subject={theme} style={{ padding: '16px 18px' }}>
                  <ReelContent reel={r} actionLabel={actionLabelForPath(path)} compact />
                </div>
              ) : null
            }}
          />
        </div>
      ) : (
        cp && (
          <div className="mt-24">
            <span className="eyebrow">Challenge complete</span>
            <p className="result-big mt-8">
              {cp.independent}/{cp.total}
            </p>
            <p className="muted">connected without help</p>
            <p aria-live="polite">
              {xpGain > 0 ? (
                <span className="xp-pop">
                  <Sparkles size={16} aria-hidden="true" /> +{xpGain} XP
                </span>
              ) : (
                <span className="small muted">Rewards for this challenge were already earned.</span>
              )}
            </p>
            {cp.conceptsToReview.length > 0 && <p>{cp.conceptsToReview.length} idea{cp.conceptsToReview.length > 1 ? 's' : ''} flagged — they’ll appear in Review.</p>}
            <div className="cluster mt-16">
              <button type="button" className="btn" onClick={() => navigate(overviewUrl(path))}>
                Back to path
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => { setProgress(newProgress()); setDone(false) }}>
                Try again
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
