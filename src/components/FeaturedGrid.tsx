import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'
import type { Project } from '../types/portfolio'
import { usePrefersReducedMotion } from './HeroAboutPanels'
import { useInViewOnce } from '../hooks/useInViewOnce'

// ── Visual Preview Carousel ────────────────────────────────────────────────
interface ProjectPreviewCarouselProps {
  project: Project
}

function ProjectPreviewCarousel({ project }: ProjectPreviewCarouselProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const images = project.caseStudy?.images || []
  const acc = project.accentColor

  // Auto-play the carousel
  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIdx(idx)
  }

  // Geometric symbols per project matching their concept
  const projectSymbols = {
    cattlelog: '◈',
    fimanu: '⬡',
    'product-space': '◉',
    spot: '⬢',
  } as Record<string, string>

  const currentSymbol = projectSymbols[project.id] || '◈'

  return (
    <Link
      to={`/work/${project.id}`}
      viewTransition
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/carousel relative block w-full aspect-[16/10] lg:aspect-[16/9] xl:aspect-[2/1] rounded-sm overflow-hidden border bg-[#141626] transition-colors duration-300"
      style={{
        borderColor: isHovered ? `${acc}55` : `${acc}25`,
        boxShadow: '0 12px 32px -12px rgba(0,0,0,0.5)',
      }}
    >
      {images.length > 0 ? (
        <div className="w-full h-full relative">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.label}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: i === activeImageIdx ? (isHovered ? 1 : 0.85) : 0,
                visibility: i === activeImageIdx ? 'visible' : 'hidden',
                transition: i === activeImageIdx
                  ? 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0ms linear 300ms',
              }}
            />
          ))}

          {/* Screen label */}
          <div className="absolute bottom-4 left-3 pointer-events-none">
            <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/75 font-semibold drop-shadow-md">
              // {images[activeImageIdx].label}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
          <div
            className="font-mono text-5xl transition-opacity duration-300 select-none"
            style={{ color: acc, opacity: isHovered ? 0.7 : 0.3 }}
          >
            {currentSymbol}
          </div>
          <div className="absolute bottom-4 text-center w-full px-4">
            <p className="font-mono text-xs tracking-label uppercase text-parchment/65">
              [{project.title} Spec Template]
            </p>
          </div>
        </div>
      )}

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-3 flex items-center gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => handleDotClick(e, i)}
              className={`rounded-full transition-all duration-200 ${i === activeImageIdx ? 'w-4 h-1' : 'w-1 h-1'}`}
              style={{
                backgroundColor: i === activeImageIdx ? acc : '#cfccbb',
                opacity: i === activeImageIdx ? 1 : 0.35,
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Autoplay progress bar */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/30 overflow-hidden z-10">
          <div
            key={activeImageIdx}
            className="h-full origin-left"
            style={{
              backgroundColor: acc,
              opacity: 0.85,
              animation: 'carousel-progress 5000ms linear forwards',
            }}
          />
        </div>
      )}
    </Link>
  )
}

// ── Status indicator ────────────────────────────────────────────────────────
function StatusIndicator({ status }: { status: Project['status'] }) {
  return (
    <span className="label-caps">
      {status === 'live' ? 'Live' : status === 'offline' ? 'Offline' : 'Archived'}
    </span>
  )
}

// ── Case study card ──────────────────────────────────────────────────────────
function FeaturedCard({ proj, index }: { proj: Project; index: number }) {
  const [ref, inView] = useInViewOnce<HTMLElement>()
  const prefersReducedMotion = usePrefersReducedMotion()
  const revealed = inView || prefersReducedMotion

  return (
    <article
      ref={ref}
      className="group relative flex flex-col bg-primary overflow-hidden"
      style={
        {
          '--accent': proj.accentColor,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${index * 90}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${index * 90}ms`,
        } as React.CSSProperties
      }
    >
      {/* Watermark index */}
      <div
        className="pointer-events-none select-none absolute -top-3 right-4 sm:right-6 font-mono font-bold leading-none z-0"
        style={{ fontSize: 'clamp(4.5rem, 9vw, 7.5rem)', color: proj.accentColor, opacity: 0.06 }}
      >
        0{index + 1}
      </div>

      {/* Accent bar */}
      <div
        className="relative z-10 h-[3px] w-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: proj.accentColor }}
      />

      <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
        <ProjectPreviewCarousel project={proj} />

        {/* Title block */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 font-mono text-xs tracking-label uppercase">
              <span className="text-gold/90">0{index + 1} / 0{PROJECTS.length}</span>
            </div>
            <StatusIndicator status={proj.status} />
          </div>

          <Link
            to={`/work/${proj.id}`}
            viewTransition
            className="font-sans font-black text-parchment leading-[0.95] tracking-tight-2 text-3xl sm:text-4xl lg:text-5xl block group-hover:text-[var(--accent)] transition-colors duration-300"
            style={{ viewTransitionName: `project-title-${proj.id}` }}
          >
            {proj.title}
          </Link>

          <div className="flex items-baseline gap-x-3 gap-y-1.5 flex-wrap mt-3">
            <p
              className="font-mono text-sm leading-relaxed max-w-xl"
              style={{ color: `${proj.accentColor}e6` }}
            >
              {proj.subtitle}
            </p>
            {proj.awards?.map((award) => (
              <span
                key={award}
                className="font-mono text-xs tracking-label uppercase whitespace-nowrap"
                style={{ color: proj.accentColor }}
              >
                ★ {award}
              </span>
            ))}
          </div>
        </div>

        {/* Metadata specimen block */}
        <div className="flex flex-col gap-3 pt-5 border-t border-accent/15">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs tracking-label uppercase">
            <span className="text-parchment/80">{proj.role}</span>
            <span className="w-px h-3 bg-accent/30" />
            <span className="text-parchment/50">{proj.categories.join(' · ')}</span>
            {proj.url && (
              <>
                <span className="w-px h-3 bg-accent/30 hidden sm:block" />
                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-parchment/50 hover:text-parchment/80 transition-colors underline underline-offset-2"
                >
                  {proj.url.replace('https://', '')} ↗
                </a>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {proj.tools.map((t) => (
              <span
                key={t}
                className="font-mono text-xs tracking-label px-2 py-0.5 rounded-sm border border-accent/25 text-parchment/60"
              >
                {t}
              </span>
            ))}
          </div>

          {proj.metrics.length > 0 && (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-1 font-mono text-xs tracking-label uppercase text-parchment/55">
              {proj.metrics.map((m, mi) => (
                <span key={m.label} className="inline-flex items-baseline gap-1.5">
                  <span className="font-semibold text-sm normal-case tracking-normal" style={{ color: proj.accentColor }}>
                    {m.value}
                  </span>
                  <span>{m.label}</span>
                  {mi < proj.metrics.length - 1 && <span className="text-parchment/25 ml-1">·</span>}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Narrative */}
        <div className="space-y-4">
          {proj.narrative.map((para, j) => (
            <p key={j} className="font-sans text-sm sm:text-[15px] text-parchment/70 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* CTA closer */}
      <Link
        to={`/work/${proj.id}`}
        viewTransition
        className="relative z-10 mt-auto flex items-center justify-between px-5 sm:px-7 lg:px-8 py-4 border-t border-accent/20 transition-colors duration-300 hover:bg-[var(--accent-bg)]"
        style={{ '--accent-bg': `${proj.accentColor}0d` } as React.CSSProperties}
      >
        <span className="font-mono text-xs tracking-label uppercase text-parchment group-hover:text-[var(--accent)] transition-colors duration-300">
          Read Case Study
        </span>
        <span
          className="font-mono text-sm transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: proj.accentColor }}
        >
          →
        </span>
      </Link>
    </article>
  )
}

// ─── Featured Grid ──────────────────────────────────────────────────────────
export default function FeaturedGrid() {
  return (
    <section id="featured-grid" className="relative pt-16 md:pt-20 pb-20 md:pb-28 px-4 sm:px-6 lg:px-12">
      <div className="flex items-end justify-between gap-6 mb-14 md:mb-20 pb-5 border-b border-accent/25">
        <div>
          <div className="label-caps mb-3">Featured / Case Studies</div>
          <h2
            className="font-sans font-black text-parchment leading-[0.95] tracking-tight-2"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}
          >
            Featured Work
          </h2>
        </div>
        <span className="font-mono text-xs tracking-label uppercase text-parchment/50 whitespace-nowrap pb-1">
          {PROJECTS.length.toString().padStart(2, '0')} / Projects
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-accent/20 border border-accent/20">
        {PROJECTS.map((proj, i) => (
          <FeaturedCard key={proj.id} proj={proj} index={i} />
        ))}
      </div>
    </section>
  )
}
