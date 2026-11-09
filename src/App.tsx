import { useEffect, useMemo } from 'react'
import { Redirect, Route, Router, Switch, useLocation } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { BookOpen, GraduationCap, RotateCcw, LineChart } from 'lucide-react'
import { StoreProvider, useStore } from './store/store'
import type { Tab } from './store/schema'
import { dueCards } from './learning/engine'
import { ThemeToggle, ToastHost, Wordmark } from './ui/common'
import { setThemePref } from './ui/themeColor'
import { InterestsHome } from './pages/InterestsHome'
import { PathOverview } from './pages/PathOverview'
import { Saved } from './pages/Saved'
import { Player } from './pages/Player'
import { Challenge } from './pages/Challenge'
import { CoursesHome } from './pages/CoursesHome'
import { CoursePage } from './pages/CoursePage'
import { SourceViewer } from './pages/SourceViewer'
import { ReviewHome, ReviewSession } from './pages/Review'
import { ProgressPage } from './pages/Progress'
import { RequestPage } from './pages/RequestPage'

const TABS: { id: Tab; label: string; Icon: typeof BookOpen }[] = [
  { id: 'interests', label: 'My Interests', Icon: BookOpen },
  { id: 'courses', label: 'My Courses', Icon: GraduationCap },
  { id: 'review', label: 'Review', Icon: RotateCcw },
  { id: 'progress', label: 'My Progress', Icon: LineChart },
]

function tabOf(location: string): Tab | undefined {
  const seg = location.split('/')[1]
  return TABS.find((t) => t.id === seg)?.id
}

function useThemeAttr() {
  const { state } = useStore()
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.theme)
    setThemePref(state.theme)
  }, [state.theme])
}

function Shell() {
  const { state, update, saveError, recovered } = useStore()
  const [location, navigate] = useLocation()
  const tab = tabOf(location)
  useThemeAttr()

  // Each space remembers where you were.
  useEffect(() => {
    if (!tab) return
    update((s) => (s.tabPaths[tab] === location ? s : { ...s, tabPaths: { ...s.tabPaths, [tab]: location } }))
  }, [tab, location, update])

  // New screens start at the top (each tab restores its own position via tabPaths and feed state).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const due = useMemo(() => dueCards(state).length, [state])

  const go = (t: Tab) => {
    if (t === tab) navigate(`/${t}`)
    else navigate(state.tabPaths[t] || `/${t}`)
  }

  return (
    <div className="shell">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        Skip to content
      </a>
      <nav className="nav" aria-label="Main">
        <div className="nav-brand">
          <Wordmark />
          <p className="nav-tagline">Turn curiosity into understanding.</p>
        </div>
        <ul className="nav-list">
          {TABS.map(({ id, label, Icon }) => (
            <li key={id}>
              <button type="button" className="nav-item" aria-current={tab === id ? 'page' : undefined} onClick={() => go(id)}>
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
                {id === 'review' && due > 0 && <span className="nav-badge" aria-label={`${due} due`}>{due}</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="nav-foot">
          <ThemeToggle />
        </div>
      </nav>
      <main id="main" className="main" tabIndex={-1}>
        {(saveError || recovered) && (
          <div className="page" style={{ paddingBottom: 0 }}>
            <div className="notice notice-warn" role="alert">
              {saveError ? 'Your progress couldn’t be saved on this device (storage may be full or disabled). It will be kept until you close this tab.' : 'Saved data on this device was unreadable, so Rudra started fresh. A copy of the old data was kept.'}
            </div>
          </div>
        )}
        <Switch>
          <Route path="/">{() => <Redirect to={state.tabPaths.interests || '/interests'} />}</Route>
          <Route path="/interests" component={InterestsHome} />
          <Route path="/interests/path/:pathId" component={PathOverview} />
          <Route path="/interests/saved" component={Saved} />
          <Route path="/interests/request/:requestId" component={RequestPage} />
          <Route path="/:tab/learn/:pathId/:topicId" component={Player} />
          <Route path="/:tab/challenge/:pathId/:moduleId" component={Challenge} />
          <Route path="/courses" component={CoursesHome} />
          <Route path="/courses/:courseId/material/:materialId/:page?" component={SourceViewer} />
          <Route path="/courses/:courseId" component={CoursePage} />
          <Route path="/review" component={ReviewHome} />
          <Route path="/review/session/:kind/:scope" component={ReviewSession} />
          <Route path="/progress" component={ProgressPage} />
          <Route>
            <div className="page">
              <p className="h1">Nothing here.</p>
              <p className="muted mt-8">That page doesn’t exist.</p>
              <button type="button" className="btn mt-16" onClick={() => navigate('/interests')}>Go to My Interests</button>
            </div>
          </Route>
        </Switch>
      </main>
      <ToastHost />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Router hook={useHashLocation}>
        <Shell />
      </Router>
    </StoreProvider>
  )
}
