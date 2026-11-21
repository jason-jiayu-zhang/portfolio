import { useEffect, useId, useMemo, useRef } from 'react'
import type { MouseEvent } from 'react'
import { STRATA, W, seeded } from './terrain'
import { landingTop, scrollToSection } from '../utils/sectionScroll'

export type Waypoint = { id: string; label: string; short?: string; alt: number }

const H = 200
const X0 = 0.22
const X1 = 0.9
const fmt = new Intl.NumberFormat('en-US')

/** The trend the route follows: high on the left at the camp, low on the right. */
const trend = (x: number) => 0.1 + x * 0.82

function jump(e: MouseEvent<HTMLAnchorElement>, id: string) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  history.replaceState(history.state, '', `#${id}`)
  scrollToSection(id)
}

/**
 * The top edge of a case study's first band, drawn as the route's elevation
 * profile. Each waypoint is one major leg of the case study, placed on the line
 * and linked to its section. The stretch already read is drawn solid in sand;
 * the route ahead stays a dashed line. Progress is written straight to the DOM.
 */
export default function RouteProfile({ waypoints, seed = 11 }: { waypoints: Waypoint[]; seed?: number }) {
  const uid = useId().replace(/:/g, '')
  const clip = useRef<SVGRectElement>(null)
  const list = useRef<HTMLOListElement>(null)

  const xs = useMemo(
    () => waypoints.map((_, i) => (waypoints.length === 1 ? (X0 + X1) / 2 : X0 + (i * (X1 - X0)) / (waypoints.length - 1))),
    [waypoints],
  )

  const { line, area } = useMemo(() => {
    const r = seeded(seed)
    const anchors = [0, ...xs, 1]
    const pts: [number, number][] = []
    anchors.forEach((x, i) => {
      pts.push([x, trend(x)])
      const next = anchors[i + 1]
      if (next === undefined) return
      // Two broken turns between waypoints, so the line reads as ground, not a ramp.
      for (let k = 1; k < 3; k++) {
        const t = x + ((next - x) * k) / 3 + (r() - 0.5) * (next - x) * 0.15
        pts.push([t, Math.min(0.98, Math.max(0.08, trend(t) + (r() - 0.5) * 0.14))])
      }
    })
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * W).toFixed(1)} ${(y * H).toFixed(1)}`).join('')
    return { line: d, area: `${d}L${W} ${H}L0 ${H}Z` }
  }, [xs, seed])

  useEffect(() => {
    const anchors = [0, ...xs, 1]
    let stops: number[] = []
    let tops: number[] = []
    let raf = 0
    const layout = () => {
      const y0 = window.scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      tops = waypoints.map((w) => {
        const el = document.getElementById(w.id)
        return el ? Math.min(max, Math.max(0, el.getBoundingClientRect().top + y0 - landingTop(el))) : max
      })
      stops = [0, ...tops, max]
    }
    const draw = () => {
      raf = 0
      const pos = window.scrollY
      let f = 1
      for (let i = 0; i < stops.length - 1; i++) {
        if (pos < stops[i + 1]) {
          const span = stops[i + 1] - stops[i]
          f = anchors[i] + (anchors[i + 1] - anchors[i]) * (span > 0 ? Math.max(0, pos - stops[i]) / span : 1)
          break
        }
      }
      clip.current?.setAttribute('width', String(f * W))
      list.current?.querySelectorAll('li').forEach((li, i) => li.toggleAttribute('data-passed', pos >= tops[i] - 1))
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    const relayout = () => {
      layout()
      queue()
    }
    layout()
    draw()
    const ro = new ResizeObserver(relayout)
    ro.observe(document.body)
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', relayout)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', relayout)
    }
  }, [waypoints, xs])

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-full h-[clamp(110px,20vw,300px)] translate-y-px">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false" className="absolute inset-0 block h-full w-full">
        <defs>
          <clipPath id={`climbed-${uid}`}>
            <rect ref={clip} x="0" y="0" width="0" height={H} />
          </clipPath>
        </defs>
        <path d={area} fill={STRATA.alpine} />
        <path d={line} fill="none" stroke="#eeebe2" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />
        <path d={line} fill="none" stroke="#cfccbb" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" clipPath={`url(#climbed-${uid})`} />
      </svg>
      <nav aria-label="Route" className="absolute inset-0 hidden md:block">
        <ol ref={list}>
          {waypoints.map((w, i) => (
            <li key={w.id} className="route-wp absolute" style={{ left: `${xs[i] * 100}%`, top: `${trend(xs[i]) * 100}%` }}>
              <span className="route-mark absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rotate-45 border-2 border-cream bg-peri-deep" aria-hidden="true" />
              <a
                href={`#${w.id}`}
                onClick={(e) => jump(e, w.id)}
                className="pointer-events-auto absolute -left-1.5 bottom-2 flex min-h-6 items-center whitespace-nowrap px-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-night underline-offset-[0.4em] hover:underline"
              >
                {w.short ? (
                  <>
                    <span className="xl:hidden">{w.short}</span>
                    <span className="hidden xl:inline">{w.label}</span>
                  </>
                ) : (
                  w.label
                )}
              </a>
              <span className="tabnum absolute -left-0.5 top-2.5 whitespace-nowrap text-[0.75rem] text-paper" aria-hidden="true">
                {fmt.format(w.alt)} m
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
