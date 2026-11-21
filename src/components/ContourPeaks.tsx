import { useMemo } from 'react'
import { contourPeaks } from '../art/geometry'

// Line-art peaks: one outline repeated down the slope, fading as it goes.
export default function ContourPeaks({ seed, className = '' }: { seed: number; className?: string }) {
  const peaks = useMemo(() => contourPeaks(seed), [seed])
  return (
    <svg className={className} viewBox="0 0 240 120" aria-hidden="true" preserveAspectRatio="xMidYMax meet" style={{ display: 'block', width: '100%', height: 'auto' }}>
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={k} transform={`translate(0 ${-k * 0})`} opacity={1 - k * 0.17}>
          {peaks.map((p, i) => (
            <path
              key={i}
              d={p.d}
              transform={`translate(${k * 0} ${k * 7 - 6})`}
              fill="none"
              stroke="var(--sand)"
              strokeWidth="0.7"
              strokeLinejoin="round"
              clipPath="url(#contour-clip)"
            />
          ))}
        </g>
      ))}
      <clipPath id="contour-clip">
        <rect x="0" y="0" width="240" height="118" />
      </clipPath>
    </svg>
  )
}
