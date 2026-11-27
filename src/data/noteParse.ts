// Parsing for note markdown files. Plain functions with no Vite or DOM types,
// so vite.config.ts can run them at build time to compute each note's metadata
// (see `notesMeta` there) and the app can use the same rules at runtime.

export type NoteMeta = {
  slug: string
  /** The file's path relative to src/data, the key its body loads by. */
  path: string
  title: string
  date: string
  dek?: string
  kind: 'essay' | 'story'
  series?: string
  part?: number
  form?: 'poem'
  /** The card's ornament: `mark:` in the front matter, else the first scene-break ornament in the body. */
  mark?: string
  draft: boolean
  minutes: number
}

const FRONT = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

// Quotes and CJK sentence punctuation mark a line of dialogue, never an ornament.
export const isOrnament = (block: string) =>
  /\S/.test(block) && !block.includes('\n') && !/[A-Za-z0-9>#*`[\-"'“”‘’「」『』。，、？！：；]/.test(block)

/** The markdown after the front matter. */
export const bodyOf = (raw: string) => (raw.match(FRONT)?.[2] ?? raw).trim()

/** `path` is relative to src/data, e.g. ../content/notes/a-sea-of-stars.md. */
export function parseNote(path: string, raw: string): NoteMeta {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const m = raw.match(FRONT)
  const meta: Record<string, string> = {}
  if (m) {
    for (const line of m[1].split(/\r?\n/)) {
      const kv = line.match(/^(\w+):\s*(.*?)\s*$/)
      if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, '')
    }
  }
  const body = bodyOf(raw)
  const words = body.split(/\s+/).filter(Boolean).length
  const mark = body.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).find(isOrnament)
  return {
    slug,
    path,
    title: meta.title || slug,
    date: meta.date || '',
    dek: meta.dek || undefined,
    kind: meta.kind === 'story' ? 'story' : 'essay',
    series: meta.series || undefined,
    part: meta.part ? Number(meta.part) : undefined,
    form: meta.form === 'poem' ? 'poem' : undefined,
    mark: meta.mark || mark,
    draft: path.includes('/drafts/'),
    minutes: Math.max(1, Math.round(words / 230)),
  }
}
