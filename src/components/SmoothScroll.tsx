import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePrefersReducedMotion } from './HeroAboutPanels'

// ── Smooth scroll ────────────────────────────────────────────────────────────
// Lenis drives the real window scrollbar with weighted inertia. It's disabled
// under prefers-reduced-motion, so the instance is null in that case and every
// consumer must fall back to native scrolling. The instance is shared via
// context so scroll-hijacking beats (SectionCurtain) can stop/start and jump
// through Lenis instead of fighting it with preventDefault + window.scrollTo.

const LenisContext = createContext<Lenis | null>(null)

export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reduced) return

    const instance = new Lenis({ lerp: 0.1 })
    setLenis(instance)

    const raf = (time: number) => {
      instance.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafRef.current)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
