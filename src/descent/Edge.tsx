import { conifers, ridge, shore, STRATA, swells, W } from './terrain'

type Kind = 'ridge' | 'treeline' | 'shore' | 'camp' | 'valley'

const H: Record<Kind, number> = { ridge: 120, treeline: 150, shore: 130, camp: 120, valley: 110 }
const WATERLINE = 96

const PATHS: Record<Kind, string> = {
  ridge: ridge(7, H.ridge, 0.3, 0.95),
  treeline: conifers(19, H.treeline),
  shore: `M0 ${WATERLINE}L${W} ${WATERLINE}L${W} ${H.shore}L0 ${H.shore}Z`,
  // A low meadow that flattens where the tent is pitched.
  camp: 'M0 96C220 76 420 106 640 92S820 82 880 84L1010 84C1120 84 1240 70 1440 80L1440 120L0 120Z',
  valley: swells(31, H.valley),
}

const FILL: Record<Kind, string> = {
  ridge: STRATA.alpine,
  treeline: STRATA.treeline,
  shore: STRATA.lake,
  camp: STRATA.camp,
  valley: STRATA.valley,
}

/**
 * The silhouette where one altitude band gives way to the next. It sits on top
 * of the band it belongs to, drawn in that band's colour, overlapping the band
 * above by its own height.
 */
export default function Edge({ kind }: { kind: Kind }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H[kind]}`}
      preserveAspectRatio={kind === 'treeline' || kind === 'camp' ? 'xMidYMax slice' : 'none'}
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-x-0 bottom-full block w-full translate-y-px ${
        // The ridge rises into the hero, so it stays shallow enough to clear the proof line.
        kind === 'ridge'
          ? 'h-[var(--ridge-h,clamp(40px,5vw,80px))]'
          : // The treeline keeps the viewBox's own proportions (never shorter), so the
            // slice only ever trims the sides and never crops the crowns off the top.
            kind === 'treeline'
            ? 'h-auto min-h-[64px]'
            : 'h-[clamp(64px,10vw,150px)]'
      }`}
      style={kind === 'treeline' ? { aspectRatio: `${W} / ${H.treeline}` } : undefined}
    >
      {kind === 'shore' && <path d={shore(29, H.shore, WATERLINE + 1)} fill="#353a60" />}
      <path d={PATHS[kind]} fill={FILL[kind]} />
      {kind === 'camp' && (
        // One A-frame tent pitched on the flat, its doorway lit from inside.
        <>
          <path d="M890 85L945 30L1000 85Z" fill={STRATA.camp} />
          <path d="M936 85L945 60L954 85Z" fill="#cfccbb" />
        </>
      )}
      {kind === 'shore' && (
        <g stroke="#c9cce6" strokeOpacity="0.3" strokeWidth="1.4" vectorEffect="non-scaling-stroke">
          <line x1="180" x2="420" y1="106" y2="106" />
          <line x1="620" x2="760" y1="114" y2="114" />
          <line x1="980" x2="1260" y1="104" y2="104" />
          <line x1="300" x2="380" y1="122" y2="122" />
        </g>
      )}
    </svg>
  )
}
