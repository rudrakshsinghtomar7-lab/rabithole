// Optional generation server for Rudra. Without ANTHROPIC_API_KEY the app still works fully
// with prepared paths and the sample course; /api/status simply reports "not configured".
//
//   ANTHROPIC_API_KEY=... npm run server     (listens on :8790; Vite proxies /api in dev)

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { generatePath, isConfigured, type GenerateRequest } from './generate.ts'

const PORT = Number(process.env.PORT || 8790)
const MAX_BODY = 8 * 1024 * 1024

function send(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) throw new Error('Request too large')
    chunks.push(chunk as Buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function validRequest(b: unknown): b is GenerateRequest {
  if (typeof b !== 'object' || !b) return false
  const r = b as Record<string, unknown>
  if (r.kind === 'goal') return typeof r.goal === 'string' && r.goal.trim().length > 2
  if (r.kind === 'course') return typeof r.courseId === 'string' && typeof r.courseName === 'string' && Array.isArray(r.materials) && r.materials.length > 0
  return false
}

createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/status') return send(res, 200, { configured: isConfigured() })
    if (req.method === 'POST' && req.url === '/api/generate') {
      if (!isConfigured()) return send(res, 503, { error: 'Personalised generation is not configured on this server.' })
      const body = await readJson(req)
      if (!validRequest(body)) return send(res, 400, { error: 'Invalid request.' })
      const result = await generatePath(body)
      return send(res, 200, result)
    }
    send(res, 404, { error: 'Not found' })
  } catch (err) {
    console.error(err)
    send(res, 500, { error: err instanceof Error ? err.message : 'Generation failed.' })
  }
}).listen(PORT, () => console.log(`Rudra generation server on :${PORT} (configured: ${isConfigured()})`))
