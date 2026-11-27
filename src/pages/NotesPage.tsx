import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { Contact, FloorFooter } from '../descent/Valley'
import { Ornament } from '../components/Markdown'
import { ESSAYS, SERIES, SHORTS, type Note } from '../data/notes'

// A series reads from day into night: each part takes the next, darker paper,
// and the panels butt together into one strip.
const PANELS = [
  { fill: 'bg-cream', ink: 'text-action', sub: 'text-peri-deep', mark: 'text-tan' },
  { fill: 'bg-mist', ink: 'text-night', sub: 'text-action', mark: 'text-peri-deep' },
  { fill: 'bg-peri-deep', ink: 'text-cream', sub: 'text-mist', mark: 'text-sand' },
  { fill: 'bg-action', ink: 'text-cream', sub: 'text-mist', mark: 'text-sand' },
]

// Pieces that stand alone use the same papers, but each card keeps one paper
// by kind and stands apart from its neighbours, so no order is implied.
const KIND = { essay: PANELS[0], story: PANELS[1], poem: PANELS[2] }

const kindOf = (n: Note) => (n.form === 'poem' ? KIND.poem : n.kind === 'essay' ? KIND.essay : KIND.story)

function Draft() {
  return <span className="ml-3 align-middle bg-tan px-2 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-night">Draft</span>
}

// Every card carries its ornament, the title and how long it takes.
function Card({ n }: { n: Note }) {
  const k = kindOf(n)
  return (
    <li className="flex">
      <Link
        viewTransition
        to={`/notes/${n.slug}`}
        className={`studio-piece group flex w-full flex-col justify-between gap-10 p-6 md:min-h-[15rem] md:p-7 ${k.fill} ${k.ink}`}
      >
        {n.mark ? <Ornament text={n.mark} className={`self-start text-2xl ${k.mark}`} /> : <span />}
        <span>
          <span className="block text-2xl font-bold leading-tight decoration-1 underline-offset-[0.3em] group-hover:underline group-focus-visible:underline">
            {n.title}
            {n.draft && <Draft />}
          </span>
          <span className={`tabnum mt-2 block text-sm ${k.sub}`}>{n.minutes} min read</span>
        </span>
      </Link>
    </li>
  )
}

const cards = 'mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'

export default function NotesPage() {
  const { hash } = useLocation()
  useEffect(() => {
    document.title = 'Field Notes — Jason Jiayu Zhang'
  }, [])
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <div className="min-h-screen">
      <Header label="Field Notes" />
      <main id="main" tabIndex={-1} className="outline-none mx-auto max-w-[1080px] px-5 pt-[7.5rem] md:px-8 md:pt-[9.5rem] lg:px-0">
        <h1 className="wordmark !text-sand text-[clamp(3.2rem,9vw,7rem)]">Field Notes</h1>

        {ESSAYS.length > 0 && (
          <section aria-labelledby="essays-h" className="mt-16 md:mt-20">
            <h2 id="essays-h" className="text-2xl font-bold text-cream md:text-[1.875rem]">Essays</h2>
            <ol className={cards}>
              {ESSAYS.map((n) => (
                <Card key={n.slug} n={n} />
              ))}
            </ol>
          </section>
        )}

        {(SERIES.length > 0 || SHORTS.length > 0) && (
          <section id="stories" aria-labelledby="stories-h" className="mt-20 scroll-mt-24 md:mt-28">
            <h2 id="stories-h" className="text-2xl font-bold text-cream md:text-[1.875rem]">Stories</h2>
            {SERIES.map((s) => (
              <div key={s.name} className="mt-6">
                <h3 className="text-lg font-bold text-cream">{s.name}</h3>
                <ol className="mt-6 grid gap-3 md:grid-cols-3 md:gap-0">
                  {s.parts.map((n, i) => {
                    const p = PANELS[Math.min(i, PANELS.length - 1)]
                    return (
                      <li key={n.slug} className="flex">
                        <Link
                          viewTransition
                          to={`/notes/${n.slug}`}
                          className={`studio-piece group flex w-full flex-col justify-between gap-10 p-6 md:min-h-[17rem] md:p-7 ${p.fill} ${p.ink}`}
                        >
                          <Ornament text={n.mark ?? '·'} className={`self-start text-2xl ${p.mark}`} />
                          <span>
                            <span className={`tabnum block text-sm ${p.sub}`}>Part {n.part ?? i + 1}</span>
                            <span className="mt-1 block text-2xl font-bold leading-tight decoration-1 underline-offset-[0.3em] group-hover:underline group-focus-visible:underline">
                              {n.title}
                              {n.draft && <Draft />}
                            </span>
                            <span className={`tabnum mt-2 block text-sm ${p.sub}`}>{n.minutes} min read</span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
            {SHORTS.length > 0 && (
              <div className={SERIES.length > 0 ? 'mt-14' : 'mt-6'}>
                <h3 className="text-lg font-bold text-cream">Standalone</h3>
                <ol className={cards}>
                  {SHORTS.map((n) => (
                    <Card key={n.slug} n={n} />
                  ))}
                </ol>
              </div>
            )}
          </section>
        )}
      </main>
      <div className="mt-40 md:mt-56">
        <Contact />
      </div>
      <FloorFooter />
    </div>
  )
}
