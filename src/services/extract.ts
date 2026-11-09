// Real text extraction for the formats the UI advertises: text-based PDF, plain text/Markdown, pasted text.
// Nothing here pretends to analyse a document: if text can't be read, the result says so.

import type { MaterialStatus } from '../store/schema'

export const ACCEPTED_EXTENSIONS = ['.pdf', '.txt', '.md']
export const ACCEPT_ATTR = '.pdf,.txt,.md,application/pdf,text/plain,text/markdown'
export const MAX_FILE_BYTES = 25 * 1024 * 1024

export interface Extraction {
  status: Exclude<MaterialStatus, 'extracting'>
  unit: 'page' | 'section'
  pages: string[]
  message?: string
}

const SECTION_CHARS = 3000

/** Splits plain text into numbered sections so citations can point somewhere specific. */
export function sectionText(text: string): string[] {
  const clean = text.replace(/\r\n?/g, '\n').trim()
  if (!clean) return []
  if (clean.includes('\f')) return clean.split('\f').map((p) => p.trim()).filter(Boolean)
  const paras = clean.split(/\n{2,}/)
  const out: string[] = []
  let cur = ''
  for (const p of paras) {
    if (cur && cur.length + p.length > SECTION_CHARS) {
      out.push(cur.trim())
      cur = ''
    }
    cur += (cur ? '\n\n' : '') + p
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

export function extractPlainText(text: string): Extraction {
  const pages = sectionText(text)
  if (!pages.length) return { status: 'empty', unit: 'section', pages: [], message: 'This text is empty, so there is nothing to study from yet.' }
  return { status: 'ready', unit: 'section', pages }
}

export function fileKind(file: { name: string; type: string }): 'pdf' | 'text' | 'unsupported' {
  const name = file.name.toLowerCase()
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (file.type.startsWith('text/plain') || file.type === 'text/markdown' || name.endsWith('.txt') || name.endsWith('.md')) return 'text'
  return 'unsupported'
}

/** Heuristic for scanned PDFs: pages exist but almost no extractable characters. */
export function looksScanned(pages: string[]): boolean {
  if (!pages.length) return false
  const chars = pages.reduce((n, p) => n + p.replace(/\s/g, '').length, 0)
  return chars / pages.length < 25
}

export async function extractFile(file: File): Promise<Extraction> {
  const kind = fileKind(file)
  if (kind === 'unsupported') {
    return { status: 'unsupported', unit: 'section', pages: [], message: `Rudra can read PDF (with selectable text), .txt and .md files. “${file.name}” isn’t one of those — try exporting it as a PDF or pasting the text.` }
  }
  if (file.size > MAX_FILE_BYTES) {
    return { status: 'error', unit: 'section', pages: [], message: 'This file is larger than 25 MB. Try splitting it into smaller parts.' }
  }
  if (kind === 'text') {
    const text = await file.text()
    if (text.includes('\u0000')) return { status: 'error', unit: 'section', pages: [], message: 'This file doesn’t look like plain text. It may be damaged or in another format.' }
    return extractPlainText(text)
  }
  return extractPdf(await file.arrayBuffer())
}

export async function extractPdf(data: ArrayBuffer): Promise<Extraction> {
  const pdfjs = await import('pdfjs-dist')
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  const task = pdfjs.getDocument({ data: new Uint8Array(data) })
  let doc
  try {
    doc = await task.promise
  } catch (err) {
    const name = (err as { name?: string })?.name
    if (name === 'PasswordException') return { status: 'error', unit: 'page', pages: [], message: 'This PDF is password-protected. Remove the password and upload it again.' }
    return { status: 'error', unit: 'page', pages: [], message: 'This PDF couldn’t be opened. It may be damaged or not really a PDF.' }
  }
  const pages: string[] = []
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      let text = ''
      for (const item of content.items) {
        if (!('str' in item)) continue
        text += item.str
        text += item.hasEOL ? '\n' : ' '
      }
      pages.push(text.replace(/[ \t]+\n/g, '\n').replace(/ {2,}/g, ' ').trim())
    }
  } catch {
    return { status: 'error', unit: 'page', pages: [], message: 'Part of this PDF couldn’t be read. It may be damaged.' }
  } finally {
    void task.destroy()
  }
  if (!pages.length || pages.every((p) => !p)) {
    return { status: 'needs-ocr', unit: 'page', pages, message: 'No selectable text was found. This looks like a scanned PDF, which needs text recognition (OCR) before Rudra can read it. The original is saved so you can still view it.' }
  }
  if (looksScanned(pages)) {
    return { status: 'needs-ocr', unit: 'page', pages, message: 'Very little text could be read — most pages appear to be scanned images. Run OCR on the file and upload it again for full results.' }
  }
  return { status: 'ready', unit: 'page', pages }
}
