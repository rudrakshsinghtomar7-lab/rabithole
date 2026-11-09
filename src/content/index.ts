import type { Familiarity, Module, Path, Question, Reel, Subject, Topic } from './types'
import { philosophyIdentity } from './philosophy'
import { historyEvidence } from './history'
import { marketingPositioning } from './marketing'
import { politicsWhoDecides } from './politics'
import { economicsHiddenCosts } from './economics'
import { geographyWhereAndWhy } from './geography'
import { financeMoneyOverTime } from './finance'
import { scienceHowWeKnow } from './science'
import { sampleCoursePath, SAMPLE_COURSE_ID } from './sampleCourse'

export { SAMPLE_COURSE_ID }

export const subjects: Subject[] = [
  { id: 'philosophy', name: 'Philosophy', theme: 'philosophy', actionLabel: 'Take a side', blurb: 'Thought experiments, arguments and objections.', pathIds: [philosophyIdentity.id] },
  { id: 'history', name: 'History', theme: 'history', actionLabel: 'Investigate', blurb: 'Sources, causes and competing interpretations.', pathIds: [historyEvidence.id] },
  { id: 'marketing', name: 'Marketing', theme: 'marketing', actionLabel: 'Make your move', blurb: 'Audiences, messages and positioning decisions.', pathIds: [marketingPositioning.id] },
  { id: 'politics', name: 'Political Science', theme: 'politics', actionLabel: 'Make the call', blurb: 'Authority, elections and how institutions shape power.', pathIds: [politicsWhoDecides.id] },
  { id: 'economics', name: 'Economics', theme: 'economics', actionLabel: 'Count the cost', blurb: 'Trade-offs, trade and the costs markets miss.', pathIds: [economicsHiddenCosts.id] },
  { id: 'geography', name: 'Geography', theme: 'geography', actionLabel: 'Read the map', blurb: 'Why places are where they are, and what maps hide.', pathIds: [geographyWhereAndWhy.id] },
  { id: 'finance', name: 'Finance', theme: 'finance', actionLabel: 'Run the numbers', blurb: 'Compounding, inflation and risk — concepts, not advice.', pathIds: [financeMoneyOverTime.id] },
  { id: 'science', name: 'Science', theme: 'science', actionLabel: 'Test it', blurb: 'Testable claims, fair experiments and causation.', pathIds: [scienceHowWeKnow.id] },
]

export const preparedPaths: Path[] = [
  philosophyIdentity,
  historyEvidence,
  marketingPositioning,
  politicsWhoDecides,
  economicsHiddenCosts,
  geographyWhereAndWhy,
  financeMoneyOverTime,
  scienceHowWeKnow,
  sampleCoursePath,
]

export function getSubject(id: string | undefined): Subject | undefined {
  return subjects.find((s) => s.id === id)
}

/** Paths are looked up in prepared content first, then in user-generated paths. */
export function findPath(id: string, generated: Record<string, Path> = {}): Path | undefined {
  return preparedPaths.find((p) => p.id === id) ?? generated[id]
}

export interface TopicLocation {
  path: Path
  module: Module
  moduleIndex: number
  topic: Topic
  topicIndex: number
  /** Index across the whole path. */
  flatIndex: number
}

export function allTopics(path: Path): TopicLocation[] {
  const out: TopicLocation[] = []
  path.modules.forEach((module, moduleIndex) =>
    module.topics.forEach((topic, topicIndex) =>
      out.push({ path, module, moduleIndex, topic, topicIndex, flatIndex: out.length }),
    ),
  )
  return out
}

export function locateTopic(path: Path, topicId: string): TopicLocation | undefined {
  return allTopics(path).find((t) => t.topic.id === topicId)
}

/** Reels visible for a learner's familiarity. */
export function visibleReels(topic: Topic, familiarity: Familiarity = 'new'): Reel[] {
  return topic.reels.filter((r) => !r.onlyFor || r.onlyFor === familiarity)
}

export function findReel(path: Path, reelId: string): { reel: Reel; topic: Topic } | undefined {
  for (const m of path.modules)
    for (const t of m.topics) {
      const reel = t.reels.find((r) => r.id === reelId)
      if (reel) return { reel, topic: t }
    }
  return undefined
}

export function themeForPath(path: Path): Subject['theme'] {
  if (path.courseId) return 'course'
  return getSubject(path.subjectId)?.theme ?? 'neutral'
}

export function actionLabelForPath(path: Path): string {
  return getSubject(path.subjectId)?.actionLabel ?? 'Try it'
}

/** All questions in a path, including fresh variants, for review. */
export function questionsByConcept(path: Path): Map<string, Question[]> {
  const map = new Map<string, Question[]>()
  const push = (q: Question) => {
    const list = map.get(q.conceptId) ?? []
    list.push(q)
    map.set(q.conceptId, list)
  }
  for (const m of path.modules) {
    for (const t of m.topics)
      for (const q of t.quiz) {
        push(q)
        if (q.fresh) push(q.fresh as Question)
      }
    m.challenge?.questions.forEach(push)
  }
  return map
}
