// Pure learning-state transitions. Every function takes state and returns new state;
// none of them touch storage or the DOM, so they are easy to test.

import type { Familiarity, Path, Question } from '../content/types'
import { allTopics, findPath, visibleReels } from '../content'
import type { AppState, Attempt, AttemptMode, Checkpoint, Outcome, ReviewCard, Scope, XpEntry } from '../store/schema'

export const DAY = 24 * 60 * 60 * 1000

export const XP = {
  checkpoint: 20,
  independentAnswer: 5,
  challenge: 40,
  review: 5,
} as const

export const topicKey = (pathId: string, topicId: string) => `${pathId}:${topicId}`
export const challengeKey = (pathId: string, challengeId: string) => `${pathId}:challenge:${challengeId}`
export const conceptKey = (pathId: string, conceptId: string) => `${pathId}::${conceptId}`

export const scopeOf = (path: Path | undefined): Scope => (path?.courseId ? 'course' : 'interest')

export function uid(prefix = 'id'): string {
  const rnd = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now().toString(36)}${rnd}`
}

// ───────────── XP (idempotent) ─────────────

/** Adds an XP entry only if no entry with the same id exists. Refreshes, re-taps and re-opened quizzes can't duplicate rewards. */
export function awardXp(state: AppState, entry: XpEntry): AppState {
  if (entry.amount <= 0 || state.xp.some((e) => e.id === entry.id)) return state
  return { ...state, xp: [...state.xp, entry] }
}

export function totalXp(state: AppState, scope?: Scope): number {
  return state.xp.filter((e) => !scope || e.scope === scope).reduce((n, e) => n + e.amount, 0)
}

export function dayStart(t: number): number {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function xpToday(state: AppState, now = Date.now()): number {
  const start = dayStart(now)
  return state.xp.filter((e) => e.at >= start && e.at < start + DAY).reduce((n, e) => n + e.amount, 0)
}

// ───────────── Enrolment & feed position ─────────────

export function enroll(state: AppState, pathId: string, familiarity: Familiarity, now = Date.now()): AppState {
  const existing = state.enrollments[pathId]
  return {
    ...state,
    enrollments: {
      ...state.enrollments,
      [pathId]: existing ? { ...existing, familiarity, lastOpenedAt: now } : { pathId, startedAt: now, familiarity, lastOpenedAt: now },
    },
  }
}

export function openTopic(state: AppState, pathId: string, topicId: string, now = Date.now()): AppState {
  const e = state.enrollments[pathId] ?? { pathId, startedAt: now, familiarity: 'new' as Familiarity, lastOpenedAt: now }
  return { ...state, enrollments: { ...state.enrollments, [pathId]: { ...e, lastTopicId: topicId, lastOpenedAt: now } } }
}

/** Records the reel the learner is on. Reaching the last reel marks content (not the topic) as done. */
export function setReelPosition(state: AppState, pathId: string, topicId: string, reelIndex: number, reelCount: number, now = Date.now()): AppState {
  const key = topicKey(pathId, topicId)
  const prev = state.feed[key] ?? { reelIndex: 0, maxReelIndex: 0 }
  const maxReelIndex = Math.max(prev.maxReelIndex, reelIndex)
  const contentDoneAt = prev.contentDoneAt ?? (maxReelIndex >= reelCount - 1 ? now : undefined)
  if (prev.reelIndex === reelIndex && prev.maxReelIndex === maxReelIndex && prev.contentDoneAt === contentDoneAt) return state
  return { ...state, feed: { ...state.feed, [key]: { reelIndex, maxReelIndex, contentDoneAt } } }
}

// ───────────── Answers & checkpoints ─────────────

export function recordAttempt(state: AppState, a: Omit<Attempt, 'id' | 'at'> & { at?: number }): AppState {
  const attempt: Attempt = { ...a, id: uid('att'), at: a.at ?? Date.now() }
  return { ...state, attempts: [...state.attempts, attempt] }
}

export interface QuestionResult {
  question: Question
  outcome: Outcome
}

/**
 * Completes a topic quiz or module challenge. Only this marks a topic completed.
 * XP: once per checkpoint, plus once per question first answered independently.
 * Every concept gets a review card; weak ones are flagged.
 */
export function completeCheckpoint(
  state: AppState,
  args: { pathId: string; checkpointKey: string; kind: 'topic' | 'challenge'; title: string; results: QuestionResult[]; now?: number },
): AppState {
  const now = args.now ?? Date.now()
  const path = findPath(args.pathId, state.generated)
  const scope = scopeOf(path)
  const count = (o: Outcome) => args.results.filter((r) => r.outcome === o).length
  const conceptsToReview = unique(args.results.filter((r) => r.outcome !== 'independent').map((r) => r.question.conceptId))
  const prev = state.checkpoints[args.checkpointKey]
  const cp: Checkpoint = {
    firstCompletedAt: prev?.firstCompletedAt ?? now,
    lastCompletedAt: now,
    attemptsCount: (prev?.attemptsCount ?? 0) + 1,
    total: args.results.length,
    independent: count('independent'),
    assisted: count('assisted'),
    missed: count('missed'),
    conceptsToReview,
  }
  let next: AppState = { ...state, checkpoints: { ...state.checkpoints, [args.checkpointKey]: cp } }

  const base = args.kind === 'challenge' ? XP.challenge : XP.checkpoint
  next = awardXp(next, { id: `checkpoint:${args.checkpointKey}`, amount: base, reason: `${args.kind === 'challenge' ? 'Module challenge' : 'Checkpoint'}: ${args.title}`, at: now, scope })
  for (const r of args.results) {
    if (r.outcome === 'independent')
      next = awardXp(next, { id: `independent:${args.checkpointKey}:${r.question.id}`, amount: XP.independentAnswer, reason: 'Answered without help', at: now, scope })
  }
  // Worst outcome per concept drives its schedule.
  const byConcept = new Map<string, Outcome>()
  for (const r of args.results) byConcept.set(r.question.conceptId, worse(byConcept.get(r.question.conceptId), r.outcome))
  for (const [conceptId, outcome] of byConcept) next = scheduleReview(next, args.pathId, conceptId, outcome, args.kind === 'challenge' ? 'challenge' : 'quiz', now)
  return next
}

const rank: Record<Outcome, number> = { independent: 0, assisted: 1, missed: 2 }
function worse(a: Outcome | undefined, b: Outcome): Outcome {
  return a && rank[a] > rank[b] ? a : b
}
function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)]
}

// ───────────── Review scheduling ─────────────
//
// A transparent Leitner-style heuristic, not a forgetting prediction:
//   independent → move up one box     assisted → stay in the box     missed → back to box 0
//   next due = now + intervals[box] days (intervals configurable in settings)

export function scheduleReview(state: AppState, pathId: string, conceptId: string, outcome: Outcome, mode: AttemptMode, now = Date.now()): AppState {
  const key = conceptKey(pathId, conceptId)
  const intervals = state.settings.reviewIntervalsDays
  const prev = state.review[key]
  const scope = scopeOf(findPath(pathId, state.generated))
  let box: number
  if (!prev) box = outcome === 'independent' ? 1 : 0
  else if (outcome === 'independent') box = Math.min(prev.box + 1, intervals.length - 1)
  else if (outcome === 'assisted') box = prev.box
  else box = 0
  box = Math.min(box, intervals.length - 1)
  const card: ReviewCard = {
    key,
    pathId,
    conceptId,
    scope,
    box,
    dueAt: now + intervals[box] * DAY,
    lastAt: now,
    history: [...(prev?.history ?? []), { at: now, result: outcome, mode }],
  }
  return { ...state, review: { ...state.review, [key]: card } }
}

/** Stable identity of one scheduled review instance; used to award review XP once. */
export const reviewInstanceId = (card: ReviewCard) => `review:${card.key}@${card.dueAt}`

export function isDue(card: ReviewCard, now = Date.now()) {
  return card.dueAt <= now
}

/**
 * Applies a review answer. Due reviews reschedule and earn XP once per instance.
 * Early practice only reschedules on a miss (so practising can't game intervals) and earns no XP.
 */
export function applyReviewAnswer(state: AppState, card: ReviewCard, outcome: Outcome, now = Date.now()): AppState {
  const due = isDue(card, now)
  let next = state
  if (due) {
    next = awardXp(next, { id: reviewInstanceId(card), amount: XP.review, reason: 'Scheduled review', at: now, scope: card.scope })
    next = scheduleReview(next, card.pathId, card.conceptId, outcome, 'review', now)
  } else if (outcome === 'missed') {
    next = scheduleReview(next, card.pathId, card.conceptId, outcome, 'practice', now)
  } else {
    const c = next.review[card.key]
    next = { ...next, review: { ...next.review, [card.key]: { ...c, lastAt: now, history: [...c.history, { at: now, result: outcome, mode: 'practice' }] } } }
  }
  return next
}

// ───────────── Derived progress ─────────────

export type TopicStatus = 'not-started' | 'in-progress' | 'quiz-pending' | 'completed' | 'needs-review'

export function topicStatus(state: AppState, pathId: string, topicId: string): TopicStatus {
  const key = topicKey(pathId, topicId)
  const cp = state.checkpoints[key]
  if (cp) return cp.conceptsToReview.length ? 'needs-review' : 'completed'
  const f = state.feed[key]
  if (!f) return 'not-started'
  return f.contentDoneAt ? 'quiz-pending' : 'in-progress'
}

export const isCheckpointDone = (s: TopicStatus) => s === 'completed' || s === 'needs-review'

export interface PathProgress {
  totalTopics: number
  checkpointsDone: number
  modules: { id: string; title: string; total: number; done: number; challengeDone: boolean; hasChallenge: boolean }[]
  nextTopicId?: string
  pendingQuizTopicIds: string[]
}

export function pathProgress(state: AppState, path: Path): PathProgress {
  const topics = allTopics(path)
  const statuses = topics.map((t) => ({ t, s: topicStatus(state, path.id, t.topic.id) }))
  const modules = path.modules.map((m) => ({
    id: m.id,
    title: m.title,
    total: m.topics.length,
    done: m.topics.filter((t) => isCheckpointDone(topicStatus(state, path.id, t.id))).length,
    hasChallenge: !!m.challenge,
    challengeDone: !!(m.challenge && state.checkpoints[challengeKey(path.id, m.challenge.id)]),
  }))
  const last = state.enrollments[path.id]?.lastTopicId
  const lastStatus = last ? topicStatus(state, path.id, last) : undefined
  const firstOpen = statuses.find((x) => !isCheckpointDone(x.s))?.t.topic.id
  return {
    totalTopics: topics.length,
    checkpointsDone: statuses.filter((x) => isCheckpointDone(x.s)).length,
    modules,
    nextTopicId: last && lastStatus && !isCheckpointDone(lastStatus) ? last : firstOpen,
    pendingQuizTopicIds: statuses.filter((x) => x.s === 'quiz-pending').map((x) => x.t.topic.id),
  }
}

/** Remaining reels before the checkpoint, for "quiz in N reels". */
export function reelsUntilQuiz(state: AppState, path: Path, topicId: string): number {
  const loc = allTopics(path).find((t) => t.topic.id === topicId)
  if (!loc) return 0
  const fam = state.enrollments[path.id]?.familiarity ?? 'new'
  const count = visibleReels(loc.topic, fam).length
  const f = state.feed[topicKey(path.id, topicId)]
  return Math.max(0, count - 1 - (f?.reelIndex ?? 0))
}

/** Whether a topic sits after an unfinished checkpoint in the same module (weak foundation). */
export function weakFoundation(state: AppState, path: Path, topicId: string): string | undefined {
  const loc = allTopics(path).find((t) => t.topic.id === topicId)
  if (!loc || loc.topicIndex === 0) return undefined
  const prev = loc.module.topics[loc.topicIndex - 1]
  const s = topicStatus(state, path.id, prev.id)
  if (!isCheckpointDone(s)) return prev.title
  if (s === 'needs-review') return prev.title
  return undefined
}

export function dueCards(state: AppState, scope?: Scope, now = Date.now()): ReviewCard[] {
  return Object.values(state.review)
    .filter((c) => (!scope || c.scope === scope) && isDue(c, now))
    .sort((a, b) => a.dueAt - b.dueAt)
}

export function helpCards(state: AppState, scope?: Scope): ReviewCard[] {
  return Object.values(state.review).filter((c) => (!scope || c.scope === scope) && c.history.length > 0 && c.history[c.history.length - 1].result !== 'independent')
}
