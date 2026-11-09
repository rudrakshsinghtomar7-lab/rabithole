import { useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { ArrowLeft, ArrowRight, ExternalLink, Flag, Lock } from 'lucide-react'
import { getSubject, themeForPath } from '../content'
import type { Familiarity, Path } from '../content/types'
import { useStore } from '../store/store'
import { challengeKey, enroll, pathProgress, topicStatus } from '../learning/engine'
import { Art, subjectMotif } from '../ui/Art'
import { StatusDot, Ticks, statusText } from '../ui/common'
import { challengeUrl, getPath, learnUrl } from '../ui/paths'
import { FamiliaritySheet } from './InterestsHome'

export function PathOverview() {
  const { pathId } = useParams<{ pathId: string }>()
  const { state } = useStore()
  const [, navigate] = useLocation()
  const path = getPath(state, pathId)
  if (!path)
    return (
      <div className="page">
        <button type="button" className="back-link" onClick={() => navigate('/interests')}>
          <ArrowLeft size={16} aria-hidden="true" /> My Interests
        </button>
        <p className="h1 mt-16">Path not found.</p>
      </div>
    )
  return (
    <div className="page">
      <button type="button" className="back-link" onClick={() => navigate('/interests')}>
        <ArrowLeft size={16} aria-hidden="true" /> My Interests
      </button>
      <PathOutline path={path} />
    </div>
  )
}

/** Path header + module/topic outline; shared by interest paths and course pages. */
export function PathOutline({ path, compactHeader }: { path: Path; compactHeader?: boolean }) {
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const [picker, setPicker] = useState(false)
  const prog = pathProgress(state, path)
  const theme = themeForPath(path)
  const sub = getSubject(path.subjectId)
  const enrollment = state.enrollments[path.id]
  const next = prog.nextTopicId

  const begin = (fam?: Familiarity) => {
    update((s) => enroll(s, path.id, fam ?? s.enrollments[path.id]?.familiarity ?? 'new'))
    setPicker(false)
    const target = next ?? path.modules[0].topics[0].id
    navigate(learnUrl(path, target))
  }
  const onPrimary = () => (enrollment || !path.familiarityNote ? begin() : setPicker(true))

  return (
    <>
      {!compactHeader && (
        <header className="hero hero-short surface mt-8" data-subject={theme} style={{ minHeight: 320 }}>
          <div className="hero-art">
            <Art motif={path.modules[0]?.topics[0]?.reels[0]?.visual.motif ?? subjectMotif[theme]} />
          </div>
          <div className="hero-body">
            <span className="cluster">
              <span className="eyebrow muted">{sub?.name ?? (path.courseId ? 'Course' : 'Custom')}</span>
              <span className="tag">{path.origin === 'prepared' ? 'Prepared path' : path.origin === 'generated' ? 'Generated for you' : 'Sample course'}</span>
            </span>
            <h1 className="display">{path.title}</h1>
            <p style={{ maxWidth: '52ch', margin: 0 }}>{path.description}</p>
            <div style={{ maxWidth: 360 }}>
              <Ticks total={prog.totalTopics} done={prog.checkpointsDone} />
              <span className="small muted">
                {prog.checkpointsDone} of {prog.totalTopics} checkpoints passed
              </span>
            </div>
            <div className="hero-actions">
              <button type="button" className="btn" onClick={onPrimary}>
                {enrollment ? (next ? 'Continue' : 'Revisit') : 'Start path'} <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>
      )}

      {enrollment && path.familiarityNote && (
        <div className="between mt-16" style={{ flexWrap: 'wrap' }}>
          <span className="small muted">{path.familiarityNote}</span>
          <div className="seg" role="group" aria-label="Familiarity">
            {(['new', 'some'] as const).map((f) => (
              <button key={f} type="button" aria-pressed={enrollment.familiarity === f} onClick={() => update((s) => enroll(s, path.id, f))}>
                {f === 'new' ? 'New to it' : 'Some background'}
              </button>
            ))}
          </div>
        </div>
      )}

      {path.modules.map((m, mi) => {
        const mp = prog.modules[mi]
        const chDone = m.challenge && state.checkpoints[challengeKey(path.id, m.challenge.id)]
        return (
          <section key={m.id} className="section" aria-labelledby={`m-${m.id}`}>
            <div className="section-head">
              <h2 id={`m-${m.id}`} className="h2">
                <span className="muted">Module {mi + 1}.</span> {m.title}
              </h2>
              <span className="small muted" style={{ whiteSpace: 'nowrap' }}>
                {mp.done}/{mp.total}
              </span>
            </div>
            <p className="muted small mt-8">{m.summary}</p>
            <ol className="rows">
              {m.topics.map((t, ti) => {
                const s = topicStatus(state, path.id, t.id)
                return (
                  <li key={t.id}>
                    <button type="button" className="row" onClick={() => (enrollment ? navigate(learnUrl(path, t.id)) : onPrimary())} aria-label={`Topic ${ti + 1}: ${t.title}. ${statusText(s)}`}>
                      <span className="row-num" aria-hidden="true">
                        {ti + 1}
                      </span>
                      <span>
                        <span className="row-title">{t.title}</span>
                        <span className="row-sub" style={{ display: 'block' }}>
                          {t.objective}
                        </span>
                        <span className="cluster mt-8">
                          <span className="tag">{t.reels.length} reels · 3-question checkpoint</span>
                          {s !== 'not-started' && <span className={`tag ${s === 'completed' ? 'tag-good' : s === 'needs-review' ? 'tag-warn' : 'tag-accent'}`}>{statusText(s)}</span>}
                        </span>
                      </span>
                      <StatusDot status={s} />
                    </button>
                  </li>
                )
              })}
              {m.challenge && (
                <li>
                  <button type="button" className="row" onClick={() => navigate(challengeUrl(path, m.id))}>
                    <span className="row-num" aria-hidden="true">
                      <Flag size={22} />
                    </span>
                    <span>
                      <span className="row-title">Module challenge: {m.challenge.title}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        A broader scenario that connects this module’s ideas.
                        {mp.done < mp.total && !chDone && ' Best after all topic checkpoints.'}
                      </span>
                    </span>
                    {chDone ? <span className="tag tag-good">Done</span> : mp.done < mp.total ? <Lock size={16} aria-label="Recommended after the topics" /> : <span className="tag tag-accent">Ready</span>}
                  </button>
                </li>
              )}
            </ol>
          </section>
        )
      })}

      {path.sources.length > 0 && !path.courseId && (
        <section className="section" aria-labelledby="src-h">
          <div className="section-head">
            <h2 id="src-h" className="eyebrow">
              Sources
            </h2>
          </div>
          <ul className="rows">
            {path.sources.map((s) => (
              <li key={s.id} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                <span>
                  <span className="row-title">{s.title}</span>
                  <span className="row-sub" style={{ display: 'block' }}>
                    {[s.author, s.year].filter(Boolean).join(', ')}
                  </span>
                </span>
                {s.url && (
                  <a className="icon-btn" href={s.url} target="_blank" rel="noreferrer" aria-label={`Open ${s.title} (new tab)`}>
                    <ExternalLink size={18} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {picker && <FamiliaritySheet path={path} onClose={() => setPicker(false)} onStart={begin} />}
    </>
  )
}
