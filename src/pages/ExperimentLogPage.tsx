// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE B — Informal Experiment Log Page
// Route: /studio/:id
// Layout: Centered single-column dev-log with oversized visual frame
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { EXPERIMENTS } from '../data/portfolio'
import NotFoundPage from './NotFoundPage'

// ── Type-safe props ────────────────────────────────────────────────────────────
interface ExperimentProps {
  index: number
}

// ── Geometric SVG motifs for the visual frame ──────────────────────────────────
// Unique geometry per experiment, cycling through 6 motifs
function ExperimentGeometric({ index }: ExperimentProps) {
  const motif = index % 6
  const cx = 160
  const cy = 160

  if (motif === 0) {
    // Concentric circles with precision crosshair
    return (
      <>
        {[120, 90, 62, 38, 18].map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={i % 2 === 0 ? '#cfccbb' : '#a39d7b'}
            strokeWidth={i === 0 ? 0.5 : 0.35}
            opacity={0.06 + i * 0.035}
            strokeDasharray={i === 1 || i === 3 ? '3 7' : undefined}
          />
        ))}
        <line x1={cx - 130} y1={cy} x2={cx + 130} y2={cy} stroke="#a39d7b" strokeWidth={0.3} opacity={0.1} />
        <line x1={cx} y1={cy - 130} x2={cx} y2={cy + 130} stroke="#a39d7b" strokeWidth={0.3} opacity={0.1} />
        <line x1={cx - 12} y1={cy} x2={cx + 12} y2={cy} stroke="#cfccbb" strokeWidth={0.7} opacity={0.3} />
        <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke="#cfccbb" strokeWidth={0.7} opacity={0.3} />
        <circle cx={cx} cy={cy} r={3} fill="#cfccbb" opacity={0.15} />
      </>
    )
  }
  if (motif === 1) {
    // Hexagonal lattice
    const hex = (hx: number, hy: number, r: number) =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 30) * (Math.PI / 180)
        return `${hx + r * Math.cos(a)},${hy + r * Math.sin(a)}`
      }).join(' ')
    return (
      <>
        {[110, 78, 48, 24].map((r, i) => (
          <polygon
            key={r}
            points={hex(cx, cy, r)}
            fill="none"
            stroke="#cfccbb"
            strokeWidth={0.4}
            opacity={0.05 + i * 0.045}
          />
        ))}
        <polygon points={hex(cx, cy, 10)} fill="#cfccbb" opacity={0.08} />
        <circle cx={cx} cy={cy} r={120} fill="none" stroke="#a39d7b" strokeWidth={0.3} opacity={0.07} strokeDasharray="4 10" />
      </>
    )
  }
  if (motif === 2) {
    // 16-fold radial burst
    return (
      <>
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i * 22.5) * (Math.PI / 180)
          const r = i % 2 === 0 ? 120 : 80
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke={i % 2 === 0 ? '#a39d7b' : '#cfccbb'}
              strokeWidth={0.3}
              opacity={i % 2 === 0 ? 0.1 : 0.06}
            />
          )
        })}
        {[100, 60, 25].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#cfccbb" strokeWidth={0.35} opacity={0.07 + i * 0.03} />
        ))}
        <circle cx={cx} cy={cy} r={5} fill="none" stroke="#cfccbb" strokeWidth={0.8} opacity={0.25} />
        <circle cx={cx} cy={cy} r={2} fill="#cfccbb" opacity={0.2} />
      </>
    )
  }
  if (motif === 3) {
    // Nested squares + fine grid
    return (
      <>
        {[-90, -60, -30, 0, 30, 60, 90].map((offset) => (
          <g key={offset}>
            <line x1={cx + offset} y1={cy - 120} x2={cx + offset} y2={cy + 120} stroke="#cfccbb" strokeWidth={0.25} opacity={0.06} />
            <line x1={cx - 120} y1={cy + offset} x2={cx + 120} y2={cy + offset} stroke="#cfccbb" strokeWidth={0.25} opacity={0.06} />
          </g>
        ))}
        {[100, 68, 38].map((s, i) => (
          <rect
            key={s}
            x={cx - s / 2}
            y={cy - s / 2}
            width={s}
            height={s}
            fill="none"
            stroke="#a39d7b"
            strokeWidth={0.4}
            opacity={0.08 + i * 0.05}
            transform={`rotate(${i * 15} ${cx} ${cy})`}
          />
        ))}
      </>
    )
  }
  if (motif === 4) {
    // Golden ratio arcs
    return (
      <>
        {[12, 22, 36, 58, 94, 118].map((r, i) => (
          <path
            key={r}
            d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#cfccbb"
            strokeWidth={0.4}
            opacity={0.06 + i * 0.025}
          />
        ))}
        <circle cx={cx} cy={cy} r={118} fill="none" stroke="#a39d7b" strokeWidth={0.3} opacity={0.08} strokeDasharray="5 10" />
        <circle cx={cx} cy={cy} r={4} fill="none" stroke="#cfccbb" strokeWidth={0.6} opacity={0.2} />
      </>
    )
  }
  // motif === 5: Diamond constellation
  return (
    <>
      {[[-80, 0], [0, -80], [80, 0], [0, 80], [-50, -50], [50, -50], [50, 50], [-50, 50], [0, 0]].map(
        ([dx, dy], i) => (
          <polygon
            key={i}
            points={`${cx + dx},${cy + dy - 22} ${cx + dx + 22},${cy + dy} ${cx + dx},${cy + dy + 22} ${cx + dx - 22},${cy + dy}`}
            fill="none"
            stroke="#cfccbb"
            strokeWidth={0.35}
            opacity={i === 8 ? 0.2 : 0.07}
          />
        )
      )}
      <circle cx={cx} cy={cy} r={112} fill="none" stroke="#a39d7b" strokeWidth={0.3} opacity={0.08} strokeDasharray="3 8" />
    </>
  )
}

// ── Section label with hairline ────────────────────────────────────────────────
function LogSectionHead({
  index,
  label,
  mounted,
  mountDelay,
}: {
  index: string
  label: string
  mounted: boolean
  mountDelay: number
}) {
  return (
    <div
      className="flex items-center gap-4 mb-6 pb-3"
      style={{
        borderBottom: '1px solid rgba(56,64,106,0.35)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.2s ease ${mountDelay}ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
      }}
    >
      <span className="font-mono text-xs text-parchment/65 pb-0.5">{index}</span>
      <div className="w-4 h-px bg-accent/40" />
      <span className="font-mono text-xs tracking-label uppercase text-gold/88">{label}</span>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ExperimentLogPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  const expIndex = EXPERIMENTS.findIndex((e) => e.id === id)
  const exp = EXPERIMENTS[expIndex]

  const prev = EXPERIMENTS[expIndex - 1]
  const next = EXPERIMENTS[expIndex + 1]

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [id])

  if (!exp) {
    return <NotFoundPage />
  }

  const log = exp.log
  const logNumber = String(expIndex + 1).padStart(2, '0')

  return (
    <div className="min-h-screen" style={{ paddingTop: '48px' }}>

      {/* ── BREADCRUMB STRIP ──────────────────────────────────────────────────── */}
      <div
        className="px-6 lg:px-16 py-4 flex items-center justify-between"
        style={{
          borderBottom: '1px solid rgba(56,64,106,0.3)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.2s ease 60ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 60ms',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="group font-mono text-xs tracking-label text-parchment/65 hover:text-parchment/65 uppercase transition-colors flex items-center gap-2"
          >
            <svg viewBox="0 0 12 8" className="w-3 h-3 text-parchment/65 group-hover:text-parchment/65 transition-colors">
              <path d="M8 1 L2 4 L8 7" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="2" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            Studio
          </button>
          <span className="font-mono text-xs text-parchment/65">/</span>
          <span className="font-mono text-xs tracking-label text-parchment/65 uppercase">{exp.category}</span>
          <span className="font-mono text-xs text-parchment/65">/</span>
          <span className="font-mono text-xs text-parchment/70">{exp.title}</span>
        </div>
        <span
          className="font-mono text-xs tracking-label"
          style={{ color: '#a39d7b', opacity: mounted ? 0.4 : 0, transition: 'opacity 0.2s ease 200ms' }}
        >
          [LOG // OFF_A_WHIM_{logNumber}]
        </span>
      </div>

      {/* ── BODY — Centered single column, max 720px ──────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 space-y-20">

        {/* ── Title block ─────────────────────────────────────────────────────── */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.2s ease 120ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 120ms',
          }}
        >
          <p className="font-mono text-xs tracking-label text-gold/88 uppercase mb-4">{exp.contextLabel}</p>
          <h1
            className="font-sans font-black text-parchment leading-none"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.05em' }}
          >
            {exp.title}
          </h1>
          {/* Thin gold underline accent */}
          <div className="mt-4 h-px w-16" style={{ backgroundColor: '#a39d7b', opacity: 0.35 }} />
        </div>

        {/* ── Oversized geometric visual frame ────────────────────────────────── */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: '4 / 3',
            border: '1px solid rgba(163,157,123,0.2)',
            backgroundColor: 'rgba(28,32,53,0.5)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.2s ease 200ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 200ms',
          }}
        >
          {/* Corner bracket SVGs — fine #a39d7b lines */}
          {/* Top-left */}
          <svg viewBox="0 0 24 24" className="absolute top-0 left-0 w-6 h-6" aria-hidden="true">
            <path d="M0 14 L0 0 L14 0" fill="none" stroke="#a39d7b" strokeWidth="1" opacity="0.35" />
          </svg>
          {/* Top-right */}
          <svg viewBox="0 0 24 24" className="absolute top-0 right-0 w-6 h-6" aria-hidden="true">
            <path d="M24 14 L24 0 L10 0" fill="none" stroke="#a39d7b" strokeWidth="1" opacity="0.35" />
          </svg>
          {/* Bottom-left */}
          <svg viewBox="0 0 24 24" className="absolute bottom-0 left-0 w-6 h-6" aria-hidden="true">
            <path d="M0 10 L0 24 L14 24" fill="none" stroke="#a39d7b" strokeWidth="1" opacity="0.35" />
          </svg>
          {/* Bottom-right */}
          <svg viewBox="0 0 24 24" className="absolute bottom-0 right-0 w-6 h-6" aria-hidden="true">
            <path d="M24 10 L24 24 L10 24" fill="none" stroke="#a39d7b" strokeWidth="1" opacity="0.35" />
          </svg>

          {/* Experiment image if available, else geometric placeholder */}
          {exp.imageUrl ? (
            <img
              src={exp.imageUrl}
              alt={exp.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 320 320"
                className="w-64 h-64 lg:w-80 lg:h-80"
                aria-hidden="true"
              >
                <ExperimentGeometric index={expIndex} />
              </svg>
            </div>
          )}

          {/* Visual type label — bottom left of frame */}
          <div className="absolute bottom-4 left-4">
            <span className="font-mono text-xs tracking-label" style={{ color: '#a39d7b', opacity: 0.9 }}>
              [{exp.visualAssetType.toUpperCase().replace(/ /g, '_')}]
            </span>
          </div>
        </div>

        {/* ── THE SPARK ────────────────────────────────────────────────────────── */}
        {log?.spark && (
          <div>
            <LogSectionHead index="01" label="The Spark" mounted={mounted} mountDelay={300} />
            <p
              className="font-mono text-sm text-parchment/65 leading-[1.9]"
              style={{
                fontStyle: 'italic',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.2s ease 360ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 360ms',
              }}
            >
              {log.spark}
            </p>
          </div>
        )}

        {/* ── THE OUTPUT ───────────────────────────────────────────────────────── */}
        {log?.output && (
          <div>
            <LogSectionHead index="02" label="The Output" mounted={mounted} mountDelay={460} />
            <p
              className="font-sans font-black text-parchment leading-tight"
              style={{
                fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                letterSpacing: '-0.03em',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.2s ease 520ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 520ms',
              }}
            >
              {log.output}
            </p>
          </div>
        )}

        {/* ── BEHIND THE SANDBOX ───────────────────────────────────────────────── */}
        {log?.sandbox && (
          <div>
            <LogSectionHead index="03" label="Behind the Sandbox" mounted={mounted} mountDelay={580} />
            <div
              className="px-6 py-5 border-l-2"
              style={{
                borderColor: 'rgba(163,157,123,0.35)',
                backgroundColor: 'rgba(163,157,123,0.03)',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.2s ease 640ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 640ms',
              }}
            >
              <p className="font-mono text-xs text-parchment/65 leading-[1.85]">{log.sandbox}</p>
            </div>
          </div>
        )}

        {/* No log fallback */}
        {!log && (
          <div
            className="py-16 text-center"
            style={{
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.2s ease 300ms',
            }}
          >
            <p className="font-mono text-xs tracking-label text-parchment/65 uppercase mb-3">Log Entry Pending</p>
            <p className="font-mono text-xs text-parchment/65 max-w-xs mx-auto leading-relaxed">{exp.description}</p>
          </div>
        )}

        {/* ── METADATA STRIP ───────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-3"
          style={{
            borderTop: '1px solid rgba(56,64,106,0.3)',
            borderBottom: '1px solid rgba(56,64,106,0.3)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.2s ease 720ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 720ms',
          }}
        >
          {[
            { label: 'Year', value: String(exp.year) },
            { label: 'Type', value: exp.visualAssetType },
            { label: 'Status', value: exp.category === 'published' ? 'Published' : 'Conceptual' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 px-4 py-4"
              style={{ borderRight: i < 2 ? '1px solid rgba(56,64,106,0.3)' : undefined }}
            >
              <span className="font-mono text-xs tracking-label text-parchment/65 uppercase">{item.label}</span>
              <span className="font-mono text-xs text-parchment/65">{item.value}</span>
            </div>
          ))}
        </div>

        {/* ── EXPERIMENT NAVIGATION ────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between"
          style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.2s ease 800ms',
          }}
        >
          {prev ? (
            <Link to={`/studio/${prev.id}`} className="group flex items-center gap-3">
              <span className="font-mono text-sm text-parchment/65 group-hover:text-parchment/65 transition-colors">←</span>
              <div>
                <p className="font-mono text-xs tracking-label text-parchment/65 uppercase">Previous</p>
                <p
                  className="font-sans font-semibold text-parchment/65 group-hover:text-parchment transition-colors duration-200"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link to={`/studio/${next.id}`} className="group flex items-center gap-3 text-right">
              <div>
                <p className="font-mono text-xs tracking-label text-parchment/65 uppercase">Next</p>
                <p
                  className="font-sans font-semibold text-parchment/65 group-hover:text-parchment transition-colors duration-200"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {next.title}
                </p>
              </div>
              <span className="font-mono text-sm text-parchment/65 group-hover:text-parchment/65 transition-colors">→</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
