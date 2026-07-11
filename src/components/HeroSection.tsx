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
      className="flex-1 min-h-0 flex flex-col justify-start"
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

// ── Control-bar tooltip ─────────────────────────────────────────────────────
// One shared HUD tooltip so every pager control (dots, arrows, play/pause)
// reads identically instead of falling back to the browser's native title.
function ControlTip({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-1.5 py-0.5 whitespace-nowrap rounded-sm font-mono text-[9px] uppercase tracking-label opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
      style={{ backgroundColor: '#0b0c10', color: accent, border: `1px solid ${accent}40` }}
    >
      {label}
    </span>
  )
}

// Shared shape for every control-bar button: fixed height so the tooltips align.
const CONTROL_BTN = 'group relative flex items-center justify-center h-5 text-parchment/45 hover:text-parchment transition-colors duration-200 focus:outline-none'

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
  const contentBandRef = useRef<HTMLDivElement>(null)

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
      setDisplayIndex(index)
      keyRef.current += 1
      setSectionKey(`section-${index}-${keyRef.current}`)
      setIsFadingOut(false)
    }, 220)
  }, [activeIndex])

  // ── AMBIENT AUTO-ROTATE ───────────────────────────────────────────────────
  // Slowly cycles the wheel to the next section on its own — but stays paused
  // until the visitor first interacts, so the opening "About" panel can be read
  // in full without being swapped mid-scan. Any interaction (drag/scroll on the
  // wheel, arrow/pager click, touch swipe) starts the rotation and resets the timer.
  const AUTO_ADVANCE_MS = 15000
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const isAutoAdvanceRef = useRef(false)
  const hasInteractedRef = useRef(false)
  const autoPausedRef = useRef(false)
  const [autoPaused, setAutoPaused] = useState(false)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const resetAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
    if (prefersReducedMotion || autoPausedRef.current || !hasInteractedRef.current) return
    autoAdvanceTimerRef.current = setInterval(() => {
      isAutoAdvanceRef.current = true
      handleSectionChange((activeIndexRef.current + 1) % WHEEL_SECTIONS.length)
    }, AUTO_ADVANCE_MS)
  }, [handleSectionChange, prefersReducedMotion])

  const markInteracted = useCallback(() => {
    hasInteractedRef.current = true
    resetAutoAdvance()
  }, [resetAutoAdvance])

  // Manual play/pause for the ambient rotation. Resuming counts as intent to
  // rotate, so it also lifts the "wait for first interaction" gate.
  const toggleAutoRotate = useCallback(() => {
    setAutoPaused((prev) => {
      const next = !prev
      autoPausedRef.current = next
      if (next) {
        if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
      } else {
        hasInteractedRef.current = true
        resetAutoAdvance()
      }
      return next
    })
  }, [resetAutoAdvance])

  useEffect(() => {
    resetAutoAdvance()
    return () => {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current)
    }
  }, [resetAutoAdvance])

  useEffect(() => {
    const el = wheelContainerRef.current
    if (!el) return
    el.addEventListener('pointerdown', markInteracted)
    el.addEventListener('wheel', markInteracted, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', markInteracted)
      el.removeEventListener('wheel', markInteracted)
    }
  }, [markInteracted])

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
    markInteracted()
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
    const el = contentBandRef.current
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

  const activeSection = WHEEL_SECTIONS[activeIndex]
  const prevSection = WHEEL_SECTIONS[(activeIndex - 1 + WHEEL_SECTIONS.length) % WHEEL_SECTIONS.length]
  const nextSection = WHEEL_SECTIONS[(activeIndex + 1) % WHEEL_SECTIONS.length]
  const ActivePanel = SECTION_PANELS[displayIndex]
  const { hasLoaded, phase } = useIntro()
  const showPhase2 = hasLoaded || phase === 'phase02' || phase === 'phase03'

  useEffect(() => {
    if (phase === 'phase03' && !hasLoaded) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [phase, hasLoaded])

  const scrollToWork = useCallback(() => {
    document.getElementById('featured-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section
      id="featured"
      className="relative w-full overflow-hidden h-[100dvh] flex flex-col"
      style={{ marginTop: 0, paddingTop: '48px' }}
    >
      {/* ── Horizontal hairline accent ── */}
      {showPhase2 && (
        <div
          className={`absolute left-0 right-0 top-[48px] border-t z-20 ${!hasLoaded ? 'animate-slice-x' : ''}`}
          style={{ borderColor: 'rgba(56, 64, 106, 0.4)' }}
        />
      )}

      {/* Section-wide accent wash, anchored to the dome rising from the bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 100%, ${activeSection.accentColor}12 0%, transparent 70%)`,
          transition: 'background 0.4s ease',
        }}
      />

      {showPhase2 && (
        <>
          {/* Corner coordinate labels — pinned to the section's viewport corners */}
          <div className={`hidden lg:block absolute top-[60px] left-6 lg:left-12 label-caps opacity-40 z-20 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            <span ref={coordXRef}>X:{String(mouseXRef.current).padStart(4, '0')}</span>
          </div>
          <div className={`hidden lg:block absolute top-[60px] right-6 lg:right-12 label-caps opacity-40 text-right z-20 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            <span ref={coordYRef}>Y:{String(mouseYRef.current).padStart(4, '0')}</span>
          </div>
          <div className={`hidden lg:block absolute bottom-5 left-6 lg:left-12 label-caps opacity-40 z-20 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            θ:{(Math.round(activeIndex * SNAP_INTERVAL)).toString().padStart(3, '0')}°
          </div>
          <div className={`hidden lg:block absolute bottom-5 right-6 lg:right-12 label-caps opacity-40 text-right z-20 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
            R:276
          </div>
        </>
      )}

      {/* ── Scroll cue — pill pinned to the bottom center, over the dome ── */}
      {showPhase2 && (
        <button
          onClick={scrollToWork}
          className={`group absolute left-1/2 -translate-x-1/2 bottom-5 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-primary/55 border border-accent/25 hover:border-accent/50 transition-colors duration-200 focus:outline-none ${!hasLoaded ? 'animate-scroll-cue-in' : ''}`}
          aria-label="Scroll to featured work"
        >
          <span
            className="label-caps opacity-60 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: activeSection.accentColor }}
          >
            View Work
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3.5 h-3.5 text-parchment/50 group-hover:text-parchment transition-colors duration-200"
            style={{ animation: prefersReducedMotion ? undefined : 'scrollCueBob 1.8s ease-in-out infinite' }}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25l7.5 7.5 7.5-7.5" />
          </svg>
        </button>
      )}

      {/* ── CONTENT BAND — scrolls above the dome ── */}
      <div
        ref={contentBandRef}
        className="thin-scrollbar relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {showPhase2 && (
          <div className="w-full px-4 sm:px-6 lg:px-12 flex-1 flex flex-col min-h-0">
            {/* Pager — centered so it clears the corner HUD readouts */}
            <div className="shrink-0 z-20 py-1.5 flex justify-center pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-primary/55 border border-accent/25 pointer-events-auto">
                <button
                  onClick={() => { markInteracted(); handleSectionChange((activeIndex - 1 + WHEEL_SECTIONS.length) % WHEEL_SECTIONS.length) }}
                  className={CONTROL_BTN}
                  aria-label={`Navigate to ${prevSection.slug} section`}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.25} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <ControlTip label="Prev" accent={activeSection.accentColor} />
                </button>
                <div className="flex items-center gap-2.5 px-0.5" role="tablist" aria-label="Hero about sections">
                {WHEEL_SECTIONS.map((s, i) => {
                  const isActive = i === activeIndex
                  return (
                    <button
                      key={s.id}
                      onClick={() => { markInteracted(); handleSectionChange(i) }}
                      className="group relative flex items-center justify-center h-5"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Navigate to ${s.slug} section`}
                    >
                      <ControlTip label={s.slug} accent={s.accentColor} />
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
                <button
                  onClick={() => { markInteracted(); handleSectionChange((activeIndex + 1) % WHEEL_SECTIONS.length) }}
                  className={CONTROL_BTN}
                  aria-label={`Navigate to ${nextSection.slug} section`}
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.25} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  <ControlTip label="Next" accent={activeSection.accentColor} />
                </button>
                {!prefersReducedMotion && (
                  <>
                    <span className="w-px h-3.5 bg-accent/30" aria-hidden />
                    <button
                      onClick={toggleAutoRotate}
                      className={CONTROL_BTN}
                      aria-label={autoPaused ? 'Resume wheel auto-rotation' : 'Pause wheel auto-rotation'}
                      aria-pressed={!autoPaused}
                    >
                      <ControlTip label={autoPaused ? 'Play' : 'Pause'} accent={activeSection.accentColor} />
                      {autoPaused ? (
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                          <path d="M2.5 1.5v9l8-4.5z" />
                        </svg>
                      ) : (
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                          <rect x="2.5" y="1.5" width="2.5" height="9" rx="0.4" />
                          <rect x="7" y="1.5" width="2.5" height="9" rx="0.4" />
                        </svg>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-1 pb-3 flex-1 flex flex-col min-h-fit">
              <SectionTransitionWrapper key={sectionKey} isExiting={isFadingOut}>
                <ActivePanel />
              </SectionTransitionWrapper>
            </div>
          </div>
        )}
      </div>

      {/* ── DOME — wheel pinned to the bottom edge, only its top half visible ── */}
      <div
        ref={wheelContainerRef}
        className="relative z-10 shrink-0"
        style={{ height: 'calc(var(--wheel-size) / 2)' }}
      >
        {/* Accent glow behind the dome */}
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[66.667%] pointer-events-none"
          style={{
            width: 'calc(var(--wheel-size) * 1.5)',
            height: 'calc(var(--wheel-size) * 1.5)',
            background: `radial-gradient(circle at center, ${activeSection.accentColor}0f 0%, transparent 60%)`,
            transition: 'background 0.25s ease',
          }}
        />

        {/* Wheel — enlarged to 1.5× the visible band and pushed down so only its
            top third shows; the container height (--wheel-size / 2) is unchanged,
            so the dome's top edge stays at the same height. */}
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[66.667%]"
          style={{ width: 'calc(var(--wheel-size) * 1.5)', height: 'calc(var(--wheel-size) * 1.5)' }}
        >
          <WheelSelector
            onProjectChange={handleSectionChange}
            activeIndex={activeIndex}
            autoAdvanceRef={isAutoAdvanceRef}
          />
        </div>
      </div>
    </section>
  )
}
