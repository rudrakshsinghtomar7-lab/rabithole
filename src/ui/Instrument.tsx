import { useEffect, useRef, useState } from 'react'
import type { Chart, InstrumentContext } from '../content/contexts'
import { prefersReducedMotion, spring, type SpringHandle } from './spring'

const N = 40 // resample lines so any two tabs can morph point-for-point
const CW = 300
const CH = 96

function resample(series: number[], n = N): number[] {
  if (series.length === n) return series
  return Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * (series.length - 1)
    const a = Math.floor(t)
    const b = Math.min(series.length - 1, a + 1)
    return series[a] + (series[b] - series[a]) * (t - a)
  })
}

/** Interruptible morph between numeric arrays: always starts from what's on screen. */
function useMorph(target: number[]): number[] {
  const [shown, setShown] = useState(target)
  const shownRef = useRef(target)
  const anim = useRef<SpringHandle | null>(null)
  const key = target.map((v) => v.toFixed(2)).join(',')
  useEffect(() => {
    anim.current?.cancel()
    const from = shownRef.current
    if (prefersReducedMotion() || from.length !== target.length) {
      shownRef.current = target
      setShown(target)
      return
    }
    anim.current = spring(0, 1, (t) => {
      const next = target.map((v, i) => from[i] + (v - from[i]) * t)
      shownRef.current = next
      setShown(next)
    }, { dampingRatio: 1, response: 0.45 })
    return () => anim.current?.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return shown
}

/** "142,580" → bright "142," + dim "580"; anything else stays as is. */
function Numeral({ value }: { value: string }) {
  const m = /^([−+€$£]?\d{1,3}[,.])(\d+)$/.exec(value)
  if (!m) return <>{value}</>
  return (
    <>
      {m[1]}
      <span className="inst-dim">{m[2]}</span>
    </>
  )
}

function LineChart({ chart }: { chart: Extract<Chart, { type: 'line' }> }) {
  const a = resample(chart.series)
  const b = chart.compare ? resample(chart.compare) : null
  const all = [...a, ...(b ?? [])]
  let min = Math.min(...all)
  let max = Math.max(...all)
  if (max - min < 1e-9) {
    min -= 1
    max += 1
  }
  const y = (v: number) => CH - 8 - ((v - min) / (max - min)) * (CH - 16)
  const target = [...a.map(y), ...(b ? b.map(y) : a.map(y))]
  const shown = useMorph(target)
  const ya = shown.slice(0, N)
  const yb = shown.slice(N)
  const x = (i: number) => (i / (N - 1)) * CW
  const d = (ys: number[]) => ys.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${v.toFixed(1)}`).join('')
  const [h0, h1] = chart.highlight ?? [-1, -1]
  const hi = (orig: number) => Math.round((orig / (chart.series.length - 1)) * (N - 1))
  const hl = h0 >= 0 ? ya.slice(hi(h0), hi(h1) + 1).map((v, i) => `${i ? 'L' : 'M'}${x(hi(h0) + i).toFixed(1)},${v.toFixed(1)}`).join('') : ''
  return (
    <svg viewBox={`0 0 ${CW} ${CH + 16}`} className="inst-line" aria-hidden="true">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={0} x2={CW} y1={CH * f} y2={CH * f} className="inst-guide" />
      ))}
      {b && <path d={d(yb)} className="inst-compare" />}
      <path d={`${d(ya)}L${CW},${CH}L0,${CH}Z`} className="inst-area" />
      <path d={d(ya)} className="inst-series" />
      {hl && <path d={hl} className="inst-highlight" />}
      {hl && (
        <>
          <circle cx={x(hi(h0))} cy={ya[hi(h0)]} r={3.2} className="inst-hl-dot" />
          <circle cx={x(hi(h1))} cy={ya[hi(h1)]} r={3.2} className="inst-hl-dot" />
        </>
      )}
      {chart.from && <text x={0} y={CH + 14} className="inst-axis">{chart.from}</text>}
      {chart.to && <text x={CW} y={CH + 14} className="inst-axis" textAnchor="end">{chart.to}</text>}
    </svg>
  )
}

function Bars({ chart }: { chart: Extract<Chart, { type: 'bars' }> }) {
  const max = Math.max(...chart.bars.map((b) => b.value), 1e-9)
  const target = chart.bars.map((b) => (b.value / max) * 100)
  const shown = useMorph(target)
  return (
    <ul className="inst-bars">
      {chart.bars.map((b, i) => (
        <li key={b.label + i} className={b.tone ? `is-${b.tone}` : ''}>
          <span className="inst-bar-label">{b.label}</span>
          <span className="inst-bar-track">
            <span className="inst-bar-fill" style={{ transform: `scaleX(${Math.max(0, (shown[i] ?? 0) / 100)})` }} />
          </span>
          <span className="inst-bar-value">{b.display}</span>
        </li>
      ))}
    </ul>
  )
}

function Groups({ chart }: { chart: Extract<Chart, { type: 'groups' }> }) {
  return (
    <ul className="inst-groups">
      {chart.items.map((g, i) => (
        <li key={g.label + i} className={g.tone ? `is-${g.tone}` : ''} style={{ animationDelay: `${i * 40}ms` }}>
          <span className="inst-group-dot" aria-hidden="true" />
          <span className="inst-group-label">{g.label}</span>
          <span className="inst-group-note">{g.note}</span>
        </li>
      ))}
    </ul>
  )
}

export function Instrument({ ctx, reelId }: { ctx: InstrumentContext; reelId?: string }) {
  const initial = (reelId && ctx.tabByReel?.[reelId]) || ctx.tabs[0].id
  const [tabId, setTabId] = useState(initial)
  useEffect(() => setTabId(initial), [initial])
  const tab = ctx.tabs.find((t) => t.id === tabId) ?? ctx.tabs[0]
  const chartKind = tab.chart?.type
  return (
    <div className="instrument glass" role="group" aria-label={ctx.title}>
      <div className="inst-head">
        <span className="inst-title">{ctx.title}</span>
        {tab.fictional && <span className="inst-tag">Illustrative</span>}
      </div>
      {ctx.tabs.length > 1 && (
        <div
          className="inst-tabs"
          role="tablist"
          aria-label={`${ctx.title} views`}
          onKeyDown={(e) => {
            // Familiar tab behaviour: arrow keys move between tabs.
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
            e.preventDefault()
            const i = ctx.tabs.findIndex((t) => t.id === tab.id)
            const next = ctx.tabs[(i + (e.key === 'ArrowRight' ? 1 : ctx.tabs.length - 1)) % ctx.tabs.length]
            setTabId(next.id)
            ;(e.currentTarget.querySelectorAll('button')[ctx.tabs.indexOf(next)] as HTMLButtonElement | undefined)?.focus()
          }}
        >
          {ctx.tabs.map((t) => (
            <button key={t.id} type="button" role="tab" tabIndex={t.id === tab.id ? 0 : -1} aria-selected={t.id === tab.id} onClick={() => setTabId(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div className="inst-value" aria-live="polite">
        <span className="inst-num">
          <Numeral value={tab.value} />
        </span>
        {tab.unit && <span className="inst-unit">{tab.unit}</span>}
      </div>
      {tab.chart?.type === 'line' && <LineChart chart={tab.chart} />}
      {chartKind === 'bars' && <Bars chart={tab.chart as Extract<Chart, { type: 'bars' }>} />}
      {chartKind === 'groups' && <Groups key={tab.id} chart={tab.chart as Extract<Chart, { type: 'groups' }>} />}
      <p className="inst-caption">{tab.caption}</p>
      {ctx.origin && <span className="inst-origin">Idea · {ctx.origin}</span>}
    </div>
  )
}
