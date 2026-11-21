import { Link } from 'react-router-dom'
import { EXPERIMENTS } from '../data/portfolio'
import Edge from './Edge'

// Studio sits at the treeline: three columns that step down the slope, so the
// pieces read as a stand of trees rather than a grid of equal tiles.
// Each shape with its height as a fraction of its width.
const SHAPES = [
  { cls: 'aspect-[4/5]', h: 1.25 },
  { cls: 'aspect-[4/3]', h: 0.75 },
  { cls: 'aspect-square', h: 1 },
  { cls: 'aspect-[3/4]', h: 1.333 },
  { cls: 'aspect-[5/4]', h: 0.8 },
]
const FIXED = 80 // px per piece that does not scale with width: mat padding, caption, gap
const FRAME = 16 // px the mat padding takes off the image width
const STEP = 96 // px each column ends below the one to its left
const TYPICAL_COL = 340 // px, only used to pick the reference column

type Piece = (typeof EXPERIMENTS)[number] & { shape: string; cover: number }

// Square sources at 480 / 720 px (`<name>-<w>.webp`) plus the 1024 original.
// object-cover scales a square to the frame's longer side, so a tall frame
// needs a source `cover` (= height / width) times wider than the frame.
function srcSet(imageUrl: string) {
  const base = imageUrl.replace(/\.webp$/, '')
  return `${base}-480.webp 480w, ${base}-720.webp 720w, ${imageUrl} 1024w`
}
function sizes(cover: number) {
  const k = cover.toFixed(3)
  return `(min-width: 1024px) calc((min(100vw, 1360px) - 328px) / 3 * ${k}), calc((100vw - 76px) / 2 * ${k})`
}

// Deal the pieces to the lightest column, then pad each column's top so its
// bottom lands one STEP below the column to its left: the stand of pieces steps
// down the slope. Image height scales with the column width (a % of padding is
// a % of that width); captions and gaps do not, so they go in as px.
function stand() {
  const cols: Piece[][] = [[], [], []]
  const ratio = [0, 0, 0]
  EXPERIMENTS.forEach((e, i) => {
    const s = SHAPES[i % SHAPES.length]
    const c = ratio.indexOf(Math.min(...ratio))
    cols[c].push({ ...e, shape: s.cls, cover: Math.max(1, s.h) })
    ratio[c] += s.h
  })
  const px = (c: number) => cols[c].length * FIXED - ratio[c] * FRAME
  const height = (c: number) => ratio[c] * TYPICAL_COL + px(c) - c * STEP
  const ref = [0, 1, 2].reduce((a, b) => (height(b) > height(a) ? b : a))
  const pad = [0, 1, 2].map(
    (c) => `max(0px, calc(${((ratio[ref] - ratio[c]) * 100).toFixed(2)}% + ${Math.round(px(ref) - px(c) + (c - ref) * STEP)}px))`,
  )
  return { cols, pad }
}

export default function Treeline() {
  const { cols: columns, pad } = stand()

  return (
    <section id="studio" tabIndex={-1} aria-labelledby="studio-h" data-alt={1900} className="relative z-20 bg-ground outline-none">
      <Edge kind="treeline" />
      <div className="band-inner pb-32 pt-16 md:pb-48 md:pt-20">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <h2 id="studio-h" className="wordmark !text-cream text-[clamp(3.5rem,9vw,7.5rem)]">
            Side Trails
          </h2>
          <p className="max-w-[44ch] text-lg text-mist md:justify-self-end md:text-right">
            Posters, series and graphics made off a whim, some published, some only for the joy of it.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:mt-20 lg:grid-cols-3 lg:gap-7">
          {columns.map((col, c) => (
            <ul
              key={c}
              role="list"
              className="contents lg:flex lg:flex-col lg:gap-7 lg:pt-[var(--stand-pad)]"
              style={{ ['--stand-pad' as string]: pad[c] }}
            >
              {col.map((e) => (
                <li key={e.id}>
                  <Link to={`/studio/${e.id}`} className="studio-piece mat on-cream group block p-2">
                    <div className={`${e.shape} overflow-hidden bg-sand/50`}>
                      <img
                        src={e.imageUrl ? e.imageUrl.replace(/\.webp$/, '-720.webp') : e.thumbUrl}
                        srcSet={e.imageUrl ? srcSet(e.imageUrl) : undefined}
                        sizes={e.imageUrl ? sizes(e.cover) : undefined}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="flex items-baseline justify-between gap-3 px-1 pb-1 pt-2.5">
                      <span className="text-[0.85rem] font-bold leading-tight text-action">{e.title}</span>
                      <span className="tabnum text-[0.75rem] text-peri-deep">{e.year}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
