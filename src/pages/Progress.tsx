import { useState } from 'react'
import { useLocation } from 'wouter'
import { ArrowRight } from 'lucide-react'
import { allTopics, locateTopic, themeForPath, preparedPaths } from '../content'
import type { Path } from '../content/types'
import { useStore } from '../store/store'
import type { AppState, Scope } from '../store/schema'
import { DAY, dayStart, dueCards, pathProgress, scopeOf, topicStatus, totalXp, xpToday } from '../learning/engine'
import { allCourses } from '../store/courses'
import { Art, subjectMotif } from '../ui/Art'
import { Empty, GoalRing, ThemeToggle, Ticks, Wordmark, relTime } from '../ui/common'
import { challengeUrl, getPath, learnUrl, overviewUrl } from '../ui/paths'
import { OutcomeTag, conceptLabel } from './Review'

function pathsInScope(state: AppState, scope: Scope): Path[] {
  const ids = new Set<string>()
  if (scope === 'interest') Object.keys(state.enrollments).forEach((id) => ids.add(id))
  else allCourses(state).forEach((c) => c.pathId && ids.add(c.pathId))
  const all = [...ids].map((id) => getPath(state, id)).filter((p): p is Path => !!p && scopeOf(p) === scope)
  return all.sort((a, b) => (state.enrollments[b.id]?.lastOpenedAt ?? 0) - (state.enrollments[a.id]?.lastOpenedAt ?? 0))
}

interface NextAction {
  label: string
  detail: string
  to: string
}

function nextAction(state: AppState, scope: Scope, paths: Path[]): NextAction {
  const due = dueCards(state, scope)
  if (due.length) return { label: `Review ${due.length} concept${due.length > 1 ? 's' : ''}`, detail: 'They’re due on your schedule — a quick check now keeps them solid.', to: `/review/session/due/${scope}` }
  for (const p of paths) {
    const prog = pathProgress(state, p)
    const pending = prog.pendingQuizTopicIds[0]
    if (pending) {
      const loc = locateTopic(p, pending)!
      return { label: `Take the checkpoint: ${loc.topic.title}`, detail: 'You’ve seen the reels; the checkpoint completes the topic.', to: learnUrl(p, pending) }
    }
  }
  for (const p of paths) {
    const prog = pathProgress(state, p)
    if (prog.nextTopicId) {
      const loc = locateTopic(p, prog.nextTopicId)!
      return { label: `Continue: ${loc.topic.title}`, detail: `${p.title} · Module ${loc.moduleIndex + 1}`, to: learnUrl(p, prog.nextTopicId) }
    }
    const ch = p.modules.find((m, i) => m.challenge && !prog.modules[i].challengeDone)
    if (ch) return { label: `Module challenge: ${ch.challenge!.title}`, detail: 'Connect the ideas from this module.', to: challengeUrl(p, ch.id) }
  }
  if (scope === 'interest' && paths.length)
    return { label: 'Start another path', detail: 'Every checkpoint in your active paths is done. Review keeps them fresh.', to: '/interests' }
  return scope === 'interest'
    ? { label: 'Start a learning path', detail: 'Eight subjects, from philosophy to science.', to: '/interests' }
    : { label: 'Open the sample course', detail: 'Or add your own course and materials.', to: '/courses' }
}

export function ProgressPage() {
  const { state } = useStore()
  const [, navigate] = useLocation()
  const [scope, setScope] = useState<Scope>('interest')
  const paths = pathsInScope(state, scope)
  const action = nextAction(state, scope, paths)
  const cps = Object.entries(state.checkpoints)
    .map(([k, c]) => {
      const [pid, ...rest] = k.split(':')
      const path = getPath(state, pid)
      const isCh = rest[0] === 'challenge'
      const title = path ? (isCh ? `Challenge: ${path.modules.find((m) => m.challenge?.id === rest[1])?.challenge?.title ?? ''}` : locateTopic(path, rest.join(':'))?.topic.title) : undefined
      return { k, c, path, title }
    })
    .filter((x) => x.path && scopeOf(x.path) === scope)
    .sort((a, b) => b.c.lastCompletedAt - a.c.lastCompletedAt)
  const sum = (f: 'independent' | 'assisted' | 'missed') => cps.reduce((n, x) => n + x.c[f], 0)
  const topicsDone = cps.filter((x) => !x.k.includes(':challenge:')).length
  const reviewEvents = Object.values(state.review)
    .filter((c) => c.scope === scope)
    .flatMap((c) => c.history.filter((h) => h.mode === 'review' || h.mode === 'practice').map((h) => ({ ...h, card: c })))
    .sort((a, b) => b.at - a.at)
  const attention = paths.flatMap((p) =>
    allTopics(p)
      .map((t) => ({ p, t, s: topicStatus(state, p.id, t.topic.id) }))
      .filter((x) => x.s === 'needs-review' || x.s === 'quiz-pending'),
  )
  const today = xpToday(state)
  const week = Array.from({ length: 7 }, (_, i) => {
    const start = dayStart(Date.now()) - (6 - i) * DAY
    const xp = state.xp.filter((e) => e.at >= start && e.at < start + DAY).reduce((n, e) => n + e.amount, 0)
    return { start, xp }
  })

  return (
    <div className="page">
      <header className="page-head">
        <Wordmark />
        <ThemeToggle />
      </header>
      <span className="eyebrow">My Progress</span>
      <div className="between mt-8" style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <h1 className="h1">What you’ve built.</h1>
        <div className="seg" role="group" aria-label="Progress for">
          <button type="button" aria-pressed={scope === 'interest'} onClick={() => setScope('interest')}>
            Interests
          </button>
          <button type="button" aria-pressed={scope === 'course'} onClick={() => setScope('course')}>
            Courses
          </button>
        </div>
      </div>

      <section className="section" aria-labelledby="next-h">
        <h2 id="next-h" className="eyebrow">
          Next useful step
        </h2>
        <button type="button" className="row" onClick={() => navigate(action.to)} style={{ borderTop: '1px solid var(--ink)' }}>
          <span className="row-num" aria-hidden="true">
            →
          </span>
          <span>
            <span className="h2" style={{ display: 'block', fontSize: 'clamp(22px,5vw,30px)' }}>
              {action.label}
            </span>
            <span className="row-sub" style={{ display: 'block', marginTop: 4 }}>
              {action.detail}
            </span>
          </span>
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </section>

      <section className="section" aria-labelledby="ev-h">
        <h2 id="ev-h" className="eyebrow" style={{ marginBottom: 8 }}>
          Evidence of understanding · latest checkpoint attempts
        </h2>
        <div className="metric-strip">
          <div>
            <div className="stat-num">{topicsDone}</div>
            <div className="small muted">Small topics completed</div>
          </div>
          <div>
            <div className="stat-num">{sum('independent')}</div>
            <div className="small muted">Answers without help</div>
          </div>
          <div>
            <div className="stat-num">{sum('assisted')}</div>
            <div className="small muted">Answers with help</div>
          </div>
          <div>
            <div className="stat-num">{sum('missed')}</div>
            <div className="small muted">To revisit</div>
          </div>
        </div>
      </section>

      <div className="grid-2 section">
        <div>
          <div className="section-head">
            <h2 className="eyebrow">{scope === 'interest' ? 'Active paths' : 'Course paths'}</h2>
          </div>
          {paths.length === 0 ? (
            <Empty title={scope === 'interest' ? 'No paths started.' : 'No course progress yet.'}>
              <button type="button" className="btn btn-sm mt-8" onClick={() => navigate(scope === 'interest' ? '/interests' : '/courses')}>
                {scope === 'interest' ? 'Choose a path' : 'Go to My Courses'}
              </button>
            </Empty>
          ) : (
            <ul className="rows">
              {paths.map((p) => {
                const prog = pathProgress(state, p)
                const theme = themeForPath(p)
                return (
                  <li key={p.id}>
                    <button type="button" className="row" onClick={() => navigate(overviewUrl(p))} style={{ alignItems: 'start' }}>
                      <span className="swatch surface" data-subject={theme}>
                        <Art motif={subjectMotif[theme]} />
                      </span>
                      <span>
                        <span className="row-title">{p.title}</span>
                        {prog.modules.map((m, i) => (
                          <span key={m.id} style={{ display: 'block', marginTop: 8 }}>
                            <span className="row-sub" style={{ display: 'block', marginBottom: 4 }}>
                              Module {i + 1}: {m.done}/{m.total} checkpoints{m.hasChallenge ? (m.challengeDone ? ' · challenge done' : ' · challenge open') : ''}
                            </span>
                            <Ticks total={m.total + (m.hasChallenge ? 1 : 0)} done={m.done + (m.challengeDone ? 1 : 0)} />
                          </span>
                        ))}
                      </span>
                      <span className="small muted">{relTime(state.enrollments[p.id]?.lastOpenedAt ?? Date.now())}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="section-head section">
            <h2 className="eyebrow">Needs another attempt</h2>
          </div>
          {attention.length === 0 ? (
            <p className="muted small mt-8">Nothing flagged.</p>
          ) : (
            <ul className="rows">
              {attention.map(({ p, t, s }) => (
                <li key={p.id + t.topic.id}>
                  <button type="button" className="row" onClick={() => navigate(learnUrl(p, t.topic.id))} style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                    <span>
                      <span className="row-title">{t.topic.title}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        {p.title}
                      </span>
                    </span>
                    <span className={`tag ${s === 'quiz-pending' ? 'tag-accent' : 'tag-warn'}`}>{s === 'quiz-pending' ? 'Checkpoint unfinished' : 'Review flagged'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="section-head section">
            <h2 className="eyebrow">Checkpoint results</h2>
          </div>
          {cps.length === 0 ? (
            <p className="muted small mt-8">No checkpoints yet.</p>
          ) : (
            <ul className="rows">
              {cps.map(({ k, c, title }) => (
                <li key={k} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                  <span>
                    <span className="row-title">{title}</span>
                    <span className="row-sub" style={{ display: 'block' }}>
                      {c.independent} independent · {c.assisted} with help · {c.missed} missed · {relTime(c.lastCompletedAt)}
                      {c.attemptsCount > 1 ? ` · ${c.attemptsCount} attempts` : ''}
                    </span>
                  </span>
                  <span className="serif" style={{ fontSize: 26 }}>
                    {c.independent}/{c.total}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="section-head">
            <h2 className="eyebrow">Daily goal</h2>
          </div>
          <div className="cluster mt-16" style={{ gap: 14 }}>
            <GoalRing value={today} goal={state.settings.dailyGoalXp} />
            <div>
              <div className="h3">
                {today >= state.settings.dailyGoalXp ? 'Goal met today' : `${state.settings.dailyGoalXp - today} XP to go today`}
              </div>
              <div className="small muted">
                {today}/{state.settings.dailyGoalXp} XP · goal is adjustable in Review settings
              </div>
            </div>
          </div>
          <div className="ticks mt-16" style={{ gap: 6 }} role="img" aria-label={`Last 7 days: goal met on ${week.filter((d) => d.xp >= state.settings.dailyGoalXp).length} days`}>
            {week.map((d) => (
              <i key={d.start} className={d.xp >= state.settings.dailyGoalXp ? 'on' : d.xp > 0 ? 'half' : ''} style={{ height: 22, borderRadius: 4, color: 'var(--accent)' }} title={`${new Date(d.start).toLocaleDateString(undefined, { weekday: 'short' })}: ${d.xp} XP`} />
            ))}
          </div>
          <div className="between small muted mt-8">
            <span>7 days ago</span>
            <span>Today</span>
          </div>

          <div className="section-head section">
            <h2 className="eyebrow">XP</h2>
          </div>
          <p className="mt-8">
            <span className="stat-num">{totalXp(state, scope)}</span> <span className="muted">XP from {scope === 'interest' ? 'interests' : 'courses'}</span>
          </p>
          <p className="small muted">XP rewards effort — finishing checkpoints, answering without help, doing scheduled reviews. It isn’t a measure of how well you understand a subject; the answers above are.</p>

          <div className="section-head section">
            <h2 className="eyebrow">Review history</h2>
          </div>
          {reviewEvents.length === 0 ? (
            <p className="muted small mt-8">No reviews yet.</p>
          ) : (
            <ul className="rows">
              {reviewEvents.slice(0, 8).map((h, i) => (
                <li key={i} className="row" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                  <span>
                    <span className="row-title">{conceptLabel(state, h.card).title}</span>
                    <span className="row-sub" style={{ display: 'block' }}>
                      {h.mode === 'review' ? 'Scheduled' : 'Practice'} · {relTime(h.at)}
                    </span>
                  </span>
                  <OutcomeTag o={h.result} />
                </li>
              ))}
            </ul>
          )}
          {scope === 'interest' && paths.length === 0 && <p className="hint mt-16">{preparedPaths.filter((p) => !p.courseId).length} prepared paths available in My Interests.</p>}
        </div>
      </div>
    </div>
  )
}
