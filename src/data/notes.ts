// Notes are markdown files in src/content/notes. The file name is the slug.
//
// ---
// title: On starting at the top
// date: 2026-11-01
// dek: One line that sits under the title on the note's page. (optional)
// mark: ⚞ 日 ⚟   The ornament on the note's card. (optional)
// ---
//
// Stories add `kind: story`. A story in parts adds a `series` name and a `part`
// number; a series is listed together in part order and each part links to the
// next. A story without a series stands alone. `form: poem` keeps line breaks.
//
// Drafts go in src/content/notes/drafts. They show in `npm run dev` only and
// are left out of the production bundle entirely.
//
// Body in markdown: paragraphs, ## and ### headings, > quotes, - and 1. lists,
// --- rules, **bold**, *italic*, `code` and [links](https://…). A one-line block
// with no Latin letters or digits (a scene-break ornament like ☾ 月 ☽) is set centred.

import { bodyOf, type NoteMeta } from './noteParse'

export { isOrnament } from './noteParse'
export type Note = NoteMeta

// Only each note's metadata ships with the app: the `notes-meta` plugin in
// vite.config.ts parses every file at build time, so the home page's trailhead
// never carries story text. Bodies load on demand when a note is opened.
const published = import.meta.glob('../content/notes/*.md', { query: '?meta', import: 'default', eager: true }) as Record<string, Note>
const drafts = import.meta.env.DEV
  ? (import.meta.glob('../content/notes/drafts/*.md', { query: '?meta', import: 'default', eager: true }) as Record<string, Note>)
  : {}

type Loader = () => Promise<string>
const bodies: Record<string, Loader> = {
  ...(import.meta.glob('../content/notes/*.md', { query: '?raw', import: 'default' }) as Record<string, Loader>),
  ...(import.meta.env.DEV ? (import.meta.glob('../content/notes/drafts/*.md', { query: '?raw', import: 'default' }) as Record<string, Loader>) : {}),
}

/** The note's markdown body, fetched on first read. */
export const loadBody = (note: Note) => bodies[note.path]().then(bodyOf)

export const NOTES: Note[] = Object.values({ ...published, ...drafts })
  .sort((a, b) => b.date.localeCompare(a.date))

/** Essays, newest first. */
export const ESSAYS = NOTES.filter((n) => n.kind === 'essay')

/** Stories in parts, grouped by series, each series in part order. */
export const SERIES: { name: string; parts: Note[] }[] = Object.values(
  NOTES.filter((n) => n.kind === 'story' && n.series).reduce<Record<string, { name: string; parts: Note[] }>>((acc, n) => {
    const name = n.series!
    ;(acc[name] ??= { name, parts: [] }).parts.push(n)
    return acc
  }, {}),
).map((s) => ({ ...s, parts: s.parts.sort((a, b) => (a.part ?? 0) - (b.part ?? 0)) }))

/** Stories that stand alone, newest first (undated last). */
export const SHORTS = NOTES.filter((n) => n.kind === 'story' && !n.series)

const fmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
export const formatDate = (iso: string) => (iso ? fmt.format(new Date(`${iso}T00:00:00Z`)) : '')
