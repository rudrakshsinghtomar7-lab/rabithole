import { describe, expect, it } from 'vitest'
import { preparedPaths } from './index'
import { pathAtlas, topicContexts } from './contexts'

const interestPaths = preparedPaths.filter((p) => !p.courseId)
const reelIds = new Set(preparedPaths.flatMap((p) => p.modules.flatMap((m) => m.topics.flatMap((t) => t.reels.map((r) => r.id)))))
const topicIds = new Set(preparedPaths.flatMap((p) => p.modules.flatMap((m) => m.topics.map((t) => t.id))))

describe('topic contexts', () => {
  it('every interest topic has a context layer', () => {
    for (const p of interestPaths) for (const m of p.modules) for (const t of m.topics) expect(topicContexts[t.id], t.id).toBeDefined()
  })

  it('history, philosophy and political science use maps; data subjects use instruments', () => {
    const kindBySubject: Record<string, string> = { history: 'map', philosophy: 'map', politics: 'map', geography: 'map', economics: 'instrument', finance: 'instrument', science: 'instrument', marketing: 'instrument' }
    for (const p of interestPaths) for (const m of p.modules) for (const t of m.topics) expect(topicContexts[t.id].kind, t.id).toBe(kindBySubject[p.subjectId!])
  })

  it('only references real topics, reels and places, with plausible coordinates', () => {
    for (const [topicId, ctx] of Object.entries(topicContexts)) {
      expect(topicIds.has(topicId), topicId).toBe(true)
      if (ctx.kind === 'map') {
        const placeIds = new Set(ctx.places.map((p) => p.id))
        expect(placeIds.size, `${topicId} unique place ids`).toBe(ctx.places.length)
        for (const p of ctx.places) {
          expect(Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180, p.id).toBe(true)
          expect(p.note.length, p.id).toBeGreaterThan(10)
        }
        for (const id of ctx.route ?? []) expect(placeIds.has(id), `${topicId} route ${id}`).toBe(true)
        for (const [reel, place] of Object.entries(ctx.focusByReel)) {
          expect(reelIds.has(reel), `${topicId} reel ${reel}`).toBe(true)
          expect(placeIds.has(place), `${topicId} place ${place}`).toBe(true)
        }
      } else {
        const tabIds = new Set(ctx.tabs.map((t) => t.id))
        expect(ctx.tabs.length).toBeGreaterThan(0)
        for (const [reel, tab] of Object.entries(ctx.tabByReel ?? {})) {
          expect(reelIds.has(reel), `${topicId} reel ${reel}`).toBe(true)
          expect(tabIds.has(tab), `${topicId} tab ${tab}`).toBe(true)
        }
        for (const t of ctx.tabs) {
          if (t.chart?.type === 'line') expect(t.chart.series.every(Number.isFinite), t.id).toBe(true)
          if (t.chart?.type === 'bars') expect(t.chart.bars.length, t.id).toBeGreaterThan(0)
        }
      }
    }
  })

  it('idea maps put each origin in chronological order along the route', () => {
    const year = (y?: string) => (y ? Number((/\d{3,4}/.exec(y) ?? ['0'])[0]) * (/BCE/.test(y) ? -1 : 1) : NaN)
    for (const id of ['phil-memory', 'phil-fission', 'phil-ship']) {
      const ctx = topicContexts[id]
      if (ctx.kind !== 'map') continue
      const years = (ctx.route ?? []).map((r) => year(ctx.places.find((p) => p.id === r)?.year)).filter((n) => !Number.isNaN(n))
      expect([...years].sort((a, b) => a - b), id).toEqual(years)
    }
  })

  it('compound figures in the finance instrument match the lesson text', () => {
    const ctx = topicContexts['fin-compound']
    if (ctx.kind !== 'instrument') throw new Error('expected instrument')
    const line = ctx.tabs[0].chart
    if (line?.type !== 'line') throw new Error('expected line')
    expect(Math.round(line.series[30])).toBe(4322)
    expect(line.compare?.[30]).toBe(2500)
  })

  it('builds a path atlas that merges topics in route order', () => {
    const atlas = pathAtlas(['phil-ship', 'phil-memory', 'phil-fission'])
    expect(atlas?.route?.[0]).toBe('chaeronea')
    expect(atlas?.route).toContain('oxford-parfit')
  })
})
