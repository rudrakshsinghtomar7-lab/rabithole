// Content model for Rudra.
// Hierarchy: Subject | Course → Path → Module → Topic → Reels → Quiz.
// Content is plain data so prepared, sample and generated paths share one shape.

export type SubjectId = string
export type Familiarity = 'new' | 'some'
export type PathOrigin = 'prepared' | 'generated' | 'sample-course'

export type SubjectTheme =
  | 'philosophy'
  | 'history'
  | 'marketing'
  | 'politics'
  | 'economics'
  | 'geography'
  | 'finance'
  | 'science'
  | 'course'
  | 'neutral'

export interface Subject {
  id: SubjectId
  name: string
  theme: SubjectTheme
  /** Verb used on the primary interaction of each reel, e.g. "Take a side". */
  actionLabel: string
  blurb: string
  pathIds: string[]
}

/** A pointer to a source. For course documents `page` refers to an extracted page/section. */
export interface SourceRef {
  sourceId: string
  page?: number
  note?: string
}

export interface Source {
  id: string
  title: string
  author?: string
  year?: string
  kind: 'book' | 'article' | 'web' | 'primary' | 'course-doc'
  url?: string
  note?: string
}

export type ArtMotif =
  | 'ship'
  | 'figure'
  | 'mirror'
  | 'branch'
  | 'scales'
  | 'columns'
  | 'arch'
  | 'timeline'
  | 'tablets'
  | 'dominoes'
  | 'target'
  | 'arrow'
  | 'grid'
  | 'stack'
  | 'curve'
  | 'pillars'
  | 'ballot'
  | 'globe'
  | 'mountain'
  | 'coins'
  | 'chart'
  | 'flask'

export interface Visual {
  motif: ArtMotif
  /** Short caption shown on the artwork (optional). */
  caption?: string
}

export type ReelInteraction =
  | { type: 'poll'; prompt: string; options: { id: string; text: string; response: string }[] }
  | { type: 'reveal'; prompt: string; answer: string }
  | { type: 'timeline'; events: { when: string; what: string }[] }
  | { type: 'compare'; left: { label: string; text: string }; right: { label: string; text: string }; prompt?: string }

/** Media slot reserved for narration or real video. Rendered only when `src` exists. */
export interface ReelMedia {
  type: 'narration' | 'video'
  src: string
  captionsSrc?: string
}

export type ReelKind = 'hook' | 'context' | 'explain' | 'example' | 'complication' | 'reflect'

export interface Reel {
  id: string
  kind: ReelKind
  title: string
  body: string[]
  visual: Visual
  interaction?: ReelInteraction
  sources?: SourceRef[]
  media?: ReelMedia
  /** Course paths: did this come from the user's material or is it supplementary? */
  origin?: 'course' | 'supplementary'
  /** Only shown to learners who said they are new to the subject. */
  onlyFor?: Familiarity
  /** Marks content that is an invented scenario rather than a historical claim. */
  fictional?: boolean
}

export type QuestionSkill = 'recognise' | 'apply' | 'reason'

export interface ChoiceOption {
  id: string
  text: string
  /** Specific feedback shown when this option is chosen. */
  feedback: string
}

interface QuestionBase {
  id: string
  conceptId: string
  skill: QuestionSkill
  prompt: string
  /** Scenario or passage shown above the prompt. */
  passage?: string
  /** Reel the learner is sent back to after a mistake. */
  reelId: string
  explanation: string
  /** A different example used when the learner struggles. */
  altExample?: string
}

export interface ChoiceQuestion extends QuestionBase {
  type: 'choice'
  options: ChoiceOption[]
  correctId: string
  /** A fresh question testing the same concept. */
  fresh?: Omit<ChoiceQuestion, 'fresh'>
}

export interface ShortQuestion extends QuestionBase {
  type: 'short'
  modelAnswer: string
  /** Points a good answer should touch; shown for self-checking. */
  lookFor: string[]
  fresh?: Omit<ShortQuestion, 'fresh'> | Omit<ChoiceQuestion, 'fresh'>
}

export type Question = ChoiceQuestion | ShortQuestion

export interface Topic {
  id: string
  title: string
  objective: string
  prerequisite?: string
  reels: Reel[]
  quiz: Question[]
  /** Copy shown after the checkpoint. */
  nextStep?: string
}

export interface ModuleChallenge {
  id: string
  title: string
  scenario: string
  questions: Question[]
}

export interface Module {
  id: string
  title: string
  summary: string
  topics: Topic[]
  challenge?: ModuleChallenge
}

export interface Path {
  id: string
  title: string
  origin: PathOrigin
  /** Interest paths. */
  subjectId?: SubjectId
  /** Course paths. */
  courseId?: string
  description: string
  /** Shown when familiarity changes the path. */
  familiarityNote?: string
  modules: Module[]
  sources: Source[]
}
