import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { ArrowLeft, Info, Trash2 } from 'lucide-react'
import { useStore } from '../store/store'
import { getGenerationStatus } from '../services/ai'
import { RequestTag, runGeneration } from './InterestsHome'
import { relTime } from '../ui/common'
import { getPath } from '../ui/paths'
import { PathOutline } from './PathOverview'

export function RequestPage() {
  const { requestId } = useParams<{ requestId: string }>()
  const { state, update } = useStore()
  const [, navigate] = useLocation()
  const [configured, setConfigured] = useState<boolean | null>(null)
  useEffect(() => {
    getGenerationStatus().then((s) => setConfigured(s.configured))
  }, [])
  const req = state.requests.find((r) => r.id === requestId)
  const back = (
    <button type="button" className="back-link" onClick={() => navigate('/interests')}>
      <ArrowLeft size={16} aria-hidden="true" /> My Interests
    </button>
  )
  if (!req)
    return (
      <div className="page">
        {back}
        <p className="h1 mt-16">Request not found.</p>
      </div>
    )
  const path = getPath(state, req.pathId)

  return (
    <div className="page">
      {back}
      <div className="between mt-16" style={{ alignItems: 'flex-start' }}>
        <div>
          <span className="eyebrow">Custom request · {relTime(req.createdAt)}</span>
          <h1 className="h1 mt-8" style={{ maxWidth: '20ch' }}>
            {req.text}
          </h1>
          <p className="muted mt-8">Familiarity: {req.familiarity === 'new' ? 'new to it' : 'some background'}</p>
        </div>
        <RequestTag r={req} />
      </div>

      {req.status === 'saved' && (
        <div className="notice mt-16">
          <Info size={18} aria-hidden="true" />
          <div>
            <b>Saved, not yet generated.</b>
            <p className="small muted" style={{ margin: '4px 0 0' }}>
              {configured
                ? 'Generation is available now. Build the path when you’re ready.'
                : 'Personalised generation isn’t set up for this app yet, so no path has been created. Your request is kept on this device.'}
            </p>
          </div>
        </div>
      )}
      {req.status === 'failed' && (
        <div className="notice notice-bad mt-16" role="alert">
          <Info size={18} aria-hidden="true" />
          <div>
            <b>Generation failed.</b>
            <p className="small" style={{ margin: '4px 0 0' }}>{req.error}</p>
          </div>
        </div>
      )}
      {req.status === 'generating' && <p className="notice notice-warn mt-16" role="status">Building your path. This can take a minute…</p>}

      <div className="cluster mt-16">
        {configured && (req.status === 'saved' || req.status === 'failed') && (
          <button type="button" className="btn" onClick={() => runGeneration(req, update)}>
            {req.status === 'failed' ? 'Try again' : 'Build my path'}
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            update((s) => ({ ...s, requests: s.requests.filter((r) => r.id !== req.id) }))
            navigate('/interests')
          }}
        >
          <Trash2 size={16} aria-hidden="true" /> Remove request
        </button>
      </div>

      {path && (
        <>
          <p className="notice mt-24">
            Proposed structure — generated from your goal, without source documents. Check the topics below, then start when it looks right.
          </p>
          <PathOutline path={path} />
        </>
      )}
    </div>
  )
}
