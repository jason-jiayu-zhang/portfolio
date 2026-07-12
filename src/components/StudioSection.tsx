import { Link } from 'react-router-dom'
import { useRef, useState, useCallback } from 'react'
import { EXPERIMENTS } from '../data/portfolio'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { usePrefersReducedMotion } from './HeroAboutPanels'

// Scroll-triggered fade-up — mirrors the Featured grid's entrance so both
// sections share one motion language.
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()
  const shown = inView || reduced
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(24px)',
        transition: reduced ? 'none' : `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: shown ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

// ─── 3D Tilt + Spotlight Card ─────────────────────────────────────────────────
interface TiltCardProps {
  to: string
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

function TiltCard({ to, children, style, className }: TiltCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // Normalized -1..1 offset from centre
    const nx = (e.clientX - cx) / (rect.width / 2)
    const ny = (e.clientY - cy) / (rect.height / 2)
    // Tilt max ±2 degrees — very subtle, premium feel
    setTilt({ rx: -ny * 2, ry: nx * 2 })
    // Spotlight follows cursor inside the card (0–100%)
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    setSpotlight({ x: px, y: py, opacity: 0.08 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 })
    setSpotlight(prev => ({ ...prev, opacity: 0 }))
  }, [])

  return (
    <Link
      ref={cardRef}
      to={to}
      className={`group relative flex flex-col gap-1.5 sm:gap-2.5 p-2 sm:p-3 md:p-4 border border-accent/20 -mt-px -ml-px bg-primary z-0 cursor-pointer ${className ?? ''}`}
      style={{
        ...style,
        // GPU-accelerated 3D transform
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
        transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Radial spotlight that tracks the mouse */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm z-10"
        style={{
          background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(163,157,123,1) 0%, transparent 65%)`,
          opacity: spotlight.opacity,
          transition: 'opacity 0.25s ease',
          willChange: 'opacity',
          backfaceVisibility: 'hidden',
        }}
      />
      {children}
    </Link>
  )
}

// ─── Studio Section ───────────────────────────────────────────────────────────
export default function StudioSection() {
  return (
    <section id="studio" className="relative py-10 md:py-14 px-4 sm:px-6 lg:px-12">
      {/* Section header — mirrors the Featured Work masthead */}
      <Reveal className="flex items-end justify-between gap-6 mb-12 md:mb-16 pb-5 border-b border-accent/30">
        <div>
          <div className="label-caps mb-3">Studio / Off-a-Whim Experiments</div>
          <h2
            className="font-sans font-black text-parchment leading-[0.95] tracking-tight-2"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
          >
            Studio
          </h2>
        </div>
        <span className="font-mono text-xs tracking-label uppercase text-parchment/50 whitespace-nowrap pb-1">
          {EXPERIMENTS.length.toString().padStart(2, '0')} / Pieces
        </span>
      </Reveal>

      {/* Experiment grid — denser columns keep each card small relative to Featured Work */}
      <Reveal delay={80} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 bg-primary pl-px pt-px border-b border-r border-accent/20">
        {[...EXPERIMENTS].sort((a, b) => {
          const yearA = a.year === 'Present' ? 9999 : Number(a.year);
          const yearB = b.year === 'Present' ? 9999 : Number(b.year);
          return yearB - yearA;
        }).map((exp, i) => (
          <TiltCard
            key={exp.id}
            to={`/studio/${exp.id}`}
          >
            {/* Background overlay for hover effect */}
            <div className="absolute inset-0 -z-10 bg-surface/10 group-hover:bg-surface/30 transition-colors duration-200 pointer-events-none rounded-sm" />
            {/* Visual area */}
            <div
              className="relative w-full aspect-square bg-accent/10 rounded-sm overflow-hidden flex items-center justify-center border border-accent/20 group-hover:border-parchment/20 transition-colors duration-200"
              style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
            >
              {exp.imageUrl ? (
                <img
                  src={exp.thumbUrl ?? exp.imageUrl}
                  alt={exp.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-[opacity,transform] duration-200 ease-out"
                  style={{ willChange: 'transform, opacity' }}
                />
              ) : (
                /* Abstract geometric placeholder per experiment */
                <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-200">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#cfccbb" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#a39d7b" strokeWidth="0.5" strokeDasharray="3 4" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="#cfccbb" strokeWidth="0.3" opacity="0.5" />
                  <line x1="50" y1="10" x2="50" y2="90" stroke="#cfccbb" strokeWidth="0.3" opacity="0.5" />
                  <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#cfccbb" fontFamily="monospace">
                    {String.fromCodePoint(0x2460 + i)}
                  </text>
                </svg>
              )}
            </div>

            {/* Labels */}
            <div className="space-y-1">
              <p className="font-mono text-[9px] tracking-label uppercase text-parchment/50">{exp.contextLabel}</p>
              <p className="font-sans font-medium text-xs text-parchment leading-tight tracking-tight">
                {exp.title}
              </p>
              <p className="font-mono text-[11px] text-parchment/60 leading-relaxed line-clamp-2">
                {exp.description}
              </p>
            </div>

            {/* Year */}
            <div className="mt-auto">
              <span className="font-mono text-[10px] tracking-label uppercase text-parchment/50">{exp.year}</span>
            </div>

            {/* Hover corner accent */}
            <div className="absolute top-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg viewBox="0 0 12 12" className="w-full h-full">
                <path d="M0 0 L12 0 L12 12" fill="none" stroke="#cfccbb" strokeWidth="0.8" opacity="0.5" />
              </svg>
            </div>
          </TiltCard>
        ))}
      </Reveal>
    </section>
  )
}
