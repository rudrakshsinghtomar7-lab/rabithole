import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { MapContext, Place } from '../../content/contexts'
import { focusFor } from '../../content/contexts'
import { tick } from '../haptics'
import { prefersReducedMotion, project, rubberband, spring, type SpringHandle } from '../spring'
import { buildMap, FOCUS_POINT, H, W, type ProjectionKind } from './geo'

const kindLabel: Record<Place['kind'], string> = {
  origin: 'Where the idea came from',
  event: 'What happened here',
  place: 'Place',
}

const SLOP = 10 // px before a press becomes a horizontal pan (hysteresis)

export interface AtlasProps {
  ctx: MapContext
  /** Reel whose focus place should be centred. */
  reelId?: string
  /** Place to pan from when this map becomes active (the previous reel's focus). */
  fromPlaceId?: string
  active?: boolean
  /** Show the floating place card. */
  card?: boolean
  /** Explicit focus place (overrides the reel's). */
  placeId?: string
  className?: string
}

export default function Atlas({ ctx, reelId, fromPlaceId, active = true, card = true, placeId, className = '' }: AtlasProps) {
  const uid = useId().replace(/:/g, '')
  const [projection, setProjection] = useState<ProjectionKind>('mercator')
  const map = useMemo(() => buildMap(ctx, projection), [ctx, projection])
  const reelFocus = (placeId && ctx.places.find((p) => p.id === placeId)) || focusFor(ctx, reelId)
  const [picked, setPicked] = useState<string | null>(null)
  const focus = (picked && ctx.places.find((p) => p.id === picked)) || reelFocus

  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pos = useRef<[number, number] | null>(null)
  const springs = useRef<[SpringHandle | null, SpringHandle | null]>([null, null])
  const wasActive = useRef(false)
  const handoff = useRef<number | null>(null) // x velocity (map units/s) from a flick, for the next spring
  const size = useRef({ w: 0, h: 0 })

  // The SVG fills its frame with "slice", so part of the drawing can be cropped.
  // Track the frame to know what's visible and how many pixels one map unit is.
  const [aspect, setAspect] = useState(W / H)
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      if (width > 0 && height > 0) {
        size.current = { w: width, h: height }
        setAspect(width / height)
        if (pos.current) apply(pos.current[0], pos.current[1])
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const vis =
    aspect < W / H
      ? { x0: W / 2 - (H * aspect) / 2, x1: W / 2 + (H * aspect) / 2, y0: 0, y1: H }
      : { x0: 0, x1: W, y0: H / 2 - W / aspect / 2, y1: H / 2 + W / aspect / 2 }

  const unit = () => {
    if (!size.current.w && wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect()
      size.current = { w: r.width, h: r.height }
    }
    return Math.max(size.current.w / W, size.current.h / H) || 1
  }

  const offsetFor = (p: Place): [number, number] => {
    if (ctx.projectionCompare) return [0, 0]
    const [x, y] = map.project(p.lon, p.lat)
    return [FOCUS_POINT[0] - x, FOCUS_POINT[1] - y]
  }

  /** Moves the whole map as one composited layer: transform only, coastlines are never re-rasterised. */
  const apply = (x: number, y: number) => {
    pos.current = [x, y]
    const s = unit()
    if (svgRef.current) svgRef.current.style.transform = `translate3d(${(x * s).toFixed(2)}px, ${(y * s).toFixed(2)}px, 0)`
  }

  /** Stops any motion in flight and returns its velocity, so the next spring can carry it. */
  const stop = (): [number, number] => {
    const v: [number, number] = [springs.current[0]?.velocity ?? 0, springs.current[1]?.velocity ?? 0]
    springs.current.forEach((sp) => sp?.cancel())
    springs.current = [null, null]
    return v
  }

  // Pan to the focus place: independent X/Y springs from the live position, carrying any
  // velocity already in flight, so a redirect never hits a "brick wall".
  useLayoutEffect(() => {
    const target = offsetFor(focus)
    if (!pos.current) apply(target[0], target[1])
    const becameActive = active && !wasActive.current
    wasActive.current = active
    if (!active) return
    const from = becameActive && fromPlaceId ? ctx.places.find((p) => p.id === fromPlaceId) : undefined
    if (from && from.id !== focus.id) {
      const start = offsetFor(from)
      apply(start[0], start[1])
    }
    const [vx, vy] = stop()
    const flick = handoff.current
    handoff.current = null
    if (prefersReducedMotion()) {
      apply(target[0], target[1])
      return
    }
    const [x0, y0] = pos.current ?? target
    let x = x0
    let y = y0
    // A thrown map lands with a touch of bounce; anything else settles without overshoot.
    const xOpts = flick !== null ? { dampingRatio: 0.82, response: 0.45, velocity: flick } : { dampingRatio: 1, response: 0.6, velocity: vx }
    springs.current = [
      spring(x0, target[0], (v) => { x = v; apply(x, y) }, xOpts),
      spring(y0, target[1], (v) => { y = v; apply(x, y) }, { dampingRatio: 1, response: 0.6, velocity: vy }),
    ]
    return () => {
      springs.current.forEach((sp) => sp?.cancel())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus.id, active, map])

  useEffect(() => setPicked(null), [reelId, placeId])

  // ── Direct manipulation: drag the map sideways; vertical swipes stay with the reel feed.
  const drag = useRef<{ x0: number; y0: number; startPos: [number, number]; on: boolean; hist: { t: number; x: number }[] } | null>(null)
  const dragged = useRef(false)
  const pannable = !ctx.projectionCompare && ctx.places.length > 1
  const xs = pannable ? ctx.places.map((p) => offsetFor(p)[0]) : [0]
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)

  const onPointerDown = (e: React.PointerEvent) => {
    if (!pannable || e.button !== 0) return
    dragged.current = false
    drag.current = { x0: e.clientX, y0: e.clientY, startPos: pos.current ?? [0, 0], on: false, hist: [{ t: performance.now(), x: e.clientX }] }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x0
    const dy = e.clientY - d.y0
    if (!d.on) {
      if (Math.abs(dy) > SLOP && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null // a vertical swipe: the feed owns it
        return
      }
      if (Math.abs(dx) < SLOP) return
      d.on = true
      dragged.current = true
      stop() // grab it mid-flight, from where it actually is
      d.startPos = pos.current ?? d.startPos
      d.x0 = e.clientX // tracking starts here, so nothing jumps when the slop is crossed
      try {
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      } catch {
        /* pointer already gone */
      }
    }
    const raw = d.startPos[0] + (e.clientX - d.x0) / unit()
    // Past the first and last place the map resists progressively instead of stopping dead.
    const lo = minX - 30
    const hi = maxX + 30
    const x = raw < lo ? lo + rubberband(raw - lo, W) : raw > hi ? hi + rubberband(raw - hi, W) : raw
    apply(x, d.startPos[1])
    const now = performance.now()
    d.hist.push({ t: now, x: e.clientX })
    while (d.hist.length > 2 && now - d.hist[0].t > 100) d.hist.shift()
  }
  const onPointerUp = () => {
    const d = drag.current
    drag.current = null
    if (!d?.on || !pos.current) return
    const a = d.hist[0]
    const b = d.hist[d.hist.length - 1]
    const vPx = b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0
    const vUnits = vPx / unit()
    // Project where the flick would come to rest, then snap to the place nearest that point.
    const projected = pos.current[0] + project(vUnits, 0.99)
    let best = ctx.places[0]
    for (const p of ctx.places) if (Math.abs(offsetFor(p)[0] - projected) < Math.abs(offsetFor(best)[0] - projected)) best = p
    if (best.id === focus.id) {
      // Same place: settle back, continuing at the finger's velocity.
      const target = offsetFor(best)
      let x = pos.current[0]
      let y = pos.current[1]
      springs.current = [
        spring(x, target[0], (v) => { x = v; apply(x, y) }, { dampingRatio: 0.82, response: 0.45, velocity: vUnits }),
        spring(y, target[1], (v) => { y = v; apply(x, y) }, { dampingRatio: 1, response: 0.5 }),
      ]
    } else {
      handoff.current = vUnits
      setPicked(best.id)
      // A short, quiet tick where supported: confirms the snap (causal, same moment, used sparingly).
      tick()
    }
  }
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragged.current) {
      e.stopPropagation()
      e.preventDefault()
      dragged.current = false
    }
  }

  const routePoints = (ctx.route ?? []).map((id) => ctx.places.find((p) => p.id === id)).filter((p): p is Place => !!p)
  const focusIndex = routePoints.findIndex((p) => p.id === focus.id)
  const pt = (p: Place) => map.project(p.lon, p.lat)

  // Place labels greedily: the focus first (above its ring), then the others in route
  // order, each trying right / left / below / above and dropping out if nothing fits
  // inside the visible part of the map. Each coordinate is labelled once.
  type Box = [number, number, number, number]
  const fs = ctx.style === 'historical' ? 11 : 9
  const charW = ctx.style === 'historical' ? 0.5 : 0.58
  const labels = new Map<string, { x: number; y: number; anchor: 'start' | 'end' | 'middle' }>()
  {
    const boxes: Box[] = []
    const [ox, oy] = offsetFor(focus)
    const inside = (a: Box) => a[0] + ox >= vis.x0 + 4 && a[2] + ox <= vis.x1 - 4 && a[1] + oy >= vis.y0 + 4 && a[3] + oy <= vis.y1 - 4
    const hit = (a: Box) => !inside(a) || boxes.some((b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1])
    const seen = new Set<string>()
    const order = [focus, ...routePoints.filter((p) => p.id !== focus.id), ...ctx.places.filter((p) => p.id !== focus.id && !routePoints.includes(p))]
    for (const p of order) {
      const key = `${p.lon.toFixed(1)},${p.lat.toFixed(1)}`
      if (seen.has(key)) continue
      seen.add(key)
      const [px, py] = map.project(p.lon, p.lat)
      const isF = p.id === focus.id
      const sz = isF ? fs + (ctx.style === 'historical' ? 3 : 2) : fs
      const w = p.name.length * sz * charW
      const h = sz * 1.15
      if (isF) {
        boxes.push([px - 30, py - 30, px + 30, py + 30])
        const above: Box = [px - w / 2, py - 32 - h, px + w / 2, py - 30]
        const below: Box = [px - w / 2, py + 30, px + w / 2, py + 32 + h]
        const useAbove = inside(above) || !inside(below)
        boxes.push(useAbove ? above : below)
        labels.set(p.id, { x: 0, y: useAbove ? -32 : 30 + sz, anchor: 'middle' })
        continue
      }
      boxes.push([px - 4, py - 4, px + 4, py + 4])
      const options: { box: Box; x: number; y: number; anchor: 'start' | 'end' | 'middle' }[] = [
        { box: [px + 6, py - h / 2, px + 6 + w, py + h / 2], x: 6, y: 3, anchor: 'start' },
        { box: [px - 6 - w, py - h / 2, px - 6, py + h / 2], x: -6, y: 3, anchor: 'end' },
        { box: [px - w / 2, py + 5, px + w / 2, py + 5 + h], x: 0, y: 5 + sz, anchor: 'middle' },
        { box: [px - w / 2, py - 5 - h, px + w / 2, py - 5], x: 0, y: -7, anchor: 'middle' },
      ]
      const fit = options.find((o) => !hit(o.box))
      if (fit) {
        boxes.push(fit.box)
        labels.set(p.id, { x: fit.x, y: fit.y, anchor: fit.anchor })
      }
    }
  }

  const segment = (a: [number, number], b: [number, number]) => {
    if (ctx.style !== 'ideas') return `M${a[0]},${a[1]}L${b[0]},${b[1]}`
    // Ideas travel in arcs: a gentle curve reads as transmission, not a road.
    const mx = (a[0] + b[0]) / 2
    const my = (a[1] + b[1]) / 2
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const k = 0.22
    return `M${a[0]},${a[1]}Q${mx - dy * k},${my + dx * k} ${b[0]},${b[1]}`
  }

  const label = ctx.projectionCompare
    ? `World map, ${projection === 'mercator' ? 'Mercator' : 'Equal Earth'} projection, comparing ${ctx.projectionCompare.a.label} and ${ctx.projectionCompare.b.label}.`
    : `Map centred on ${focus.name}${focus.year ? `, ${focus.year}` : ''}. Places: ${ctx.places.map((p) => p.name).join(', ')}.${pannable ? ' Swipe sideways to move between places.' : ''}`

  return (
    <div
      ref={wrapRef}
      className={`atlas atlas--${ctx.style}${pannable ? ' atlas--pannable' : ''} ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (drag.current = null)}
      onClickCapture={onClickCapture}
    >
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
        <defs>
          <pattern id={`hatch-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 3h6" className="atlas-hatch" />
          </pattern>
          <radialGradient id={`glow-${uid}`}>
            <stop offset="0%" className="atlas-glow-a" />
            <stop offset="100%" className="atlas-glow-b" />
          </radialGradient>
        </defs>
        <rect x={-W * 2} y={-H * 2} width={W * 5} height={H * 5} className="atlas-sea" />
        {ctx.style === 'historical' && <rect x={-W * 2} y={-H * 2} width={W * 5} height={H * 5} fill={`url(#hatch-${uid})`} />}
        <path d={map.graticule} className="atlas-graticule" />
        <path d={map.land} className="atlas-land" />
        {map.highlights.map((h, i) => (
          <g key={h.id}>
            <path d={h.d} className={`atlas-highlight atlas-highlight--${i}`} />
            <text x={h.centroid[0]} y={h.centroid[1] + (i ? 18 : 16)} className="atlas-hl-label" textAnchor="middle">
              {i ? ctx.projectionCompare!.b.label : ctx.projectionCompare!.a.label}
            </text>
            <text x={h.centroid[0]} y={h.centroid[1] + (i ? 28 : 26)} className="atlas-hl-sub" textAnchor="middle">
              {i ? ctx.projectionCompare!.b.area : ctx.projectionCompare!.a.area}
            </text>
          </g>
        ))}
        {!ctx.projectionCompare &&
          ctx.drawRoute !== false &&
          routePoints.slice(1).map((p, i) => {
            const done = focusIndex >= 0 && i + 1 <= focusIndex
            return <path key={p.id} d={segment(pt(routePoints[i]), pt(p))} className={`atlas-route${done ? ' atlas-route--done' : ''}`} />
          })}
        {!ctx.projectionCompare &&
          ctx.places.map((p) => {
            const [x, y] = pt(p)
            const isFocus = p.id === focus.id
            const lab = labels.get(p.id)
            return (
              <g
                key={p.id}
                className={`atlas-place${isFocus ? ' is-focus' : ''}`}
                transform={`translate(${x} ${y})`}
                role="button"
                tabIndex={0}
                aria-label={`${p.name}${p.year ? `, ${p.year}` : ''}${p.who ? `, ${p.who}` : ''}`}
                aria-pressed={isFocus}
                onClick={(e) => {
                  e.stopPropagation()
                  setPicked(p.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setPicked(p.id)
                  }
                }}
              >
                <circle r={16} className="atlas-hit" />
                {isFocus && (
                  <>
                    <circle r={30} fill={`url(#glow-${uid})`} />
                    <circle r={24} className="atlas-ring" />
                    <circle r={8} className="atlas-dot-focus" />
                    <circle r={2.6} className="atlas-dot-core" />
                  </>
                )}
                {!isFocus && <circle r={3.4} className="atlas-dot" />}
                {lab && (
                  <text x={lab.x} y={lab.y} textAnchor={lab.anchor} className={isFocus ? 'atlas-label atlas-label--focus' : 'atlas-label'}>
                    {p.name}
                  </text>
                )}
              </g>
            )
          })}
      </svg>
      {ctx.style === 'historical' && (
        <svg className="atlas-compass" viewBox="-16 -26 32 42" aria-hidden="true">
          <circle r={13} />
          <path d="M0 -12 L3 0 L0 12 L-3 0 Z" />
          <text y={-15} textAnchor="middle">
            N
          </text>
        </svg>
      )}

      {ctx.projectionCompare && (
        <div className="atlas-toggle glass seg" role="group" aria-label="Projection">
          <button type="button" aria-pressed={projection === 'mercator'} onClick={() => setProjection('mercator')}>
            Mercator
          </button>
          <button type="button" aria-pressed={projection === 'equalEarth'} onClick={() => setProjection('equalEarth')}>
            Equal Earth
          </button>
        </div>
      )}

      {card && !ctx.projectionCompare && (
        <div key={focus.id} className={`atlas-card glass${ctx.style === 'historical' ? ' glass--paper' : ''}`} aria-live="polite">
          <span className="atlas-card-kind">{kindLabel[focus.kind]}</span>
          <span className="atlas-card-title">
            {focus.name}
            {focus.year && <span className="atlas-card-year"> · {focus.year}</span>}
          </span>
          {focus.who && <span className="atlas-card-who">{focus.who}</span>}
          <span className="atlas-card-note">{focus.note}</span>
        </div>
      )}
      {card && ctx.projectionCompare && (
        <div key={projection} className="atlas-card glass" aria-live="polite">
          <span className="atlas-card-kind">{projection === 'mercator' ? 'Mercator · conformal' : 'Equal Earth · equal-area'}</span>
          <span className="atlas-card-note">
            {projection === 'mercator'
              ? `${ctx.projectionCompare.a.label} looks far bigger than ${ctx.projectionCompare.b.label} — yet it’s slightly smaller.`
              : `Sizes are true: ${ctx.projectionCompare.a.label} (${ctx.projectionCompare.a.area}) and ${ctx.projectionCompare.b.label} (${ctx.projectionCompare.b.area}) are nearly equal.`}
          </span>
        </div>
      )}
      {ctx.caption && <span className="atlas-caption">{ctx.caption}</span>}
    </div>
  )
}
