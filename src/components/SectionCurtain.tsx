import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './HeroAboutPanels'
import { useLenis } from './SmoothScroll'

gsap.registerPlugin(ScrollTrigger)

// ── Section curtains ─────────────────────────────────────────────────────────
// Scroll-driven gold title-card wipe between the page's major chapters — no
// scroll lock, no forced jumps. The curtain is a rank of vertical gold slats:
// as a section rises from the fold the slats surge up from below in a staggered,
// random order to blanket the screen; at the seam they all rest flush (full
// cover) and the section title settles on top; scrolling on, they peel off the
// top in a fresh random order to reveal the new section. Scroll back up and the
// whole thing runs in reverse. The visitor is the playhead.

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

const COLS = 9 // number of vertical slats making up each curtain

export default function SectionCurtain() {
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
        const slats = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(`[data-slat="${target.id}"]`))
        const title = root.querySelector<HTMLElement>(`[data-title="${target.id}"]`)
        if (!el || !slats.length || !title) return

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 10%', scrub: true },
        })

        // Rise — slats surge up from below into full cover, random stagger.
        tl.fromTo(
          slats,
          { yPercent: 105 },
          { yPercent: 0, ease: 'power3.out', duration: 0.5, stagger: { amount: 0.3, from: 'random' } },
          0
        )
        // Title fades in over the covered wall, holds through the seam…
        tl.fromTo(
          title,
          { opacity: 0, yPercent: 14 },
          { opacity: 1, yPercent: 0, ease: 'power2.out', duration: 0.2 },
          0.62
        )
        // …then lifts away just as the slats begin to peel off the top.
        tl.to(title, { opacity: 0, yPercent: -14, ease: 'power2.in', duration: 0.2 }, 1.0)
        // Exit — slats clear off the top in a fresh random order.
        tl.to(
          slats,
          { yPercent: -105, ease: 'power3.in', duration: 0.5, stagger: { amount: 0.3, from: 'random' } },
          1.0
        )
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
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 right-0 z-[9000] overflow-hidden"
      // iOS Safari anchors `position: fixed` to the layout viewport, which drifts
      // from the visible area as the URL bar / toolbar collapse and during Lenis
      // momentum scroll. Sizing the curtain to exactly one viewport exposed slivers
      // of the page at the top and bottom. Bleeding it 12vh past each edge (clipped
      // by overflow-hidden) absorbs that drift and the safe-area zones so the wall
      // always reaches under the status bar and home indicator.
      style={{ top: '-12vh', height: '124vh' }}
      aria-hidden
    >
      {TARGETS.map((target) => (
        <div key={target.id} className="absolute inset-0">
          {/* Slat wall — each column rises/exits independently. */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLS }).map((_, i) => (
              <div
                key={i}
                data-slat={target.id}
                className="relative h-full shadow-[inset_-1px_0_0_rgba(20,22,32,0.12)]"
                style={{
                  width: `${100 / COLS}%`,
                  willChange: 'transform',
                  background:
                    'radial-gradient(ellipse 140% 70% at 50% 45%, #b6b08a 0%, #a39d7b 42%, #8f8a6a 100%)',
                }}
              >
                <div className="absolute inset-0 bg-grid-fine bg-grid-md opacity-[0.14] mix-blend-multiply" />
              </div>
            ))}
          </div>

          {/* Title — layered above the slats, centered. */}
          <div
            data-title={target.id}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{
              opacity: 0,
              willChange: 'transform, opacity',
              // Container is offset -12vh; keep the title optically centred in the
              // visible viewport and clear of the notch / home indicator.
              paddingTop: 'calc(12vh + env(safe-area-inset-top))',
              paddingBottom: 'calc(12vh + env(safe-area-inset-bottom))',
            }}
          >
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
