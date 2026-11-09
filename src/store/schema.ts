import type { Familiarity, Path } from '../content/types'

export const STATE_VERSION = 1
export const STORAGE_KEY = 'rudra:state'

export type Tab = 'interests' | 'courses' | 'review' | 'progress'
export type ThemePref = 'system' | 'light' | 'dark'
export type Scope = 'interest' | 'course'

export interface Enrollment {
  pathId: string
  startedAt: number
  familiarity: Familiarity
  lastTopicId?: string
  lastOpenedAt: number
}

export interface FeedPosition {
  reelIndex: number
  maxReelIndex: number
  /** Set once every reel in the topic has been reached. Content completion ≠ topic completion. */
  contentDoneAt?: number
}

export type Outcome = 'independent' | 'assisted' | 'missed'

export interface Checkpoint {
  firstCompletedAt: number
  lastCompletedAt: number
  attemptsCount: number
  total: number
  independent: number
  assisted: number
  missed: number
  /** Concepts from the latest attempt that need another look. */
  conceptsToReview: string[]
}

export type AttemptMode = 'quiz' | 'fresh' | 'review' | 'practice' | 'challenge'

export interface Attempt {
  id: string
  pathId: string
  topicId?: string
  checkpointKey?: string
  questionId: string
  conceptId: string
  mode: AttemptMode
  correct: boolean
  /** True if feedback, explanation, solution or a retry preceded this answer. */
  assisted: boolean
  solutionShown?: boolean
  selfAssessed?: boolean
  response?: string
  at: number
}

export interface Bookmark {
  id: string
  pathId: string
  topicId: string
  reelId: string
  createdAt: number
  note: string
}

export type RequestStatus = 'saved' | 'generating' | 'ready' | 'failed'

export interface CustomRequest {
  id: string
  text: string
  familiarity: Familiarity
  subjectHint?: string
  createdAt: number
  status: RequestStatus
  error?: string
  pathId?: string
}

export type MaterialKind = 'syllabus' | 'lecture' | 'reading' | 'practice'
export type MaterialStatus = 'extracting' | 'ready' | 'empty' | 'needs-ocr' | 'unsupported' | 'error'

export interface Material {
  id: string
  courseId: string
  kind: MaterialKind
  name: string
  mime: string
  size: number
  addedAt: number
  status: MaterialStatus
  /** Page-based for PDFs, section-based for text. */
  unit: 'page' | 'section'
  pageCount: number
  charCount: number
  message?: string
  /** Bundled sample documents live in content, not IndexedDB. */
  bundled?: boolean
}

export type GenerationStatus = 'idle' | 'generating' | 'proposed' | 'accepted' | 'failed'

export interface Course {
  id: string
  name: string
  code?: string
  createdAt: number
  sample?: boolean
  materials: Material[]
  generation: { status: GenerationStatus; error?: string; proposalPathId?: string; at?: number; warnings?: string[] }
  pathId?: string
}

export interface ReviewEvent {
  at: number
  result: Outcome
  mode: AttemptMode
}

export interface ReviewCard {
  key: string
  pathId: string
  conceptId: string
  scope: Scope
  box: number
  dueAt: number
  lastAt: number
  history: ReviewEvent[]
}

export interface XpEntry {
  id: string
  amount: number
  reason: string
  at: number
  scope: Scope
}

export interface Settings {
  dailyGoalXp: number
  reviewIntervalsDays: number[]
}

export interface AppState {
  version: number
  theme: ThemePref
  onboarded: boolean
  interests: string[]
  enrollments: Record<string, Enrollment>
  feed: Record<string, FeedPosition>
  checkpoints: Record<string, Checkpoint>
  attempts: Attempt[]
  bookmarks: Bookmark[]
  requests: CustomRequest[]
  courses: Course[]
  generated: Record<string, Path>
  review: Record<string, ReviewCard>
  xp: XpEntry[]
  settings: Settings
  tabPaths: Record<Tab, string>
}

export const DEFAULT_INTERVALS = [1, 3, 7, 16, 35]

export const defaultTabPaths: Record<Tab, string> = {
  interests: '/interests',
  courses: '/courses',
  review: '/review',
  progress: '/progress',
}

export function defaultState(): AppState {
  return {
    version: STATE_VERSION,
    theme: 'system',
    onboarded: false,
    interests: [],
    enrollments: {},
    feed: {},
    checkpoints: {},
    attempts: [],
    bookmarks: [],
    requests: [],
    courses: [],
    generated: {},
    review: {},
    xp: [],
    settings: { dailyGoalXp: 30, reviewIntervalsDays: [...DEFAULT_INTERVALS] },
    tabPaths: { ...defaultTabPaths },
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const arr = <T>(v: unknown, keep: (x: unknown) => boolean = isObj): T[] => (Array.isArray(v) ? (v.filter(keep) as T[]) : [])
const rec = <T>(v: unknown): Record<string, T> => {
  if (!isObj(v)) return {}
  const out: Record<string, T> = {}
  for (const [k, val] of Object.entries(v)) if (isObj(val)) out[k] = val as T
  return out
}

/**
 * Turns whatever was in storage into a valid AppState.
 * Unknown/malformed fields fall back to defaults instead of crashing the app.
 */
export function sanitizeState(raw: unknown): AppState {
  const d = defaultState()
  if (!isObj(raw)) return d
  const migrated = migrate(raw)
  const s = migrated
  const theme = s.theme === 'light' || s.theme === 'dark' || s.theme === 'system' ? s.theme : d.theme
  const settings = isObj(s.settings) ? s.settings : {}
  const intervals = Array.isArray(settings.reviewIntervalsDays)
    ? settings.reviewIntervalsDays.filter((n): n is number => typeof n === 'number' && n > 0 && n < 3650)
    : []
  const tabPaths = isObj(s.tabPaths) ? s.tabPaths : {}
  const safeTab = (t: Tab) => {
    const v = tabPaths[t]
    return typeof v === 'string' && v.startsWith(`/${t}`) ? v : d.tabPaths[t]
  }
  return {
    version: STATE_VERSION,
    theme,
    onboarded: s.onboarded === true,
    interests: arr<string>(s.interests, (x) => typeof x === 'string'),
    enrollments: rec<Enrollment>(s.enrollments),
    feed: rec<FeedPosition>(s.feed),
    checkpoints: rec<Checkpoint>(s.checkpoints),
    attempts: arr<Attempt>(s.attempts),
    bookmarks: arr<Bookmark>(s.bookmarks),
    requests: arr<CustomRequest>(s.requests),
    courses: arr<Course>(s.courses).map((c) => ({
      ...c,
      materials: arr<Material>(c.materials),
      generation: isObj(c.generation) ? (c.generation as Course['generation']) : { status: 'idle' },
    })),
    generated: rec<Path>(s.generated),
    review: rec<ReviewCard>(s.review),
    xp: arr<XpEntry>(s.xp),
    settings: {
      dailyGoalXp: typeof settings.dailyGoalXp === 'number' && settings.dailyGoalXp > 0 ? settings.dailyGoalXp : d.settings.dailyGoalXp,
      reviewIntervalsDays: intervals.length >= 2 ? intervals : d.settings.reviewIntervalsDays,
    },
    tabPaths: { interests: safeTab('interests'), courses: safeTab('courses'), review: safeTab('review'), progress: safeTab('progress') },
  }
}

/** Version migrations live here. v1 is the first persisted shape. */
function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  const v = typeof raw.version === 'number' ? raw.version : 0
  if (v > STATE_VERSION) {
    // Data from a newer build: keep what we understand.
    return raw
  }
  return raw
}
