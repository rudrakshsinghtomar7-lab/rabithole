import { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { ArrowLeft, FileText, Upload, ClipboardPaste, Info, Trash2, Loader2, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react'
import { useStore } from '../store/store'
import { getCourse, materialIndex, updateCourse } from '../store/courses'
import type { Course, Material, MaterialKind } from '../store/schema'
import { fileStore } from '../store/files'
import { ACCEPT_ATTR, extractFile, extractPlainText, type Extraction } from '../services/extract'
import { getGenerationStatus, requestGeneration } from '../services/ai'
import { enforceCitations } from '../learning/citations'
import { uid } from '../learning/engine'
import { Art } from '../ui/Art'
import { Sheet } from '../ui/Sheet'
import { Empty, relTime, toast } from '../ui/common'
import { getPath } from '../ui/paths'
import { PathOutline } from './PathOverview'

const KINDS: { id: MaterialKind; label: string }[] = [
  { id: 'syllabus', label: 'Syllabus' },
  { id: 'lecture', label: 'Lecture material' },
  { id: 'reading', label: 'Reading' },
  { id: 'practice', label: 'Practice questions' },
]

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const course = getCourse(state, courseId)
  const [tab, setTab] = useState<'path' | 'materials'>('path')
  const [configured, setConfigured] = useState<boolean | null>(null)
  useEffect(() => {
    getGenerationStatus().then((s) => setConfigured(s.configured))
  }, [])

  if (!course)
    return (
      <div className="page">
        <button type="button" className="back-link" onClick={() => navigate('/courses')}>
          <ArrowLeft size={16} aria-hidden="true" /> My Courses
        </button>
        <p className="h1 mt-16">Course not found.</p>
      </div>
    )

  const path = getPath(state, course.pathId)
  const proposal = getPath(state, course.generation.proposalPathId)

  return (
    <div className="page">
      <button type="button" className="back-link" onClick={() => navigate('/courses')}>
        <ArrowLeft size={16} aria-hidden="true" /> My Courses
      </button>
      <header className="hero hero-short surface mt-8" data-subject="course" style={{ minHeight: 280 }}>
        <div className="hero-art">
          <Art motif="stack" />
        </div>
        <div className="hero-body">
          <span className="cluster">
            {course.code && <span className="eyebrow muted">{course.code}</span>}
            {course.sample && <span className="tag">Sample course — for trying Rudra</span>}
          </span>
          <h1 className="display">{course.name}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {course.materials.length} material{course.materials.length === 1 ? '' : 's'}
            {path ? ` · study path: ${path.title}` : ''}
          </p>
        </div>
      </header>

      <div className="seg mt-24" role="tablist" aria-label="Course sections">
        <button type="button" role="tab" aria-selected={tab === 'path'} onClick={() => setTab('path')}>
          Study path
        </button>
        <button type="button" role="tab" aria-selected={tab === 'materials'} onClick={() => setTab('materials')}>
          Materials ({course.materials.length})
        </button>
      </div>

      {tab === 'path' ? (
        <div role="tabpanel">
          {path ? (
            <PathOutline path={path} compactHeader />
          ) : proposal ? (
            <Proposal course={course} />
          ) : (
            <GenerationPanel course={course} configured={configured} onAddMaterials={() => setTab('materials')} />
          )}
          {path && !course.sample && (
            <button
              type="button"
              className="btn btn-quiet btn-sm mt-24"
              onClick={() => update((s) => updateCourse(s, course.id, (c) => ({ ...c, pathId: undefined, generation: { status: 'idle' } })))}
            >
              Rebuild the study path
            </button>
          )}
        </div>
      ) : (
        <div role="tabpanel">
          <Materials course={course} />
        </div>
      )}

      {!course.sample && <DeleteCourse course={course} />}
    </div>
  )
}

function DeleteCourse({ course }: { course: Course }) {
  const { update } = useStore()
  const [, navigate] = useLocation()
  const [confirming, setConfirming] = useState(false)
  const remove = async () => {
    for (const m of course.materials) await fileStore.remove(m.id).catch(() => undefined)
    update((s) => ({ ...s, courses: s.courses.filter((c) => c.id !== course.id) }))
    navigate('/courses')
    toast('Course deleted')
  }
  return (
    <div className="cluster mt-24">
      {confirming ? (
        <>
          <span className="small">Delete “{course.name}”, its files and its progress?</span>
          <button type="button" className="btn btn-sm btn-accent" onClick={remove}>
            Delete
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </>
      ) : (
        <button type="button" className="btn btn-quiet btn-sm" onClick={() => setConfirming(true)}>
          <Trash2 size={15} aria-hidden="true" /> Delete course
        </button>
      )}
    </div>
  )
}

function GenerationPanel({ course, configured, onAddMaterials }: { course: Course; configured: boolean | null; onAddMaterials: () => void }) {
  const { update } = useStore()
  const ready = course.materials.filter((m) => m.status === 'ready')
  const g = course.generation

  const generate = async () => {
    update((s) => updateCourse(s, course.id, (c) => ({ ...c, generation: { status: 'generating', at: Date.now() } })))
    try {
      const materials = await Promise.all(
        ready.map(async (m) => {
          const t = await fileStore.getText(m.id)
          return { id: m.id, name: m.name, kind: m.kind, unit: m.unit, pages: t?.pages ?? [] }
        }),
      )
      const { path, warnings } = await requestGeneration({ kind: 'course', courseId: course.id, courseName: course.name, materials })
      // Re-check every citation against what's actually stored on this device.
      const { path: checked, issues } = enforceCitations({ ...path, courseId: course.id }, materialIndex(course.materials))
      const allWarnings = [...warnings, ...issues.map((i) => `Removed an unverifiable citation in “${i.where}”.`)]
      update((s) => ({
        ...updateCourse(s, course.id, (c) => ({ ...c, generation: { status: 'proposed', proposalPathId: checked.id, warnings: allWarnings, at: Date.now() } })),
        generated: { ...s.generated, [checked.id]: checked },
      }))
    } catch (err) {
      update((s) => updateCourse(s, course.id, (c) => ({ ...c, generation: { status: 'failed', error: err instanceof Error ? err.message : 'Generation failed' } })))
    }
  }

  if (!course.materials.length)
    return (
      <Empty title="Start with your syllabus.">
        <p>Add a syllabus, lecture notes, readings or practice questions. Rudra reads text-based PDFs, .txt and .md files, or text you paste.</p>
        <button type="button" className="btn mt-8" onClick={onAddMaterials}>
          <Upload size={16} aria-hidden="true" /> Add materials
        </button>
      </Empty>
    )

  return (
    <div className="mt-24 stack">
      {configured === false && (
        <div className="notice">
          <Info size={18} aria-hidden="true" />
          <div>
            <b>Personalised lesson generation needs to be set up.</b>
            <p className="small muted" style={{ margin: '4px 0 0' }}>
              Your files are saved on this device and their text has been extracted — you can read it under Materials. Rudra hasn’t analysed them or built lessons from them. Once generation is configured for this app, you’ll be able to turn them into a study path here. Meanwhile, try the sample course to see how course study works.
            </p>
          </div>
        </div>
      )}
      {configured && g.status !== 'generating' && (
        <div className="notice">
          <Sparkles size={18} aria-hidden="true" />
          <div>
            <b>Build a study path from {ready.length} readable material{ready.length === 1 ? '' : 's'}.</b>
            <p className="small muted" style={{ margin: '4px 0 8px' }}>
              Rudra will propose modules and topics with reels and checkpoints, citing the pages it used. You’ll review the structure before it’s added.
            </p>
            <button type="button" className="btn btn-sm" disabled={!ready.length} onClick={generate}>
              {g.status === 'failed' ? 'Try again' : 'Build study path'}
            </button>
          </div>
        </div>
      )}
      {g.status === 'generating' && (
        <p className="notice notice-warn" role="status">
          <Loader2 size={18} className="spin" aria-hidden="true" /> Reading your materials and proposing a structure. This can take a minute or two…
        </p>
      )}
      {g.status === 'failed' && (
        <p className="notice notice-bad" role="alert">
          <AlertTriangle size={18} aria-hidden="true" /> {g.error}
        </p>
      )}
    </div>
  )
}

function Proposal({ course }: { course: Course }) {
  const { state, update } = useStore()
  const proposal = getPath(state, course.generation.proposalPathId)!
  return (
    <div className="mt-24">
      <div className="notice">
        <Info size={18} aria-hidden="true" />
        <div>
          <b>Proposed study path — review before adding.</b>
          <p className="small muted" style={{ margin: '4px 0 0' }}>
            Generated from your materials. Reels marked “From your course material” cite specific pages; “Supplementary” reels add explanation beyond them. Open any topic to check its sources.
          </p>
          {!!course.generation.warnings?.length && (
            <ul className="small" style={{ margin: '8px 0 0', paddingLeft: 18 }}>
              {course.generation.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="cluster mt-16">
        <button type="button" className="btn btn-accent" onClick={() => update((s) => updateCourse(s, course.id, (c) => ({ ...c, pathId: proposal.id, generation: { ...c.generation, status: 'accepted' } })))}>
          <CheckCircle2 size={16} aria-hidden="true" /> Add to course
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() =>
            update((s) => {
              const { [proposal.id]: _drop, ...rest } = s.generated
              void _drop
              return { ...updateCourse(s, course.id, (c) => ({ ...c, generation: { status: 'idle' } })), generated: rest }
            })
          }
        >
          Discard
        </button>
      </div>
      <h2 className="h2 mt-24">{proposal.title}</h2>
      <p className="muted">{proposal.description}</p>
      <PathOutline path={proposal} compactHeader />
    </div>
  )
}

function Materials({ course }: { course: Course }) {
  const { update } = useStore()
  const [, navigate] = useLocation()
  const [kind, setKind] = useState<MaterialKind>(course.materials.some((m) => m.kind === 'syllabus') ? 'lecture' : 'syllabus')
  const [pasting, setPasting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const addMaterial = async (name: string, mime: string, blob: Blob, run: () => Promise<Extraction>) => {
    const id = uid('mat')
    const m: Material = { id, courseId: course.id, kind, name, mime, size: blob.size, addedAt: Date.now(), status: 'extracting', unit: 'section', pageCount: 0, charCount: 0 }
    update((s) => updateCourse(s, course.id, (c) => ({ ...c, materials: [...c.materials, m] })))
    let ex: Extraction
    try {
      await fileStore.putFile({ id, name, type: mime, blob })
      ex = await run()
      if (ex.pages.length) await fileStore.putText({ id, pages: ex.pages })
    } catch (err) {
      ex = { status: 'error', unit: 'section', pages: [], message: err instanceof Error && /storage/i.test(err.message) ? err.message : 'Something went wrong while reading this file.' }
    }
    update((s) =>
      updateCourse(s, course.id, (c) => ({
        ...c,
        materials: c.materials.map((x) => (x.id === id ? { ...x, status: ex.status, unit: ex.unit, pageCount: ex.pages.length, charCount: ex.pages.reduce((n, p) => n + p.length, 0), message: ex.message } : x)),
      })),
    )
    if (ex.status === 'ready') toast(`Read ${ex.pages.length} ${ex.unit}${ex.pages.length === 1 ? '' : 's'} from ${name}`)
  }

  const onFiles = async (files: FileList | null) => {
    if (!files) return
    for (const f of Array.from(files)) await addMaterial(f.name, f.type || 'application/octet-stream', f, () => extractFile(f))
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="mt-24">
      {!course.sample && (
        <div className="stack" style={{ maxWidth: 640 }}>
          <div className="field" style={{ marginBottom: 4 }}>
            <label htmlFor="mkind">What are you adding?</label>
            <select id="mkind" className="select" value={kind} onChange={(e) => setKind(e.target.value as MaterialKind)}>
              {KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          <div className="cluster">
            <input ref={fileRef} id="upload" type="file" accept={ACCEPT_ATTR} multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
            <label htmlFor="upload" className="btn" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), fileRef.current?.click())}>
              <Upload size={16} aria-hidden="true" /> Upload file
            </label>
            <button type="button" className="btn btn-ghost" onClick={() => setPasting(true)}>
              <ClipboardPaste size={16} aria-hidden="true" /> Paste text
            </button>
          </div>
          <p className="hint">PDF with selectable text, .txt or .md, up to 25 MB. Scanned PDFs need text recognition (OCR) first.</p>
        </div>
      )}

      {course.materials.length === 0 ? (
        <Empty title="No materials yet." />
      ) : (
        KINDS.map((k) => {
          const items = course.materials.filter((m) => m.kind === k.id)
          if (!items.length) return null
          return (
            <section key={k.id} className="section" aria-labelledby={`k-${k.id}`}>
              <div className="section-head">
                <h2 id={`k-${k.id}`} className="eyebrow">
                  {k.label}
                </h2>
              </div>
              <ul className="rows">
                {items.map((m) => (
                  <li key={m.id} className="row" style={{ gridTemplateColumns: 'auto minmax(0,1fr) auto' }}>
                    <FileText size={20} aria-hidden="true" />
                    <button type="button" onClick={() => navigate(`/courses/${course.id}/material/${m.id}`)} style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', minHeight: 44 }}>
                      <span className="row-title">{m.name}</span>
                      <span className="row-sub" style={{ display: 'block' }}>
                        <MaterialStatusLine m={m} />
                      </span>
                      {m.message && (
                        <span className="small" style={{ display: 'block', marginTop: 4 }}>
                          {m.message}
                        </span>
                      )}
                    </button>
                    {!course.sample && (
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Remove ${m.name}`}
                        onClick={async () => {
                          await fileStore.remove(m.id).catch(() => undefined)
                          update((s) => updateCourse(s, course.id, (c) => ({ ...c, materials: c.materials.filter((x) => x.id !== m.id) })))
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}

      {pasting && <PasteSheet kindLabel={KINDS.find((k) => k.id === kind)!.label} onClose={() => setPasting(false)} onSave={(title, text) => { setPasting(false); void addMaterial(title, 'text/plain', new Blob([text], { type: 'text/plain' }), async () => extractPlainText(text)) }} />}
    </div>
  )
}

function MaterialStatusLine({ m }: { m: Material }) {
  switch (m.status) {
    case 'extracting':
      return <span className="tag tag-warn">Reading…</span>
    case 'ready':
      return (
        <>
          <span className="tag tag-good">Text extracted</span> {m.pageCount} {m.unit}
          {m.pageCount === 1 ? '' : 's'} · {Math.round(m.charCount / 100) / 10}k characters{m.bundled ? '' : ` · added ${relTime(m.addedAt)}`}
        </>
      )
    case 'needs-ocr':
      return <span className="tag tag-warn">Needs OCR</span>
    case 'empty':
      return <span className="tag tag-warn">No text found</span>
    case 'unsupported':
      return <span className="tag tag-bad">Unsupported format</span>
    default:
      return <span className="tag tag-bad">Couldn’t read</span>
  }
}

function PasteSheet({ kindLabel, onClose, onSave }: { kindLabel: string; onClose: () => void; onSave: (title: string, text: string) => void }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  return (
    <Sheet
      title={`Paste ${kindLabel.toLowerCase()}`}
      onClose={onClose}
      footer={
        <button type="button" className="btn" disabled={!text.trim()} onClick={() => onSave(title.trim() || `Pasted ${kindLabel.toLowerCase()} · ${new Date().toLocaleDateString()}`, text)}>
          Save
        </button>
      }
    >
      <div className="field">
        <label htmlFor="ptitle">
          Title <span className="muted">(optional)</span>
        </label>
        <input id="ptitle" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Week 3 lecture notes" />
      </div>
      <div className="field">
        <label htmlFor="ptext">Text</label>
        <textarea id="ptext" className="textarea" style={{ minHeight: 220 }} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <p className="hint">Long text is split into numbered sections so sources can point to the right place.</p>
    </Sheet>
  )
}
