import { lazy, Suspense } from 'react'
import type { Reel } from '../content/types'
import { contextFor } from '../content/contexts'
import { Art } from './Art'
import { Instrument } from './Instrument'

// The atlas pulls in coastline data, so it loads only when a map is first shown.
const Atlas = lazy(() => import('./atlas/Atlas'))

/**
 * The stage above a reel's text: a map (history, philosophy, politics, geography),
 * an instrument panel (economics, finance, science, marketing), or the subject artwork.
 */
export function ContextStage({ topicId, reel, active, fromPlaceId }: { topicId: string; reel: Reel; active: boolean; fromPlaceId?: string }) {
  const ctx = contextFor(topicId)
  const fallback = (
    <figure className="reel-art" style={{ margin: '0 -22px' }}>
      <Art motif={reel.visual.motif} />
      {reel.visual.caption && <figcaption>{reel.visual.caption}</figcaption>}
    </figure>
  )
  if (!ctx) return fallback
  if (ctx.kind === 'instrument')
    return (
      <div className="ctx-stage ctx-stage--instrument">
        <Instrument ctx={ctx} reelId={reel.id} />
      </div>
    )
  return (
    <div className="ctx-stage ctx-stage--map">
      <Suspense fallback={<div className="atlas atlas--loading" aria-hidden="true" />}>
        <Atlas ctx={ctx} reelId={reel.id} active={active} fromPlaceId={fromPlaceId} />
      </Suspense>
    </div>
  )
}
