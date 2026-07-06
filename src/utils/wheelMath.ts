// ─────────────────────────────────────────────────────────────────────────────
// WHEEL MATH — Rotation / Inertia / Snap Utilities
// Trigonometry for multi-layered mandala wheel selector
// ─────────────────────────────────────────────────────────────────────────────

import { WHEEL_SECTIONS } from '../data/about'

export const SNAP_COUNT = WHEEL_SECTIONS.length
export const SNAP_INTERVAL = 360 / Math.max(1, SNAP_COUNT)

export const toRad = (deg: number): number => (deg * Math.PI) / 180
export const toDeg = (rad: number): number => (rad * 180) / Math.PI

export const safeMod = (n: number, m: number): number => ((n % m) + m) % m
export const normalizeAngle = (angle: number): number => safeMod(angle, 360)

export const snapAngle = (angle: number): number => {
  // Directly clamp to the nearest continuous quadrant boundary without modulo-360 inversion
  const exactIndex = angle / SNAP_INTERVAL
  const roundedIndex = Math.round(exactIndex)
  return roundedIndex * SNAP_INTERVAL
}

export const angleToProjectIndex = (angle: number): number => {
  const i = Math.round(angle / SNAP_INTERVAL)
  return safeMod(i, SNAP_COUNT)
}

export const projectIndexToAngle = (index: number, currentAngle: number = 0): number => {
  // Find the closest target angle for the given index in continuous space
  const targetBase = index * SNAP_INTERVAL
  const diff = (targetBase - currentAngle) % 360
  // Normalize delta to [-180, 180], prioritizing positive direction on exact 180 tie
  let delta = (diff + 540) % 360 - 180
  if (delta === -180) delta = 180
  
  return currentAngle + delta
}

export const applyFriction = (velocity: number, friction = 0.88): number =>
  Math.abs(velocity) < 0.01 ? 0 : velocity * friction

export const angularDelta = (from: number, to: number): number => {
  const diff = safeMod(to - from, 360)
  return diff > 180 ? diff - 360 : diff
}

export const springToward = (
  current: number,
  target: number,
  stiffness = 0.1
): number => {
  const delta = target - current
  return current + delta * stiffness
}

export const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } => {
  const rad = toRad(angleDeg - 90)
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

export const describeArc = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(cx, cy, radius, startAngle)
  const end = polarToCartesian(cx, cy, radius, endAngle)
  const largeArcFlag = safeMod(endAngle - startAngle, 360) <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

export const generateTicks = (
  cx: number,
  cy: number,
  radius: number,
  count: number,
  length: number,
  offset = 0
): Array<{ x1: number; y1: number; x2: number; y2: number }> => {
  return Array.from({ length: count }, (_, i) => {
    const angle = offset + (i * 360) / count
    const outer = polarToCartesian(cx, cy, radius, angle)
    const inner = polarToCartesian(cx, cy, radius - length, angle)
    return { x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y }
  })
}

export const generateTicksPath = (
  cx: number,
  cy: number,
  radius: number,
  count: number,
  length: number,
  offset = 0
): string => {
  let path = ''
  for (let i = 0; i < count; i++) {
    const angle = offset + (i * 360) / count
    const outer = polarToCartesian(cx, cy, radius, angle)
    const inner = polarToCartesian(cx, cy, radius - length, angle)
    path += `M ${outer.x} ${outer.y} L ${inner.x} ${inner.y} `
  }
  return path.trim()
}

export const circleToPath = (cx: number, cy: number, r: number): string =>
  `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy}`

export const getMouseAngle = (
  e: { clientX: number; clientY: number },
  rect: DOMRect,
  cx: number,
  cy: number
): number => {
  const x = e.clientX - rect.left - cx
  const y = e.clientY - rect.top - cy
  const radians = Math.atan2(y, x)
  return toDeg(radians) + 90
}

export const clampVelocity = (vel: number, max = 12): number =>
  Math.max(-max, Math.min(max, vel))
