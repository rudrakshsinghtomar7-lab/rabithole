import { describe, expect, it } from 'vitest'
import { defaultState, sanitizeState, STATE_VERSION, STORAGE_KEY } from './schema'
import { loadState, saveState } from './store'
import { completeCheckpoint, enroll, setReelPosition, topicKey } from '../learning/engine'
import { historyEvidence } from '../content/history'

function memoryStorage(init: Record<string, string> = {}) {
  const data = { ...init }
  return {
    data,
    getItem: (k: string) => (k in data ? data[k] : null),
    setItem: (k: string, v: string) => {
      data[k] = v
    },
  }
}

describe('persistence', () => {
  it('round-trips learning state through storage', () => {
    const path = historyEvidence
    const t = path.modules[0].topics[0]
    let s = enroll(defaultState(), path.id, 'some', 1)
    s = setReelPosition(s, path.id, t.id, 2, t.reels.length, 2)
    s = completeCheckpoint(s, { pathId: path.id, checkpointKey: topicKey(path.id, t.id), kind: 'topic', title: t.title, results: t.quiz.map((question) => ({ question, outcome: 'independent' as const })), now: 3 })
    s = { ...s, theme: 'dark', interests: ['history'], bookmarks: [{ id: 'b', pathId: path.id, topicId: t.id, reelId: t.reels[0].id, createdAt: 4, note: 'hi' }] }
    const store = memoryStorage()
    expect(saveState(s, store)).toBe(true)
    const { state, recovered } = loadState(store)
    expect(recovered).toBe(false)
    expect(state).toEqual(s)
    expect(state.version).toBe(STATE_VERSION)
  })

  it('starts fresh, without crashing, on malformed JSON', () => {
    const { state, recovered } = loadState(memoryStorage({ [STORAGE_KEY]: '{not json' }))
    expect(recovered).toBe(true)
    expect(state).toEqual(defaultState())
  })

  it('returns defaults when nothing is stored', () => {
    expect(loadState(memoryStorage()).state).toEqual(defaultState())
  })

  it('repairs wrong-typed fields instead of trusting them', () => {
    const s = sanitizeState({
      version: 1,
      theme: 'neon',
      interests: ['history', 42, null],
      attempts: 'nope',
      checkpoints: { a: { total: 3 }, b: 7 },
      settings: { dailyGoalXp: -5, reviewIntervalsDays: ['x'] },
      tabPaths: { interests: 'javascript:alert(1)', courses: '/courses/abc' },
      courses: [{ id: 'c1', name: 'X', materials: 'bad' }],
    })
    expect(s.theme).toBe('system')
    expect(s.interests).toEqual(['history'])
    expect(s.attempts).toEqual([])
    expect(Object.keys(s.checkpoints)).toEqual(['a'])
    expect(s.settings.dailyGoalXp).toBe(30)
    expect(s.settings.reviewIntervalsDays.length).toBeGreaterThan(1)
    expect(s.tabPaths.interests).toBe('/interests')
    expect(s.tabPaths.courses).toBe('/courses/abc')
    expect(s.courses[0].materials).toEqual([])
    expect(s.courses[0].generation.status).toBe('idle')
  })

  it('reports failure when storage throws (quota exceeded)', () => {
    const throwing = {
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    expect(saveState(defaultState(), throwing)).toBe(false)
  })
})
