import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

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

/**
 * How the flag's own svg maps onto its host's drawing. The flag no longer lives
 * inside the host svg (every SMIL frame would repaint the whole host): it is an
 * absolutely positioned svg of its own, laid over the host at the spot and scale
 * the host's viewBox would have drawn it. Its offset parent must have exactly the
 * host svg's box.
 */
export type FlagFit = {
  /** The host's viewBox size. */
  vw: number
  vh: number
  /** The host's preserveAspectRatio (both hosts align xMax YMax). */
  mode: 'slice' | 'meet'
  /** Where the flag's local origin sits in host viewBox units (the old translate). */
  at: Pt
}

type Box = [number, number, number, number]

/**
 * Hoist edge runs down x from `top` to `bottom`; the cloth tapers to `tip`.
 * Renders its own small svg. `children` (the pole) draw over the cloth, in the
 * same local units. With `fit` the svg places itself over the host; without
 * it, `className` sizes and places it and `box` should be its viewBox.
 */
export default function RipplingFlag({
  x, top, bottom, tip, fill, dur = 2.6, fit, box, className, children,
}: {
  x: number; top: number; bottom: number; tip: Pt; fill: string; dur?: number
  fit?: FlagFit; box?: Box; className?: string; children?: ReactNode
}) {
  const ref = useRef<SVGSVGElement>(null)
  // Lift at the tip: ~9% of the hoist height, subtle at any flag size.
  const amp = (bottom - top) * 0.09
  const frames = useMemo(
    () => Array.from({ length: FRAMES + 1 }, (_, i) => frame((i / FRAMES) * Math.PI * 2, x, top, bottom, tip, amp)),
    [x, top, bottom, tip[0], tip[1], amp], // eslint-disable-line react-hooks/exhaustive-deps
  )
  // The cloth's reach with some slack for the curves, widened to cover the pole
  // (the children) when it hangs below or beside the cloth.
  const pad = 2 + amp
  const [bx, by, bw, bh] = box ?? (() => {
    const x0 = Math.min(0, x) - pad
    const y0 = Math.min(top, tip[1]) - pad
    const x1 = Math.max(x, tip[0]) + pad
    const y1 = Math.max(bottom, tip[1], 0) + pad
    return [x0, y0, x1 - x0, y1 - y0]
  })()

  // Place the svg over the host: the host's box maps its viewBox with
  // preserveAspectRatio xMaxYMax (slice or meet), so take the same scale and
  // offset from the offset parent's layout size (unaffected by transforms).
  const fvw = fit?.vw, fvh = fit?.vh, fmode = fit?.mode, fax = fit?.at[0], fay = fit?.at[1]
  useLayoutEffect(() => {
    const svg = ref.current
    const host = svg?.parentElement
    if (!svg || !host || fvw == null || fvh == null || fax == null || fay == null) return
    const place = (w: number, h: number) => {
      const s = fmode === 'slice' ? Math.max(w / fvw, h / fvh) : Math.min(w / fvw, h / fvh)
      const ox = w - fvw * s
      const oy = h - fvh * s
      svg.style.left = `${ox + (fax + bx) * s}px`
      svg.style.top = `${oy + (fay + by) * s}px`
      svg.style.width = `${bw * s}px`
      svg.style.height = `${bh * s}px`
    }
    const ro = new ResizeObserver(([e]) => place(e.contentRect.width, e.contentRect.height))
    ro.observe(host)
    return () => ro.disconnect()
  }, [fvw, fvh, fmode, fax, fay, bx, by, bw, bh])

  // The ripple repaints its svg every frame: run it only while on screen and the
  // tab is showing, and hold it still for reduced motion.
  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    const sync = () => {
      if (visible && !document.hidden && !motion.matches) svg.unpauseAnimations()
      else svg.pauseAnimations()
      if (motion.matches) svg.setCurrentTime(0)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync() })
    io.observe(svg)
    motion.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      io.disconnect()
      motion.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return (
    <svg
      ref={ref}
      viewBox={`${bx} ${by} ${bw} ${bh}`}
      className={fit ? 'pointer-events-none absolute' : className}
      // Its own paint area and layer: a frame repaints this small box, not the host.
      style={{ contain: 'strict', willChange: 'transform', ...(fit ? { left: 0, top: 0, width: 0, height: 0 } : null) }}
      aria-hidden="true"
      focusable="false"
    >
      <path d={frames[0]} fill={fill}>
        <animate attributeName="d" dur={`${dur}s`} repeatCount="indefinite" values={frames.join(';')} />
      </path>
      {children}
    </svg>
  )
}
