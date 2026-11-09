import { useState } from 'react'
import type { Reel, ReelInteraction } from '../content/types'
import { Art } from './Art'

const kindLabel: Record<Reel['kind'], string> = {
  hook: 'Opening',
  context: 'Primer',
  explain: 'Explanation',
  example: 'Worked example',
  complication: 'Complication',
  reflect: 'Reflection',
}

export function ReelContent({ reel, actionLabel, compact }: { reel: Reel; actionLabel: string; compact?: boolean }) {
  return (
    <>
      {!compact && (
        <figure className="reel-art" style={{ margin: '0 -22px' }}>
          <Art motif={reel.visual.motif} />
          {reel.visual.caption && <figcaption>{reel.visual.caption}</figcaption>}
        </figure>
      )}
      <div className="reel-kind">
        <span className="tag">{kindLabel[reel.kind]}</span>
        {reel.fictional && <span className="tag">Fictional exercise</span>}
        {reel.origin === 'course' && <span className="tag">From your course material</span>}
        {reel.origin === 'supplementary' && <span className="tag">Supplementary explanation</span>}
      </div>
      {compact ? <h3>{reel.title}</h3> : <h2 className="reel-title">{reel.title}</h2>}
      <div className="reel-text">
        {reel.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {reel.media?.src && <ReelMediaPlayer reel={reel} />}
      {reel.interaction && !compact && <Interaction ix={reel.interaction} actionLabel={actionLabel} />}
    </>
  )
}

/** Only rendered when real media exists, so controls always do something. */
function ReelMediaPlayer({ reel }: { reel: Reel }) {
  const m = reel.media!
  if (m.type === 'video')
    return (
      <video controls preload="metadata" src={m.src} style={{ width: '100%', borderRadius: 12 }}>
        {m.captionsSrc && <track kind="captions" src={m.captionsSrc} default />}
      </video>
    )
  return <audio controls preload="none" src={m.src} style={{ width: '100%' }} aria-label={`Narration: ${reel.title}`} />
}

function Interaction({ ix, actionLabel }: { ix: ReelInteraction; actionLabel: string }) {
  const [choice, setChoice] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  switch (ix.type) {
    case 'poll':
      return (
        <div className="ix" role="group" aria-label={actionLabel}>
          <span className="ix-label">{actionLabel}</span>
          <span className="ix-prompt">{capitalise(ix.prompt.replace(/^[^:]+:\s*/, ''))}</span>
          <div className="ix-options">
            {ix.options.map((o) => (
              <button key={o.id} type="button" className="ix-opt" aria-pressed={choice === o.id} onClick={() => setChoice(o.id)}>
                {o.text}
              </button>
            ))}
          </div>
          <div aria-live="polite">{choice && <p className="ix-response">{ix.options.find((o) => o.id === choice)?.response}</p>}</div>
          <span className="small muted">There’s no score here — your choice is a starting point to test.</span>
        </div>
      )
    case 'reveal':
      return (
        <div className="ix">
          <span className="ix-label">Think first</span>
          <span className="ix-prompt">{ix.prompt}</span>
          {revealed ? (
            <p className="ix-response" aria-live="polite">
              {ix.answer}
            </p>
          ) : (
            <div>
              <button type="button" className="ix-opt" onClick={() => setRevealed(true)}>
                Reveal
              </button>
            </div>
          )}
        </div>
      )
    case 'timeline':
      return (
        <div className="ix">
          <span className="ix-label">Sequence</span>
          <ol className="ix-timeline">
            {ix.events.map((e) => (
              <li key={e.when + e.what}>
                <b>{e.when}</b>
                {e.what}
              </li>
            ))}
          </ol>
        </div>
      )
    case 'compare':
      return (
        <div className="ix">
          <span className="ix-label">Compare</span>
          <div className="ix-compare">
            <div>
              <b>{ix.left.label}</b>
              {ix.left.text}
            </div>
            <div>
              <b>{ix.right.label}</b>
              {ix.right.text}
            </div>
          </div>
          {ix.prompt && <span className="ix-prompt">{ix.prompt}</span>}
        </div>
      )
  }
}

const capitalise = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)
