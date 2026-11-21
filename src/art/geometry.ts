// Procedural geometry for the mountain system. Every shape in the landscape,
// the project peak bands and the contour tiles comes from these functions, so
// the whole family shares one grammar: a flat-topped apex, straight slightly
// kinked flanks, and a curved ridge that splits a lit face from a shaded one.

export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number) => n.toFixed(1)

export interface PeakSpec {
  cx: number
  w: number
  h: number
  base?: number
  /** apex offset from cx as a fraction of width */
  lean?: number
  /** where the ridge meets the base, relative to the apex, as a fraction of width */
  ridgeShift?: number
}

export function peakPaths(s: PeakSpec) {
  const base = s.base ?? 420
  const ax = s.cx + (s.lean ?? 0) * s.w
  const ay = base - s.h
  const lx = s.cx - s.w / 2
  const rx = s.cx + s.w / 2
  const bx = ax + (s.ridgeShift ?? -0.13) * s.w
  // Kinked flanks: bow each side outward a hair so slopes read as rock, not triangles.
  const ml = [lx + (ax - lx) * 0.55 - s.w * 0.012, base - (base - ay) * 0.55]
  const mr = [rx - (rx - ax) * 0.55 + s.w * 0.012, base - (base - ay) * 0.55]
  const c1 = [ax + 0.09 * s.w, ay + 0.22 * s.h]
  const c2 = [ax + 0.1 * s.w, ay + 0.62 * s.h]
  const tip = 3
  const lit =
    `M${f(ax - tip)} ${f(ay + 2)}L${f(ml[0])} ${f(ml[1])}L${f(lx)} ${f(base)}L${f(bx)} ${f(base)}` +
    `C${f(c2[0])} ${f(c2[1])} ${f(c1[0])} ${f(c1[1])} ${f(ax + tip)} ${f(ay + 2)}Z`
  const shade =
    `M${f(ax + tip)} ${f(ay + 2)}C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(bx)} ${f(base)}` +
    `L${f(rx)} ${f(base)}L${f(mr[0])} ${f(mr[1])}Z`
  return { lit, shade, apex: [ax, ay] as const }
}

// ── The hero landscape (viewBox 0 0 1200 340) ───────────────────────────────

export const SCENE_W = 1200
export const SCENE_H = 340

export const FAR = [
  peakPaths({ cx: 175, w: 560, h: 262, base: 420, lean: -0.04, ridgeShift: -0.14 }),
  peakPaths({ cx: 1040, w: 560, h: 290, base: 420, lean: -0.1, ridgeShift: -0.12 }),
]
export const MID = [
  peakPaths({ cx: 330, w: 700, h: 262, base: 420, lean: 0.02, ridgeShift: -0.14 }),
  peakPaths({ cx: 905, w: 700, h: 236, base: 420, lean: -0.05, ridgeShift: -0.12 }),
]
export const CENTER = peakPaths({ cx: 618, w: 700, h: 400, base: 420, lean: 0.03, ridgeShift: -0.15 })

// The sand dune the climbers walk. One ridge path serves both the lit/shade
// split and the walking line, so figures always stand on the edge they climb.
export const DEPTH = { far: 7, mid: 13, center: 19, dune: 26 }

export const DUNE_LIT = `M649 101L170 420L700 420L692 360C706 320 714 296 724 262C744 196 690 128 656 101Z`
export const DUNE_SHADE = `M656 101C690 128 744 196 724 262C714 296 706 320 692 360L700 420L1040 420L748 205Z`

// ── Project peak band (viewBox 0 0 1200 300) ────────────────────────────────

export function bandLayers(seed: number) {
  const r = rng(seed * 9973 + 17)
  const j = (n: number) => (r() - 0.5) * 2 * n
  return {
    far: [
      peakPaths({ cx: 235 + j(30), w: 470 + j(40), h: 235 + j(22), base: 320, lean: j(0.05), ridgeShift: -0.14 }),
      peakPaths({ cx: 975 + j(30), w: 470 + j(40), h: 262 + j(22), base: 320, lean: j(0.05), ridgeShift: -0.12 }),
    ],
    mid: [
      peakPaths({ cx: 430 + j(60), w: 640 + j(50), h: 205 + j(20), base: 320, lean: j(0.04), ridgeShift: -0.14 }),
      peakPaths({ cx: 800 + j(60), w: 640 + j(50), h: 228 + j(20), base: 320, lean: j(0.04), ridgeShift: -0.12 }),
    ],
  }
}

// ── Contour line-art peaks (viewBox 0 0 240 120) ────────────────────────────

export function contourPeaks(seed: number) {
  const r = rng(seed * 7919 + 3)
  const peaks = [
    { cx: 120 + (r() - 0.5) * 30, w: 150 + r() * 30, h: 86 + r() * 16 },
    { cx: 40 + (r() - 0.5) * 20, w: 100, h: 52 + r() * 14 },
    { cx: 205 + (r() - 0.5) * 20, w: 100, h: 46 + r() * 14 },
  ]
  return peaks.map((p) => ({
    d: `M${f(p.cx - p.w / 2)} 118L${f(p.cx - 3)} ${f(118 - p.h)}L${f(p.cx + 3)} ${f(118 - p.h)}L${f(p.cx + p.w / 2)} 118`,
  }))
}
