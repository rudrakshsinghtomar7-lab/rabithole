// Keeps the browser chrome / status bar colour matched to what's at the top of the screen:
// the page background normally, the subject colour while a reel fills the screen.

import type { ThemePref } from '../store/schema'

const LIGHT = '#F5F1E9'
const DARK = '#141412'
let pref: ThemePref = 'system'
let override: string | null = null

function apply() {
  const light = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][media*="light"]')
  const dark = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][media*="dark"]')
  light?.setAttribute('content', override ?? (pref === 'dark' ? DARK : LIGHT))
  dark?.setAttribute('content', override ?? (pref === 'light' ? LIGHT : DARK))
}

export function setThemePref(p: ThemePref) {
  pref = p
  apply()
}

export function setThemeOverride(color: string | null) {
  override = color
  apply()
}
