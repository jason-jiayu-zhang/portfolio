import { useEffect } from 'react'
import { Link, useLoaderData, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { Contact, FloorFooter } from '../descent/Valley'
import Markdown from '../components/Markdown'
import NotFoundPage from './NotFoundPage'
import { ESSAYS, NOTES, SERIES, SHORTS, formatDate, type Note } from '../data/notes'

type Neighbour = { note: Note; label: string }

// Essays step to the next older or newer essay; story parts step through their series.
function neighbours(note: Note): [Neighbour | undefined, Neighbour | undefined] {
  if (note.kind === 'story' && !note.series) {
    const i = SHORTS.indexOf(note)
    return [SHORTS[i - 1] && { note: SHORTS[i - 1], label: 'Previous story' }, SHORTS[i + 1] && { note: SHORTS[i + 1], label: 'Next story' }]
  }
  if (note.kind === 'story') {
    const parts = SERIES.find((s) => s.parts.includes(note))?.parts ?? []
    const i = parts.indexOf(note)
    const prev = parts[i - 1]
    const next = parts[i + 1]
    return [
      prev && { note: prev, label: `Part ${prev.part ?? i}` },
      next && { note: next, label: `Part ${next.part ?? i + 2}` },
    ]
  }
  const i = ESSAYS.indexOf(note)
  return [ESSAYS[i + 1] && { note: ESSAYS[i + 1], label: 'Older' }, ESSAYS[i - 1] && { note: ESSAYS[i - 1], label: 'Newer' }]
}

export default function NotePage() {
  const { slug } = useParams<{ slug: string }>()
  const note = NOTES.find((n) => n.slug === slug)
  // The route loader fetches the text before the page shows (see router.tsx).
  const body = useLoaderData() as string | null
  useEffect(() => {
    if (note) document.title = `${note.title} — Field Notes — Jason Jiayu Zhang`
  }, [note])
  if (!note) return <NotFoundPage />
  const [back, forward] = neighbours(note)
  const story = note.kind === 'story'
  const series = story ? SERIES.find((s) => s.parts.includes(note)) : undefined
  const meta = [
    story && series ? `Part ${note.part ?? series.parts.indexOf(note) + 1} of ${series.name}` : '',
    note.form === 'poem' ? 'Poem' : '',
    formatDate(note.date),
    note.form === 'poem' ? '' : `${note.minutes} min read`,
    note.draft ? 'Draft (hidden in production)' : '',
  ].filter(Boolean)

  return (
    <div className="min-h-screen">
      <Header label={story ? 'Field Notes · Stories' : 'Field Notes'} />
      <main id="main" tabIndex={-1} className="outline-none mx-auto max-w-[1080px] px-5 pt-[7.5rem] md:px-8 md:pt-[9.5rem] lg:px-0">
        <Link viewTransition to={story ? '/notes#stories' : '/notes'} className="text-sm text-mist underline underline-offset-[0.3em] hover:text-cream">
          {story ? 'All stories' : 'All notes'}
        </Link>
        <article className="mt-6">
          <header>
            <h1 className="max-w-[22ch] text-4xl font-black leading-[1.02] tracking-[-0.03em] text-cream md:text-6xl">{note.title}</h1>
            {note.dek && <p className="mt-5 max-w-[52ch] text-lg text-paper md:text-xl">{note.dek}</p>}
            <p className="tabnum mt-5 text-sm text-mist">{meta.join(' · ')}</p>
          </header>
          <div className="mt-12 max-w-[68ch] space-y-5 text-[1.0625rem] leading-[1.75] text-paper md:text-lg">
            <Markdown source={body ?? ''} verse={note.form === 'poem'} />
          </div>
        </article>

        {(back || forward) && (
          <nav aria-label={story ? `More of ${series?.name ?? 'this story'}` : 'More notes'} className="mt-20 flex justify-between gap-6 border-t border-sand/25 pt-6">
            {back ? (
              <Link viewTransition to={`/notes/${back.note.slug}`} className="group text-left">
                <span className="block text-xs text-mist">{back.label}</span>
                <span className="text-lg font-bold text-cream group-hover:underline">{back.note.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {forward && (
              <Link viewTransition to={`/notes/${forward.note.slug}`} className="group text-right">
                <span className="block text-xs text-mist">{forward.label}</span>
                <span className="text-lg font-bold text-cream group-hover:underline">{forward.note.title}</span>
              </Link>
            )}
          </nav>
        )}
      </main>
      <div className="mt-40 md:mt-56">
        <Contact />
      </div>
      <FloorFooter />
    </div>
  )
}
