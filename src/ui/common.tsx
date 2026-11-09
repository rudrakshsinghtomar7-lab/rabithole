import { useEffect, useState, type ReactNode } from 'react'
import { Check, Moon, Sun, Monitor } from 'lucide-react'
import type { TopicStatus } from '../learning/engine'
import { useStore } from '../store/store'
import type { ThemePref } from '../store/schema'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="rudra">
      rudra<span>.</span>
    </span>
  )
}

export function StatusDot({ status }: { status: TopicStatus }) {
  const label: Record<TopicStatus, string> = {
    'not-started': 'Not started',
    'in-progress': 'In progress',
    'quiz-pending': 'Reels done, checkpoint quiz not taken',
    completed: 'Checkpoint passed',
    'needs-review': 'Checkpoint done, some concepts need review',
  }
  return (
    <span className="status-dot" data-s={status} role="img" aria-label={label[status]} title={label[status]}>
      {(status === 'completed' || status === 'needs-review') && <Check size={11} strokeWidth={3.5} />}
    </span>
  )
}

export function statusText(s: TopicStatus): string {
  switch (s) {
    case 'completed':
      return 'Checkpoint passed'
    case 'needs-review':
      return 'Done · review flagged'
    case 'quiz-pending':
      return 'Checkpoint unfinished'
    case 'in-progress':
      return 'In progress'
    default:
      return 'Not started'
  }
}

export function Ticks({ total, done, half = 0 }: { total: number; done: number; half?: number }) {
  return (
    <div className="ticks" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < done ? 'on' : i < done + half ? 'half' : ''} />
      ))}
    </div>
  )
}

export function GoalRing({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(1, goal ? value / goal : 0)
  const r = 18
  const c = 2 * Math.PI * r
  return (
    <svg className="goal-ring" viewBox="0 0 44 44" role="img" aria-label={`Daily goal: ${value} of ${goal} XP`}>
      <circle cx={22} cy={22} r={r} fill="none" stroke="var(--line)" strokeWidth={4} />
      <circle cx={22} cy={22} r={r} fill="none" stroke="var(--accent)" strokeWidth={4} strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round" transform="rotate(-90 22 22)" style={{ transition: 'stroke-dasharray .6s' }} />
      {pct >= 1 && <path d="M15 22l5 5 9-10" stroke="var(--accent)" strokeWidth={3} fill="none" strokeLinecap="round" />}
    </svg>
  )
}

export function ThemeToggle() {
  const { state, update } = useStore()
  const order: ThemePref[] = ['system', 'light', 'dark']
  const next = order[(order.indexOf(state.theme) + 1) % order.length]
  const Icon = state.theme === 'dark' ? Moon : state.theme === 'light' ? Sun : Monitor
  const label = { system: 'Theme: match device', light: 'Theme: light', dark: 'Theme: dark' }[state.theme]
  return (
    <button type="button" className="icon-btn theme-toggle" onClick={() => update((s) => ({ ...s, theme: next }))} aria-label={`${label}. Switch to ${next}.`} title={label}>
      <Icon size={20} />
    </button>
  )
}

let toastSetter: ((m: string | null) => void) | null = null
// eslint-disable-next-line react-refresh/only-export-components
export function toast(message: string) {
  toastSetter?.(message)
}
export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    toastSetter = setMsg
    return () => {
      toastSetter = null
    }
  }, [])
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2600)
    return () => clearTimeout(t)
  }, [msg])
  return (
    <div aria-live="polite" role="status">
      {msg && <div className="toast">{msg}</div>}
    </div>
  )
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="empty">
      <p className="h2">{title}</p>
      {children}
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function relTime(t: number, now = Date.now()): string {
  const d = t - now
  const abs = Math.abs(d)
  const day = 86400000
  if (abs < 60000) return 'just now'
  if (abs < 3600000) {
    const m = Math.round(abs / 60000)
    return d < 0 ? `${m} min ago` : `in ${m} min`
  }
  if (abs < day) {
    const h = Math.round(abs / 3600000)
    return d < 0 ? `${h} h ago` : `in ${h} h`
  }
  const n = Math.round(abs / day)
  return d < 0 ? `${n} day${n > 1 ? 's' : ''} ago` : `in ${n} day${n > 1 ? 's' : ''}`
}
