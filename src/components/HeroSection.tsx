import React, { useState, useCallback, useEffect, useRef } from 'react'
import { WHEEL_SECTIONS } from '../data/about'
import WheelSelector from './WheelSelector'
import { SNAP_INTERVAL } from '../utils/wheelMath'
import { useIntro } from './IntroContext'
import { DescriptionPanel, TrajectoryPanel, PhilosophyPanel, CatalogPanel, usePrefersReducedMotion } from './HeroAboutPanels'

const SECTION_PANELS = [DescriptionPanel, TrajectoryPanel, PhilosophyPanel, CatalogPanel]

// ── Section content transition wrapper ─────────────────────────────────────
// Outgoing content fades out with a slight upward drift; the freshly-mounted
// incoming content (remounted via `key`) slides up into place from below —
// gives the swap a sense of vertical flow that echoes the wheel's rotation.
function SectionTransitionWrapper({ isExiting, children }: { isExiting: boolean; children: React.ReactNode }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="flex-1 flex flex-col justify-start"
      style={{
        opacity: isExiting ? 0 : entered ? 1 : 0,
        transform: isExiting ? 'translateY(-4px)' : entered ? 'translateY(0)' : 'translateY(6px)',
        transition: isExiting
          ? 'opacity 0.16s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          : 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: entered && !isExiting ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

// ── Main Hero Section ──────────────────────────────────────────────────────
export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [sectionKey, setSectionKey] = useState('section-0')
  const keyRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

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

  const handleSectionChange = useCallback((index: number) => {
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
      setSectionKey(`section-${index}-${keyRef.current}`)
      setIsFadingOut(false)
    }, 220)
  }, [activeIndex])

  // ── AMBIENT AUTO-ROTATE ───────────────────────────────────────────────────
  // Slowly cycles the wheel to the next section on its own when idle; any
  // interaction (drag/scroll on the wheel, or the change it produces) resets the timer.
  const AUTO_ADVANCE_MS = 15000
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const isAutoAdvanceRef = useRef(false)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const resetAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
    if (prefersReducedMotion) return
    autoAdvanceTimerRef.current = setInterval(() => {
      isAutoAdvanceRef.current = true
      handleSectionChange((activeIndexRef.current + 1) % WHEEL_SECTIONS.length)
    }, AUTO_ADVANCE_MS)
  }, [handleSectionChange, prefersReducedMotion])

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

  // ── Touch swipe state (for mobile section switching) ─────────────────────
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
        // Swipe left → next section
        handleSectionChange((activeIndex + 1) % WHEEL_SECTIONS.length)
      } else {
        // Swipe right → previous section
        handleSectionChange((activeIndex - 1 + WHEEL_SECTIONS.length) % WHEEL_SECTIONS.length)
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
  }, [displayIndex, sectionKey])

  const activeSection = WHEEL_SECTIONS[activeIndex]
  const prevSection = WHEEL_SECTIONS[(activeIndex - 1 + WHEEL_SECTIONS.length) % WHEEL_SECTIONS.length]
  const nextSection = WHEEL_SECTIONS[(activeIndex + 1) % WHEEL_SECTIONS.length]
  const ActivePanel = SECTION_PANELS[displayIndex]
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

        {/* ── LEFT 45% — About Content Panel ── */}
        <div
          ref={leftPanelRef}
          className="relative flex flex-col justify-start px-3 sm:px-6 lg:px-12 min-h-full pt-12 sm:pt-20 lg:pt-32 pb-6 sm:pb-8 lg:pb-24 w-full"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Subtle color wash tying this panel to the active section's accent */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 30% 35%, ${activeSection.accentColor}08 0%, transparent 60%)`,
              transition: 'background 0.4s ease',
            }}
          />

          {showPhase2 && (
            <>
              {/* Top label & Nav dots */}
              <div className="absolute top-4 sm:top-6 left-3 sm:left-6 lg:left-12 right-3 sm:right-6 lg:right-12 flex items-center justify-between">
                <span className="label-caps">ABOUT /</span>
                <div className="flex items-center gap-2.5" role="tablist" aria-label="Hero about sections">
                  {WHEEL_SECTIONS.map((s, i) => {
                    const isActive = i === activeIndex
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleSectionChange(i)}
                        className="group relative py-1"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Navigate to ${s.slug} section`}
                      >
                        {/* Hover tooltip */}
                        <span
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-1.5 py-0.5 whitespace-nowrap rounded-sm font-mono text-[9px] uppercase tracking-label opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
                          style={{ backgroundColor: '#0b0c10', color: s.accentColor, border: `1px solid ${s.accentColor}40` }}
                        >
                          {s.slug}
                        </span>
                        {/* Sonar ping on active change */}
                        {isActive && (
                          <span
                            key={`ping-${sectionKey}`}
                            className="absolute inset-0 m-auto w-2 h-2 rounded-full pointer-events-none"
                            style={{ backgroundColor: s.accentColor, animation: 'sonarPing 0.7s ease-out' }}
                          />
                        )}
                        <div
                          className="w-2 h-2 rounded-full transition-all duration-200"
                          style={{
                            backgroundColor: isActive ? s.accentColor : '#cfccbb',
                            opacity: isActive ? 1 : 0.2,
                            transform: isActive ? 'scale(1.35)' : 'scale(1)',
                          }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="thin-scrollbar flex-1 flex flex-col max-lg:overflow-y-auto max-lg:max-h-[calc(100dvh-128px)] max-lg:px-1 max-lg:-mx-1">
                <SectionTransitionWrapper key={sectionKey} isExiting={isFadingOut}>
                  <ActivePanel />
                </SectionTransitionWrapper>
              </div>

              {/* Left edge index line */}
              <div
                key={`edge-${sectionKey}`}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-48 flex items-center transition-opacity duration-200 ease-in-out"
                style={{ opacity: isFadingOut ? 0 : 1 }}
              >
                <div
                  className="w-px h-full"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${activeSection.accentColor}, transparent)`,
                    animation: 'edgeFlash 0.6s ease-out forwards',
                  }}
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
                <div className="group/arrow absolute left-1.5 sm:left-3 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2">
                  <button
                    onClick={() => handleSectionChange((activeIndex - 1 + WHEEL_SECTIONS.length) % WHEEL_SECTIONS.length)}
                    className="hero-arrow-btn p-1 sm:p-2 md:p-3 rounded-full border bg-primary/40 backdrop-blur-md transition-all duration-200 group focus:outline-none hover:bg-surface/50 active:scale-95 animate-arrow-left-in"
                    style={{
                      borderColor: `${activeSection.accentColor}33`,
                      color: activeSection.accentColor,
                      boxShadow: '0 0 0px transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = activeSection.accentColor
                      e.currentTarget.style.boxShadow = `0 0 12px ${activeSection.accentColor}33`
                      e.currentTarget.style.color = '#cfccbb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${activeSection.accentColor}33`
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.color = activeSection.accentColor
                    }}
                    aria-label={`Navigate to ${prevSection.slug} section`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transform group-hover:-translate-x-0.5 transition-transform duration-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <span
                    className="hidden md:inline-block font-mono text-[9px] uppercase tracking-label opacity-0 group-hover/arrow:opacity-60 transition-opacity duration-150 pointer-events-none whitespace-nowrap"
                    style={{ color: prevSection.accentColor }}
                  >
                    ← {prevSection.slug}
                  </span>
                </div>

                {/* Right Arrow Button */}
                <div className="group/arrow absolute right-1.5 sm:right-3 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 flex-row-reverse">
                  <button
                    onClick={() => handleSectionChange((activeIndex + 1) % WHEEL_SECTIONS.length)}
                    className="hero-arrow-btn p-1 sm:p-2 md:p-3 rounded-full border bg-primary/40 backdrop-blur-md transition-all duration-200 group focus:outline-none hover:bg-surface/50 active:scale-95 animate-arrow-right-in"
                    style={{
                      borderColor: `${activeSection.accentColor}33`,
                      color: activeSection.accentColor,
                      boxShadow: '0 0 0px transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = activeSection.accentColor
                      e.currentTarget.style.boxShadow = `0 0 12px ${activeSection.accentColor}33`
                      e.currentTarget.style.color = '#cfccbb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${activeSection.accentColor}33`
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.color = activeSection.accentColor
                    }}
                    aria-label={`Navigate to ${nextSection.slug} section`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transform group-hover:translate-x-0.5 transition-transform duration-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                  <span
                    className="hidden md:inline-block font-mono text-[9px] uppercase tracking-label opacity-0 group-hover/arrow:opacity-60 transition-opacity duration-150 pointer-events-none whitespace-nowrap"
                    style={{ color: nextSection.accentColor }}
                  >
                    {nextSection.slug} →
                  </span>
                </div>
              </>
            )}

            {/* Wheel SVG container */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 'var(--wheel-size)', height: 'var(--wheel-size)' }}
            >
              <WheelSelector
                onProjectChange={handleSectionChange}
                activeIndex={activeIndex}
                autoAdvanceRef={isAutoAdvanceRef}
              />
            </div>

            {/* Active section accent glow behind wheel */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${activeSection.accentColor}08 0%, transparent 65%)`,
                transition: 'background 0.25s ease',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
