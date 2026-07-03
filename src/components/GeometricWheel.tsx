import { memo, forwardRef, useImperativeHandle, useRef } from 'react'
import {
  polarToCartesian,
  generateTicksPath,
  SNAP_INTERVAL,
  normalizeAngle,
} from '../utils/wheelMath'
import type { Project, WheelRing } from '../types/portfolio'
import { useIntro } from './IntroContext'

export interface WheelHandle {
  setRotation: (angle: number, velocity?: number) => void
}

interface GeometricWheelProps {
  rotationAngle: number
  activeIndex: number
  projects: Project[]
}

// ── RING DEFINITIONS ──────────────────────────────────────────────────────────
// Multi-layer mandala: outermost → innermost
const RINGS: WheelRing[] = [
  { radius: 276, strokeWidth: 0.5, opacity: 0.12, dashed: true, dashArray: '1 8', ticks: 120, tickLength: 4 },
  { radius: 264, strokeWidth: 0.5, opacity: 0.20, ticks: 60, tickLength: 6 },
  { radius: 252, strokeWidth: 1, opacity: 0.15 },
  { radius: 236, strokeWidth: 0.5, opacity: 0.30, ticks: 24, tickLength: 5 },
  { radius: 218, strokeWidth: 1, opacity: 0.12, dashed: true, dashArray: '3 6' },
  { radius: 200, strokeWidth: 1.5, opacity: 0.35, ticks: 12, tickLength: 8 },
  { radius: 184, strokeWidth: 0.5, opacity: 0.20 },
  { radius: 168, strokeWidth: 0.5, opacity: 0.15, dashed: true, dashArray: '2 4' },
  { radius: 148, strokeWidth: 1, opacity: 0.25, ticks: 36, tickLength: 4 },
  { radius: 130, strokeWidth: 1.5, opacity: 0.40 },
  { radius: 110, strokeWidth: 0.5, opacity: 0.18, ticks: 24, tickLength: 5 },
  { radius: 88,  strokeWidth: 1, opacity: 0.30 },
  { radius: 68,  strokeWidth: 0.5, opacity: 0.20, dashed: true, dashArray: '2 5' },
  { radius: 48,  strokeWidth: 1, opacity: 0.35, ticks: 12, tickLength: 6 },
  { radius: 28,  strokeWidth: 0.5, opacity: 0.25 },
]

const CX = 300
const CY = 300
const PARCHMENT = '#cfccbb'
const GOLD = '#a39d7b'

// ── PROJECT LABEL POSITIONS (4 compass points on main ring) ─────────────────
const LABEL_RADIUS = 222

const StaticBackground = memo(() => {
  const { hasLoaded } = useIntro()
  
  return (
  <g>
    <defs>
      <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={GOLD} stopOpacity="0.04" />
        <stop offset="60%" stopColor={GOLD} stopOpacity="0.015" />
        <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={PARCHMENT} stopOpacity="0.15" />
        <stop offset="100%" stopColor={PARCHMENT} stopOpacity="0" />
      </radialGradient>
      <clipPath id="wheelClip">
        <circle cx={CX} cy={CY} r={280} />
      </clipPath>
    </defs>
    
    <style>{`
      @keyframes spin-cw {
        from { transform: rotate(0deg) translateZ(0); }
        to { transform: rotate(360deg) translateZ(0); }
      }
      @keyframes spin-ccw {
        from { transform: rotate(0deg) translateZ(0); }
        to { transform: rotate(-360deg) translateZ(0); }
      }
      @keyframes pulse-opacity {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      .ambient-ring-cw {
        transform-origin: ${CX}px ${CY}px;
        animation: spin-cw 400s linear infinite;
        will-change: transform;
      }
      .ambient-ring-ccw {
        transform-origin: ${CX}px ${CY}px;
        animation: spin-ccw 300s linear infinite;
        will-change: transform;
      }
      .pulse-active {
        animation: pulse-opacity 2.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        will-change: opacity;
      }
    `}</style>

    <g className={!hasLoaded ? "animate-vector-draw" : ""} style={{ animationDuration: '1.3s', animationDelay: !hasLoaded ? '450ms' : '0ms' }}>
      <circle cx={CX} cy={CY} r={280} fill="url(#wheelGlow)" />
    </g>

    {RINGS.map((ring, i) => {
      let ambientClass = ""
      if (ring.dashed) {
        ambientClass = i % 2 === 0 ? "ambient-ring-cw" : "ambient-ring-ccw"
      }
      return (
        <g key={`ring-static-${i}`} className={!hasLoaded ? "animate-vector-draw" : ""} style={{ animationDuration: '1.3s', animationDelay: !hasLoaded ? `${(RINGS.length - 1 - i) * 30}ms` : '0ms' }}>
          <g className={ambientClass}>
            <circle
              cx={CX}
              cy={CY}
              r={ring.radius}
              fill="none"
              stroke={PARCHMENT}
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
              strokeDasharray={ring.dashed ? ring.dashArray : undefined}
            />
          </g>
        </g>
      )
    })}
  </g>
  )
})
StaticBackground.displayName = 'StaticBackground'

const StaticRotatingMandalas = memo(() => {
  // Batch Star 12-point
  let starPath = ''
  for (let i = 0; i < 12; i++) {
    const a1 = i * 30
    const a2 = a1 + 15
    const p1 = polarToCartesian(CX, CY, 110, a1)
    const p2 = polarToCartesian(CX, CY, 68, a2)
    const p3 = polarToCartesian(CX, CY, 110, a1 + 30)
    starPath += `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} `
  }

  // Batch 6-point hexagon lines
  let hexPath = ''
  for (let i = 0; i < 6; i++) {
    const a = i * 60
    const p1 = polarToCartesian(CX, CY, 130, a)
    const p2 = polarToCartesian(CX, CY, 130, a + 60)
    hexPath += `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} `
  }

  // Batch 4-fold cross lines
  let crossPath = ''
  for (const deg of [0, 90, 180, 270]) {
    const p1 = polarToCartesian(CX, CY, 88, deg)
    const p2 = polarToCartesian(CX, CY, 88, deg + 90)
    crossPath += `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} `
  }

  // Batch spiral ticks
  let spiralPath = ''
  for (let i = 0; i < 48; i++) {
    const a = i * 7.5
    const r1 = 48 + (i % 4) * 2
    const r2 = r1 - 4
    const p1 = polarToCartesian(CX, CY, r1, a)
    const p2 = polarToCartesian(CX, CY, r2, a)
    spiralPath += `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} `
  }

  const { hasLoaded } = useIntro()

  return (
    <g className={!hasLoaded ? "animate-vector-draw" : ""} style={{ animationDuration: '1.3s' }}>
      {RINGS.map((ring, ri) =>
        ring.ticks ? (
          <path
            key={`ticks-${ri}`}
            d={generateTicksPath(CX, CY, ring.radius, ring.ticks, ring.tickLength ?? 5)}
            fill="none"
            stroke={PARCHMENT}
            strokeWidth={ring.strokeWidth * 0.8}
            opacity={ring.opacity * 0.8}
          />
        ) : null
      )}
      
      <path d={starPath.trim()} fill="none" stroke={PARCHMENT} strokeWidth={0.4} opacity={0.15} />
      <path d={hexPath.trim()} fill="none" stroke={PARCHMENT} strokeWidth={0.4} opacity={0.12} />
      <path d={crossPath.trim()} fill="none" stroke={GOLD} strokeWidth={0.35} opacity={0.15} />
      <path d={spiralPath.trim()} fill="none" stroke={PARCHMENT} strokeWidth={0.3} opacity={0.12} />
    </g>
  )
})
StaticRotatingMandalas.displayName = 'StaticRotatingMandalas'

const GeometricWheel = memo(forwardRef<WheelHandle, GeometricWheelProps>(({ rotationAngle, activeIndex, projects }, ref) => {
  const rot = rotationAngle
  const rotatingGroupRef = useRef<SVGGElement>(null)
  const degreeTextRef = useRef<SVGTextElement>(null)
  const labelRefs = useRef<(SVGGElement | null)[]>([])

  const { hasLoaded, phase } = useIntro()

  // A label rotated past the bottom half of the wheel reads upside-down unless
  // we counter-flip it 180° around its own anchor — recomputed every frame since
  // setRotation drives the wheel imperatively, bypassing React re-renders.
  const updateLabelOrientations = (angle: number) => {
    labelRefs.current.forEach((g, i) => {
      if (!g) return
      const angleDeg = -i * SNAP_INTERVAL
      const effective = normalizeAngle(angle + angleDeg)
      const flip = effective > 90 && effective < 270
      const pos = polarToCartesian(CX, CY, LABEL_RADIUS, angleDeg)
      g.setAttribute('transform', `rotate(${angleDeg + (flip ? 180 : 0)} ${pos.x} ${pos.y})`)
    })
  }

  useImperativeHandle(ref, () => ({
    setRotation: (angle: number, velocity?: number) => {
      if (rotatingGroupRef.current) {
        const speed = Math.abs(velocity || 0)
        const scale = 1 - Math.min(speed * 0.005, 0.08)

        // Use pure SVG transform math to avoid Safari CSS transform-origin bugs.
        // translate(CX, CY) -> scale & rotate from 0,0 -> translate(-CX, -CY)
        rotatingGroupRef.current.setAttribute(
          'transform',
          `translate(${CX}, ${CY}) rotate(${angle}) scale(${scale}) translate(-${CX}, -${CY})`
        )
      }
      if (degreeTextRef.current) {
        const norm = ((angle % 360) + 360) % 360
        degreeTextRef.current.textContent = `${Math.round(norm).toString().padStart(3, '0')}°`
      }
      updateLabelOrientations(angle)
    },
  }))

  return (
    <g>
      <StaticBackground />

      {/* ── ROTATING GROUP (ticks + labels rotate with wheel) ─────────────── */}
      <g
        ref={rotatingGroupRef}
        transform={`translate(${CX}, ${CY}) rotate(${rot}) translate(-${CX}, -${CY})`}
        style={{ willChange: 'transform' }}
      >
        <StaticRotatingMandalas />

        {/* Dynamic cross-hairs at snap points */}
        {Array.from({ length: projects.length }, (_, i) => {
          const deg = -i * SNAP_INTERVAL
          const outer = polarToCartesian(CX, CY, 276, deg)
          const inner = polarToCartesian(CX, CY, 246, deg)
          const dotPos = polarToCartesian(CX, CY, 246, deg)
          const isActive = i === activeIndex
          const projColor = projects[i]?.accentColor ?? PARCHMENT
          
          const isPhase2 = hasLoaded || phase === 'phase02' || phase === 'phase03'
          const baseLineOpacity = isActive ? 0.9 : 0.25
          const baseDotOpacity = isActive ? 1 : 0.3

          return (
            <g key={`cardinal-${deg}`}>
              {/* Cardinal line */}
              <line
                x1={outer.x} y1={outer.y}
                x2={inner.x} y2={inner.y}
                stroke={isActive ? projColor : PARCHMENT}
                strokeWidth={isActive ? 1.5 : 0.5}
                opacity={isPhase2 ? baseLineOpacity : 0}
                style={{ 
                  filter: isActive ? `drop-shadow(0px 0px 3px ${projColor})` : 'none', 
                  transition: 'opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: hasLoaded ? '0ms' : `${200 + i * 80}ms`,
                  willChange: 'filter, opacity' 
                }}
              />
              {/* Cardinal dot */}
              <circle
                cx={dotPos.x}
                cy={dotPos.y}
                r={isActive ? 3.5 : 1.5}
                fill={isActive ? projColor : PARCHMENT}
                opacity={isPhase2 ? baseDotOpacity : 0}
                style={{ 
                  filter: isActive ? `drop-shadow(0px 0px 3px ${projColor})` : 'none', 
                  transition: 'opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: hasLoaded ? '0ms' : `${200 + i * 80}ms`,
                  willChange: 'filter, opacity' 
                }}
              />
            </g>
          )
        })}

        {/* Project label slugs at compass points */}
        {projects.map((proj, i) => {
          const angleDeg = -i * SNAP_INTERVAL
          const pos = polarToCartesian(CX, CY, LABEL_RADIUS, angleDeg)
          const isActive = i === activeIndex

          const isPhase2 = hasLoaded || phase === 'phase02' || phase === 'phase03'
          const baseTextOpacity = isActive ? 1 : 0.65

          // Keep label upright: flip 180° if it currently sits in the bottom half of the wheel
          const effective = normalizeAngle(rot + angleDeg)
          const initialFlip = effective > 90 && effective < 270

          return (
            <g
              key={`proj-label-${i}`}
              ref={(el) => { labelRefs.current[i] = el }}
              transform={`rotate(${angleDeg + (initialFlip ? 180 : 0)} ${pos.x} ${pos.y})`}
            >
              {/* Outer bracket arc segments */}
              <text
                className={isActive ? 'wheel-label-active' : 'wheel-label'}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily='"IBM Plex Mono", monospace'
                fontWeight={isActive ? 500 : 400}
                fill={isActive ? proj.accentColor : PARCHMENT}
                opacity={isPhase2 ? baseTextOpacity : 0}
                letterSpacing="0.1em"
                style={{ 
                  textTransform: 'uppercase',
                  filter: isActive ? `drop-shadow(0px 0px 3px ${proj.accentColor})` : 'none', 
                  transition: 'opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: hasLoaded ? '0ms' : `${250 + i * 80}ms`,
                  willChange: 'filter, opacity',
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                {proj.slug}
              </text>
            </g>
          )
        })}
      </g>

      {/* ── STATIC OVERLAY (never rotates) ─────────────────────────────────── */}

      {/* Active project accent arc — drawn at top (0°), fixed */}
      {(() => {
        const proj = projects[activeIndex]
        const arcColor = proj?.accentColor ?? PARCHMENT
        // Arc from -8° to 8° at main ring
        const arcR = 200
        const p1 = polarToCartesian(CX, CY, arcR, -8)
        const p2 = polarToCartesian(CX, CY, arcR, 8)
        return (
          <path
            className="pulse-active"
            d={`M ${p1.x} ${p1.y} A ${arcR} ${arcR} 0 0 1 ${p2.x} ${p2.y}`}
            fill="none"
            stroke={arcColor}
            strokeWidth={2}
            opacity={0.9}
            style={{ filter: `drop-shadow(0px 0px 6px ${arcColor})`, willChange: 'filter' }}
          />
        )
      })()}

      {/* Center glow on active snap */}
      <circle cx={CX} cy={CY} r={18} fill="url(#centerGlow)" opacity={0.6} />

      {/* Phase 01: Singular Vector Dot at center */}
      {!hasLoaded && (
        <circle cx={CX} cy={CY} r={2} fill={GOLD} className="animate-scale-dot" style={{ transformOrigin: `${CX}px ${CY}px` }} />
      )}

      {/* Center crosshair — static (rendered on top) */}
      <line x1={CX - 12} y1={CY} x2={CX + 12} y2={CY} stroke={PARCHMENT} strokeWidth={0.5} opacity={0.4} />
      <line x1={CX} y1={CY - 12} x2={CX} y2={CY + 12} stroke={PARCHMENT} strokeWidth={0.5} opacity={0.4} />
      <circle cx={CX} cy={CY} r={5} fill="none" stroke={PARCHMENT} strokeWidth={0.8} opacity={0.5} />
      <circle cx={CX} cy={CY} r={1.5} fill={PARCHMENT} opacity={0.6} />

      {/* Degree readout — top of wheel */}
      <text
        ref={degreeTextRef}
        x={CX}
        y={CY - 292}
        textAnchor="middle"
        fontFamily='"IBM Plex Mono", monospace'
        fontSize={7}
        fill={PARCHMENT}
        opacity={0.35}
        letterSpacing="0.1em"
      >
        {Math.round(normalizeAngle(rotationAngle)).toString().padStart(3, '0')}°
      </text>

      {/* Project count rings indicator — bottom */}
      <g transform={`translate(${CX}, ${CY + 300})`}>
        {projects.map((_, i) => (
          <circle
            key={`indicator-${i}`}
            className={i === activeIndex ? "pulse-active" : ""}
            cx={(i - (projects.length - 1) / 2) * 10}
            cy={-8}
            r={i === activeIndex ? 2.5 : 1.5}
            fill={i === activeIndex ? projects[i].accentColor : PARCHMENT}
            opacity={i === activeIndex ? 0.9 : 0.25}
          />
        ))}
      </g>
    </g>
  )
}))

GeometricWheel.displayName = 'GeometricWheel'
export default GeometricWheel
