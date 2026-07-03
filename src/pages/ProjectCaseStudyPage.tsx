// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE A — Formal Full Case Study Page
// Route: /work/:slug
// Layout: 30% sticky metadata sidebar | 70% scrolling editorial content
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'


// ── Thin hairline separator with section label + deep link ───────────────────
function SectionRule({
  index,
  label,
  accentColor,
  mounted,
  mountDelay,
}: {
  index: string
  label: string
  accentColor: string
  mounted: boolean
  mountDelay: number
}) {
  const [copied, setCopied] = useState(false)
  const sectionId = `${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select + copy
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [sectionId])

  return (
    <div
      id={sectionId}
      className="group flex items-center gap-4 mb-8 pb-3"
      style={{
        borderBottom: '1px solid rgba(56,64,106,0.45)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.2s ease ${mountDelay}ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
        scrollMarginTop: '80px',
      }}
    >
      <span className="font-mono text-xs text-parchment/65 tabular-nums">{index}</span>
      <div className="w-4 h-px" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
      <span className="font-mono text-xs tracking-label uppercase" style={{ color: `${accentColor}e6` }}>
        {label}
      </span>
      <button
        onClick={handleCopyLink}
        aria-label={`Copy link to ${label} section`}
        className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative flex items-center w-4 h-4"
        style={{ color: copied ? accentColor : 'rgba(207,204,187,0.65)' }}
      >
        {copied ? (
          <span className="font-mono text-xs whitespace-nowrap absolute left-0" style={{ color: accentColor }}>✓ Copied!</span>
        ) : (
          <svg viewBox="0 0 16 16" className="w-3 h-3 absolute left-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5L7.5 5" strokeLinecap="round" />
            <path d="M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5L8.5 11" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  )
}

// ── Paragraph with left accent rule ───────────────────────────────────────────
function EditorialParagraph({
  text,
  accentColor,
  mounted,
  mountDelay,
}: {
  text: string
  accentColor: string
  mounted: boolean
  mountDelay: number
}) {
  return (
    <div
      className="flex gap-5 py-4"
      style={{
        borderBottom: '1px solid rgba(56,64,106,0.18)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.2s ease ${mountDelay}ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
      }}
    >
      <div
        className="w-px flex-shrink-0 self-stretch mt-1"
        style={{ backgroundColor: accentColor, opacity: 0.2 }}
      />
      <p className="font-mono text-xs text-parchment/65 leading-[1.85] tracking-tight">{text}</p>
    </div>
  )
}

// ── Architecture spec box ──────────────────────────────────────────────────────
function SpecBox({
  children,
  stamp,
  mounted,
  mountDelay,
}: {
  children: React.ReactNode
  accentColor?: string
  stamp: string
  mounted: boolean
  mountDelay: number
}) {
  return (
    <div
      className="relative"
      style={{
        border: `1px solid rgba(163,157,123,0.18)`,
        backgroundColor: 'rgba(28,32,53,0.6)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.2s ease ${mountDelay}ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
      }}
    >
      {/* Corner bracket — top left */}
      <svg
        viewBox="0 0 16 16"
        className="absolute top-0 left-0 w-4 h-4"
        aria-hidden="true"
      >
        <path d="M0 10 L0 0 L10 0" fill="none" stroke="#a39d7b" strokeWidth="0.8" opacity="0.4" />
      </svg>
      {/* Corner bracket — bottom right */}
      <svg
        viewBox="0 0 16 16"
        className="absolute bottom-0 right-0 w-4 h-4"
        aria-hidden="true"
      >
        <path d="M16 6 L16 16 L6 16" fill="none" stroke="#a39d7b" strokeWidth="0.8" opacity="0.4" />
      </svg>

      {/* Stamp */}
      <div
        className="absolute top-2 right-3 font-mono text-xs tracking-label"
        style={{ color: '#a39d7b', opacity: 0.9 }}
      >
        {stamp}
      </div>

      <div className="px-6 pt-8 pb-6">{children}</div>
    </div>
  )
}

// ── Metric callout ─────────────────────────────────────────────────────────────
function MetricBlock({
  label,
  value,
  accentColor,
}: {
  label: string
  value: string
  accentColor: string
}) {
  return (
    <div
      className="flex flex-col gap-0.5 px-3 py-3 border"
      style={{ borderColor: `${accentColor}25`, backgroundColor: `${accentColor}05` }}
    >
      <span className="font-mono text-xs tracking-label text-parchment/65 uppercase">{label}</span>
      <span
        className="font-mono font-semibold leading-none"
        style={{ color: accentColor, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', letterSpacing: '-0.03em' }}
      >
        {value}
      </span>
    </div>
  )
}

// ── Tool chip ──────────────────────────────────────────────────────────────────
function ToolChip({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 font-mono text-xs tracking-label rounded-sm border transition-colors duration-200"
      style={{ borderColor: `${accentColor}35`, color: `${accentColor}e6`, backgroundColor: `${accentColor}06` }}
    >
      {label}
    </span>
  )
}

// ── Project-to-project navigation ─────────────────────────────────────────────
function ProjectNav({ current }: { current: number }) {
  const prev = PROJECTS[current - 1]
  const next = PROJECTS[current + 1]
  return (
    <div
      className="flex items-center justify-between pt-10 mt-10"
      style={{ borderTop: '1px solid rgba(56,64,106,0.3)' }}
    >
      {prev ? (
        <Link to={`/work/${prev.id}`} className="group flex items-center gap-3">
          <span className="font-mono text-sm text-parchment/65 group-hover:text-parchment/65 transition-colors">
            ←
          </span>
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
        <Link to={`/work/${next.id}`} className="group flex items-center gap-3 text-right">
          <div>
            <p className="font-mono text-xs tracking-label text-parchment/65 uppercase">Next</p>
            <p
              className="font-sans font-semibold text-parchment/65 group-hover:text-parchment transition-colors duration-200"
              style={{ letterSpacing: '-0.02em' }}
            >
              {next.title}
            </p>
          </div>
          <span className="font-mono text-sm text-parchment/65 group-hover:text-parchment/65 transition-colors">
            →
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

// ── Sticky left metadata sidebar (30%) ─────────────────────────────────────────
function MetadataSidebar({
  project,
  projectIndex,
  mounted,
}: {
  project: ReturnType<typeof PROJECTS.find> & object
  projectIndex: number
  mounted: boolean
}) {
  if (!project) return null
  return (
    <aside
      className="lg:w-[30%] px-6 lg:px-10 py-10 flex-shrink-0"
      style={{
        borderRight: '1px solid rgba(56,64,106,0.3)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
        transition: 'opacity 0.2s ease 80ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 80ms',
      }}
    >
      <div className="sticky top-16 space-y-8">

        {/* Index counter */}
        <div className="flex items-baseline gap-2">
          <span
            className="font-mono font-semibold leading-none"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: project.accentColor, letterSpacing: '-0.05em', opacity: 0.9 }}
          >
            {String(projectIndex + 1).padStart(2, '0')}
          </span>
          <span className="font-mono text-xs text-parchment/65">/ {String(PROJECTS.length).padStart(2, '0')}</span>
        </div>



        {/* Tools */}
        <div>
          <p className="font-mono text-xs tracking-label text-parchment/65 uppercase mb-2.5">Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <ToolChip key={tool} label={tool} accentColor={project.accentColor} />
            ))}
          </div>
        </div>

        {/* Metrics */}
        {project.metrics.length > 0 && (
          <div>
            <p className="font-mono text-xs tracking-label text-parchment/65 uppercase mb-2.5">Impact</p>
            <div className="grid grid-cols-2 gap-1.5">
              {project.metrics.map((m) => (
                <MetricBlock key={m.label} label={m.label} value={m.value} accentColor={project.accentColor} />
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {project.awards && project.awards.length > 0 && (
          <div>
            <p className="font-mono text-xs tracking-label text-parchment/65 uppercase mb-2.5">Recognition</p>
            <div className="space-y-1.5">
              {project.awards.map((award) => (
                <div
                  key={award}
                  className="flex items-center gap-2.5 px-3 py-2 border"
                  style={{ borderColor: `${project.accentColor}25`, backgroundColor: `${project.accentColor}05` }}
                >
                  <svg viewBox="0 0 10 10" className="w-3 h-3 flex-shrink-0" style={{ color: project.accentColor }}>
                    <polygon points="5,0 6.2,3.8 10,3.8 6.9,6.2 8.1,10 5,7.5 1.9,10 3.1,6.2 0,3.8 3.8,3.8" fill="currentColor" />
                  </svg>
                  <span className="font-mono text-xs tracking-label" style={{ color: project.accentColor }}>
                    {award}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domains */}
        <div>
          <p className="font-mono text-xs tracking-label text-parchment/65 uppercase mb-2.5">Domains</p>
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <span
                key={cat}
                className="font-mono text-xs px-2 py-0.5 border rounded-sm"
                style={{ borderColor: 'rgba(56,64,106,0.45)', color: 'rgba(207,204,187,0.65)' }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Hairline */}
        <div className="h-px" style={{ backgroundColor: 'rgba(56,64,106,0.4)' }} />

        {/* Status + CTA */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: project.status === 'live' ? '#4ade80' : '#a39d7b',
                boxShadow: project.status === 'live' ? '0 0 6px #4ade8088' : 'none',
              }}
            />
            <span className="font-mono text-xs tracking-label text-parchment/70 uppercase">
              {project.status === 'live' ? 'Live' : project.status === 'offline' ? 'Offline' : 'Archived'}
            </span>
          </div>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full px-4 py-3 border transition-all duration-200"
              style={{ borderColor: `${project.accentColor}25` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${project.accentColor}70`
                e.currentTarget.style.backgroundColor = `${project.accentColor}08`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${project.accentColor}25`
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <span
                className="font-mono text-xs tracking-label uppercase"
                style={{ color: project.accentColor }}
              >
                Visit {project.title}
              </span>
              <span className="font-mono text-xs text-parchment/65 group-hover:text-parchment/65 transition-colors">
                ↗
              </span>
            </a>
          )}
        </div>
      </div>
    </aside>
  )
}

// ── Lightbox Overlay ─────────────────────────────────────────────────────────
function Lightbox({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: { src: string; label: string; description?: string }[]
  activeIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onNext, onPrev])

  const img = images[activeIndex]

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(28,32,53,0.96)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        id="lightbox-close"
        onClick={onClose}
        className="absolute top-5 right-6 font-mono text-2xl text-parchment/65 hover:text-parchment transition-colors z-10"
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-6 font-mono text-xs text-parchment/65">
        {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          id="lightbox-prev"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-black/30 text-parchment/65 hover:text-parchment hover:border-white/30 transition-all z-10"
          aria-label="Previous image"
        >
          ←
        </button>
      )}

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          id="lightbox-next"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-black/30 text-parchment/65 hover:text-parchment hover:border-white/30 transition-all z-10"
          aria-label="Next image"
        >
          →
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.src}
          alt={img.label}
          className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
          style={{ border: '1px solid rgba(56,64,106,0.4)' }}
        />
      </div>

      {/* Caption — slide up from bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 px-8 py-5"
        style={{
          background: 'linear-gradient(to top, rgba(28,32,53,0.95) 0%, transparent 100%)',
          animation: 'slideUpCaption 0.25s cubic-bezier(0.22,1,0.36,1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-sans font-semibold text-parchment text-sm tracking-tight">{img.label}</p>
        {img.description && (
          <p className="font-mono text-xs text-parchment/65 mt-1">{img.description}</p>
        )}
      </div>
    </div>
  )
}

// ── Visual Showcase Component ────────────────────────────────────────────────
function VisualShowcase({
  images,
  accentColor,
  mounted,
  mountDelay,
}: {
  images?: { src: string; label: string; description?: string }[]
  accentColor: string
  mounted: boolean
  mountDelay: number
}) {
  const [activeTab, setActiveTab] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Default geometric placeholders if no screenshots exist
  const placeholders = [
    { label: 'System Overview', symbol: '◈', description: 'Central workspace layout and main user path.' },
    { label: 'Detailed Workspace', symbol: '⬡', description: 'Deep dive view of structural details and content.' },
    { label: 'Interactive Features', symbol: '◉', description: 'Secondary controls, statistics, and configuration.' },
  ]

  const items = (images && images.length > 0 ? images : placeholders) as {
    label: string
    src?: string
    symbol?: string
    description?: string
  }[]

  return (
    <>
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.2s ease ${mountDelay}ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) ${mountDelay}ms`,
      }}
      className="space-y-6"
    >
      {/* Device frame (simulated browser mockup) */}
      <div
        className="relative rounded-[3px] border shadow-2xl overflow-hidden transition-all duration-200"
        style={{
          borderColor: 'rgba(56,64,106,0.35)',
          backgroundColor: 'rgba(28,32,53,0.7)',
        }}
      >
        {/* Browser Top Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: 'rgba(56,64,106,0.2)',
            backgroundColor: 'rgba(20,24,40,0.5)',
          }}
        >
          {/* Window control dots */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          {/* Browser Address Bar */}
          <div
            className="flex-1 max-w-md mx-4 py-1 px-3 text-xs font-mono text-center rounded truncate"
            style={{
              backgroundColor: 'rgba(10,12,22,0.6)',
              color: 'rgba(207,204,187,0.65)',
              border: '1px solid rgba(56,64,106,0.15)',
            }}
          >
            {images && images.length > 0 ? `visuals://showcase/${items[activeTab].label.toLowerCase().replace(/\s+/g, '-')}` : 'visuals://design-template/geometric-spec'}
          </div>

          <div className="w-10" /> {/* Spacer to balance dots */}
        </div>

        {/* Viewport Canvas */}
        <div className="relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center bg-[#0a0c16]">
          {/* Scanlines / Grid lines overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(207,204,187,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(207,204,187,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />

          {/* Glowing background radial gradient matching project accent color */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 transition-all duration-200"
            style={{
              background: `radial-gradient(circle at center, ${accentColor}15 0%, transparent 70%)`
            }}
          />

          {/* Show image or placeholder */}
          {images && images.length > 0 ? (
            <div
              className="w-full h-full relative"
              style={{ cursor: 'zoom-in' }}
              onClick={() => { setLightboxIndex(activeTab); setLightboxOpen(true) }}
              role="button"
              aria-label="Expand image"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setLightboxIndex(activeTab); setLightboxOpen(true) } }}
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.label}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-200 ease-in-out"
                  style={{
                    opacity: i === activeTab ? 1 : 0,
                    transform: i === activeTab ? 'scale(1)' : 'scale(1.025)',
                    visibility: i === activeTab ? 'visible' : 'hidden',
                  }}
                />
              ))}
              {/* Zoom-in hint overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm rounded px-3 py-1.5 font-mono text-xs text-parchment/70 border border-white/10">
                  ⊕ Click to expand
                </div>
              </div>
            </div>
          ) : (
            // Geometric template fallback
            <div className="flex flex-col items-center justify-center p-8 text-center h-full w-full relative">
              {/* Spinning or pulsing backdrop ring */}
              <div 
                className="absolute w-64 h-64 border rounded-full border-dashed animate-[spin_120s_linear_infinite]"
                style={{ borderColor: `${accentColor}12` }}
              />
              <div 
                className="absolute w-48 h-48 border rounded-full border-dashed animate-[spin_80s_linear_infinite_reverse]"
                style={{ borderColor: `${accentColor}08` }}
              />
              
              {/* Central pulsing symbol */}
              <div 
                className="relative z-10 font-mono text-7xl select-none transition-all duration-200 transform hover:scale-110"
                style={{ 
                  color: accentColor,
                  textShadow: `0 0 40px ${accentColor}50`
                }}
              >
                {(items[activeTab] as any).symbol}
              </div>

              {/* Title & Description of current screen within canvas */}
              <div className="relative z-10 mt-6 space-y-2 max-w-sm">
                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: `${accentColor}e6` }}>
                  [Mockup Template Unit_{String(activeTab + 1).padStart(2, '0')}]
                </span>
                <h4 className="font-sans font-black text-parchment text-lg tracking-tight">
                  {items[activeTab].label}
                </h4>
                <p className="font-mono text-xs text-parchment/70 px-4">
                  {items[activeTab].description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className="flex flex-col text-left p-3.5 border transition-all duration-200 relative group rounded-sm"
            style={{
              borderColor: idx === activeTab ? `${accentColor}40` : 'rgba(56,64,106,0.18)',
              backgroundColor: idx === activeTab ? `${accentColor}06` : 'rgba(28,32,53,0.3)',
            }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-mono text-xs text-parchment/65 group-hover:text-parchment/70">
                0{idx + 1}
              </span>
              {!images && (
                <span className="font-mono text-xs" style={{ color: idx === activeTab ? accentColor : 'rgba(207,204,187,0.65)' }}>
                  {(item as any).symbol}
                </span>
              )}
            </div>

            {/* Label */}
            <h5 
              className="font-sans font-bold text-xs tracking-tight transition-colors duration-200"
              style={{ color: idx === activeTab ? accentColor : 'rgba(207,204,187,0.65)' }}
            >
              {item.label}
            </h5>

            {/* Description */}
            <p className="font-mono text-xs text-parchment/65 mt-1.5 leading-[1.6] group-hover:text-parchment/70 transition-colors w-full">
              {item.description}
            </p>

            {/* Selected bottom glow bar */}
            {idx === activeTab && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5" 
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Lightbox portal */}
    {lightboxOpen && images && images.length > 0 && (
      <Lightbox
        images={images}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % images.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)}
      />
    )}
  </>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProjectCaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  const project = PROJECTS.find((p) => p.id === slug)
  const projectIndex = project ? PROJECTS.indexOf(project) : 0

  useEffect(() => {
    const hash = window.location.hash
    const t = setTimeout(() => {
      setMounted(true)
      // After mount animation, scroll to hash section if present
      if (hash) {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 120)
    return () => clearTimeout(t)
  }, [slug])

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-xs tracking-label text-parchment/65">404 — PROJECT NOT FOUND</p>
          <Link to="/" className="font-mono text-xs text-gold/88 hover:text-gold transition-colors">
            ← Return Home
          </Link>
        </div>
      </div>
    )
  }

  const cs = project.caseStudy
  const acc = project.accentColor

  return (
    <div className="min-h-screen" style={{ paddingTop: '48px' }}>

      {/* ── MASTHEAD ─────────────────────────────────────────────────────────── */}
      <div
        className="relative px-6 lg:px-12 py-8"
        style={{
          borderBottom: '1px solid rgba(56,64,106,0.4)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.2s ease, transform 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Full-width project color top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${acc} 35%, ${acc} 65%, transparent 100%)`,
            opacity: 0.55,
          }}
        />

        {/* Back + index row */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5"
          >
            <svg viewBox="0 0 16 10" className="w-4 h-4 text-parchment/65 group-hover:text-parchment/65 transition-colors">
              <path d="M10 1 L2 5 L10 9" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="2" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-xs tracking-label text-parchment/65 group-hover:text-parchment/65 uppercase transition-colors">
              Work
            </span>
          </button>

          <span className="font-mono text-xs text-parchment/65 tabular-nums">
            {String(projectIndex + 1).padStart(2, '0')} — {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Category tags + status */}
        <div className="flex items-center gap-3 mb-4">
          {project.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="font-mono text-xs tracking-label uppercase"
              style={{ color: acc, opacity: 0.9 }}
            >
              {cat}
            </span>
          ))}
          {project.status === 'live' && (
            <>
              <div className="w-px h-3 bg-accent/40" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34d399' }} />
                <span className="font-mono text-xs tracking-label text-parchment/65">Live</span>
              </div>
            </>
          )}
        </div>

        {/* Display title */}
        <h1
          className="font-sans font-black text-parchment leading-none mb-3"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            letterSpacing: '-0.05em',
            viewTransitionName: `project-title-${project.id}`,
          }}
        >
          {project.title}
        </h1>

        {/* Subtitle */}
        <p
          className="font-mono text-sm leading-relaxed max-w-2xl"
          style={{ color: `${acc}e6` }}
        >
          {project.subtitle}
        </p>

        {/* Role + URL */}
        <div className="flex flex-wrap items-center gap-4 mt-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-px" style={{ backgroundColor: acc, opacity: 0.35 }} />
            <span className="font-mono text-xs tracking-label text-parchment/70 uppercase">{project.role}</span>
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs tracking-label uppercase transition-colors duration-200"
              style={{ color: `${acc}e6` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = acc)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${acc}e6`)}
            >
              {project.url.replace('https://', '')} ↗
            </a>
          )}
        </div>
      </div>

      {/* ── BODY — 30/70 column split ──────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row">

        {/* ── LEFT 30% — Sticky metadata sidebar ──────────────────────────────── */}
        <MetadataSidebar project={project} projectIndex={projectIndex} mounted={mounted} />

        {/* ── RIGHT 70% — Scrolling editorial content ─────────────────────────── */}
        <div
          className="flex-1 px-6 lg:px-14 py-12 space-y-16"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.2s ease 120ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 120ms',
          }}
        >
          {/* §01 Executive Summary */}
          {cs?.executiveSummary && (
            <section>
              <SectionRule index="01" label="Executive Summary" accentColor={acc} mounted={mounted} mountDelay={180} />
              <p
                className="font-sans font-medium text-parchment leading-relaxed"
                style={{
                  fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                  letterSpacing: '-0.01em',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 0.2s ease 240ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 240ms',
                }}
              >
                {cs.executiveSummary}
              </p>
            </section>
          )}

          {/* §02 Interface Showcase */}
          {cs && (
            <section>
              <SectionRule index="02" label="Interface Showcase" accentColor={acc} mounted={mounted} mountDelay={300} />
              <VisualShowcase images={cs.images} accentColor={acc} mounted={mounted} mountDelay={360} />
            </section>
          )}

          {/* §03 Problem Space */}
          {cs?.problemSpace && cs.problemSpace.length > 0 && (
            <section>
              <SectionRule index="03" label="Problem Space & Scope" accentColor={acc} mounted={mounted} mountDelay={480} />
              <div>
                {cs.problemSpace.map((para, i) => (
                  <EditorialParagraph
                    key={i}
                    text={para}
                    accentColor={acc}
                    mounted={mounted}
                    mountDelay={540 + i * 80}
                  />
                ))}
              </div>
            </section>
          )}

          {/* §04 System Architecture */}
          {cs?.systemArchitecture && cs.systemArchitecture.length > 0 && (
            <section>
              <SectionRule
                index="04"
                label="System Architecture & Design Engineering"
                accentColor={acc}
                mounted={mounted}
                mountDelay={660}
              />

              {/* Stack chips row */}
              <div
                className="flex flex-wrap gap-1.5 mb-6"
                style={{
                  opacity: mounted ? 1 : 0,
                  transition: 'opacity 0.2s ease 720ms',
                }}
              >
                {project.tools.map((tool) => (
                  <ToolChip key={tool} label={tool} accentColor={acc} />
                ))}
              </div>

              {/* Spec box wrapper */}
              <SpecBox accentColor={acc} stamp="[ARCH // DESIGN-ENG]" mounted={mounted} mountDelay={740}>
                <div>
                  {cs.systemArchitecture.map((para, i) => (
                    <EditorialParagraph
                      key={i}
                      text={para}
                      accentColor={acc}
                      mounted={mounted}
                      mountDelay={760 + i * 80}
                    />
                  ))}
                </div>
              </SpecBox>
            </section>
          )}

          {/* §05 Validation & Impact */}
          {cs?.validation && cs.validation.length > 0 && (
            <section>
              <SectionRule index="05" label="Validation & Impact" accentColor={acc} mounted={mounted} mountDelay={880} />

              {/* Metric callouts row */}
              {project.metrics.length > 0 && (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'opacity 0.2s ease 940ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 940ms',
                  }}
                >
                  {project.metrics.map((m) => (
                    <MetricBlock key={m.label} label={m.label} value={m.value} accentColor={acc} />
                  ))}
                </div>
              )}

              <div>
                {cs.validation.map((para, i) => (
                  <EditorialParagraph
                    key={i}
                    text={para}
                    accentColor={acc}
                    mounted={mounted}
                    mountDelay={960 + i * 80}
                  />
                ))}
              </div>
            </section>
          )}

          {/* §06 Roadmap */}
          {cs?.roadmap && (
            <section>
              <SectionRule index="06" label="Roadmap" accentColor={acc} mounted={mounted} mountDelay={1080} />
              <div
                className="px-6 py-5 border-l-2"
                style={{
                  borderColor: `${acc}60`,
                  backgroundColor: `${acc}06`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 0.2s ease 1140ms, transform 0.26s cubic-bezier(0.22,1,0.36,1) 1140ms',
                }}
              >
                <p className="font-mono text-xs text-parchment/65 leading-[1.85] italic">{cs.roadmap}</p>
              </div>
            </section>
          )}

          {/* No case study fallback */}
          {!cs && (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
              <div
                className="w-12 h-12 border rounded-sm flex items-center justify-center"
                style={{ borderColor: `${acc}30` }}
              >
                <span className="font-mono text-xl" style={{ color: `${acc}e6` }} aria-hidden="true">◈</span>
              </div>
              <p className="font-mono text-xs tracking-label text-parchment/65 uppercase">Case Study In Progress</p>
              <p className="font-mono text-xs text-parchment/65 max-w-xs leading-relaxed">
                {project.narrative[0]}
              </p>
            </div>
          )}

          {/* Project navigation */}
          <ProjectNav current={projectIndex} />
        </div>
      </div>
    </div>
  )
}
