import { PLAYGROUND, type GameEntry, type Ladder } from '../data/about'
import RipplingFlag from './RipplingFlag'

// Each game's standing read as a route profile, the strip under a trail map:
// the climbed stretch is solid ground, the route ahead is a dashed line, and a
// flag stands where the climber is now.

const N = 64 // samples along the ridge

// The ridge height (0..1) at t along the route: a steady climb with a little
// seeded wander, topping out just before the end of the route.
function ridge(t: number, seed: number) {
  const climb = 0.1 + 0.7 * Math.pow(t, 1.25)
  const wander = Math.sin(Math.PI * t) * (0.05 * Math.sin(t * 9 + seed) + 0.03 * Math.sin(t * 23 + seed * 2.1))
  const summit = -Math.max(0, t - 0.965) * 2.4
  return Math.max(0.04, Math.min(0.82, climb + wander + summit))
}

const X = (t: number) => (t * 1000).toFixed(1)
const Y = (h: number) => (100 - h * 100).toFixed(1)

function Profile({ ladder, seed, value, sub }: { ladder: Ladder; seed: number; value: string; sub?: string }) {
  const pts = Array.from({ length: N + 1 }, (_, i) => i / N)
  const line = (from: number, to: number) =>
    [from, ...pts.filter((t) => t > from && t < to), to]
      .map((t, i) => `${i ? 'L' : 'M'}${X(t)} ${Y(ridge(t, seed))}`)
      .join('')
  const here = ridge(ladder.at, seed)
  const climbed = line(0, ladder.at)
  const flip = ladder.at > 0.72 // label on the left of the pole near the right edge

  return (
    <div className="pt-16">
      <div className="relative h-28 md:h-36">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="absolute inset-0 h-full w-full overflow-visible">
          <path d={`${climbed}L${X(ladder.at)} 100L0 100Z`} fill="#4d5584" />
          <path d={climbed} fill="none" stroke="#cfccbb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d={line(ladder.at, 1)} fill="none" stroke="#c9cce6" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
          {ladder.ticks.map((k) => (
            <line key={k.label} x1={X(k.at)} x2={X(k.at)} y1="100" y2="94" stroke="#c9cce6" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {/* The flag, planted on the ridge at the current standing. */}
        <div aria-hidden="true" className="absolute" style={{ left: `${ladder.at * 100}%`, bottom: `${here * 100}%` }}>
          <svg viewBox="0 0 24 40" className="absolute bottom-0 left-[-1px] h-10 w-6 overflow-visible">
            <RipplingFlag x={1} top={2} bottom={14} tip={[22, 8]} fill="#cfccbb" />
            <rect x="0" y="0" width="2" height="40" fill="#eeebe2" />
          </svg>
          <p className={`absolute bottom-11 whitespace-nowrap ${flip ? 'right-0 text-right' : 'left-0'}`}>
            <span className="mat inline-block px-2.5 py-1.5 text-[0.85rem] font-bold leading-none text-night">{value}</span>
            {sub && <span className="mt-1.5 block text-[0.72rem] leading-none text-mist">{sub}</span>}
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="relative mt-2 h-4 border-t border-mist/20">
        {ladder.ticks.map((k) => (
          <span
            key={k.label}
            className={`absolute top-1.5 whitespace-nowrap text-[0.62rem] font-medium uppercase leading-none tracking-[0.12em] text-mist ${
              k.minor ? 'hidden sm:block' : ''
            } ${k.at <= 0.01 ? '' : k.at >= 0.99 ? '-translate-x-full' : '-translate-x-1/2'}`}
            style={{ left: `${k.at * 100}%` }}
          >
            {k.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Route({ g, seed }: { g: GameEntry; seed: number }) {
  // Specs are: genre, what I play, then the standing the profile draws.
  const [genre, ...rest] = g.specs
  const standing = g.ladder ? rest.find((s) => s.label === g.ladder!.spec) : undefined
  const specs = rest.filter((s) => s !== standing)
  // "NA Server // Lv. 57" reads as a value and its server; otherwise the sublabel is the context.
  const [value, server] = standing?.value.includes(' // ') ? standing.value.split(' // ').reverse() : [standing?.value, standing?.sublabel]

  return (
    <li className="grid gap-x-14 gap-y-4 border-b border-mist/20 py-10 first:pt-2 last:border-b-0 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:items-end">
      <div>
        <p className="text-2xl font-bold leading-tight tracking-[-0.01em] text-cream">{g.title}</p>
        <p className="mt-1 text-sm text-sand">{genre.value}</p>
        <dl className="mt-6 space-y-4">
          {specs.map((s) => (
            <div key={s.label}>
              <dt className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-mist">{s.label}</dt>
              <dd className="mt-0.5 leading-snug text-paper">
                {s.value}
                {s.sublabel && <span className="text-mist"> · {s.sublabel}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {g.ladder && standing && value && (
        <figure>
          <figcaption className="sr-only-x">
            {standing.label}: {value}
            {server ? `, ${server}` : ''}. That is {g.ladder.reads}.
          </figcaption>
          <Profile ladder={g.ladder} seed={seed} value={value} sub={server} />
        </figure>
      )}
    </li>
  )
}

export default function GameRoutes() {
  return (
    <ul>
      {PLAYGROUND.map((g, i) => (
        <Route key={g.id} g={g} seed={i * 1.7 + 0.6} />
      ))}
    </ul>
  )
}
