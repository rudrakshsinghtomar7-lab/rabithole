// Client side of the generation service boundary. The browser never holds credentials:
// it talks to /api, which is served by server/index.ts when someone runs it.

import type { Path } from '../content/types'

export interface GenerationStatus {
  configured: boolean
}

let statusCache: Promise<GenerationStatus> | null = null

export function getGenerationStatus(): Promise<GenerationStatus> {
  statusCache ??= fetch('/api/status', { headers: { accept: 'application/json' } })
    .then(async (r) => {
      if (!r.ok) return { configured: false }
      const json = (await r.json()) as Partial<GenerationStatus>
      return { configured: json.configured === true }
    })
    .catch(() => ({ configured: false }))
  return statusCache
}

export interface GenerateResult {
  path: Path
  warnings: string[]
}

export type GeneratePayload =
  | { kind: 'goal'; goal: string; familiarity: 'new' | 'some' }
  | { kind: 'course'; courseId: string; courseName: string; materials: { id: string; name: string; kind: string; unit: 'page' | 'section'; pages: string[] }[] }

export async function requestGeneration(payload: GeneratePayload): Promise<GenerateResult> {
  const r = await fetch('/api/generate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
  const json = (await r.json().catch(() => ({}))) as { path?: Path; warnings?: string[]; error?: string }
  if (!r.ok || !json.path) throw new Error(json.error || 'Generation failed. Please try again.')
  return { path: json.path, warnings: json.warnings ?? [] }
}
