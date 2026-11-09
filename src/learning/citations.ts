// Citation validation for course-derived content. A citation must name a material
// that exists in the course, and any page must fall within that material's extracted pages.

import type { Path, SourceRef } from '../content/types.ts'

export interface MaterialIndex {
  [materialId: string]: { pageCount: number; readable: boolean }
}

export interface CitationIssue {
  where: string
  ref: SourceRef
  problem: 'unknown-source' | 'page-out-of-range' | 'unreadable-source'
}

export function checkRef(ref: SourceRef, index: MaterialIndex): CitationIssue['problem'] | null {
  const m = index[ref.sourceId]
  if (!m) return 'unknown-source'
  if (!m.readable) return 'unreadable-source'
  if (ref.page !== undefined && (!Number.isInteger(ref.page) || ref.page < 1 || ref.page > m.pageCount)) return 'page-out-of-range'
  return null
}

export function validatePathCitations(path: Path, index: MaterialIndex): CitationIssue[] {
  const issues: CitationIssue[] = []
  for (const m of path.modules)
    for (const t of m.topics)
      for (const r of t.reels)
        for (const ref of r.sources ?? []) {
          const problem = checkRef(ref, index)
          if (problem) issues.push({ where: `${t.title} › ${r.title}`, ref, problem })
        }
  return issues
}

/**
 * Removes invalid citations and downgrades reels that relied solely on them to "supplementary",
 * so nothing is presented as course-derived without a verifiable source.
 */
export function enforceCitations(path: Path, index: MaterialIndex): { path: Path; issues: CitationIssue[] } {
  const issues = validatePathCitations(path, index)
  const cleaned: Path = {
    ...path,
    modules: path.modules.map((m) => ({
      ...m,
      topics: m.topics.map((t) => ({
        ...t,
        reels: t.reels.map((r) => {
          const valid = (r.sources ?? []).filter((ref) => !checkRef(ref, index))
          const origin = r.origin === 'course' && valid.length === 0 ? 'supplementary' : r.origin
          return { ...r, sources: valid, origin }
        }),
      })),
    })),
  }
  return { path: cleaned, issues }
}
