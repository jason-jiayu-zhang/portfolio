import { useMemo } from 'react'
import RipplingFlag from './RipplingFlag'
import { STRATA, seeded } from './terrain'

// A case study's own peak: the home summit's faceted world (far range, a lit
// and a shaded face split by a broken rib, a two-tone snow cap, a flag on the
// apex), drawn from the project's seed so every ascent stands on a different
// mountain. It fills the right of the sky band and stands behind the route
// profile, which covers its foot.
const VW = 760
const VH = 860

type Pt = [number, number]
const f = (n: number) => Math.round(n * 10) / 10
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`

/** x on a polyline (ordered by increasing y) at height y. */
function xAt(line: Pt[], y: number) {
  for (let i = 0; i < line.length - 1; i++) {
    const [x0, y0] = line[i]
    const [x1, y1] = line[i + 1]
    if (y >= y0 && y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0 || 1)
  }
  return line[line.length - 1][0]
}

function peak(seed: number) {
  const r = seeded(seed * 7919 + 17)
  const ax = 470 + (r() - 0.5) * 70
  const ay = 190 + r() * 50
  const h = VH - ay
  const lx = ax - h * (0.66 + r() * 0.08)

  // Ridges and rib run top to bottom so xAt can read them.
  const left: Pt[] = [
    [ax, ay],
    [ax - h * 0.22 + (r() - 0.5) * 16, ay + h * 0.3],
    [ax - h * 0.42 - r() * 14, ay + h * 0.55],
    [lx, VH],
  ]
  const right: Pt[] = [
    [ax, ay],
    [ax + h * 0.3, ay + h * 0.32 + (r() - 0.5) * 20],
    [ax + h * 0.42, ay + h * 0.36],
    [VW + 40, ay + h * 0.6],
    [VW + 40, VH],
  ]
  const rib: Pt[] = [
    [ax, ay],
    [ax + 16 + r() * 8, ay + h * 0.12],
    [ax - 18 - r() * 10, ay + h * 0.3],
    [ax + 8 + r() * 10, ay + h * 0.5],
    [ax - 20 - r() * 10, ay + h * 0.72],
    [ax - 30, VH],
  ]

  // Snow line: the lit side breaks higher than the shade side, as at the summit.
  const ys = ay + h * (0.2 + r() * 0.05)
  const ysShade = ys + 24
  const above = (line: Pt[], y: number) => line.slice(1).filter(([, py]) => py < y)
  const zig = (x0: number, x1: number, y: number, k: number): Pt[] =>
    [0.25, 0.5, 0.75].map((u, i) => [x0 + (x1 - x0) * u, y + (i % 2 === k ? -16 : 16) + (r() - 0.5) * 6])

  const lEdge = xAt(left, ys)
  const ribLit = xAt(rib, ys + 10)
  const snowLit: Pt[] = [
    [ax, ay],
    ...above(left, ys),
    [lEdge, ys],
    ...zig(lEdge, ribLit, ys, 0),
    [ribLit, ys + 10],
    ...above(rib, ys + 10).reverse(),
  ]
  const rEdge = xAt(right, ysShade)
  const ribShade = xAt(rib, ys + 10)
  const snowShade: Pt[] = [
    [ax, ay],
    ...above(rib, ys + 10).map(([x, y]): Pt => [x - 3, y]),
    [ribShade - 3, ys + 10],
    ...zig(ribShade, rEdge, ysShade, 1),
    [rEdge, ysShade],
    ...above(right, ysShade).reverse(),
  ]

  // Back layers tuck 3 units under the lit face so the seam never opens.
  const lit: Pt[] = [...left, ...rib.slice().reverse()]
  const shade: Pt[] = [
    [xAt(rib, ys) - 3, ys],
    ...rib.filter(([, y]) => y > ys).map(([x, y]): Pt => [x - 3, y]),
    ...right.filter(([, y]) => y > ysShade - 30).reverse(),
    [xAt(right, ysShade - 30) - 2, ysShade - 30],
  ]

  // A lower shoulder in front, left of the main peak.
  const sx = ax - h * 0.5 - r() * 30
  const sy = ay + h * (0.5 + r() * 0.08)
  const sh = VH - sy
  const shoulderLit: Pt[] = [[sx, sy], [sx + 14, sy + 10], [sx + 6, sy + sh * 0.4], [sx + 40, VH], [sx - sh * 0.55, VH]]
  const shoulderShade: Pt[] = [[sx + 10, sy + 6], [sx + sh * 0.42, sy + sh * 0.5], [sx + sh * 0.6, VH], [sx + 38, VH], [sx + 4, sy + sh * 0.4]]

  return {
    apex: [ax, ay] as Pt,
    lit: poly(lit),
    shade: poly(shade),
    snowLit: poly(snowLit),
    snowShade: poly(snowShade),
    shoulderLit: poly(shoulderLit),
    shoulderShade: poly(shoulderShade),
  }
}

export default function CampPeak({ seed, className = '' }: { seed: number; className?: string }) {
  const p = useMemo(() => peak(seed), [seed])
  const [ax, ay] = p.apex
  // The flag and pole draw in their own small svg over the peak (see
  // RipplingFlag); the wrapper hugs the svg so the overlay maps its viewBox.
  return (
    <div className={className} aria-hidden="true">
      <svg
        className="block h-full w-auto"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMaxYMax meet"
        style={{ aspectRatio: `${VW} / ${VH}` }}
        aria-hidden="true"
        focusable="false"
      >
        <path d={p.shade} fill="#646d9c" />
        <path d={p.lit} fill="#c9cce6" />
        <path d={p.snowShade} fill="#b9bde0" />
        <path d={p.snowLit} fill="#eeebe2" />
        <path d={p.shoulderShade} fill="#5d669a" />
        <path d={p.shoulderLit} fill="#a9afd8" />
      </svg>
      <RipplingFlag
        x={1}
        top={-64}
        bottom={-44}
        tip={[40, -56]}
        fill="#eeebe2"
        fit={{ vw: VW, vh: VH, mode: 'meet', at: [f(ax - 1.5), f(ay + 6)] }}
      >
        <rect x="0" y="-64" width="3" height="64" fill={STRATA.valley} />
      </RipplingFlag>
    </div>
  )
}

/**
 * The near range in front of the peak's foot, sized to the route profile's box
 * plus the waypoint labels above it, so every label reads on light ground.
 */
export function Foothills({ seed, className = '' }: { seed: number; className?: string }) {
  const d = useMemo(() => {
    const r = seeded(seed * 31 + 5)
    // The skyline steps down to the right, as the route does, staying above the
    // waypoint labels it has to carry: about y 50 at its left end, 75 at the right.
    const pts: Pt[] = [[0, 100], [50 + r() * 30, 50 + r() * 8]]
    let x = pts[1][0]
    let up = true
    while (x < 1000) {
      x = Math.min(1000, x + 55 + r() * 120)
      const base = 26 + (x / 1000) * 34
      pts.push([x, base + (up ? -8 - r() * 10 : 4 + r() * 8)])
      up = !up
    }
    pts.push([1000, 100])
    return poly(pts)
  }, [seed])
  return (
    <svg className={className} viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={d} fill="#838dc8" />
    </svg>
  )
}
