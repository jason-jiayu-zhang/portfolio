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

    setHasLoaded(false)
    
    // Initial buffer: 500ms (allows browser to paint dark screen first)
    const timer0 = setTimeout(() => {
      setPhase('phase01')
    }, 500)
    
    // Phase 02: fires at 600ms, while the glow/rings' 1.3s vector-draw (finishes ~1750ms after mount) is still mid-flight — the cardinal points and labels start fading in over the tail of the draw instead of waiting for it to fully settle.
    const timer1 = setTimeout(() => {
      setPhase('phase02')
    }, 600)

    // Phase 03: fires at 1500ms — 900ms after phase02, enough for the staggered cardinal-point/label fade-ins (last one starts at phase02+490ms, 250ms transition) to finish before hasLoaded flips.
    const timer2 = setTimeout(() => {
      setPhase('phase03')
      sessionStorage.setItem('introPlayed', 'true')
    }, 1500)

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
