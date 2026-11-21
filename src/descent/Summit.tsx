import { useEffect, useRef } from 'react'
import { APEX, STRATA, SUMMIT, SUMMIT_H, W } from './terrain'

// The peak the page starts on: one snow-capped summit, a shoulder, a far range,
// standing behind the ridge the Work band draws on its top edge. The peak sits
// right of centre so the name keeps the open sky to its left, and low enough
// that the flag clears the fixed Resume / Let's talk bar.
const SHIFT = 70
const DROP = 195

export default function Summit({ className = '' }: { className?: string }) {
  const [ax, ay] = APEX
  const ref = useRef<SVGSVGElement>(null)

  // The flag's wave repaints the svg each frame; stop it once the summit has
  // scrolled away so it isn't competing with the scroll for frames.
  useEffect(() => {
    const svg = ref.current
    const flag = svg?.querySelector('.summit-flag')
    if (!svg || !flag) return
    const io = new IntersectionObserver(([e]) => flag.classList.toggle('is-paused', !e.isIntersecting))
    io.observe(svg)
    return () => io.disconnect()
  }, [])

  return (
    <svg
      ref={ref}
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
        <path d={SUMMIT.lit} fill="#c9cce6" />
        <path d={SUMMIT.shade} fill="#646d9c" />
        <path d={SUMMIT.snowLit} fill="#eeebe2" />
        <path d={SUMMIT.snowShade} fill="#b9bde0" />
        {/* The pole is planted a few units into the snow so it reads as standing on the apex. */}
        <g transform={`translate(${ax - 1.5} ${ay + 6})`}>
          <rect x="0" y="-64" width="3" height="64" fill={STRATA.valley} />
          <path className="summit-flag" d="M3 -64L40 -56L3 -44Z" fill="#eeebe2" />
        </g>
      </g>
    </svg>
  )
}
