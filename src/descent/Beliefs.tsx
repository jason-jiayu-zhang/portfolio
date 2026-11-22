import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { BELIEFS } from '../data/about'

// The beliefs are a stone skipped across the lake. Five landings, each hop
// lower than the last; every landing is one belief. Pick a belief and the
// stone hops there along the same dashed line, ringing the water as it lands.

const W = 1000
const H = 160
const WATER = 132
// Column centres of a five-column grid with no gap.
const LAND = BELIEFS.map((_, i) => ((i + 0.5) * W) / BELIEFS.length)
// Peak height of the hop leaving landing k for landing k+1.
const HOP = [80, 58, 40, 26]
// The throw from the shore into the first landing.
const THROW = { x0: -30, y0: 24, cx: 40, cy: 6 }

type Pt = { x: number; y: number }

function quad(p0: Pt, c: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y }
}

// A hop is a quadratic whose control sits at the midpoint, raised twice the
// peak: x then moves at constant speed and y traces a parabola, as a thrown
// stone does.
function hop(k: number): [Pt, Pt, Pt] {
  const a = LAND[k]
  const b = LAND[k + 1]
  return [{ x: a, y: WATER }, { x: (a + b) / 2, y: WATER - 2 * HOP[k] }, { x: b, y: WATER }]
}

const throwCurve: [Pt, Pt, Pt] = [{ x: THROW.x0, y: THROW.y0 }, { x: THROW.cx, y: THROW.cy }, { x: LAND[0], y: WATER }]

const trail =
  `M${THROW.x0} ${THROW.y0}Q${THROW.cx} ${THROW.cy} ${LAND[0]} ${WATER}` +
  HOP.map((_, k) => {
    const [, c, p1] = hop(k)
    return `Q${c.x} ${c.y} ${p1.x} ${p1.y}`
  }).join('')

function Rings({ x, strong }: { x: number; strong?: boolean }) {
  return (
    <g fill="none" stroke="#eeebe2" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
      {[16, 30, 46].map((rx, j) => (
        <ellipse key={rx} cx={x} cy={WATER} rx={rx} ry={rx * 0.26} strokeOpacity={(strong ? 0.75 : 0.22) * (1 - j * 0.3)} />
      ))}
    </g>
  )
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Beliefs() {
  const [active, setActive] = useState(0)
  const [waves, setWaves] = useState<{ id: number; at: number }[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const stoneRef = useRef<SVGEllipseElement>(null)
  const shadowRef = useRef<SVGEllipseElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const at = useRef(-1) // landing the stone rests on; -1 is still in hand
  const target = useRef(0)
  const flying = useRef(false)
  const frame = useRef(0)
  const waveId = useRef(0)

  const place = useCallback((p: Pt) => {
    const lift = Math.max(0, WATER - p.y)
    stoneRef.current?.setAttribute('cx', String(p.x))
    stoneRef.current?.setAttribute('cy', String(p.y - 5))
    const s = shadowRef.current
    if (s) {
      s.setAttribute('cx', String(p.x))
      s.setAttribute('rx', String(Math.max(3, 9 - lift / 14)))
      s.setAttribute('opacity', String(Math.max(0, 0.5 - lift / 160)))
    }
  }, [])

  const ring = useCallback((k: number) => {
    const id = ++waveId.current
    setWaves((w) => [...w, { id, at: k }])
  }, [])

  // Fly one curve, then keep hopping toward whatever the target is by then,
  // so a click mid-flight redirects the stone rather than snapping it.
  const fly = useCallback(() => {
    if (at.current === target.current) {
      flying.current = false
      return
    }
    flying.current = true
    const from = at.current
    const next = from < 0 ? 0 : from + Math.sign(target.current - from)
    const curve = from < 0 ? throwCurve : next > from ? hop(from) : (hop(next).slice().reverse() as [Pt, Pt, Pt])
    const peak = from < 0 ? 90 : HOP[Math.min(from, next)]
    const ms = from < 0 ? 620 : 300 * Math.sqrt(peak / 60)
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      place(quad(...curve, t))
      if (t < 1) {
        frame.current = requestAnimationFrame(tick)
        return
      }
      at.current = next
      ring(next)
      fly()
    }
    frame.current = requestAnimationFrame(tick)
  }, [place, ring])

  // The throw happens once, when the water comes into view.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (reduced()) {
      at.current = 0
      place({ x: LAND[0], y: WATER })
      return
    }
    place(throwCurve[0])
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        fly()
      },
      { threshold: 0.6 },
    )
    io.observe(svg)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame.current)
    }
  }, [fly, place])

  const choose = (i: number) => {
    setActive(i)
    target.current = i
    if (reduced()) {
      at.current = i
      place({ x: LAND[i], y: WATER })
      return
    }
    if (!flying.current && at.current >= 0) fly()
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = BELIEFS.length
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: n - 1 }
    if (!(e.key in map)) return
    e.preventDefault()
    const i = (map[e.key] + n) % n
    choose(i)
    tabRefs.current[i]?.focus()
  }

  const b = BELIEFS[active]

  return (
    <div className="mt-24 md:mt-32">
      <h3 className="text-2xl font-bold text-cream md:text-3xl">What I believe</h3>

      {/* Phones: the stones read as a list, each with its own rings. */}
      <ol className="mt-8 space-y-9 md:hidden">
        {BELIEFS.map((x, i) => (
          <li key={x.headline} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-3">
            <svg viewBox="0 0 56 24" className="mt-1.5 w-14" aria-hidden="true">
              <g fill="none" stroke="#eeebe2" strokeWidth="1.25">
                {[8, 16, 26].map((rx, j) => (
                  <ellipse key={rx} cx="28" cy="14" rx={rx} ry={rx * 0.3} strokeOpacity={0.7 - j * 0.22} />
                ))}
              </g>
              <ellipse cx="28" cy={9 - Math.min(i, 3)} rx="5" ry="3.2" fill="#eeebe2" />
            </svg>
            <div>
              <p className="text-xl font-bold leading-snug text-cream">{x.headline}</p>
              <p className="mt-1.5 text-paper">{x.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Tablets and up: the skip itself. */}
      <div className="hidden md:block">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="mt-6 block w-full overflow-hidden" aria-hidden="true">
          {/* Water: the line the stone skims, and the streaks the portrait's reflection uses. */}
          <line x1="0" x2={W} y1={WATER} y2={WATER} stroke="#c9cce6" strokeOpacity="0.14" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {[
            [60, 150, 146],
            [380, 470, 150],
            [610, 720, 144],
            [820, 880, 151],
          ].map(([x1, x2, y]) => (
            <line key={x1} x1={x1} x2={x2} y1={y} y2={y} stroke="#c9cce6" strokeOpacity="0.12" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          ))}

          <path d={trail} fill="none" stroke="#eeebe2" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />

          {LAND.map((x, i) => (
            <Rings key={x} x={x} strong={i === active} />
          ))}

          {waves.map((w) => (
            <g
              key={w.id}
              className="belief-wave"
              style={{ transformOrigin: `${LAND[w.at]}px ${WATER}px` }}
              onAnimationEnd={() => setWaves((all) => all.filter((x) => x.id !== w.id))}
            >
              <Rings x={LAND[w.at]} strong />
            </g>
          ))}

          <ellipse ref={shadowRef} cy={WATER + 1} ry="2.4" fill="#1c2035" />
          <ellipse ref={stoneRef} rx="9" ry="5.5" fill="#eeebe2" />
        </svg>

        <div role="tablist" aria-label="What I believe" onKeyDown={onKey} className="grid grid-cols-5">
          {BELIEFS.map((x, i) => (
            <button
              key={x.headline}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              id={`belief-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="belief-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => choose(i)}
              className={`belief-tab px-3 pb-2 pt-4 text-center text-base font-bold leading-snug lg:px-4 lg:text-lg ${
                i === active ? 'text-cream' : 'text-mist hover:text-cream'
              }`}
            >
              <span className="belief-tab-label">{x.headline}</span>
            </button>
          ))}
        </div>

        <div id="belief-panel" role="tabpanel" aria-labelledby={`belief-tab-${active}`} className="mt-10 min-h-[9.5rem] border-t border-mist/20 pt-8 lg:mt-12">
          <p key={active} className="belief-body max-w-[46ch] text-[clamp(1.25rem,1.9vw,1.625rem)] font-medium leading-[1.45] tracking-[-0.01em] text-paper">
            {b.body}
          </p>
        </div>
      </div>
    </div>
  )
}
