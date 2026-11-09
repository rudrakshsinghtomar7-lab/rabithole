import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { ArrowLeft, ExternalLink, Download } from 'lucide-react'
import { useStore } from '../store/store'
import { bundledPages, getCourse } from '../store/courses'
import { fileStore } from '../store/files'

type Load = { state: 'loading' } | { state: 'ready'; pages: string[] } | { state: 'missing' }

export function SourceViewer() {
  const { courseId, materialId, page } = useParams<{ courseId: string; materialId: string; page?: string }>()
  const { state } = useStore()
  const [, navigate] = useLocation()
  const course = getCourse(state, courseId)
  const mat = course?.materials.find((m) => m.id === materialId)
  const [load, setLoad] = useState<Load>({ state: 'loading' })
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const target = page ? Number(page) : undefined

  useEffect(() => {
    let cancelled = false
    if (!mat) return
    if (mat.bundled) {
      const pages = bundledPages(mat.id)
      setLoad(pages ? { state: 'ready', pages } : { state: 'missing' })
      return
    }
    fileStore
      .getText(mat.id)
      .then((t) => !cancelled && setLoad(t ? { state: 'ready', pages: t.pages } : { state: 'ready', pages: [] }))
      .catch(() => !cancelled && setLoad({ state: 'missing' }))
    let url: string | null = null
    fileStore
      .getFile(mat.id)
      .then((f) => {
        if (f && !cancelled) {
          url = URL.createObjectURL(f.blob)
          setOriginalUrl(url)
        }
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [mat])

  useEffect(() => {
    if (load.state === 'ready' && target) document.getElementById(`pg-${target}`)?.scrollIntoView({ block: 'start' })
  }, [load, target])

  if (!course || !mat)
    return (
      <div className="page">
        <button type="button" className="back-link" onClick={() => navigate('/courses')}>
          <ArrowLeft size={16} aria-hidden="true" /> My Courses
        </button>
        <p className="h1 mt-16">Source not found.</p>
        <p className="muted">It may have been removed from the course.</p>
      </div>
    )

  const unitLabel = mat.unit === 'page' ? 'Page' : 'Section'
  const outOfRange = load.state === 'ready' && target !== undefined && (target < 1 || target > load.pages.length)

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <button type="button" className="back-link" onClick={() => history.length > 1 ? history.back() : navigate(`/courses/${course.id}`)}>
        <ArrowLeft size={16} aria-hidden="true" /> Back
      </button>
      <span className="eyebrow mt-8" style={{ display: 'block' }}>
        {course.name} · {mat.kind}
      </span>
      <h1 className="h2 mt-8">{mat.name}</h1>
      <div className="cluster mt-16">
        {originalUrl && (
          <>
            <a className="btn btn-sm btn-ghost" href={originalUrl} target="_blank" rel="noreferrer">
              Open original <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only">(new tab)</span>
            </a>
            <a className="btn btn-sm btn-quiet" href={originalUrl} download={mat.name}>
              <Download size={14} aria-hidden="true" /> Download
            </a>
          </>
        )}
        {mat.bundled && <span className="tag">Sample document bundled with Rudra</span>}
        {target && !outOfRange && (
          <span className="tag tag-accent">
            Cited: {unitLabel.toLowerCase()} {target}
          </span>
        )}
      </div>

      {mat.message && <p className={`notice mt-16 ${mat.status === 'ready' ? '' : 'notice-warn'}`}>{mat.message}</p>}
      {outOfRange && <p className="notice notice-bad mt-16">The cited {unitLabel.toLowerCase()} ({target}) doesn’t exist in this document.</p>}

      {load.state === 'loading' && <p className="muted mt-24">Loading text…</p>}
      {load.state === 'missing' && <p className="notice notice-bad mt-24">The stored text for this file couldn’t be found on this device.</p>}
      {load.state === 'ready' && load.pages.length === 0 && mat.status !== 'extracting' && <p className="muted mt-24">No extracted text is available for this file{originalUrl ? ', but you can open the original above.' : '.'}</p>}
      {load.state === 'ready' &&
        load.pages.map((p, i) => (
          <section key={i} aria-labelledby={`pgl-${i + 1}`}>
            <p className="doc-page-label" id={`pgl-${i + 1}`}>
              {unitLabel} {i + 1}
            </p>
            <div id={`pg-${i + 1}`} className="doc-page" data-highlight={target === i + 1 ? 'true' : undefined} tabIndex={target === i + 1 ? -1 : undefined}>
              {p || <span className="muted">(No text on this {unitLabel.toLowerCase()}.)</span>}
            </div>
          </section>
        ))}
    </div>
  )
}
