import { useState } from 'react'
import { useLocation } from 'wouter'
import { ChevronRight, Plus } from 'lucide-react'
import { useStore } from '../store/store'
import { allCourses } from '../store/courses'
import { pathProgress, uid } from '../learning/engine'
import { Art } from '../ui/Art'
import { ThemeToggle, Wordmark } from '../ui/common'
import { getPath } from '../ui/paths'
import { Sheet } from '../ui/Sheet'

export function CoursesHome() {
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const courses = allCourses(state)

  const create = () => {
    const n = name.trim()
    if (!n) return
    const id = uid('course')
    update((s) => ({ ...s, courses: [{ id, name: n, code: code.trim() || undefined, createdAt: Date.now(), materials: [], generation: { status: 'idle' } }, ...s.courses] }))
    setCreating(false)
    setName('')
    setCode('')
    navigate(`/courses/${id}`)
  }

  return (
    <div className="page">
      <header className="page-head">
        <Wordmark />
        <ThemeToggle />
      </header>
      <div className="between" style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <span className="eyebrow">My Courses</span>
          <h1 className="h1 mt-8">Your coursework, one topic at a time.</h1>
        </div>
        <button type="button" className="btn btn-accent" onClick={() => setCreating(true)}>
          <Plus size={18} aria-hidden="true" /> New course
        </button>
      </div>
      <p className="muted mt-16" style={{ maxWidth: '60ch' }}>
        Add a syllabus, lecture notes, readings and practice questions. Course progress stays with the course — learning something similar in My Interests won’t tick off a course requirement.
      </p>

      <ul className="rows section">
        {courses.map((c) => {
          const path = getPath(state, c.pathId)
          const prog = path ? pathProgress(state, path) : undefined
          return (
            <li key={c.id}>
              <button type="button" className="row" onClick={() => navigate(`/courses/${c.id}`)} style={{ padding: '20px 0' }}>
                <span className="swatch surface" data-subject="course" style={{ width: 56, height: 56 }}>
                  <Art motif="stack" />
                </span>
                <span>
                  <span className="cluster">
                    <span className="row-title" style={{ fontSize: 17 }}>
                      {c.name}
                    </span>
                    {c.sample && <span className="tag tag-accent">Sample course</span>}
                  </span>
                  <span className="row-sub" style={{ display: 'block' }}>
                    {[c.code, `${c.materials.length} material${c.materials.length === 1 ? '' : 's'}`, prog ? `${prog.checkpointsDone}/${prog.totalTopics} checkpoints` : 'No study path yet'].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>

      {creating && (
        <Sheet
          title="New course"
          onClose={() => setCreating(false)}
          footer={
            <button type="button" className="btn" disabled={!name.trim()} onClick={create}>
              Create course
            </button>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              create()
            }}
          >
            <div className="field">
              <label htmlFor="cname">Course name</label>
              <input id="cname" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Introduction to Psychology" maxLength={120} required />
            </div>
            <div className="field">
              <label htmlFor="ccode">
                Course code <span className="muted">(optional)</span>
              </label>
              <input id="ccode" className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. PSYC 101" maxLength={40} />
            </div>
            <p className="hint">Next you’ll add your syllabus and materials.</p>
            <button type="submit" className="sr-only">
              Create course
            </button>
          </form>
        </Sheet>
      )}
    </div>
  )
}
