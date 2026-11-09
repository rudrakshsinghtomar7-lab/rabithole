// A tiny, interruptible spring for gesture-driven UI.
// Parameters follow Apple's designer-facing model: dampingRatio (1 = no overshoot, <1 = bounce)
// and response (seconds; lower = snappier). Always starts from the current value and carries
// the incoming velocity, so a finger release or an interruption never leaves a visible seam.

export interface SpringOptions {
  dampingRatio?: number
  response?: number
  /** Initial velocity in units per second (e.g. px/s from the pointer). */
  velocity?: number
}

export interface SpringHandle {
  cancel: () => void
  /** Live position and velocity, for interrupting mid-flight. */
  readonly value: number
  readonly velocity: number
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function spring(from: number, to: number, onUpdate: (v: number) => void, opts: SpringOptions = {}, onDone?: () => void): SpringHandle {
  const zeta = opts.dampingRatio ?? 1
  const response = opts.response ?? 0.35
  const k = Math.pow((2 * Math.PI) / response, 2) // stiffness (mass = 1)
  const c = (4 * Math.PI * zeta) / response // damping
  let x = from
  let v = opts.velocity ?? 0
  let last = performance.now()
  let raf = 0
  let done = false

  const step = (now: number) => {
    // Integrate in small fixed sub-steps for stability on slow frames.
    let dt = Math.min(0.064, (now - last) / 1000)
    last = now
    while (dt > 0) {
      const h = Math.min(dt, 1 / 240)
      const a = -k * (x - to) - c * v
      v += a * h
      x += v * h
      dt -= h
    }
    if (Math.abs(x - to) < 0.3 && Math.abs(v) < 8) {
      x = to
      v = 0
      onUpdate(x)
      done = true
      onDone?.()
      return
    }
    onUpdate(x)
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)

  return {
    cancel: () => {
      if (!done) cancelAnimationFrame(raf)
      done = true
    },
    get value() {
      return x
    },
    get velocity() {
      return v
    },
  }
}

/** Apple's momentum projection: where a flick would come to rest (px). */
export function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate)
}

/** Progressive resistance past a boundary. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot))
}
