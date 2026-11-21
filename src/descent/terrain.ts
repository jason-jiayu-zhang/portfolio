// Geometry for the descent. Every edge between two altitude bands is drawn here
// from a seeded walk, so the silhouettes stay identical between renders.

export const W = 1440

/** Camps step down 300 m at a time below the work band's 3,600 m mark. */
export const campAlt = (i: number) => 3400 - i * 300

export const STRATA = {
  sky: '#95a0da',
  alpine: '#4d5584',
  treeline: '#3d4268',
  lake: '#2f3456',
  camp: '#262a48',
  valley: '#1c2035',
} as const

export function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const n = (v: number) => Math.round(v * 10) / 10

/** A broken alpine ridge: short straight segments, sharp turns, no curves. */
export function ridge(seed: number, h: number, low = 0.25, high = 0.95) {
  const r = seeded(seed)
  const pts: [number, number][] = []
  let x = 0
  let y = h * (low + (high - low) * r())
  while (x < W) {
    pts.push([x, y])
    x += 26 + r() * 70
    const swing = (r() - 0.5) * h * 0.55
    y = Math.min(h * high, Math.max(h * low, y + swing))
  }
  pts.push([W, y])
  return `M0 ${h}` + pts.map(([px, py]) => `L${n(px)} ${n(py)}`).join('') + `L${W} ${h}Z`
}

/** Conifers standing on a gently rolling base, two tiers each. */
export function conifers(seed: number, h: number) {
  const r = seeded(seed)
  const baseAt = (x: number) => h * 0.78 + Math.sin(x / 210) * h * 0.08
  let d = `M0 ${h}L0 ${n(baseAt(0))}`
  for (let x = 0; x < W; x += 30 + r() * 26) d += `L${n(x)} ${n(baseAt(x))}`
  d += `L${W} ${n(baseAt(W))}L${W} ${h}Z`
  let x = 6
  while (x < W) {
    const b = baseAt(x) + 2
    // Keep every tip inside the viewBox so no crown gets clipped.
    const tall = Math.min(h * (0.32 + r() * 0.5), b - 2)
    const half = 7 + r() * 9
    const top = b - tall
    const mid = b - tall * 0.52
    d += `M${n(x - half)} ${n(b)}L${n(x - half * 0.62)} ${n(mid)}L${n(x - half * 0.95)} ${n(mid)}L${n(x)} ${n(top)}`
    d += `L${n(x + half * 0.95)} ${n(mid)}L${n(x + half * 0.62)} ${n(mid)}L${n(x + half)} ${n(b)}Z`
    x += half * (0.9 + r() * 1.3)
  }
  return d
}

/** Low far hills that end on a dead-straight waterline. */
export function shore(seed: number, h: number, waterline: number) {
  const r = seeded(seed)
  let d = `M0 ${waterline}`
  let x = 0
  while (x < W) {
    const w = 120 + r() * 220
    const peak = waterline - h * (0.12 + r() * 0.3)
    d += `Q${n(x + w / 2)} ${n(peak)} ${n(Math.min(W, x + w))} ${waterline}`
    x += w
  }
  return d + `L${W} ${h}L0 ${h}Z`
}

/** Valley floor: long soft swells. */
export function swells(seed: number, h: number) {
  const r = seeded(seed)
  let d = `M0 ${n(h * 0.6)}`
  let x = 0
  let y = h * 0.6
  while (x < W) {
    const w = 260 + r() * 260
    const ny = h * (0.25 + r() * 0.5)
    d += `C${n(x + w * 0.4)} ${n(y)} ${n(x + w * 0.6)} ${n(ny)} ${n(Math.min(W, x + w))} ${n(ny)}`
    x += w
    y = ny
  }
  return d + `L${W} ${h}L0 ${h}Z`
}

// ── The summit (viewBox 0 0 1440 780) ───────────────────────────────────────

export const SUMMIT_H = 780
export const APEX: [number, number] = [1066, 100]

export const SUMMIT = {
  far: `M0 780L0 690L90 650L170 668L260 590L330 628L420 572L520 640L600 606L660 780Z`,
  shoulderLit: `M560 780L760 352L790 360L812 420L730 780Z`,
  shoulderShade: `M790 360L900 470L980 780L730 780L812 420Z`,
  lit: `M640 780L1066 100L1088 190L1040 330L1070 470L1010 620L1040 780Z`,
  // The faces and the two snow tones share edges exactly. Each back layer
  // (shade, snowShade) is drawn first and tucks a few units under the layer in
  // front of its seam, so anti-aliasing never opens a hairline along the ridge.
  shade: `M1066 100L1440 470L1440 780L1036 780L1006 620L1066 470L1036 330L1084 190Z`,
  // Outer snow vertices sit on the face edges (973.3 / 1181.2 are on the
  // apex→640,780 and apex→1440,470 lines); the lit/shade split ends at 1064,260,
  // the ridge's midpoint, so the snow line continues the rock ridge below it.
  snowLit: `M1066 100L973.3 248L996 236L1012 270L1040 226L1064 260L1088 190Z`,
  snowShade: `M1066 100L1181.2 214L1196 256L1150 230L1128 268L1100 232L1064 260L1062 256L1084 190Z`,
}
