import { useState } from 'react'
import { BOOKSHELF, ROTATIONS } from '../data/about'
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

const CJK = /[぀-ヿ㐀-鿿]/

// Finished books stand upright; the one being read leans at the end of the row.
const SHELF = [...BOOKSHELF.filter((b) => b.status !== 'reading'), ...BOOKSHELF.filter((b) => b.status === 'reading')]

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

function Tracklist() {
  return (
    <ol className="mat on-cream divide-y divide-action/15 px-5 py-2 md:px-6">
      {ROTATIONS.map((r, i) => {
        const lang = CJK.test(r.artist + r.note) ? 'zh-Hans' : undefined
        return (
          <li key={`${r.artist}-${r.note}`} lang={lang} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-x-2 py-2.5 sm:grid-cols-[1.75rem_minmax(0,1fr)_auto] sm:gap-x-4">
            <span className="tabnum text-[0.75rem] font-medium text-peri-deep">{String(i + 1).padStart(2, '0')}</span>
            <span className="truncate font-bold leading-snug text-action" title={r.note}>
              {r.note}
            </span>
            <span className="col-start-2 text-sm leading-snug text-peri-deep sm:col-start-auto sm:text-right">{r.artist}</span>
          </li>
        )
      })}
    </ol>
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
            Where I rest between climbs: the books, music and games that fill the hours after the laptop closes.
          </p>
        </div>

        <div className="mt-14 grid gap-16 md:mt-20 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-14">
          <div>
            <h3 className="mb-6 text-xl font-bold text-cream">On the shelf</h3>
            <Shelf />
          </div>
          <div>
            <h3 className="mb-6 text-xl font-bold text-cream">On repeat</h3>
            <Tracklist />
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
