import { useState } from 'react'
import { useLocation } from 'wouter'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { findReel, themeForPath, visibleReels } from '../content'
import { setReelPosition } from '../learning/engine'
import { useStore } from '../store/store'
import { Art } from '../ui/Art'
import { Empty, relTime } from '../ui/common'
import { getPath, learnUrl } from '../ui/paths'

export function Saved() {
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const [filter, setFilter] = useState<'all' | 'notes'>('all')
  const items = state.bookmarks
    .map((b) => {
      const path = getPath(state, b.pathId)
      const found = path ? findReel(path, b.reelId) : undefined
      return { b, path, found }
    })
    .filter((x) => x.path && x.found && (filter === 'all' || x.b.note.trim()))
    .sort((a, b) => b.b.createdAt - a.b.createdAt)

  return (
    <div className="page">
      <button type="button" className="back-link" onClick={() => navigate('/interests')}>
        <ArrowLeft size={16} aria-hidden="true" /> My Interests
      </button>
      <div className="between mt-8" style={{ flexWrap: 'wrap' }}>
        <h1 className="h1">Saved ideas</h1>
        <div className="seg" role="group" aria-label="Filter">
          <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </button>
          <button type="button" aria-pressed={filter === 'notes'} onClick={() => setFilter('notes')}>
            With notes
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <Empty title={filter === 'notes' ? 'No notes yet.' : 'Nothing saved yet.'}>
          <p>Tap the bookmark on any reel to keep the idea here. You can add a note to it too.</p>
        </Empty>
      ) : (
        <ul className="rows mt-16">
          {items.map(({ b, path, found }) => (
            <li key={b.id} className="row" style={{ gridTemplateColumns: 'auto minmax(0,1fr) auto' }}>
              <span className="swatch surface" data-subject={themeForPath(path!)}>
                <Art motif={found!.reel.visual.motif} />
              </span>
              <button
                type="button"
                onClick={() => {
                  const fam = state.enrollments[path!.id]?.familiarity ?? 'new'
                  const reels = visibleReels(found!.topic, fam)
                  const idx = Math.max(0, reels.findIndex((r) => r.id === b.reelId))
                  update((s) => setReelPosition(s, path!.id, b.topicId, idx, reels.length))
                  navigate(learnUrl(path!, b.topicId))
                }} style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', minHeight: 44 }}>
                <span className="row-title">{found!.reel.title}</span>
                <span className="row-sub" style={{ display: 'block' }}>
                  {path!.title} · {found!.topic.title} · saved {relTime(b.createdAt)}
                </span>
                {b.note && (
                  <span className="small" style={{ display: 'block', marginTop: 6, fontStyle: 'italic' }}>
                    “{b.note}”
                  </span>
                )}
              </button>
              <button type="button" className="icon-btn" aria-label={`Remove “${found!.reel.title}” from saved`} onClick={() => update((s) => ({ ...s, bookmarks: s.bookmarks.filter((x) => x.id !== b.id) }))}>
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
