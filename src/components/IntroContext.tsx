import React, { createContext, useContext, useEffect, useState } from 'react'

export type IntroPhase = 'initial' | 'phase01' | 'phase02' | 'phase03'

interface IntroContextType {
  phase: IntroPhase
  hasLoaded: boolean
}

const IntroContext = createContext<IntroContextType>({
  phase: 'phase03', // Default to phase 3 for safety if not wrapped
  hasLoaded: true,
})

export function useIntro() {
  return useContext(IntroContext)
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [hasLoaded, setHasLoaded] = useState(() => {
    return sessionStorage.getItem('introPlayed') === 'true'
  })
  const [phase, setPhase] = useState<IntroPhase>(() => {
    return sessionStorage.getItem('introPlayed') === 'true' ? 'phase03' : 'initial'
  })

  useEffect(() => {
    if (sessionStorage.getItem('introPlayed') === 'true') {
      return
    }

    // Respect reduced-motion: skip the entrance entirely and land on the live state.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasLoaded(true)
      setPhase('phase03')
      sessionStorage.setItem('introPlayed', 'true')
      return
    }

    setHasLoaded(false)

    // Phase 01: fires at 400ms (after the browser paints the dark stage) — the
    // wheel fades in as a full disc high in the viewport, then sinks down and
    // settles into its resting dome over the 1.5s wheel-set animation.
    const timer0 = setTimeout(() => {
      setPhase('phase01')
    }, 400)

    // Phase 02: fires at 1150ms, while the wheel is mid-descent — the frame,
    // HUD, pager, and content band rise up to meet the space it's vacating, and
    // the cardinal points/labels begin their staggered fade-in.
    const timer1 = setTimeout(() => {
      setPhase('phase02')
    }, 1150)

    // Phase 03: fires at 2000ms — the wheel-set (starts 400ms, 1.5s) and the
    // content rise/cardinal fade-ins have all settled; interactivity unlocks.
    const timer2 = setTimeout(() => {
      setPhase('phase03')
      sessionStorage.setItem('introPlayed', 'true')
    }, 2000)

    return () => {
      clearTimeout(timer0)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <IntroContext.Provider value={{ phase, hasLoaded }}>
      {children}
    </IntroContext.Provider>
  )
}
