import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ANCHOR_OFFSET, setSmoothScroller } from '../utils/sectionScroll'
import { isLowEndDevice } from '../utils/lowEnd'

// Decided once: hardware does not change during a visit.
const LOW_END = isLowEndDevice()

// Lenis smooths the window scroll. Its frame loop runs only while the page is
// moving (plus a short tail), so an idle page does no per-frame work.
// On weak hardware Lenis's per-frame work on the main thread makes scrolling
// stutter, so those devices keep the browser's own scrolling, which runs off
// the main thread. Section jumps there use the native smooth scroll instead.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (LOW_END) {
      setSmoothScroller((top) => window.scrollTo({ top, behavior: 'smooth' }))
      return () => setSmoothScroller(null)
    }
    const lenis = new Lenis({ lerp: 0.2, autoRaf: false, anchors: { offset: -ANCHOR_OFFSET } })
    let raf = 0
    let until = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = t < until || lenis.isScrolling ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      until = performance.now() + 400
      if (!raf) raf = requestAnimationFrame(loop)
    }
    // Programmatic jumps start the loop themselves; nothing guarantees an
    // input event arrived first (keyboard activation, assistive tech).
    setSmoothScroller((top) => {
      lenis.scrollTo(top)
      kick()
    })
    const events = ['wheel', 'touchmove', 'keydown', 'pointerdown', 'hashchange'] as const
    events.forEach((e) => window.addEventListener(e, kick, { passive: true }))
    const off = lenis.on('scroll', kick)
    return () => {
      cancelAnimationFrame(raf)
      events.forEach((e) => window.removeEventListener(e, kick))
      off()
      lenis.destroy()
      setSmoothScroller(null)
    }
  }, [reduced])

  return <>{children}</>
}
