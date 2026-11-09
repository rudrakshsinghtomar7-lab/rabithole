import { describe, expect, it } from 'vitest'
import { preparedPaths, subjects } from './index'
import { sampleCourseDocs, sampleCoursePath } from './sampleCourse'
import type { Question } from './types'
import { validatePathCitations } from '../learning/citations'

describe('prepared content integrity', () => {
  for (const path of preparedPaths) {
    describe(path.title, () => {
      it('has at least one module with three or more small topics', () => {
        expect(path.modules.length).toBeGreaterThan(0)
        for (const m of path.modules) expect(m.topics.length).toBeGreaterThanOrEqual(3)
      })

      it('gives every topic an objective, 3–5 reels and a 3-question checkpoint covering all three skills', () => {
        for (const m of path.modules)
          for (const t of m.topics) {
            expect(t.objective.length).toBeGreaterThan(20)
            expect(t.reels.length).toBeGreaterThanOrEqual(3)
            expect(t.reels.length).toBeLessThanOrEqual(5)
            expect(t.quiz).toHaveLength(3)
            expect(new Set(t.quiz.map((q) => q.skill))).toEqual(new Set(['recognise', 'apply', 'reason']))
          }
      })

      it('links every question to a reel in its topic, with a valid answer and specific feedback', () => {
        const check = (q: Question, reelIds: Set<string>) => {
          expect(reelIds.has(q.reelId), `${q.id} → ${q.reelId}`).toBe(true)
          if (q.type === 'choice') {
            expect(q.options.length).toBeGreaterThanOrEqual(3)
            expect(q.options.some((o) => o.id === q.correctId)).toBe(true)
            for (const o of q.options) expect(o.feedback.length).toBeGreaterThan(5)
          } else expect(q.lookFor.length).toBeGreaterThan(0)
        }
        for (const m of path.modules) {
          const moduleReels = new Set(m.topics.flatMap((t) => t.reels.map((r) => r.id)))
          for (const t of m.topics) {
            const reelIds = new Set(t.reels.map((r) => r.id))
            for (const q of t.quiz) {
              check(q, reelIds)
              if (q.fresh) {
                check(q.fresh as Question, reelIds)
                expect(q.fresh.conceptId).toBe(q.conceptId)
              }
            }
          }
          m.challenge?.questions.forEach((q) => check(q, moduleReels))
        }
      })

      it('uses unique ids and only cites sources that exist', () => {
        const ids = path.modules.flatMap((m) => [m.id, ...m.topics.flatMap((t) => [t.id, ...t.reels.map((r) => r.id), ...t.quiz.flatMap((q) => [q.id, ...(q.fresh ? [q.fresh.id] : [])])])])
        expect(new Set(ids).size).toBe(ids.length)
        const sourceIds = new Set(path.sources.map((s) => s.id))
        for (const m of path.modules) for (const t of m.topics) for (const r of t.reels) for (const ref of r.sources ?? []) expect(sourceIds.has(ref.sourceId), ref.sourceId).toBe(true)
      })
    })
  }

  it('every subject points at a real path', () => {
    for (const s of subjects) for (const id of s.pathIds) expect(preparedPaths.some((p) => p.id === id)).toBe(true)
  })

  it('sample course citations resolve to real pages of the bundled documents', () => {
    const index = Object.fromEntries(sampleCourseDocs.map((d) => [d.id, { pageCount: d.pages.length, readable: true }]))
    expect(validatePathCitations(sampleCoursePath, index)).toEqual([])
    // and every course-derived reel actually has a citation
    for (const t of sampleCoursePath.modules[0].topics) for (const r of t.reels) if (r.origin === 'course') expect(r.sources?.length).toBeGreaterThan(0)
  })
})
