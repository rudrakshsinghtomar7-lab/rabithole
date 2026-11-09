import { describe, expect, it } from 'vitest'
import type { Path } from '../content/types'
import { checkRef, enforceCitations } from './citations'
import { extractPlainText, fileKind, looksScanned, sectionText } from '../services/extract'

const index = { a: { pageCount: 3, readable: true }, scanned: { pageCount: 2, readable: false } }

describe('citation checks', () => {
  it('accepts real pages and rejects unknown files, bad pages and unreadable files', () => {
    expect(checkRef({ sourceId: 'a', page: 3 }, index)).toBeNull()
    expect(checkRef({ sourceId: 'a' }, index)).toBeNull()
    expect(checkRef({ sourceId: 'a', page: 4 }, index)).toBe('page-out-of-range')
    expect(checkRef({ sourceId: 'a', page: 0 }, index)).toBe('page-out-of-range')
    expect(checkRef({ sourceId: 'a', page: 1.5 }, index)).toBe('page-out-of-range')
    expect(checkRef({ sourceId: 'zzz', page: 1 }, index)).toBe('unknown-source')
    expect(checkRef({ sourceId: 'scanned', page: 1 }, index)).toBe('unreadable-source')
  })

  it('strips invalid citations and downgrades uncited "course" reels to supplementary', () => {
    const path: Path = {
      id: 'p', title: 'p', origin: 'generated', courseId: 'c', description: '', sources: [],
      modules: [{ id: 'm', title: 'm', summary: '', topics: [{ id: 't', title: 't', objective: 'o', quiz: [], reels: [
        { id: 'r1', kind: 'explain', title: 'ok', body: [], visual: { motif: 'grid' }, origin: 'course', sources: [{ sourceId: 'a', page: 2 }] },
        { id: 'r2', kind: 'explain', title: 'fake', body: [], visual: { motif: 'grid' }, origin: 'course', sources: [{ sourceId: 'a', page: 99 }, { sourceId: 'ghost' }] },
      ] }] }],
    }
    const { path: clean, issues } = enforceCitations(path, index)
    expect(issues).toHaveLength(2)
    const [r1, r2] = clean.modules[0].topics[0].reels
    expect(r1.origin).toBe('course')
    expect(r2.origin).toBe('supplementary')
    expect(r2.sources).toEqual([])
  })
})

describe('text extraction helpers', () => {
  it('splits long text into sections and keeps form-feed page breaks', () => {
    const long = Array.from({ length: 40 }, (_, i) => `Paragraph ${i} `.repeat(20)).join('\n\n')
    expect(sectionText(long).length).toBeGreaterThan(1)
    expect(sectionText('page one\fpage two\f')).toEqual(['page one', 'page two'])
  })

  it('reports empty text honestly', () => {
    expect(extractPlainText('   \n  ').status).toBe('empty')
    expect(extractPlainText('Hello world').status).toBe('ready')
  })

  it('recognises supported and unsupported formats', () => {
    expect(fileKind({ name: 'notes.PDF', type: '' })).toBe('pdf')
    expect(fileKind({ name: 'a.md', type: '' })).toBe('text')
    expect(fileKind({ name: 'a.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })).toBe('unsupported')
    expect(fileKind({ name: 'scan.png', type: 'image/png' })).toBe('unsupported')
  })

  it('flags image-only PDFs as needing OCR', () => {
    expect(looksScanned(['', ' ', '3'])).toBe(true)
    expect(looksScanned(['A real page of lecture notes about supply and demand.'])).toBe(false)
  })
})
