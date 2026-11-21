import { useEffect, useMemo, useRef } from 'react'

// A flag that ripples rather than swings: a small wave rolls from the hoist
// (held still by the pole) out to the tip, which flutters most. Each frame is
// the cloth outline sampled along its length and smoothed into cubic curves;
// every frame has the same commands so SMIL can tween between them.
const FRAMES = 16
const K = 4.2 // radians of wave along the cloth (~2/3 of a wavelength)

type Pt = [number, number]

function frame(phase: number, x: number, top: number, bottom: number, tip: Pt, amp: number) {
  const N = 6
  const at = (u: number, y0: number): Pt => {
    // The cloth bunches slightly toward the pole on each crest, like luffing.
    const px = x + (tip[0] - x) * u * (1 - 0.025 * (1 + Math.cos(phase - u * K)))
    return [px, y0 + (tip[1] - y0) * u + amp * u * Math.sin(phase - u * K)]
  }
  const upper = Array.from({ length: N + 1 }, (_, i) => at(i / N, top))
  const lower = Array.from({ length: N + 1 }, (_, i) => at(i / N, bottom)).reverse()
  const f = (n: number) => +n.toFixed(2)
  // Catmull-Rom through the samples, as cubic Béziers.
  const curve = (pts: Pt[]) =>
    pts.slice(1).map((p1, i) => {
      const p0 = pts[i]
      const pm = pts[i - 1] ?? p0
      const p2 = pts[i + 2] ?? p1
      return `C${f(p0[0] + (p1[0] - pm[0]) / 6)} ${f(p0[1] + (p1[1] - pm[1]) / 6)} ${f(p1[0] - (p2[0] - p0[0]) / 6)} ${f(p1[1] - (p2[1] - p0[1]) / 6)} ${f(p1[0])} ${f(p1[1])}`
    }).join('')
  return `M${f(upper[0][0])} ${f(upper[0][1])}${curve(upper)}${curve(lower)}Z`
}

/** Hoist edge runs down x from `top` to `bottom`; the cloth tapers to `tip`. */
export default function RipplingFlag({
  x, top, bottom, tip, fill, dur = 2.6,
}: { x: number; top: number; bottom: number; tip: Pt; fill: string; dur?: number }) {
  const ref = useRef<SVGPathElement>(null)
  // Lift at the tip: ~9% of the hoist height, subtle at any flag size.
  const amp = (bottom - top) * 0.09
  const frames = useMemo(
    () => Array.from({ length: FRAMES + 1 }, (_, i) => frame((i / FRAMES) * Math.PI * 2, x, top, bottom, tip, amp)),
    [x, top, bottom, tip[0], tip[1], amp], // eslint-disable-line react-hooks/exhaustive-deps
  )

  // The ripple repaints its svg every frame: run it only while on screen, and
  // hold it still for reduced motion.
  useEffect(() => {
    const svg = ref.current?.ownerSVGElement
    if (!svg) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    const sync = () => {
      if (visible && !motion.matches) svg.unpauseAnimations()
      else svg.pauseAnimations()
      if (motion.matches) svg.setCurrentTime(0)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync() })
    io.observe(svg)
    motion.addEventListener('change', sync)
    sync()
    return () => { io.disconnect(); motion.removeEventListener('change', sync) }
  }, [])

  return (
    <path ref={ref} d={frames[0]} fill={fill}>
      <animate attributeName="d" dur={`${dur}s`} repeatCount="indefinite" values={frames.join(';')} />
    </path>
  )
}
