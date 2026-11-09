// Turns a learning goal or extracted course material into a structured Rudra path using Claude.
// Runs server-side only; the API key never reaches the browser.

import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import type { Path, Question, Reel } from '../src/content/types.ts'
import { enforceCitations, type MaterialIndex } from '../src/learning/citations.ts'

const MODEL = process.env.RUDRA_MODEL || 'claude-opus-5-5'

const motif = z.enum(['ship', 'figure', 'mirror', 'branch', 'scales', 'columns', 'arch', 'timeline', 'tablets', 'dominoes', 'target', 'arrow', 'grid', 'stack', 'curve'])

const GenOption = z.object({ text: z.string(), feedback: z.string() })
const GenQuestion = z.object({
  conceptId: z.string().describe('kebab-case concept identifier, shared by questions that test the same idea'),
  skill: z.enum(['recognise', 'apply', 'reason']),
  prompt: z.string(),
  options: z.array(GenOption).describe('3–4 plausible options; distractors should reflect real misconceptions'),
  correctIndex: z.number().int(),
  explanation: z.string(),
  reelIndex: z.number().int().describe('index of the reel in this topic that teaches the concept'),
  fresh: z.object({ prompt: z.string(), options: z.array(GenOption), correctIndex: z.number().int(), explanation: z.string() }).describe('a different question testing the same concept'),
})
const GenSource = z.object({ materialId: z.string(), page: z.number().int().describe('1-based page/section number from the provided material') })
const GenReel = z.object({
  kind: z.enum(['hook', 'context', 'explain', 'example', 'complication', 'reflect']),
  title: z.string(),
  body: z.array(z.string()).describe('1–3 short paragraphs'),
  motif,
  origin: z.enum(['course', 'supplementary']).describe('course = directly supported by provided material; supplementary = added explanation'),
  sources: z.array(GenSource),
})
const GenTopic = z.object({
  title: z.string(),
  objective: z.string(),
  prerequisite: z.string(),
  reels: z.array(GenReel).describe('3–5 reels: hook, explanation, worked example, complication'),
  quiz: z.array(GenQuestion).describe('exactly 3: recognise, apply, reason'),
  nextStep: z.string(),
})
const GenPath = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.array(z.object({ title: z.string(), summary: z.string(), topics: z.array(GenTopic).describe('3–4 small topics') })).describe('1–3 modules'),
})
type GenPathT = z.infer<typeof GenPath>

export interface MaterialInput {
  id: string
  name: string
  kind: string
  unit: 'page' | 'section'
  pages: string[]
}

export type GenerateRequest =
  | { kind: 'goal'; goal: string; familiarity: 'new' | 'some' }
  | { kind: 'course'; courseId: string; courseName: string; materials: MaterialInput[] }

const SYSTEM = `You design short, rigorous learning paths for Rudra, a study app.
Structure: modules → small topics → 3–5 reels → a 3-question checkpoint quiz.
Each topic needs a clear objective, prerequisite context, an explanation, a worked example, and a complication or contrasting case.
Quiz questions check (1) recognising or distinguishing concepts, (2) applying to a new example, (3) reasoning about assumptions. Distractors must be plausible and each option needs specific feedback.
Write in plain, warm, precise English. No filler.`

function coursePrompt(req: Extract<GenerateRequest, { kind: 'course' }>): string {
  const docs = req.materials
    .map((m) => `<material id="${m.id}" name="${m.name}" kind="${m.kind}">\n${m.pages.map((p, i) => `<${m.unit} n="${i + 1}">\n${p}\n</${m.unit}>`).join('\n')}\n</material>`)
    .join('\n\n')
  return `Course: ${req.courseName}

${docs}

Build a learning path for this course from the material above, organised the way the syllabus organises it where possible.
Rules for sources:
- Cite only material ids and ${'page/section'} numbers that appear above. Never invent a citation.
- Mark a reel origin "course" only when its content is supported by the cited pages; otherwise mark it "supplementary" and say so in the text.
- If the material is thin, produce fewer topics rather than padding.`
}

function goalPrompt(req: Extract<GenerateRequest, { kind: 'goal' }>): string {
  return `Learner goal: ${req.goal}
Familiarity: ${req.familiarity === 'new' ? 'new to this subject' : 'has some background'}

Build a learning path for this goal. No source material was provided, so every reel is "supplementary" with an empty sources list. Don't claim specific statistics, dates or quotations you are unsure of.`
}

export function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)
}

export async function generatePath(req: GenerateRequest): Promise<{ path: Path; warnings: string[] }> {
  const client = new Anthropic()
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: zodOutputFormat(GenPath) },
    system: SYSTEM,
    messages: [{ role: 'user', content: req.kind === 'course' ? coursePrompt(req) : goalPrompt(req) }],
  })
  const message = await stream.finalMessage()
  if (message.stop_reason === 'refusal') throw new Error('The request was declined by the model.')
  if (message.stop_reason === 'max_tokens') throw new Error('The generated path was too long and got cut off. Try fewer materials.')
  const text = message.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('')
  const gen = GenPath.parse(JSON.parse(text))
  return toPath(gen, req)
}

function toPath(gen: GenPathT, req: GenerateRequest): { path: Path; warnings: string[] } {
  const pid = `gen-${Date.now().toString(36)}`
  const warnings: string[] = []
  const path: Path = {
    id: pid,
    title: gen.title,
    origin: 'generated',
    courseId: req.kind === 'course' ? req.courseId : undefined,
    description: gen.description,
    sources: req.kind === 'course' ? req.materials.map((m) => ({ id: m.id, title: m.name, kind: 'course-doc' as const })) : [],
    modules: gen.modules.map((m, mi) => ({
      id: `${pid}-m${mi}`,
      title: m.title,
      summary: m.summary,
      topics: m.topics.map((t, ti) => {
        const tid = `${pid}-m${mi}-t${ti}`
        const reels: Reel[] = t.reels.map((r, ri) => ({
          id: `${tid}-r${ri}`,
          kind: r.kind,
          title: r.title,
          body: r.body,
          visual: { motif: r.motif },
          origin: req.kind === 'course' ? r.origin : 'supplementary',
          sources: req.kind === 'course' ? r.sources.map((s) => ({ sourceId: s.materialId, page: s.page })) : [],
        }))
        const quiz: Question[] = t.quiz.slice(0, 3).map((q, qi) => {
          const qid = `${tid}-q${qi}`
          const reelId = reels[Math.min(Math.max(q.reelIndex, 0), reels.length - 1)]?.id ?? reels[0].id
          const opts = q.options.map((o, oi) => ({ id: String.fromCharCode(97 + oi), text: o.text, feedback: o.feedback }))
          const fopts = q.fresh.options.map((o, oi) => ({ id: String.fromCharCode(97 + oi), text: o.text, feedback: o.feedback }))
          return {
            id: qid, type: 'choice', conceptId: `${pid}-${q.conceptId}`, skill: q.skill, prompt: q.prompt, reelId, explanation: q.explanation,
            options: opts, correctId: opts[clamp(q.correctIndex, opts.length)].id,
            fresh: { id: `${qid}f`, type: 'choice', conceptId: `${pid}-${q.conceptId}`, skill: q.skill, prompt: q.fresh.prompt, reelId, explanation: q.fresh.explanation, options: fopts, correctId: fopts[clamp(q.fresh.correctIndex, fopts.length)].id },
          }
        })
        return { id: tid, title: t.title, objective: t.objective, prerequisite: t.prerequisite, nextStep: t.nextStep, reels, quiz }
      }),
    })),
  }
  if (req.kind === 'course') {
    const index: MaterialIndex = Object.fromEntries(req.materials.map((m) => [m.id, { pageCount: m.pages.length, readable: true }]))
    const { path: cleaned, issues } = enforceCitations(path, index)
    for (const i of issues) warnings.push(`Removed a citation in “${i.where}” (${i.problem === 'unknown-source' ? 'unknown file' : 'page not found'}).`)
    return { path: cleaned, warnings }
  }
  return { path, warnings }
}

const clamp = (i: number, n: number) => Math.min(Math.max(0, i), n - 1)
