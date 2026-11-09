import { useLocation } from 'wouter'
import { ExternalLink, FileText, AlertTriangle } from 'lucide-react'
import type { Path, SourceRef } from '../content/types'
import { useStore } from '../store/store'
import { getCourse, materialIndex } from '../store/courses'
import { checkRef } from '../learning/citations'

export function SourceList({ path, refs, onNavigate }: { path: Path; refs: SourceRef[]; onNavigate?: () => void }) {
  const { state } = useStore()
  const [, navigate] = useLocation()
  const course = path.courseId ? getCourse(state, path.courseId) : undefined
  const index = course ? materialIndex(course.materials) : undefined

  if (!refs.length) return <p className="muted small">No specific source for this reel.</p>
  return (
    <ul className="rows">
      {refs.map((ref, i) => {
        const src = path.sources.find((s) => s.id === ref.sourceId)
        if (course && index) {
          const mat = course.materials.find((m) => m.id === ref.sourceId)
          const problem = checkRef(ref, index)
          if (!mat || problem)
            return (
              <li key={i} className="row" style={{ gridTemplateColumns: 'auto minmax(0,1fr)' }}>
                <AlertTriangle size={18} aria-hidden="true" />
                <span className="row-sub">This citation can’t be verified against your uploaded material, so it isn’t shown.</span>
              </li>
            )
          const where = ref.page ? `${mat.unit === 'page' ? 'Page' : 'Section'} ${ref.page}` : 'Whole document'
          return (
            <li key={i}>
              <button
                type="button"
                className="row"
                onClick={() => {
                  onNavigate?.()
                  navigate(`/courses/${course.id}/material/${mat.id}${ref.page ? `/${ref.page}` : ''}`)
                }}
              >
                <FileText size={20} aria-hidden="true" />
                <span>
                  <span className="row-title">{mat.name}</span>
                  <span className="row-sub" style={{ display: 'block' }}>
                    {where}
                    {ref.note ? ` · ${ref.note}` : ''}
                  </span>
                </span>
                <span className="tag">Open</span>
              </button>
            </li>
          )
        }
        if (!src) return null
        const meta = [src.author, src.year].filter(Boolean).join(', ')
        return (
          <li key={i} className="row" style={{ gridTemplateColumns: 'auto minmax(0,1fr) auto' }}>
            <FileText size={20} aria-hidden="true" />
            <span>
              <span className="row-title">{src.title}</span>
              <span className="row-sub" style={{ display: 'block' }}>
                {meta}
                {ref.page ? ` · p. ${ref.page}` : ''}
                {src.kind === 'primary' ? ' · primary source' : ''}
              </span>
            </span>
            {src.url ? (
              <a className="btn btn-sm btn-ghost" href={src.url} target="_blank" rel="noreferrer">
                Open <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="tag">Print</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
