import { describe, expect, it } from 'vitest'
import { defaultState } from '../store/schema'
import { philosophyIdentity } from '../content/philosophy'
import { sampleCoursePath } from '../content/sampleCourse'
import { marketingPositioning } from '../content/marketing'
import {
  applyReviewAnswer,
  awardXp,
  completeCheckpoint,
  conceptKey,
  DAY,
  dueCards,
  enroll,
  helpCards,
  pathProgress,
  reviewInstanceId,
  scheduleReview,
  setReelPosition,
  topicKey,
  topicStatus,
  totalXp,
  weakFoundation,
  XP,
  type QuestionResult,
} from './engine'

const path = philosophyIdentity
const topic = path.modules[0].topics[0]
const key = topicKey(path.id, topic.id)
const T0 = Date.UTC(2026, 10, 10, 12)

const results = (outcomes: QuestionResult['outcome'][]): QuestionResult[] => topic.quiz.map((question, i) => ({ question, outcome: outcomes[i] }))

describe('topic completion', () => {
  it('viewing every reel marks content done but does not complete the topic', () => {
    let s = enroll(defaultState(), path.id, 'new', T0)
    for (let i = 0; i < topic.reels.length; i++) s = setReelPosition(s, path.id, topic.id, i, topic.reels.length, T0)
    expect(s.feed[key].contentDoneAt).toBe(T0)
    expect(topicStatus(s, path.id, topic.id)).toBe('quiz-pending')
    expect(pathProgress(s, path).checkpointsDone).toBe(0)
  })

  it('only the checkpoint completes a topic, and weak answers still flag concepts', () => {
    const s = completeCheckpoint(defaultState(), { pathId: path.id, checkpointKey: key, kind: 'topic', title: topic.title, results: results(['independent', 'assisted', 'missed']), now: T0 })
    expect(topicStatus(s, path.id, topic.id)).toBe('needs-review')
    expect(s.checkpoints[key]).toMatchObject({ independent: 1, assisted: 1, missed: 1, total: 3 })
    expect(s.checkpoints[key].conceptsToReview).toEqual([topic.quiz[1].conceptId, topic.quiz[2].conceptId])
    expect(pathProgress(s, path).checkpointsDone).toBe(1)
  })

  it('a clean checkpoint is "completed" and the next topic is suggested', () => {
    const s = completeCheckpoint(defaultState(), { pathId: path.id, checkpointKey: key, kind: 'topic', title: topic.title, results: results(['independent', 'independent', 'independent']), now: T0 })
    expect(topicStatus(s, path.id, topic.id)).toBe('completed')
    expect(pathProgress(s, path).nextTopicId).toBe(path.modules[0].topics[1].id)
  })

  it('flags a weak foundation when the previous checkpoint is unfinished', () => {
    const second = path.modules[0].topics[1]
    expect(weakFoundation(defaultState(), path, second.id)).toBe(topic.title)
    const s = completeCheckpoint(defaultState(), { pathId: path.id, checkpointKey: key, kind: 'topic', title: topic.title, results: results(['independent', 'independent', 'independent']), now: T0 })
    expect(weakFoundation(s, path, second.id)).toBeUndefined()
  })

  it('course progress stays separate from interest progress', () => {
    const s = completeCheckpoint(defaultState(), { pathId: marketingPositioning.id, checkpointKey: topicKey(marketingPositioning.id, 'mkt-audience'), kind: 'topic', title: 'x', results: [], now: T0 })
    expect(pathProgress(s, sampleCoursePath).checkpointsDone).toBe(0)
    expect(s.xp.every((e) => e.scope === 'interest')).toBe(true)
  })
})

describe('XP idempotency', () => {
  it('awards checkpoint XP once, however many times the quiz is retaken', () => {
    const args = { pathId: path.id, checkpointKey: key, kind: 'topic' as const, title: topic.title, results: results(['independent', 'missed', 'independent']), now: T0 }
    let s = completeCheckpoint(defaultState(), args)
    const first = totalXp(s)
    expect(first).toBe(XP.checkpoint + 2 * XP.independentAnswer)
    s = completeCheckpoint(s, { ...args, now: T0 + 1000 })
    s = completeCheckpoint(s, { ...args, now: T0 + 2000 })
    expect(totalXp(s)).toBe(first)
    expect(s.checkpoints[key].attemptsCount).toBe(3)
  })

  it('a retake can earn the independent-answer XP that was missed the first time, but only once', () => {
    let s = completeCheckpoint(defaultState(), { pathId: path.id, checkpointKey: key, kind: 'topic', title: topic.title, results: results(['missed', 'missed', 'missed']), now: T0 })
    expect(totalXp(s)).toBe(XP.checkpoint)
    s = completeCheckpoint(s, { pathId: path.id, checkpointKey: key, kind: 'topic', title: topic.title, results: results(['independent', 'missed', 'missed']), now: T0 + 1 })
    s = completeCheckpoint(s, { pathId: path.id, checkpointKey: key, kind: 'topic', title: topic.title, results: results(['independent', 'missed', 'missed']), now: T0 + 2 })
    expect(totalXp(s)).toBe(XP.checkpoint + XP.independentAnswer)
  })

  it('awardXp ignores duplicate ids and non-positive amounts', () => {
    let s = awardXp(defaultState(), { id: 'a', amount: 10, reason: '', at: T0, scope: 'interest' })
    s = awardXp(s, { id: 'a', amount: 10, reason: '', at: T0, scope: 'interest' })
    s = awardXp(s, { id: 'b', amount: 0, reason: '', at: T0, scope: 'interest' })
    expect(totalXp(s)).toBe(10)
  })

  it('reading reels earns no XP', () => {
    let s = defaultState()
    for (let i = 0; i < 20; i++) s = setReelPosition(s, path.id, topic.id, i % topic.reels.length, topic.reels.length, T0)
    expect(totalXp(s)).toBe(0)
  })
})

describe('review scheduling', () => {
  const cid = topic.quiz[0].conceptId
  const ck = conceptKey(path.id, cid)

  it('follows the documented step rule with configurable intervals', () => {
    let s = defaultState()
    s = { ...s, settings: { ...s.settings, reviewIntervalsDays: [1, 2, 4] } }
    s = scheduleReview(s, path.id, cid, 'independent', 'quiz', T0)
    expect(s.review[ck]).toMatchObject({ box: 1, dueAt: T0 + 2 * DAY })
    s = scheduleReview(s, path.id, cid, 'independent', 'review', T0)
    expect(s.review[ck]).toMatchObject({ box: 2, dueAt: T0 + 4 * DAY })
    s = scheduleReview(s, path.id, cid, 'independent', 'review', T0)
    expect(s.review[ck].box).toBe(2) // capped at the last step
    s = scheduleReview(s, path.id, cid, 'assisted', 'review', T0)
    expect(s.review[ck].box).toBe(2)
    s = scheduleReview(s, path.id, cid, 'missed', 'review', T0)
    expect(s.review[ck]).toMatchObject({ box: 0, dueAt: T0 + 1 * DAY })
    expect(s.review[ck].history.map((h) => h.result)).toEqual(['independent', 'independent', 'independent', 'assisted', 'missed'])
  })

  it('due reviews earn XP once per scheduled instance; early practice earns none and cannot push intervals out', () => {
    let s = scheduleReview(defaultState(), path.id, cid, 'missed', 'quiz', T0)
    const card = s.review[ck]
    expect(dueCards(s, undefined, T0)).toHaveLength(0)
    expect(helpCards(s)).toHaveLength(1)

    // practise early, correctly → no XP, schedule unchanged
    s = applyReviewAnswer(s, card, 'independent', T0 + 1000)
    expect(totalXp(s)).toBe(0)
    expect(s.review[ck].dueAt).toBe(card.dueAt)

    // when due → XP once, rescheduled
    const later = card.dueAt + 1
    const dueCard = s.review[ck]
    expect(dueCards(s, undefined, later)).toHaveLength(1)
    s = applyReviewAnswer(s, dueCard, 'independent', later)
    expect(totalXp(s)).toBe(XP.review)
    expect(s.xp[0].id).toBe(reviewInstanceId(dueCard))
    // replaying the same instance (e.g. a refresh mid-session) does not add XP
    s = applyReviewAnswer(s, dueCard, 'independent', later + 5)
    expect(totalXp(s)).toBe(XP.review)
  })

  it('checkpoint completion creates a card per concept using the worst outcome', () => {
    const s = completeCheckpoint(defaultState(), { pathId: path.id, checkpointKey: key, kind: 'topic', title: topic.title, results: results(['independent', 'missed', 'assisted']), now: T0 })
    expect(Object.keys(s.review)).toHaveLength(3)
    expect(s.review[conceptKey(path.id, topic.quiz[1].conceptId)].box).toBe(0)
    expect(s.review[conceptKey(path.id, topic.quiz[0].conceptId)].box).toBe(1)
  })
})
