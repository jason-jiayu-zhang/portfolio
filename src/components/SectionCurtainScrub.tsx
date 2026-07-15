import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './HeroAboutPanels'
import { useLenis } from './SmoothScroll'

gsap.registerPlugin(ScrollTrigger)

// ── Section curtains, scrub variant (GSAP prototype) ─────────────────────────
// Same gold plate + title as SectionCurtain, but the wipe is *driven by scroll
// position* instead of a locked timer. As a section rises from the fold toward
// the top, the gold plate sweeps up across the viewport — fully covering at the
// midpoint (title peaks there) then clearing off the top. Scroll back up and it
// un-wipes. No scroll-lock, no forced jumps: the visitor is the playhead.
// Enabled via ?scrub — the timed cut in SectionCurtain stays the default.

interface CurtainTarget {
  id: string
  eyebrow: string
  title: string
}

const TARGETS: CurtainTarget[] = [
  { id: 'featured-grid', eyebrow: '§ 02 — Selected', title: 'Featured Work' },
  { id: 'studio', eyebrow: '§ 03 — Off-a-whim', title: 'Studio' },
  { id: 'signoff', eyebrow: '§ 05 — Sign-off', title: "Let's Talk" },
]

export default function SectionCurtainScrub() {
  const reduced = usePrefersReducedMotion()
  const lenis = useLenis()
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    const root = rootRef.current
    if (!root) return

    // Keep ScrollTrigger's scroll position in step with Lenis's inertial scroll.
    if (lenis) lenis.on('scroll', ScrollTrigger.update)

    const ctx = gsap.context(() => {
      TARGETS.forEach((target) => {
        const el = document.getElementById(target.id)
        const plate = root.querySelector<HTMLElement>(`[data-plate="${target.id}"]`)
        const title = root.querySelector<HTMLElement>(`[data-title="${target.id}"]`)
        if (!el || !plate || !title) return

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 10%', scrub: true },
        })
        // Plate travels below → full cover (mid) → off the top, as one sweep.
        tl.fromTo(plate, { yPercent: 102 }, { yPercent: -102, ease: 'none', duration: 1 }, 0)
        // Title rises in for the covered beat, then lifts away with the plate.
        tl.fromTo(title, { opacity: 0, yPercent: 10 }, { opacity: 1, yPercent: 0, ease: 'power1.out', duration: 0.22 }, 0.30)
        tl.to(title, { opacity: 0, yPercent: -10, ease: 'power1.in', duration: 0.22 }, 0.56)
      })
    }, root)

    // Lazy sections settle in after mount — recompute trigger positions once.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 60)

    return () => {
      clearTimeout(refresh)
      if (lenis) lenis.off('scroll', ScrollTrigger.update)
      ctx.revert()
    }
  }, [reduced, lenis])

  if (reduced) return null

  return createPortal(
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[9000] overflow-hidden" aria-hidden>
      {TARGETS.map((target) => (
        <div
          key={target.id}
          data-plate={target.id}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            willChange: 'transform',
            background:
              'radial-gradient(ellipse 90% 70% at 50% 45%, #b6b08a 0%, #a39d7b 42%, #8f8a6a 100%)',
          }}
        >
          <div className="absolute inset-0 bg-grid-fine bg-grid-md opacity-[0.14] mix-blend-multiply" />
          <div className="absolute inset-x-0 top-0 h-px bg-primary/25" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-primary/25" />

          <div data-title={target.id} className="relative px-6 text-center" style={{ opacity: 0 }}>
            <div className="font-mono text-xs sm:text-sm tracking-label uppercase text-primary/70 mb-4">
              {target.eyebrow}
            </div>
            <div
              className="font-sans font-black text-primary leading-[0.9] tracking-ultra-tight"
              style={{ fontSize: 'clamp(2.75rem, 11vw, 8rem)' }}
            >
              {target.title}
            </div>
          </div>
        </div>
      ))}
    </div>,
    document.body
  )
}
