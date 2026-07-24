import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'
import type { Project } from '../types/portfolio'
import { usePrefersReducedMotion } from './HeroAboutPanels'
import { useInViewOnce } from '../hooks/useInViewOnce'

const AUTO_ADVANCE_MS = 9000

// Geometric sigil per project — reused as the fallback + rail glyph.
const PROJECT_SIGILS: Record<string, string> = {
  cattlelog: '◈',
  fimanu: '⬡',
  'product-space': '◉',
  spot: '⬢',
}

// ── Specimen viewport ───────────────────────────────────────────────────────
// The project imagery, framed like a readout on an oscilloscope: corner
// brackets, a drifting scan bar, a frame counter, and an inline caption.
function SpecimenViewport({ project }: { project: Project }) {
  const [frame, setFrame] = useState(0)
  const [hovered, setHovered] = useState(false)
  const images = project.caseStudy?.images ?? []
  const acc = project.accentColor
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (images.length <= 1 || reduced) return
    const t = setInterval(() => setFrame((f) => (f + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [images.length, reduced])

  const sigil = PROJECT_SIGILS[project.id] ?? '◈'

  return (
    <Link
      to={`/work/${project.id}`}
      viewTransition
      aria-label={`Open ${project.title} case study`}
      className="relative block w-full aspect-[16/10] overflow-hidden bg-[#0d0f1a]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: `inset 0 0 0 1px ${acc}33, 0 24px 60px -28px rgba(0,0,0,0.7)` }}
    >
      {/* Fine grid backdrop so an empty/loading frame still reads as instrument glass */}
      <div className="absolute inset-0 bg-grid-fine bg-grid-sm opacity-40 pointer-events-none" />

      {images.length > 0 ? (
        images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.label}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === frame ? (hovered ? 1 : 0.9) : 0,
              transform: i === frame && hovered ? 'scale(1.03)' : 'scale(1)',
              transition:
                'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-6xl select-none" style={{ color: acc, opacity: 0.3 }}>
            {sigil}
          </span>
        </div>
      )}

      {/* Drifting read-head scan bar */}
      <div
        className="absolute left-0 right-0 h-px animate-specimen-scan pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${acc}cc 50%, transparent)`, opacity: 0.5 }}
      />

      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <span
          key={c}
          className="absolute w-4 h-4 pointer-events-none"
          style={{
            top: c[0] === 't' ? 8 : undefined,
            bottom: c[0] === 'b' ? 8 : undefined,
            left: c[1] === 'l' ? 8 : undefined,
            right: c[1] === 'r' ? 8 : undefined,
            borderTop: c[0] === 't' ? `1.5px solid ${acc}` : undefined,
            borderBottom: c[0] === 'b' ? `1.5px solid ${acc}` : undefined,
            borderLeft: c[1] === 'l' ? `1.5px solid ${acc}` : undefined,
            borderRight: c[1] === 'r' ? `1.5px solid ${acc}` : undefined,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Inline caption + frame counter */}
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 pointer-events-none">
        <span className="font-mono text-[10px] tracking-widest uppercase text-parchment/85 font-semibold drop-shadow-md">
          // {images[frame]?.label ?? 'SPEC'}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-parchment/60 tabular-nums">
          {String(frame + 1).padStart(2, '0')}/{String(Math.max(images.length, 1)).padStart(2, '0')}
        </span>
      </div>

      {/* Frame selector ticks */}
      {images.length > 1 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-auto">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setFrame(i)
              }}
              aria-label={`View frame ${i + 1}`}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === frame ? 20 : 8,
                backgroundColor: i === frame ? acc : '#cfccbb',
                opacity: i === frame ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      )}
    </Link>
  )
}

// ── Channel selector (rail) ─────────────────────────────────────────────────
function ChannelButton({
  project,
  index,
  active,
  onSelect,
}: {
  project: Project
  index: number
  active: boolean
  onSelect: () => void
}) {
  const acc = project.accentColor
  return (
    <button
      onClick={onSelect}
      role="tab"
      aria-selected={active}
      aria-label={`Channel ${index + 1}: ${project.title}`}
      title={project.title}
      className={`group relative flex flex-1 lg:flex-none lg:w-full items-center justify-center lg:justify-start gap-0 lg:gap-4 min-w-0 text-left px-2 lg:px-4 py-3.5 lg:py-4 overflow-hidden transition-colors duration-300 border-accent/20 ${index > 0 ? 'border-l lg:border-l-0' : ''} lg:border-t`}
      style={{
        backgroundColor: active ? `${acc}12` : 'transparent',
      }}
    >
      {/* Active edge — bottom bar in the horizontal strip, left bar in the rail */}
      <span
        aria-hidden
        className="lg:hidden absolute left-0 right-0 bottom-0 h-[3px] origin-left transition-transform duration-500"
        style={{ backgroundColor: acc, transform: active ? 'scaleX(1)' : 'scaleX(0)' }}
      />
      <span
        aria-hidden
        className="hidden lg:block absolute left-0 top-0 bottom-0 w-[3px] origin-top transition-transform duration-500"
        style={{
          backgroundColor: acc,
          transform: active ? 'scaleY(1)' : 'scaleY(0.18)',
          opacity: active ? 1 : 0.5,
        }}
      />

      <span
        className="font-mono font-bold tabular-nums leading-none transition-colors duration-300"
        style={{
          fontSize: 'clamp(1.05rem, 1.4vw, 1.5rem)',
          color: active ? acc : 'rgba(207,204,187,0.4)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Title + role — rail only; the horizontal strip stays a numeric tuner */}
      <span className="hidden lg:flex flex-col min-w-0">
        <span
          className="font-sans font-black leading-tight tracking-tight-2 break-words transition-colors duration-300"
          style={{
            fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)',
            color: active ? '#cfccbb' : 'rgba(207,204,187,0.6)',
          }}
        >
          {project.title}
        </span>
        <span className="font-mono text-[10px] tracking-label uppercase text-parchment/40 mt-1 truncate">
          {project.role}
        </span>
      </span>

      {/* Status dot */}
      <span
        className="ml-auto hidden lg:flex items-center gap-1.5 shrink-0"
        style={{ opacity: active ? 1 : 0.45 }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: project.status === 'live' ? acc : '#cfccbb',
            boxShadow: active && project.status === 'live' ? `0 0 8px ${acc}` : undefined,
          }}
        />
      </span>
    </button>
  )
}

// ── The loaded dossier ──────────────────────────────────────────────────────
function Dossier({ project, index, total }: { project: Project; index: number; total: number }) {
  const acc = project.accentColor
  const cs = project.caseStudy

  return (
    <div className="relative animate-stage-load">
      {/* Giant channel number, bled off the top-right as a watermark */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute -top-6 sm:-top-10 right-0 font-mono font-black leading-none z-0"
        style={{ fontSize: 'clamp(7rem, 20vw, 18rem)', color: acc, opacity: 0.07 }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Header strip */}
      <div className="relative z-10 flex items-center gap-3 flex-wrap font-mono text-[11px] tracking-label uppercase mb-5">
        <span style={{ color: acc }}>Case File {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
        <span className="w-px h-3 bg-accent/40" />
        <span className="text-parchment/50">{project.year}</span>
        <span className="w-px h-3 bg-accent/40" />
        <span className="inline-flex items-center gap-2 text-parchment/70">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: project.status === 'live' ? acc : '#cfccbb',
              animation: project.status === 'live' ? 'pulseDot 2s cubic-bezier(0.4,0,0.6,1) infinite' : undefined,
            }}
          />
          {project.status === 'live' ? 'Live' : project.status === 'offline' ? 'Offline' : 'Archived'}
        </span>
        {project.awards?.map((a) => (
          <span key={a} className="inline-flex items-center gap-1" style={{ color: acc }}>
            ★ {a}
          </span>
        ))}
      </div>

      {/* Title */}
      <Link
        to={`/work/${project.id}`}
        viewTransition
        className="relative z-10 block font-sans font-black text-parchment leading-[0.9] tracking-tight-2 hover:opacity-90 transition-opacity"
        style={{ fontSize: 'clamp(2.75rem, 6.5vw, 6rem)', viewTransitionName: `project-title-${project.id}` }}
      >
        {project.title}
      </Link>
      <p
        className="relative z-10 font-mono text-sm sm:text-base mt-3 max-w-2xl leading-relaxed"
        style={{ color: `${acc}e6` }}
      >
        {project.subtitle}
      </p>

      {/* Body: specimen viewport + intel column */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-8">
        <div className="lg:col-span-7 animate-dossier-line" style={{ animationDelay: '80ms' }}>
          <SpecimenViewport project={project} />

          {/* Tools ribbon under the viewport */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tools.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] tracking-label px-2 py-0.5 rounded-sm border border-accent/30 text-parchment/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Metrics — oversized readouts */}
          {project.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-accent/25 border border-accent/25 animate-dossier-line" style={{ animationDelay: '160ms' }}>
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-primary px-4 py-4 flex flex-col justify-center min-w-0">
                  <div className="font-sans font-black leading-[1.02] tracking-tight-2 break-words" style={{ fontSize: 'clamp(1.35rem, 2vw, 1.5rem)', color: acc }}>
                    {m.value}
                  </div>
                  <div className="font-mono text-[10px] tracking-label uppercase text-parchment/50 mt-2 break-words">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Narrative */}
          <div className="space-y-3 animate-dossier-line" style={{ animationDelay: '240ms' }}>
            {(cs?.problemSpace?.slice(0, 1) ?? project.narrative).map((para, j) => (
              <p key={j} className="font-sans text-sm sm:text-[15px] text-parchment/70 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Meta line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] tracking-label uppercase text-parchment/50 animate-dossier-line" style={{ animationDelay: '300ms' }}>
            <span className="text-parchment/75">{project.role}</span>
            <span className="w-px h-3 bg-accent/30" />
            <span>{project.categories.join(' · ')}</span>
            {project.url && (
              <>
                <span className="w-px h-3 bg-accent/30" />
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-parchment/80 transition-colors underline underline-offset-2"
                >
                  {project.url.replace('https://', '').replace(/\/$/, '')} ↗
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/work/${project.id}`}
        viewTransition
        className="group/cta relative z-10 mt-8 flex items-center justify-between gap-4 px-5 py-4 border-t-2 transition-colors duration-300 animate-dossier-line"
        style={{ borderColor: `${acc}55`, animationDelay: '360ms' }}
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ backgroundColor: `${acc}0f` }}
        />
        <span className="relative font-mono text-xs tracking-label uppercase text-parchment group-hover/cta:text-[color:var(--acc)] transition-colors duration-300" style={{ ['--acc' as string]: acc }}>
          Open Full Case File
        </span>
        <span className="relative font-mono text-lg transition-transform duration-300 group-hover/cta:translate-x-1.5" style={{ color: acc }}>
          →
        </span>
      </Link>
    </div>
  )
}

// ─── Work Console ───────────────────────────────────────────────────────────
export default function FeaturedGrid() {
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [ref, inView] = useInViewOnce<HTMLElement>()
  const reduced = usePrefersReducedMotion()
  const total = PROJECTS.length
  const activeProject = PROJECTS[active]
  const acc = activeProject.accentColor

  // Ambient tuning — the console cycles through the case files on its own, with a
  // countdown bar showing when the next one loads, until the visitor takes over
  // with a click. Parking the pointer on the stage pauses the countdown so a file
  // can be read, and it resumes on leave. Mirrors the hero wheel's auto-rotate;
  // sits out entirely under prefers-reduced-motion.
  const autoRunning = !reduced && !manual && inView

  const select = useCallback((i: number) => {
    setManual(true)
    setActive(i)
  }, [])

  const advance = useCallback(() => {
    setActive((a) => (a + 1) % total)
  }, [total])

  const statusLabel = reduced || manual ? 'Manual' : hovered ? 'Paused' : 'Auto-tune'

  return (
    <section
      id="featured-grid"
      ref={ref}
      className="relative pt-24 md:pt-36 pb-28 md:pb-40 section-shell"
    >
      {/* Accent wash that shifts with the tuned channel — echoes the hero dome */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-[background] duration-700"
        style={{ background: `radial-gradient(ellipse 60% 50% at 78% 32%, ${acc}0f 0%, transparent 68%)` }}
      />

      {/* Masthead */}
      <div className="relative flex items-end justify-between gap-6 mb-10 md:mb-14 pb-5 border-b border-accent/25">
        <div>
          <div className="label-caps mb-3 flex items-center gap-2">
            <span className="inline-flex gap-[3px] items-end h-3" aria-hidden>
              <span className="waveform-bar w-[2px] h-full bg-gold/70" style={{ animationDuration: '1.1s', animationDelay: '-0.2s' }} />
              <span className="waveform-bar w-[2px] h-full bg-gold/70" style={{ animationDuration: '1.4s', animationDelay: '-0.6s' }} />
              <span className="waveform-bar w-[2px] h-full bg-gold/70" style={{ animationDuration: '0.9s', animationDelay: '-1.1s' }} />
            </span>
            Featured / Case Files
          </div>
          <h2
            className="font-sans font-black text-parchment leading-[0.95] tracking-tight-2"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
          >
            Work Console
          </h2>
        </div>
        <span className="font-mono text-xs tracking-label uppercase text-parchment/50 whitespace-nowrap pb-1 hidden sm:block">
          Now Tuned <span style={{ color: acc }}>{String(active + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Console body */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(220px,300px)_1fr] border border-accent/25 bg-primary overflow-hidden">
        {/* Channel rail */}
        <div
          role="tablist"
          aria-label="Case file channels"
          className="flex lg:flex-col overflow-hidden border-b lg:border-b-0 lg:border-r border-accent/25"
        >
          <div className="hidden lg:block px-4 pt-4 pb-2 font-mono text-[10px] tracking-label uppercase text-parchment/35">
            Channels
          </div>
          {PROJECTS.map((p, i) => (
            <ChannelButton
              key={p.id}
              project={p}
              index={i}
              active={i === active}
              onSelect={() => select(i)}
            />
          ))}
          {/* Auto-tune indicator */}
          <div className="hidden lg:flex items-center gap-2 mt-auto px-4 py-3 border-t border-accent/20">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: autoRunning ? acc : 'rgba(207,204,187,0.35)',
                animation: autoRunning && !hovered ? 'pulseDot 2s cubic-bezier(0.4,0,0.6,1) infinite' : undefined,
              }}
            />
            <span className="font-mono text-[9px] tracking-label uppercase text-parchment/40">
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Stage */}
        <div
          className="relative p-6 sm:p-8 lg:p-10 xl:p-12 overflow-hidden min-h-[560px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Countdown to the next channel — fills over AUTO_ADVANCE_MS, pauses on
              hover, and advances the console when it completes. Only present while
              auto-tuning, so a manual pick or reduced-motion removes it entirely. */}
          {autoRunning && (
            <span
              key={`prog-${active}`}
              aria-hidden
              onAnimationEnd={advance}
              className="absolute top-0 left-0 w-full h-[2px] z-30 origin-left pointer-events-none"
              style={{
                backgroundColor: acc,
                transform: 'scaleX(0)',
                animation: `carousel-progress ${AUTO_ADVANCE_MS}ms linear forwards`,
                animationPlayState: hovered ? 'paused' : 'running',
              }}
            />
          )}

          {/* Corner HUD ticks */}
          <span className="hidden lg:block absolute top-3 right-4 font-mono text-[10px] tracking-label uppercase text-parchment/25 z-20">
            θ:{String(Math.round(active * (360 / total))).padStart(3, '0')}°
          </span>

          {/* One-shot scan-sweep on channel change */}
          <span
            key={`sweep-${active}`}
            aria-hidden
            className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none animate-scan-sweep"
            style={{ background: `linear-gradient(90deg, transparent, ${acc}, transparent)` }}
          />

          <Dossier key={activeProject.id} project={activeProject} index={active} total={total} />
        </div>
      </div>
    </section>
  )
}
