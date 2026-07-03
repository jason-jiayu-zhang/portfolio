import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'
import type { Project } from '../types/portfolio'
import WheelSelector from './WheelSelector'
import { SNAP_INTERVAL } from '../utils/wheelMath'
import { useIntro } from './IntroContext'

// ── Animated Element Wrapper ───────────────────────────────────────────────
interface AnimatedElementProps {
  delay: number
  children: React.ReactNode
  className?: string
}

function AnimatedElement({ delay, children, className = '' }: AnimatedElementProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`${className}`}>
      <div
        style={{
          transform: show ? 'translateY(0)' : 'translateY(10px)',
          opacity: show ? 1 : 0,
          // Expo-out: 70% of travel happens in first 15% of time — feels instant,
          // but the curve coasts gently to rest over the full duration.
          transition: `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Narrative text panel ───────────────────────────────────────────────────
interface NarrativePanelProps {
  project: Project
}

function NarrativePanel({ project }: NarrativePanelProps) {
  const [lines, setLines] = useState<boolean[]>(Array(project.narrative.length).fill(false))

  useEffect(() => {
    setLines(Array(project.narrative.length).fill(false))
    const timeouts = project.narrative.map((_, i) => 
      setTimeout(() => {
        setLines(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, 500 + i * 120)
    )
    return () => timeouts.forEach(clearTimeout)
  }, [project.narrative.length])

  return (
    <div className="space-y-4">
      {project.narrative.map((para, i) => (
        <div key={i} className="">
          <p
            className="font-mono text-sm text-parchment/60 leading-[1.65] tracking-tight"
            style={{
              transform: lines[i] ? 'translateY(0)' : 'translateY(8px)',
              opacity: lines[i] ? 1 : 0,
              // Expo-out: each paragraph snaps into place immediately, then flows to rest
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform, opacity',
            }}
          >
            {para}
          </p>
        </div>
      ))}
    </div>
  )
}

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
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  // Reset index when project changes
  useEffect(() => {
    setActiveImageIdx(0)
  }, [project.id])

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
      className="group/carousel relative block w-full aspect-[21/9] rounded-sm overflow-hidden border transition-all duration-300 bg-surface/10 hover:bg-surface/20 shadow-lg mb-4"
      style={{
        borderColor: isHovered ? `${acc}60` : `${acc}25`,
        boxShadow: isHovered ? `0 12px 48px -12px ${acc}20` : `0 8px 32px -8px ${acc}08`,
      }}
    >
      {/* Scanlines / Grid lines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(207,204,187,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(207,204,187,0.1) 1px, transparent 1px)`,
        backgroundSize: '16px 16px'
      }} />

      {images.length > 0 ? (
        <div className="w-full h-full relative">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.label}
              /* LCP candidate (first slide of first project): prioritize fetch */
              fetchPriority={i === 0 ? 'high' : 'low'}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding={i === 0 ? 'sync' : 'async'}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: i === activeImageIdx ? (isHovered ? 1 : 0.6) : 0,
                transform: i === activeImageIdx ? (isHovered ? 'scale(1.05)' : 'scale(1)') : 'scale(1.025)',
                visibility: i === activeImageIdx ? 'visible' : 'hidden',
                // Expo-out: snaps to the new scale instantly, drifts to rest
                transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}

          {/* Banner screen label */}
          <div className="absolute bottom-3 left-3 pointer-events-none transition-opacity duration-300">
            <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/70 font-semibold drop-shadow-md">
              // {images[activeImageIdx].label}
            </span>
          </div>
        </div>
      ) : (
        // Render geometric Spec/Placeholder with hover states matching Studio style
        <div className="w-full h-full flex flex-col items-center justify-center relative p-6">
          {/* Spinning dashed rings */}
          <div className="absolute w-40 h-40 border rounded-full border-dashed animate-[spin_120s_linear_infinite]"
               style={{ borderColor: `${acc}15` }} />
          <div className="absolute w-28 h-28 border rounded-full border-dashed animate-[spin_80s_linear_infinite_reverse]"
               style={{ borderColor: `${acc}10` }} />

          {/* Glowing central glyph */}
          <div 
            className="font-mono text-5xl transition-all duration-500 select-none"
            style={{ 
              color: acc,
              opacity: isHovered ? 0.75 : 0.25,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              textShadow: isHovered ? `0 0 24px ${acc}60` : `0 0 8px ${acc}20`
            }}
          >
            {currentSymbol}
          </div>

          <div className="absolute bottom-3 text-center w-full px-4">
            <p className="font-mono text-xs tracking-label uppercase text-parchment/50 group-hover/carousel:text-[#cfccbb90] transition-colors">
              [{project.title} Spec Template]
            </p>
          </div>
        </div>
      )}

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10 px-2 py-1 rounded bg-[#0a0c16]/50 backdrop-blur-sm">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => handleDotClick(e, i)}
              className="w-1 h-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === activeImageIdx ? acc : '#cfccbb',
                opacity: i === activeImageIdx ? 1 : 0.3,
                transform: i === activeImageIdx ? 'scale(1.35)' : 'scale(1)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </Link>
  )
}

// ── Main Hero Section ──────────────────────────────────────────────────────
export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [projKey, setProjKey] = useState('proj-0')
  const keyRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const wheelContainerRef = useRef<HTMLDivElement>(null)
  const wheelPosRef = useRef<number | null>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)

  // Mouse position: use refs to avoid React re-renders on every mousemove frame.
  // The coordinate display is updated via direct DOM manipulation — same visual result, zero cost.
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)
  const coordXRef = useRef<HTMLSpanElement>(null)
  const coordYRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX
      mouseYRef.current = e.clientY
      // Update the DOM directly — bypasses React reconciler entirely
      if (coordXRef.current) coordXRef.current.textContent = `X:${String(e.clientX).padStart(4, '0')}`
      if (coordYRef.current) coordYRef.current.textContent = `Y:${String(e.clientY).padStart(4, '0')}`
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleProjectChange = useCallback((index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsFadingOut(true)

    timeoutRef.current = setTimeout(() => {
      // Record the wheel's position relative to the viewport right before content changes
      if (wheelContainerRef.current) {
        wheelPosRef.current = wheelContainerRef.current.getBoundingClientRect().top
      }

      setDisplayIndex(index)
      keyRef.current += 1
      setProjKey(`proj-${index}-${keyRef.current}`)
      setIsFadingOut(false)
    }, 300)
  }, [activeIndex])

  // ── AMBIENT AUTO-ROTATE ───────────────────────────────────────────────────
  // Slowly cycles the wheel to the next project on its own when idle; any
  // interaction (drag/scroll on the wheel, or the change it produces) resets the timer.
  const AUTO_ADVANCE_MS = 6000
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeIndexRef = useRef(activeIndex)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const resetAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
    autoAdvanceTimerRef.current = setInterval(() => {
      handleProjectChange((activeIndexRef.current + 1) % PROJECTS.length)
    }, AUTO_ADVANCE_MS)
  }, [handleProjectChange])

  useEffect(() => {
    resetAutoAdvance()
    return () => {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
    }
  }, [resetAutoAdvance])

  useEffect(() => {
    const el = wheelContainerRef.current
    if (!el) return
    el.addEventListener('pointerdown', resetAutoAdvance)
    el.addEventListener('wheel', resetAutoAdvance, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', resetAutoAdvance)
      el.removeEventListener('wheel', resetAutoAdvance)
    }
  }, [resetAutoAdvance])

  // ── Touch swipe state (for mobile project switching) ─────────────────────
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const touchStartTimeRef = useRef(0)
  const touchSwipeLockedRef = useRef<'horizontal' | 'vertical' | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStartXRef.current = t.clientX
    touchStartYRef.current = t.clientY
    touchStartTimeRef.current = performance.now()
    touchSwipeLockedRef.current = null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchSwipeLockedRef.current !== 'horizontal') return

    const t = e.changedTouches[0]
    const deltaX = t.clientX - touchStartXRef.current
    const elapsed = performance.now() - touchStartTimeRef.current

    if (Math.abs(deltaX) > 50 && elapsed < 250) {
      if (deltaX < 0) {
        // Swipe left → next project
        handleProjectChange((activeIndex + 1) % PROJECTS.length)
      } else {
        // Swipe right → previous project
        handleProjectChange((activeIndex - 1 + PROJECTS.length) % PROJECTS.length)
      }
    }

    touchSwipeLockedRef.current = null
  }

  // Attach non-passive touchmove listener so we can call preventDefault on horizontal swipes
  // Also handles axis-lock detection (can't use synthetic onTouchMove for preventDefault)
  useEffect(() => {
    const el = leftPanelRef.current
    if (!el) return
    const handler = (e: TouchEvent) => {
      const t = e.touches[0]
      const deltaX = t.clientX - touchStartXRef.current
      const deltaY = t.clientY - touchStartYRef.current

      // Lock to an axis on the first significant movement
      if (!touchSwipeLockedRef.current) {
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
          touchSwipeLockedRef.current = 'horizontal'
        } else if (Math.abs(deltaY) > 8) {
          touchSwipeLockedRef.current = 'vertical'
        }
      }

      if (touchSwipeLockedRef.current === 'horizontal') {
        e.preventDefault()
      }
    }
    el.addEventListener('touchmove', handler, { passive: false })
    return () => el.removeEventListener('touchmove', handler)
  }, [])

  React.useLayoutEffect(() => {
    if (wheelPosRef.current !== null && wheelContainerRef.current) {
      const newTop = wheelContainerRef.current.getBoundingClientRect().top
      const diff = newTop - wheelPosRef.current
      
      // If the wheel moved relative to the viewport (e.g. because text above it changed height),
      // adjust the window scroll to keep it under the user's finger.
      if (Math.abs(diff) > 0) {
        window.scrollBy({ top: diff })
      }
      wheelPosRef.current = null
    }
  }, [displayIndex, projKey])

  const activeProject = PROJECTS[activeIndex]
  const project = PROJECTS[displayIndex]
  const { hasLoaded, phase } = useIntro()
  const showPhase2 = hasLoaded || phase === 'phase02' || phase === 'phase03'
  const isPhase3 = hasLoaded || phase === 'phase03'

  useEffect(() => {
    if (phase === 'phase03' && !hasLoaded) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [phase, hasLoaded])

  return (
    <section
      id="featured"
      className="relative w-full overflow-x-clip min-h-[100dvh]"
      style={{ marginTop: 0, paddingTop: '48px' }}
    >
      {/* ── Horizontal hairline accent ── */}
      {showPhase2 && (
        <div
          className={`absolute left-0 right-0 top-[48px] border-t ${!hasLoaded ? 'animate-slice-x' : ''}`}
          style={{ borderColor: 'rgba(56, 64, 106, 0.4)' }}
        />
      )}

      {/* ── SPLIT LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-full flex-1 relative">
        
        {/* Vertical split line */}
        {showPhase2 && (
          <div 
            className={`hidden lg:block absolute left-[45%] top-0 bottom-0 border-l ${!hasLoaded ? 'animate-slice-y' : ''}`}
            style={{ borderColor: 'rgba(56, 64, 106, 0.35)' }}
          />
        )}

        {/* ── LEFT 45% — Project Metadata Panel ── */}
        <div
          ref={leftPanelRef}
          className="relative flex flex-col justify-start px-4 sm:px-6 lg:px-12 min-h-full pt-16 sm:pt-20 lg:pt-32 pb-24 lg:pb-24 w-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {showPhase2 && (
            <>
              {/* Top label & Nav dots */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 lg:left-12 right-4 sm:right-6 lg:right-12 flex items-center justify-between">
                <span className="label-caps">FEATURED /</span>
                <div className="flex items-center gap-2">
                  {PROJECTS.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => handleProjectChange(i)}
                      className="group relative"
                      aria-label={p.title}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: i === activeIndex ? p.accentColor : '#cfccbb',
                          opacity: i === activeIndex ? 1 : 0.2,
                          transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div 
                key={projKey}
                className="flex-1 flex flex-col justify-start transition-opacity duration-300 ease-in-out"
                style={{ opacity: isFadingOut ? 0 : 1 }}
              >
                {/* 1. Header Cluster (Tight Spacing) */}
                <div className="flex flex-col gap-1 mb-4 sm:mb-8">
                  <AnimatedElement delay={0}>
                    <div className="font-mono text-xs tracking-label uppercase text-[#a39d7b]">
                      0{project.wheelIndex + 1} / 0{PROJECTS.length}
                    </div>
                  </AnimatedElement>
                  <AnimatedElement delay={60}>
                    <div className="font-mono text-xs tracking-label uppercase" style={{ color: project.accentColor }}>
                      {project.categories[0]}
                    </div>
                  </AnimatedElement>
                  <AnimatedElement delay={120} className="mt-1">
                    <Link
                      to={`/work/${project.id}`}
                      viewTransition
                      className="font-sans font-bold text-4xl text-parchment leading-none tracking-tight block hover:opacity-80 transition-opacity cursor-pointer"
                      style={{
                        viewTransitionName: `project-title-${project.id}`,
                      }}
                    >
                      {project.title}
                    </Link>
                  </AnimatedElement>
                  <AnimatedElement delay={180}>
                    <div className="font-mono text-sm text-parchment/60 tracking-tight mt-1">
                      {project.subtitle}
                    </div>
                  </AnimatedElement>
                </div>

                {/* 2. Project Metadata Cluster (Tight Spacing) */}
                <div className="flex flex-col gap-2 mb-6 sm:mb-10">
                  <AnimatedElement delay={240}>
                    <div className="flex items-center gap-2 font-mono text-xs tracking-label text-parchment/50 uppercase">
                      <div className="w-3 h-px" style={{ backgroundColor: project.accentColor, opacity: 0.4 }} />
                      <span>{project.role}</span>
                    </div>
                  </AnimatedElement>
                  
                  <div className="flex flex-col gap-2 my-1">
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.map((t, i) => (
                        <AnimatedElement key={t} delay={280 + i * 30} className="inline-block">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono tracking-label rounded-sm border cursor-default transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] border-[#38406a80] text-[#cfccbb8c] bg-transparent hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-bg)]"
                            style={{
                              '--accent': project.accentColor,
                              '--accent-bg': `${project.accentColor}10`,
                              textBox: 'trim-both cap alphabetic',
                            } as React.CSSProperties}
                          >
                            {t}
                          </span>
                        </AnimatedElement>
                      ))}
                    </div>

                    {/* Classification & Award Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.length >= 4 && (
                        <AnimatedElement delay={280 + project.tools.length * 30} className="inline-block">
                          <span
                            className="font-mono text-xs tracking-label px-2 py-0.5 border rounded-sm"
                            style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}
                          >
                            [Design System Parity]
                          </span>
                        </AnimatedElement>
                      )}
                      {project.categories.includes('Full-Stack Engineering') && (
                        <AnimatedElement delay={280 + (project.tools.length + 1) * 30} className="inline-block">
                          <span
                            className="font-mono text-xs tracking-label px-2 py-0.5 border rounded-sm"
                            style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}
                          >
                            [UI Engineering]
                          </span>
                        </AnimatedElement>
                      )}
                      {project.awards?.map((award, i) => (
                        <AnimatedElement key={award} delay={280 + (project.tools.length + 2 + i) * 30} className="inline-block">
                          <span
                            className="font-mono text-xs tracking-label px-2 py-0.5 border rounded-sm"
                            style={{ borderColor: `${project.accentColor}40`, color: project.accentColor, textBox: 'trim-both cap alphabetic' } as React.CSSProperties}
                          >
                            ★ {award}
                          </span>
                        </AnimatedElement>
                      ))}
                    </div>
                  </div>

                  {project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {project.metrics.map((m, i) => (
                        <AnimatedElement key={m.label} delay={360 + i * 40}>
                          <div
                            className="flex flex-col gap-0.5 px-3 py-2 rounded-sm border border-[rgba(255,255,255,0.05)] bg-transparent hover:bg-[var(--accent-bg-hover)] transition-colors duration-400"
                            style={{ '--accent-bg-hover': `${project.accentColor}08` } as React.CSSProperties}
                          >
                            <span className="font-mono text-xs tracking-label text-[#cfccbb4d] uppercase">{m.label}</span>
                            <span
                              className="font-mono text-sm font-medium"
                              style={{ color: project.accentColor }}
                            >
                              {m.value}
                            </span>
                          </div>
                        </AnimatedElement>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Status badge & CTA */}
                <AnimatedElement delay={380}>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mb-8">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: project.status === 'live' ? '#4ade80' : '#a39d7b',
                          boxShadow: project.status === 'live' ? '0 0 6px #4ade80' : 'none',
                        }}
                      />
                      <span className="label-caps">
                        {project.status === 'live' ? 'Live' : project.status === 'offline' ? 'Offline' : 'Archived'}
                      </span>
                    </div>
                    {project.url && (
                      <>
                        <div className="w-px h-3 bg-white/20 hidden xs:block" />
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="label-caps hover:text-parchment transition-colors underline underline-offset-2"
                        >
                          {project.url.replace('https://', '')} ↗
                        </a>
                      </>
                    )}
                    <div className="w-px h-3 bg-white/20" />
                    <Link
                      to={`/work/${project.id}`}
                      viewTransition
                      className="label-caps transition-opacity hover:opacity-80 underline underline-offset-2"
                      style={{ color: project.accentColor }}
                    >
                      Read Case Study →
                    </Link>
                  </div>
                </AnimatedElement>

                {/* Visual Preview Carousel */}
                <AnimatedElement delay={400}>
                  <ProjectPreviewCarousel project={project} />
                </AnimatedElement>
 
                {/* 3 & 4. Description Block with Macro Margin above */}
                <div className="mb-8">
                  <NarrativePanel project={project} />
                </div>
              </div>


              {/* Left edge index line */}
              <div 
                key={`edge-${projKey}`}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-32 flex items-center transition-opacity duration-300 ease-in-out"
                style={{ opacity: isFadingOut ? 0 : 1 }}
              >
                <div
                  className={`w-px h-full transition-all duration-700 ${!hasLoaded ? 'animate-slice-y' : ''}`}
                  style={{ backgroundColor: project.accentColor, opacity: 0.6 }}
                />
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT 55% — Interactive Wheel Wrapper ── */}
        <div className="w-full">
          <div
            ref={wheelContainerRef}
            className="relative flex items-center justify-center w-full min-h-[40vh] lg:h-[calc(100vh-48px)] lg:sticky lg:top-[48px] py-8 sm:py-12 lg:py-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(56,64,106,0.1) 0%, transparent 70%)' }}
          >
            {showPhase2 && (
              <>
            {/* Corner coordinate labels */}
            <div className={`hidden lg:block absolute top-4 sm:top-6 left-4 sm:left-6 lg:left-12 label-caps opacity-40 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
              <span ref={coordXRef}>X:{String(mouseXRef.current).padStart(4, '0')}</span>
            </div>
            <div className={`hidden lg:block absolute top-4 sm:top-6 right-4 sm:right-6 lg:right-12 label-caps opacity-40 text-right ${!hasLoaded ? 'animate-fade-down' : ''}`}>
              <span ref={coordYRef}>Y:{String(mouseYRef.current).padStart(4, '0')}</span>
            </div>
            <div className={`hidden lg:block absolute bottom-4 sm:bottom-6 left-4 sm:left-6 lg:left-12 label-caps opacity-40 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
              θ:{(Math.round(activeIndex * SNAP_INTERVAL)).toString().padStart(3, '0')}°
            </div>
            <div className={`hidden lg:block absolute bottom-4 sm:bottom-6 right-4 sm:right-6 lg:right-12 label-caps opacity-40 text-right ${!hasLoaded ? 'animate-fade-down' : ''}`}>
              R:276
            </div>
            </>
            )}

            {isPhase3 && (
              <>
                {/* Left Arrow Button */}
                <div className="absolute left-3 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20">
                  <button
                    onClick={() => handleProjectChange((activeIndex - 1 + PROJECTS.length) % PROJECTS.length)}
                    className="p-2 md:p-3 rounded-full border bg-primary/40 backdrop-blur-md transition-all duration-300 group focus:outline-none hover:bg-surface/50 active:scale-95 animate-arrow-left-in"
                    style={{
                      borderColor: `${activeProject.accentColor}33`,
                      color: activeProject.accentColor,
                      boxShadow: '0 0 0px transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = activeProject.accentColor
                      e.currentTarget.style.boxShadow = `0 0 12px ${activeProject.accentColor}33`
                      e.currentTarget.style.color = '#cfccbb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${activeProject.accentColor}33`
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.color = activeProject.accentColor
                    }}
                    aria-label="Previous Project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform duration-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                </div>

                {/* Right Arrow Button */}
                <div className="absolute right-3 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20">
                  <button
                    onClick={() => handleProjectChange((activeIndex + 1) % PROJECTS.length)}
                    className="p-2 md:p-3 rounded-full border bg-primary/40 backdrop-blur-md transition-all duration-300 group focus:outline-none hover:bg-surface/50 active:scale-95 animate-arrow-right-in"
                    style={{
                      borderColor: `${activeProject.accentColor}33`,
                      color: activeProject.accentColor,
                      boxShadow: '0 0 0px transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = activeProject.accentColor
                      e.currentTarget.style.boxShadow = `0 0 12px ${activeProject.accentColor}33`
                      e.currentTarget.style.color = '#cfccbb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${activeProject.accentColor}33`
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.color = activeProject.accentColor
                    }}
                    aria-label="Next Project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* Wheel SVG container */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 'var(--wheel-size)', height: 'var(--wheel-size)' }}
            >
              <WheelSelector
                onProjectChange={handleProjectChange}
                activeIndex={activeIndex}
              />
            </div>

            {/* Active project accent glow behind wheel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${activeProject.accentColor}08 0%, transparent 65%)`,
                transition: 'background 0.8s ease',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
