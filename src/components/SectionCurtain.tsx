import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePrefersReducedMotion } from './HeroAboutPanels'
import { useLenis } from './SmoothScroll'

// ── Section curtains ─────────────────────────────────────────────────────────
// Choreographed transition between the page's major chapters. When the visitor
// scrolls down toward a section boundary, the transition takes over the scroll:
//   1. cover  — a full-viewport gold plate sweeps up and fills the screen
//   2. hold   — scrolling is locked while the section title settles on the gold
//   3. reveal — behind the gold we jump to the section, then the plate lifts off
//                the top as the fresh section rises up into place.
// The whole beat is scroll-locked so it plays as one deliberate cut, not a
// decoration racing a free-scrolling page.

interface CurtainTarget {
  /** id of the section element to align to the top of the viewport. */
  id: string
  eyebrow: string
  title: string
}

const TARGETS: CurtainTarget[] = [
  { id: 'featured-grid', eyebrow: '§ 02 — Selected', title: 'Featured Work' },
  { id: 'studio', eyebrow: '§ 03 — Off-a-whim', title: 'Studio' },
  { id: 'signoff', eyebrow: '§ 05 — Sign-off', title: "Let's Talk" },
]

const HEADER_OFFSET = 48 // fixed header height — sections align just beneath it
const COVER_MS = 460 // plate sweeps up to full cover
const HOLD_MS = 500 // dwell with the title on screen
const REVEAL_MS = 680 // plate lifts + the new section rises into place
const RISE_PX = 72 // how far the revealed section drifts up during the lift

type Phase = 'cover' | 'hold' | 'reveal'

export default function SectionCurtain() {
  const reduced = usePrefersReducedMotion()
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  useEffect(() => { lenisRef.current = lenis }, [lenis])
  const [active, setActive] = useState<CurtainTarget | null>(null)
  const [phase, setPhase] = useState<Phase>('cover')
  const [raised, setRaised] = useState(false)

  const busyRef = useRef(false)
  const lastYRef = useRef(0)
  const armedFromYRef = useRef(0) // scroll pos where the last beat handed control back
  const timers = useRef<number[]>([])

  // ── Scroll lock — freeze all scrolling for the duration of the beat ─────────
  // With Lenis present, lenis.stop() halts its inertia loop and sets the
  // html overflow hidden; without it (the brief pre-init window) we fall back to
  // eating the raw scroll events ourselves. Keys are eaten in both cases.
  const eat = useCallback((e: Event) => e.preventDefault(), [])
  const eatKeys = useCallback((e: KeyboardEvent) => {
    const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar']
    if (scrollKeys.includes(e.key)) e.preventDefault()
  }, [])

  const lockScroll = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop()
    } else {
      window.addEventListener('wheel', eat, { passive: false })
      window.addEventListener('touchmove', eat, { passive: false })
    }
    window.addEventListener('keydown', eatKeys, { passive: false })
  }, [eat, eatKeys])

  const unlockScroll = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start()
    } else {
      window.removeEventListener('wheel', eat)
      window.removeEventListener('touchmove', eat)
    }
    window.removeEventListener('keydown', eatKeys)
  }, [eat, eatKeys])

  // Jump/scroll through Lenis when it owns the scroll, else native. force:true
  // lets a programmatic scroll run even while Lenis is stopped for the beat.
  const scrollToY = useCallback((top: number, smooth = false) => {
    const l = lenisRef.current
    if (l) {
      l.scrollTo(top, smooth ? { duration: REVEAL_MS / 1000, force: true } : { immediate: true, force: true })
    } else {
      window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' })
    }
  }, [])

  const engage = useCallback((target: CurtainTarget) => {
    busyRef.current = true
    lockScroll()
    setActive(target)
    setPhase('cover')
    setRaised(false)
    // Next frame: flip `raised` so the plate transitions up from below the fold.
    requestAnimationFrame(() => requestAnimationFrame(() => setRaised(true)))

    const t = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

    // Tear down the beat and hand scrolling back, docked at the target section.
    // Shared by the natural end and the Esc skip, guarded against a double call.
    let done = false
    const finish = () => {
      if (done) return
      done = true
      timers.current.forEach(clearTimeout)
      timers.current = []
      window.removeEventListener('keydown', onSkip)
      const el = document.getElementById(target.id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
        scrollToY(top)
      }
      setActive(null)
      setRaised(false)
      unlockScroll()
      lastYRef.current = window.scrollY
      armedFromYRef.current = window.scrollY
      busyRef.current = false
    }
    // Esc cuts straight to the section — no one should feel trapped behind the gold.
    const onSkip = (e: KeyboardEvent) => { if (e.key === 'Escape') finish() }
    window.addEventListener('keydown', onSkip)

    // Cover complete → jump behind the gold to the target section, parked a hair
    // low so the reveal can scroll it up into place.
    t(() => {
      const el = document.getElementById(target.id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
        scrollToY(top + RISE_PX)
      }
      setPhase('hold')
    }, COVER_MS)

    // Hold done → lift the plate and float the section up the final RISE_PX.
    t(() => {
      const el = document.getElementById(target.id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
        scrollToY(top, true)
      }
      setPhase('reveal')
    }, COVER_MS + HOLD_MS)

    // Reveal done → hand scrolling back to the visitor.
    t(finish, COVER_MS + HOLD_MS + REVEAL_MS)
  }, [lockScroll, unlockScroll, scrollToY])

  // ── Boundary detection — engage on a downward pass into a section ───────────
  useEffect(() => {
    if (reduced) return
    lastYRef.current = window.scrollY
    armedFromYRef.current = window.scrollY
    let armed = false
    const armTimer = window.setTimeout(() => { armed = true }, 400)

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!armed || busyRef.current) return
        const y = window.scrollY
        const down = y > lastYRef.current + 1
        lastYRef.current = y
        if (!down) return
        const H = window.innerHeight
        // Distance gate — after a beat hands back, don't re-arm until the visitor
        // has actually travelled into the next chapter, so a small nudge right
        // after landing can't chain straight into another curtain.
        if (Math.abs(y - armedFromYRef.current) < H * 0.4) return
        for (const target of TARGETS) {
          const el = document.getElementById(target.id)
          if (!el) continue
          const top = el.getBoundingClientRect().top
          // Section has entered from the bottom but isn't yet docked at the top.
          if (top > HEADER_OFFSET + 8 && top < H * 0.85) {
            engage(target)
            break
          }
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(armTimer)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      unlockScroll()
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [reduced, engage, unlockScroll])

  if (reduced || !active) return null

  const panelY = phase === 'reveal' ? '-102%' : raised ? '0%' : '102%'
  const panelTransition =
    phase === 'reveal'
      ? `transform ${REVEAL_MS}ms cubic-bezier(0.83, 0, 0.17, 1)`
      : `transform ${COVER_MS}ms cubic-bezier(0.83, 0, 0.17, 1)`
  const titleShown = raised && phase !== 'reveal'

  return createPortal(
    <div className="fixed inset-0 z-[9000] overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          transform: `translateY(${panelY})`,
          transition: panelTransition,
          willChange: 'transform',
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, #b6b08a 0%, #a39d7b 42%, #8f8a6a 100%)',
        }}
      >
        {/* Blueprint texture, tinted dark against the gold */}
        <div className="absolute inset-0 bg-grid-fine bg-grid-md opacity-[0.14] mix-blend-multiply" />
        <div className="absolute inset-x-0 top-0 h-px bg-primary/25" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-primary/25" />

        <div
          className="relative px-6 text-center"
          style={{
            opacity: titleShown ? 1 : 0,
            transform: titleShown ? 'translateY(0)' : phase === 'reveal' ? 'translateY(-14px)' : 'translateY(26px)',
            transition: 'opacity 380ms cubic-bezier(0.22, 1, 0.36, 1), transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div className="font-mono text-xs sm:text-sm tracking-label uppercase text-primary/70 mb-4">
            {active.eyebrow}
          </div>
          <div
            className="font-sans font-black text-primary leading-[0.9] tracking-ultra-tight"
            style={{ fontSize: 'clamp(2.75rem, 11vw, 8rem)' }}
          >
            {active.title}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
