import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ANCHOR_OFFSET, setSmoothScroller } from '../utils/sectionScroll'

// Lenis smooths the window scroll. Its frame loop runs only while the page is
// moving (plus a short tail), so an idle page does no per-frame work.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
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
