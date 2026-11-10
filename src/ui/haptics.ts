import { prefersReducedMotion } from './spring'

/**
 * A short, quiet tick that confirms a snap. Call it synchronously from the gesture's
 * own event handler (pointerup / click): both paths below need the user's activation.
 *
 * - Android and others: the Vibration API.
 * - iPhone: Safari has no Vibration API. Since iOS 18, toggling a native switch control
 *   plays a Taptic tick, so we flip a hidden one. Older iOS simply stays silent.
 *
 * Off when the user asks for reduced motion.
 */
export function tick(): void {
  if (prefersReducedMotion()) return
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(6)
    return
  }
  if (typeof document === 'undefined') return
  const label = document.createElement('label')
  label.setAttribute('aria-hidden', 'true')
  label.style.display = 'none'
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.setAttribute('switch', '')
  label.appendChild(input)
  document.head.appendChild(label)
  label.click()
  label.remove()
}
