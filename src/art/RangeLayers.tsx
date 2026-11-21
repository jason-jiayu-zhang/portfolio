import { memo } from 'react'
import { CENTER, DEPTH, DUNE_LIT, DUNE_SHADE, FAR, MID } from './geometry'

const layer = (d: number) => ({ ['--d' as string]: d }) as React.CSSProperties

function Peak({ p, lit, shade }: { p: { lit: string; shade: string }; lit: string; shade: string }) {
  return (
    <>
      <path d={p.lit} fill={lit} />
      <path d={p.shade} fill={shade} />
    </>
  )
}

/**
 * The hero range: 14 paths in four depth layers. With `parallax` each layer
 * carries a depth for the pointer drift; the reflection renders them flat.
 */
function RangeLayers({ parallax = false }: { parallax?: boolean }) {
  const cls = parallax ? 'ls-layer' : undefined
  return (
    <>
      <g className={cls} style={parallax ? layer(DEPTH.far) : undefined}>
        {FAR.map((p, i) => (
          <Peak key={i} p={p} lit="var(--m-peri-lit)" shade="var(--m-peri-shade)" />
        ))}
      </g>
      <g className={cls} style={parallax ? layer(DEPTH.mid) : undefined}>
        {MID.map((p, i) => (
          <Peak key={i} p={p} lit="var(--m-dark-lit)" shade="var(--m-dark-shade)" />
        ))}
      </g>
      <g className={cls} style={parallax ? layer(DEPTH.center) : undefined}>
        <Peak p={CENTER} lit="var(--m-peri-lit)" shade="var(--m-peri-shade)" />
      </g>
      <g className={cls} style={parallax ? layer(DEPTH.dune) : undefined}>
        <path d={DUNE_LIT} fill="var(--m-sand-lit)" />
        <path d={DUNE_SHADE} fill="var(--m-sand-shade)" />
      </g>
    </>
  )
}

export default memo(RangeLayers)
