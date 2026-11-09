// Course helpers: the sample course is virtual (from content), user courses live in state.

import { sampleCourseDocs, SAMPLE_COURSE_ID, sampleCoursePath } from '../content/sampleCourse'
import type { AppState, Course, Material } from './schema'
import type { MaterialIndex } from '../learning/citations'

export const sampleCourse: Course = {
  id: SAMPLE_COURSE_ID,
  name: 'Principles of Microeconomics',
  code: 'ECON 101 · Sample',
  createdAt: 0,
  sample: true,
  pathId: sampleCoursePath.id,
  generation: { status: 'accepted' },
  materials: sampleCourseDocs.map((d) => ({
    id: d.id,
    courseId: SAMPLE_COURSE_ID,
    kind: d.kind,
    name: d.name,
    mime: 'text/plain',
    size: d.pages.join('').length,
    addedAt: 0,
    status: 'ready',
    unit: 'page',
    pageCount: d.pages.length,
    charCount: d.pages.join('').length,
    bundled: true,
  })),
}

export function allCourses(state: AppState): Course[] {
  return [...state.courses, sampleCourse]
}

export function getCourse(state: AppState, id: string | undefined): Course | undefined {
  return allCourses(state).find((c) => c.id === id)
}

export function bundledPages(materialId: string): string[] | undefined {
  return sampleCourseDocs.find((d) => d.id === materialId)?.pages
}

export function materialIndex(materials: Material[]): MaterialIndex {
  return Object.fromEntries(materials.map((m) => [m.id, { pageCount: m.pageCount, readable: m.status === 'ready' }]))
}

export function updateCourse(state: AppState, id: string, fn: (c: Course) => Course): AppState {
  return { ...state, courses: state.courses.map((c) => (c.id === id ? fn(c) : c)) }
}
