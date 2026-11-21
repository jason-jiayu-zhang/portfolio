import RipplingFlag from './RipplingFlag'
import { APEX, STRATA, SUMMIT, SUMMIT_H, W } from './terrain'

// The peak the page starts on: one snow-capped summit, a shoulder, a far range,
// standing behind the ridge the Work band draws on its top edge. The peak sits
// right of centre so the name keeps the open sky to its left, and low enough
// that the flag clears the fixed Resume / Let's talk bar.
const SHIFT = 70
const DROP = 195

export default function Summit({ className = '' }: { className?: string }) {
  const [ax, ay] = APEX

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${SUMMIT_H}`}
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <path d={SUMMIT.far} fill="#838dc8" />
      <g transform={`translate(${SHIFT} ${DROP})`}>
        <path d={SUMMIT.shoulderLit} fill="#a9afd8" />
        <path d={SUMMIT.shoulderShade} fill="#5d669a" />
        {/* Back layer first: shade and snowShade run under their lit neighbours. */}
        <path d={SUMMIT.shade} fill="#646d9c" />
        <path d={SUMMIT.lit} fill="#c9cce6" />
        <path d={SUMMIT.snowShade} fill="#b9bde0" />
        <path d={SUMMIT.snowLit} fill="#eeebe2" />
        {/* The pole is planted a few units into the snow so it reads as standing on the apex.
            The flag starts under the pole (x=1) so its hoist edge never shows a seam. */}
        <g transform={`translate(${ax - 1.5} ${ay + 6})`}>
          <RipplingFlag x={1} top={-64} bottom={-44} tip={[40, -56]} fill="#eeebe2" />
          <rect x="0" y="-64" width="3" height="64" fill={STRATA.valley} />
        </g>
      </g>
    </svg>
  )
}
