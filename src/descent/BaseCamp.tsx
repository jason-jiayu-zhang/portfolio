import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ESSAYS, SERIES, SHORTS, formatDate } from '../data/notes'
import { BOOKSHELF } from '../data/about'
import Edge from './Edge'
import GameRoutes from './GameRoutes'
import { STRATA } from './terrain'

// Spine fills cycle through the landscape palette; ink flips with the fill.
// Nothing as dark as the band itself, so every spine stands off the ground.
const SPINES = [
  { fill: 'bg-sand', ink: 'text-night' },
  { fill: 'bg-peri-deep', ink: 'text-cream' },
  { fill: 'bg-cream', ink: 'text-action' },
  { fill: 'bg-mist', ink: 'text-night' },
  { fill: 'bg-tan', ink: 'text-night' },
  { fill: 'bg-peri', ink: 'text-night' },
  { fill: 'bg-action', ink: 'text-cream' },
  { fill: 'bg-cream', ink: 'text-night' },
]
// Hand-set thickness and height jitter so the row reads as real books, not bars.
const WIDTH = [3.1, 2.5, 2.3, 2.7, 2.0, 2.4, 2.2, 2.6]
const JITTER = [0.3, -0.4, 0.6, -0.2, 0.9, 0, -0.5, 0.4]

// Finished books stand upright; the one being read leans at the end of the row.
const SHELF = [...BOOKSHELF.filter((b) => b.status !== 'reading'), ...BOOKSHELF.filter((b) => b.status === 'reading')]

// Notes are trails out of camp, not books on the shelf: arrow boards on a
// trailhead post, newest on top. Title, date and length stay on the board, so
// nothing hides behind hover. Past four, the last board points to the rest.
const TRAILS_SHOWN = 4
const TILT = [-1.2, 0.9, -0.6, 1.1]

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
      <path d="M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5" />
    </svg>
  )
}

function Trailhead() {
  const shown = ESSAYS.length > TRAILS_SHOWN ? ESSAYS.slice(0, TRAILS_SHOWN - 1) : ESSAYS
  const more = ESSAYS.length - shown.length
  return (
    <div className="relative max-w-[36rem] pl-6 md:pl-8">
      {/* The post: sand-lit face, tan shade, standing in a scrape of ground */}
      <span aria-hidden className="absolute bottom-0 left-0 top-0 flex w-2.5 md:left-1">
        <span className="w-1/2 bg-sand" />
        <span className="w-1/2 bg-tan" />
      </span>
      <p className="tabnum relative -ml-6 mb-5 inline-flex items-center gap-2 bg-peri-deep px-3 py-1 text-sm text-paper md:-ml-7">
        Trailhead at <span className="font-bold text-cream">700 m</span>
      </p>
      <ul className="space-y-3 pb-10" aria-label="Notes">
        {shown.map((n, i) => (
          <li key={n.slug} className="trail-board-wrap" style={{ ['--tilt' as string]: `${TILT[i % TILT.length]}deg` }}>
            <Link viewTransition to={`/notes/${n.slug}`} className="trail-board group grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 bg-cream py-3 pl-5 pr-10 text-action md:pr-12">
              <span className="min-w-0">
                <span className="block text-[1.05rem] font-bold leading-snug decoration-1 underline-offset-[0.3em] group-hover:underline group-focus-visible:underline md:text-lg">{n.title}</span>
                <span className="tabnum mt-0.5 block text-sm text-peri-deep">{formatDate(n.date)}</span>
              </span>
              <span className="tabnum flex items-center gap-1.5 whitespace-nowrap text-night">
                <span className="text-lg font-black tracking-[-0.02em]">{n.minutes}</span>
                <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-peri-deep">min</span>
                <Arrow className="ml-1 h-4 w-4 text-action" />
              </span>
            </Link>
          </li>
        ))}
        {more > 0 && (
          <li className="trail-board-wrap" style={{ ['--tilt' as string]: '0.4deg' }}>
            <Link viewTransition to="/notes" className="trail-board flex min-h-11 items-center gap-2 bg-sand py-3 pl-5 pr-10 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-night">
              {more} more {more === 1 ? 'essay' : 'essays'}
              <Arrow className="h-4 w-4" />
            </Link>
          </li>
        )}
      </ul>
      <span aria-hidden className="absolute -left-3 bottom-0 h-1 w-16 bg-sand/60 md:-left-2" />
    </div>
  )
}

function Shelf() {
  const reading = SHELF.findIndex((b) => b.status === 'reading')
  const [active, setActive] = useState(reading === -1 ? 0 : reading)
  const book = SHELF[active]

  return (
    <div>
      <ul className="flex h-[16.5rem] items-end gap-[3px] pr-10 md:gap-1" aria-label="Books">
        {SHELF.map((b, i) => {
          const s = SPINES[i % SPINES.length]
          const lean = b.status === 'reading'
          const h = 11 + Math.min(b.title.length, 26) * 0.16 + JITTER[i % JITTER.length]
          return (
            <li
              key={b.title}
              className={`flex min-w-[1.75rem] ${lean ? 'ml-6 md:ml-8' : ''}`}
              style={{ flex: `0 1 ${WIDTH[i % WIDTH.length]}rem` }}
            >
              <button
                type="button"
                data-active={i === active}
                data-lean={lean}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`spine relative w-full overflow-hidden ${s.fill} ${s.ink}`}
                style={{ height: `${h}rem` }}
              >
                <span aria-hidden className="absolute inset-x-1.5 top-3 border-t border-current opacity-30" />
                <span aria-hidden className="absolute inset-x-1.5 bottom-3.5 border-t border-current opacity-30" />
                <span className="spine-title absolute inset-x-0 top-6 mx-auto text-[0.72rem] font-bold leading-none tracking-[0.02em] md:text-[0.78rem]">
                  {b.title}
                </span>
                <span className="sr-only-x">
                  , {b.author}. {b.category}.{lean ? ' Reading now.' : ''}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {/* The ledge's front lip sits in front of the spines' feet, so a picked book
          slides up from behind it. Lit face and shaded underside, as on the sand ridge. */}
      <div aria-hidden className="relative z-10 -mt-3">
        <div className="h-3 bg-sand" />
        <div className="h-1.5 bg-tan" />
      </div>
      <p aria-hidden className="mt-5 min-h-[3.5rem]">
        <span className="font-bold text-cream">{book.title}</span>
        <span className="text-mist"> · {book.author}</span>
        <br />
        <span className="text-sm text-sand">{book.category}</span>
        {book.status === 'reading' && (
          <span className="ml-3 inline-block bg-tan px-2.5 py-1 align-[0.1em] text-[0.62rem] font-bold uppercase leading-none tracking-[0.12em] text-night">
            Reading now
          </span>
        )}
      </p>
    </div>
  )
}

// Base camp sits below the lake: where the climber rests between ascents.
export default function BaseCamp() {
  return (
    <section id="base-camp" tabIndex={-1} aria-labelledby="camp-h" data-alt={700} className="relative z-[32] outline-none" style={{ background: STRATA.camp }}>
      <Edge kind="camp" />
      <div className="band-inner pb-32 pt-14 md:pb-48 md:pt-16">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="camp-h" className="wordmark !text-cream text-[clamp(3.5rem,9vw,7.5rem)]">
            Base Camp
          </h2>
          <p className="max-w-[40ch] text-lg text-mist md:justify-self-end md:text-right">
            Where I rest between climbs: the books and games that fill the hours after the laptop closes.
          </p>
        </div>

        <div className="mt-14 grid gap-20 md:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          {ESSAYS.length > 0 && (
            <div>
              <h3 className="mb-6 text-xl font-bold text-cream">Notes from camp</h3>
              <Trailhead />
              {SERIES.length + SHORTS.length > 0 && (
                <Link viewTransition to="/notes#stories" className="mt-6 inline-flex min-h-11 items-center text-cream underline decoration-1 underline-offset-[0.35em] hover:text-white">
                  Short stories
                </Link>
              )}
            </div>
          )}
          <div className="max-w-[40rem]">
            <h3 className="mb-6 text-xl font-bold text-cream">On the shelf</h3>
            <Shelf />
          </div>
        </div>

        <div className="mt-20 md:mt-24">
          <h3 className="mb-6 text-xl font-bold text-cream md:mb-8">On the server</h3>
          <GameRoutes />
        </div>
      </div>
    </section>
  )
}
