import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { defaultState, sanitizeState, STORAGE_KEY, type AppState } from './schema'

export function loadState(storage: Pick<Storage, 'getItem'> | undefined = safeStorage()): { state: AppState; recovered: boolean } {
  if (!storage) return { state: defaultState(), recovered: false }
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return { state: defaultState(), recovered: false }
    return { state: sanitizeState(JSON.parse(raw)), recovered: false }
  } catch {
    // Malformed JSON: start fresh but keep the bad copy for inspection.
    try {
      const bad = storage.getItem(STORAGE_KEY)
      if (bad) safeStorage()?.setItem(`${STORAGE_KEY}:corrupt`, bad)
    } catch {
      /* ignore */
    }
    return { state: defaultState(), recovered: true }
  }
}

export function saveState(state: AppState, storage: Pick<Storage, 'setItem'> | undefined = safeStorage()): boolean {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined
  } catch {
    return undefined
  }
}

interface StoreValue {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
  saveError: boolean
  recovered: boolean
}

const Ctx = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => loadState())
  const [state, setState] = useState<AppState>(initial.state)
  const [saveError, setSaveError] = useState(false)
  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), [])

  useEffect(() => {
    const t = setTimeout(() => setSaveError(!saveState(state)), 150)
    return () => clearTimeout(t)
  }, [state])

  // Flush on tab hide so a fast refresh doesn't lose the last action.
  const latest = useRef(state)
  useEffect(() => {
    latest.current = state
  }, [state])
  useEffect(() => {
    const flush = () => saveState(latest.current)
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', flush)
    }
  }, [])

  const value = useMemo(() => ({ state, update, saveError, recovered: initial.recovered }), [state, update, saveError, initial])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreValue {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used inside StoreProvider')
  return v
}
