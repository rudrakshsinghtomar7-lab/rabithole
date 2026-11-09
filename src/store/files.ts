// IndexedDB storage for uploaded originals and their extracted text.
// Structured app state lives in localStorage; binary files and long text live here.

const DB_NAME = 'rudra-files'
const DB_VERSION = 1
const FILES = 'files'
const TEXT = 'text'

export interface StoredFile {
  id: string
  name: string
  type: string
  blob: Blob
}

export interface StoredText {
  id: string
  pages: string[]
}

let dbPromise: Promise<IDBDatabase> | null = null

function open(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('File storage is not available in this browser.'))
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(FILES)) db.createObjectStore(FILES, { keyPath: 'id' })
      if (!db.objectStoreNames.contains(TEXT)) db.createObjectStore(TEXT, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => {
      dbPromise = null
      reject(req.error ?? new Error('Could not open file storage.'))
    }
  })
  return dbPromise
}

function tx<T>(store: string, mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode)
        const req = run(t.objectStore(store))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      }),
  )
}

export const fileStore = {
  putFile: (f: StoredFile) => tx(FILES, 'readwrite', (s) => s.put(f)),
  getFile: (id: string) => tx<StoredFile | undefined>(FILES, 'readonly', (s) => s.get(id)),
  putText: (t: StoredText) => tx(TEXT, 'readwrite', (s) => s.put(t)),
  getText: (id: string) => tx<StoredText | undefined>(TEXT, 'readonly', (s) => s.get(id)),
  async remove(id: string) {
    await tx(FILES, 'readwrite', (s) => s.delete(id))
    await tx(TEXT, 'readwrite', (s) => s.delete(id))
  },
}
