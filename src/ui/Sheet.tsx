import { useCallback, useEffect, useId, useLayoutEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { prefersReducedMotion, project, rubberband, spring, type SpringHandle } from './spring'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
const DRAG_SLOP = 6 // px of movement before a press becomes a drag

/**
 * Modal sheet.
 * - Bottom-edge sheet on phones: drag down to dismiss (1:1 tracking, rubber-band upward,
 *   velocity + projected-distance threshold), spring release seeded with the finger's velocity.
 * - Centred card on wider screens: materialises with a critically damped spring.
 * - Enters and exits along the same path, can be grabbed mid-animation, and the scrim's
 *   opacity is derived from the sheet's position so the two never drift apart.
 * - Traps focus, closes on Escape / scrim, restores focus, and makes the app behind inert.
 */
export function Sheet({
  title,
  onClose,
  children,
  footer,
  tall,
  initialFocus,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  tall?: boolean
  initialFocus?: 'body' | 'close'
}) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const anim = useRef<SpringHandle | null>(null)
  const pos = useRef(0) // edge: translateY px; centre: 1 - progress (0 = open, 1 = closed)
  const closing = useRef(false)
  const edge = useRef(false)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const height = () => ref.current?.offsetHeight || 600

  /** Applies a position to the sheet and derives the scrim from it. */
  const apply = useCallback((v: number) => {
    pos.current = v
    const el = ref.current
    const scrim = scrimRef.current
    if (!el || !scrim) return
    if (edge.current) {
      el.style.transform = `translate3d(0, ${v}px, 0)`
      scrim.style.opacity = String(Math.max(0, Math.min(1, 1 - v / (el.offsetHeight || 600))))
    } else {
      const p = 1 - v
      el.style.transform = `scale(${0.96 + 0.04 * p})`
      el.style.opacity = String(Math.max(0, Math.min(1, p)))
      scrim.style.opacity = String(Math.max(0, Math.min(1, p)))
    }
  }, [])

  const animateTo = useCallback(
    (target: number, opts: { velocity?: number; dampingRatio?: number; response?: number }, done?: () => void) => {
      anim.current?.cancel()
      if (prefersReducedMotion()) {
        // Gentle, non-vestibular equivalent: a quick cross-fade instead of travel.
        const el = ref.current
        if (el) {
          el.style.transition = 'opacity 160ms ease'
          el.style.transform = 'none'
          el.style.opacity = target === 0 ? '1' : '0'
        }
        if (scrimRef.current) {
          scrimRef.current.style.transition = 'opacity 160ms ease'
          scrimRef.current.style.opacity = target === 0 ? '1' : '0'
        }
        pos.current = target
        if (done) setTimeout(done, 160)
        return
      }
      anim.current = spring(pos.current, target, apply, opts, done)
    },
    [apply],
  )

  const requestClose = useCallback(
    (velocity = 0) => {
      if (closing.current) return
      closing.current = true
      const target = edge.current ? height() : 1
      animateTo(target, { velocity, dampingRatio: 1, response: edge.current ? 0.32 : 0.22 }, () => onCloseRef.current())
    },
    [animateTo],
  )

  // Enter: start off-screen (or small and transparent) before first paint, then spring in.
  useLayoutEffect(() => {
    edge.current = !matchMedia('(min-width: 760px)').matches
    if (prefersReducedMotion()) {
      const el = ref.current
      const scrim = scrimRef.current
      if (el && scrim) {
        el.style.opacity = '0'
        scrim.style.opacity = '0'
        requestAnimationFrame(() => animateTo(0, {}))
      }
      return
    }
    apply(edge.current ? height() : 1)
    animateTo(0, { dampingRatio: 1, response: edge.current ? 0.36 : 0.28 })
    return () => anim.current?.cancel()
  }, [apply, animateTo])

  // Focus management, inert background, Escape and Tab trapping.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const el = ref.current
    const first =
      initialFocus === 'close' ? el?.querySelector<HTMLElement>('[data-close]') : el?.querySelector<HTMLElement>('.sheet-body ' + FOCUSABLE) ?? el?.querySelector<HTMLElement>('[data-close]')
    ;(first ?? el)?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        requestClose()
        return
      }
      if (e.key !== 'Tab' || !el) return
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null)
      if (!items.length) return
      const a = items[0]
      const z = items[items.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      if (!document.querySelector('.sheet-root')) root?.removeAttribute('inert')
      document.body.style.overflow = prevOverflow
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true })
    }
  }, [initialFocus, requestClose])

  // ── Drag to dismiss (phones). Shared tracker for the header (pointer events) and the body (touch, only when scrolled to top).
  const drag = useRef<{ startY: number; startPos: number; active: boolean; history: { t: number; y: number }[]; suppressClick: boolean } | null>(null)

  const begin = (clientY: number) => {
    anim.current?.cancel() // grab it mid-flight, from where it actually is
    closing.current = false // catching a closing sheet cancels the close
    drag.current = { startY: clientY, startPos: pos.current, active: false, history: [{ t: performance.now(), y: clientY }], suppressClick: false }
  }
  const move = (clientY: number): boolean => {
    const d = drag.current
    if (!d || closing.current) return false
    const dy = clientY - d.startY
    if (!d.active) {
      if (Math.abs(dy) < DRAG_SLOP) return false
      d.active = true
      d.suppressClick = true
    }
    const raw = d.startPos + dy
    apply(raw >= 0 ? raw : rubberband(raw, height()))
    const now = performance.now()
    d.history.push({ t: now, y: clientY })
    while (d.history.length > 2 && now - d.history[0].t > 100) d.history.shift()
    return true
  }
  const end = () => {
    const d = drag.current
    drag.current = null
    if (!d || !d.active || closing.current) {
      if (d && !d.active && pos.current !== 0) animateTo(0, { dampingRatio: 1, response: 0.3 })
      return
    }
    const h = d.history
    const a = h[0]
    const b = h[h.length - 1]
    const velocity = b.t > a.t ? ((b.y - a.y) / (b.t - a.t)) * 1000 : 0
    const projected = pos.current + project(velocity, 0.99)
    if (velocity > 900 || projected > height() * 0.45) requestClose(velocity)
    // The finger applied force, so a little bounce on the way back reads as physical.
    else animateTo(0, { velocity, dampingRatio: 0.8, response: 0.3 })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!edge.current || e.button !== 0) return
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      /* pointer already released */
    }
    begin(e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    move(e.clientY)
  }
  const onPointerUp = () => end()
  const onClickCapture = (e: React.MouseEvent) => {
    // A drag that started on the close button must not also close via click.
    if (drag.current?.suppressClick || suppressNextClick.current) {
      e.preventDefault()
      e.stopPropagation()
      suppressNextClick.current = false
    }
  }
  const suppressNextClick = useRef(false)

  // Body: pull down to dismiss only when its content is already at the top.
  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    let tracking = false
    const ts = (e: TouchEvent) => {
      if (!edge.current || e.touches.length !== 1) return
      tracking = body.scrollTop <= 0
      if (tracking) begin(e.touches[0].clientY)
    }
    const tm = (e: TouchEvent) => {
      if (!tracking || !drag.current) return
      const dy = e.touches[0].clientY - drag.current.startY
      if (!drag.current.active && dy < 0) {
        // Scrolling up into the content: hand control back to native scroll.
        tracking = false
        drag.current = null
        return
      }
      if (move(e.touches[0].clientY)) e.preventDefault()
    }
    const te = () => {
      if (!tracking) return
      tracking = false
      if (drag.current?.active) suppressNextClick.current = true
      end()
    }
    body.addEventListener('touchstart', ts, { passive: true })
    body.addEventListener('touchmove', tm, { passive: false })
    body.addEventListener('touchend', te)
    body.addEventListener('touchcancel', te)
    return () => {
      body.removeEventListener('touchstart', ts)
      body.removeEventListener('touchmove', tm)
      body.removeEventListener('touchend', te)
      body.removeEventListener('touchcancel', te)
    }
    // begin/move/end only touch refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div className="sheet-root">
      <div ref={scrimRef} className="sheet-scrim" onClick={() => requestClose()} />
      <div ref={ref} className={`sheet${tall ? ' sheet-tall' : ''}`} role="dialog" aria-modal="true" aria-labelledby={id} tabIndex={-1}>
        <div className="sheet-head" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClickCapture={onClickCapture}>
          <span className="sheet-grabber" aria-hidden="true" />
          <h2 id={id}>{title}</h2>
          <button type="button" className="icon-btn" onClick={() => requestClose()} aria-label="Close" data-close>
            <X size={20} />
          </button>
        </div>
        <div ref={bodyRef} className="sheet-body" onClickCapture={onClickCapture}>
          {children}
        </div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
