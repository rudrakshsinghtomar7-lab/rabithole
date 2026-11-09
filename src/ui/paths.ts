import type { Path } from '../content/types'
import { findPath } from '../content'
import type { AppState } from '../store/schema'

export const tabForPath = (path: Path) => (path.courseId ? 'courses' : 'interests')
export const learnUrl = (path: Path, topicId: string) => `/${tabForPath(path)}/learn/${path.id}/${topicId}`
export const challengeUrl = (path: Path, moduleId: string) => `/${tabForPath(path)}/challenge/${path.id}/${moduleId}`
export const overviewUrl = (path: Path) => (path.courseId ? `/courses/${path.courseId}` : `/interests/path/${path.id}`)

export function getPath(state: AppState, id: string | undefined): Path | undefined {
  return id ? findPath(id, state.generated) : undefined
}
