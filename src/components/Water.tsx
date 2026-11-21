import { useId, useRef } from 'react'
import RangeLayers from '../art/RangeLayers'
import { SCENE_H, SCENE_W } from '../art/geometry'

const VISIBLE = 150 // units of the mirrored scene we keep

/**
 * The lake under the range: the mountains mirrored once, displaced by a single
 * low-octave noise pass whose region is bounded to the visible strip, then left
 * alone (it never re-rasterises). Moving across it adds ripple rings, created
 * and removed directly in the DOM so React never re-renders.
 */
export default function Water({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  const svg = useRef<SVGSVGElement>(null)
  const last = useRef(0)
  const mask = 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 96%)'

  const onMove = (e: React.PointerEvent) => {
    const now = performance.now()
    const el = svg.current
    if (!el || now - last.current < 180 || el.querySelectorAll('.water-ring').length > 4) return
    last.current = now
    const r = el.getBoundingClientRect()
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
    ring.setAttribute('class', 'water-ring')
    ring.setAttribute('cx', String(((e.clientX - r.left) / r.width) * SCENE_W))
    ring.setAttribute('cy', String(((e.clientY - r.top) / r.height) * VISIBLE))
    ring.setAttribute('rx', '6')
    ring.setAttribute('ry', '1.6')
    ring.setAttribute('fill', 'none')
    ring.setAttribute('stroke', '#eeebe2')
    ring.setAttribute('stroke-width', '1.2')
    ring.addEventListener('animationend', () => ring.remove(), { once: true })
    el.appendChild(ring)
  }

  return (
    <div
      onPointerMove={onMove}
      aria-hidden="true"
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${SCENE_W} / ${VISIBLE}`, maskImage: mask, WebkitMaskImage: mask }}
    >
      <svg ref={svg} viewBox={`0 0 ${SCENE_W} ${VISIBLE}`} className="absolute inset-0 h-full w-full">
        <defs>
          <filter
            id={`ripple-${uid}`}
            filterUnits="userSpaceOnUse"
            x="0"
            y={SCENE_H - VISIBLE - 20}
            width={SCENE_W}
            height={VISIBLE + 20}
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.05" numOctaves="1" seed="7" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="36" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g transform={`translate(0 ${SCENE_H}) scale(1 -1)`}>
          <g filter={`url(#ripple-${uid})`} opacity="0.6">
            <RangeLayers />
          </g>
        </g>
      </svg>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(61,66,104,0.15), rgba(61,66,104,0.55))' }} />
    </div>
  )
}
