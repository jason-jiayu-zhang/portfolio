import { useEffect, useRef, useState } from 'react'

/* Cockpit-bezel frame for wide monitors. The content column is capped by
   `.section-shell`, leaving side gutters; rather than dead space we bracket it
   with calibration rails, a section spine, and live readouts. Purely
   decorative (aria-hidden, pointer-events-none) and CSS-gated to viewports
   wide enough that the chrome sits clear of the column. */

type SectionMeta = { n: string; label: string }

const SECTIONS: Record<string, SectionMeta> = {
  featured: { n: '01', label: 'Featured' },
  'featured-grid': { n: '02', label: 'Work Console' },
  studio: { n: '03', label: 'Studio' },
  signoff: { n: '05', label: 'Sign-off' },
}

function Timecode() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    <span className="font-mono text-[10px] tracking-label text-parchment/45 tabular-nums">
      {p(now.getHours())}:{p(now.getMinutes())}
      <span className="text-parchment/25">:{p(now.getSeconds())}</span>
    </span>
  )
}

export default function HudFrame() {
  const rootRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState<SectionMeta>(SECTIONS.featured)

  // Scroll-driven: arm the frame once past the hero, and drive the progress
  // rail + percentage straight from refs so mousewheel doesn't re-render React.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const y = window.scrollY
      const pct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0
      const armed = y > window.innerHeight * 0.55
      if (rootRef.current) rootRef.current.dataset.armed = armed ? 'true' : 'false'
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${pct})`
      if (pctRef.current) pctRef.current.textContent = String(Math.round(pct * 100)).padStart(2, '0')
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Section spine reflects whichever chapter owns the middle of the viewport.
  useEffect(() => {
    const els = Object.keys(SECTIONS)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const meta = top && SECTIONS[top.target.id]
        if (meta) setActive(meta)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="hud-frame" aria-hidden data-armed="false">
      {/* Left calibration rail + rotated section spine */}
      <div className="hud-rail hud-rail-left" />
      <div className="hud-spine">
        <span className="text-gold/60">§ {active.n}</span>
        <span className="text-parchment/40"> · {active.label.toUpperCase()}</span>
      </div>

      {/* Right calibration rail carries the scroll-progress fill */}
      <div className="hud-rail hud-rail-right">
        <div ref={fillRef} className="hud-rail-fill" />
      </div>

      {/* Right-gutter readout stack */}
      <div className="hud-readout">
        <span className="label-caps text-[10px] opacity-55">Scroll</span>
        <span className="font-mono text-sm tracking-label text-parchment/70 tabular-nums">
          <span ref={pctRef}>00</span>
          <span className="text-parchment/30">%</span>
        </span>
        <span className="hud-readout-bars">
          <span className="w-[2px] h-full bg-gold/60 origin-bottom animate-signal-bar-1" />
          <span className="w-[2px] h-full bg-gold/60 origin-bottom animate-signal-bar-2" />
          <span className="w-[2px] h-full bg-gold/60 origin-bottom animate-signal-bar-3" />
        </span>
        <Timecode />
      </div>

      {/* Corner brackets — a viewfinder around the whole console */}
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
    </div>
  )
}
