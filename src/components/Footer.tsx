import { useEffect, useRef, useState } from 'react'
import { BIO } from '../data/portfolio'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { usePrefersReducedMotion } from './HeroAboutPanels'

const FOOTER_ACCENT = '#a39d7b' // gold — the site's warm sign-off tone

// ── Scroll-triggered fade-up — shares the Studio/Featured motion language ────
function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'span'
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()
  const shown = inView || reduced
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(24px)',
        transition: reduced
          ? 'none'
          : `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: shown ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </Tag>
  )
}

// ── Center-out underline link (mirrors the old footer social treatment) ──────
function SocialLink({ href, label, handle }: { href: string; label: string; handle: string }) {
  return (
    <a
      href={href}
      target={label !== 'Email' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex flex-col items-start gap-1"
    >
      <span className="font-mono text-[10px] tracking-label text-gold/70 uppercase transition-colors duration-200">
        {label}
      </span>
      <span className="relative font-mono text-xs text-parchment/70 group-hover:text-parchment transition-colors duration-200">
        {handle}
        <span
          className="absolute -bottom-px left-0 right-0 h-px bg-parchment/40"
          style={{
            transform: 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          data-social-underline
        />
      </span>
    </a>
  )
}

// ── Mission-control live clock ───────────────────────────────────────────────
function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()?.replace(/_/g, ' ') ?? 'LOCAL'
  return (
    <span className="font-mono text-xs tracking-label text-parchment/70 tabular-nums">
      {hh}:{mm}
      <span className="text-parchment/35">:{ss}</span>
      <span className="text-gold/70"> {tz.toUpperCase()}</span>
    </span>
  )
}

// ── Three-bar signal meter (echoes the header status pulse) ──────────────────
function SignalMeter() {
  return (
    <span className="inline-flex items-end gap-[2px] h-2.5" aria-hidden="true">
      <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-1" />
      <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-2" />
      <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-3" />
    </span>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const firstName = BIO.fullName.split(' ')[0]
  const email = BIO.socials.find((s) => s.platform === 'Email')

  // Corner coordinate readout — mirrors the hero HUD, updated straight from the
  // DOM to avoid re-rendering the whole footer on every mousemove frame.
  const coordRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (coordRef.current)
        coordRef.current.textContent = `X:${String(e.clientX).padStart(4, '0')} Y:${String(e.clientY).padStart(4, '0')}`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <footer
      id="signoff"
      className="relative mt-auto shrink-0 min-h-[100svh] flex flex-col bg-primary"
      style={{ borderTop: '1px solid rgba(56,64,106,0.4)' }}
      aria-labelledby="footer-cta"
    >
      {/* Decorative backdrop — clipped here so the oversized radar dome can't
          spill sideways, while the footer itself stays free to grow taller than
          the viewport on short screens (otherwise the bottom rows get cut off). */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blueprint grid wash */}
        <div className="absolute inset-0 bg-grid-fine bg-grid-md opacity-60" />
        {/* Warm horizon glow rising from the dome */}
        <div
          className="absolute inset-x-0 bottom-0 h-[70%]"
          style={{ background: `radial-gradient(ellipse 80% 90% at 50% 100%, ${FOOTER_ACCENT}14 0%, transparent 70%)` }}
        />
        {/* Radar-dome horizon — echoes the hero wheel, pinned to the bottom */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 bottom-0"
          style={{ width: 'min(150vw, 1400px)', height: 'min(75vw, 700px)' }}
          viewBox="0 0 1000 500"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="500" cy="500" r="460" stroke={FOOTER_ACCENT} strokeOpacity="0.16" strokeWidth="1" />
          <circle cx="500" cy="500" r="330" stroke={FOOTER_ACCENT} strokeOpacity="0.12" strokeWidth="1" />
          <circle cx="500" cy="500" r="200" stroke={FOOTER_ACCENT} strokeOpacity="0.09" strokeWidth="1" />
          {/* Radial tick spokes across the visible arc */}
          {Array.from({ length: 13 }).map((_, i) => {
            const a = Math.PI + (i / 12) * Math.PI // 180° → 360°, i.e. the top half
            const x1 = 500 + Math.cos(a) * 448
            const y1 = 500 + Math.sin(a) * 448
            const x2 = 500 + Math.cos(a) * 460
            const y2 = 500 + Math.sin(a) * 460
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={FOOTER_ACCENT} strokeOpacity="0.28" strokeWidth="1" />
          })}
        </svg>
      </div>

      {/* ── Top HUD strip ── */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-12 pt-[calc(48px+1.25rem)] pb-4">
        <span className="label-caps opacity-60">§ 05 — Sign-off</span>
        <span
          ref={coordRef}
          className="hidden md:inline font-mono text-xs tracking-label text-parchment/40 tabular-nums"
        >
          X:0000 Y:0000
        </span>
      </div>

      {/* ── Center: the call to action ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center section-shell py-8">
        <Reveal className="flex items-center gap-2.5 mb-6">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: FOOTER_ACCENT, animation: 'sonarPing 2s ease-out infinite' }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: FOOTER_ACCENT }} />
          </span>
          <span className="label-caps opacity-80">Available for new work · {year}</span>
        </Reveal>

        <h2 id="footer-cta" className="headline-xl text-6xl sm:text-7xl lg:text-8xl xl:text-9xl">
          <Reveal as="span" className="block">Let's make</Reveal>
          <Reveal as="span" delay={80} className="block">
            something{' '}
            <span className="italic font-light text-gold" style={{ letterSpacing: '-0.03em' }}>
              worth
            </span>
          </Reveal>
          <Reveal as="span" delay={160} className="block">making.</Reveal>
        </h2>

        <Reveal delay={240} className="mt-8 max-w-xl">
          <p className="font-sans text-base sm:text-lg text-parchment/70 leading-relaxed">
            Have a product, a role, or an idea in the workshop? My inbox is always open.
          </p>
        </Reveal>

        {/* Primary email CTA */}
        <Reveal delay={320} className="mt-10">
          <a
            href={email?.url}
            className="group inline-flex items-center gap-3 sm:gap-4"
          >
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full border transition-colors duration-200 shrink-0"
              style={{ borderColor: `${FOOTER_ACCENT}66` }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7v9" />
              </svg>
            </span>
            <span className="relative font-sans text-lg sm:text-3xl lg:text-4xl xl:text-5xl font-medium text-parchment tracking-tight-2 break-all">
              {email?.handle}
              <span
                className="absolute -bottom-1 left-0 right-0 h-px bg-parchment/50"
                style={{
                  transform: 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                data-cta-underline
              />
            </span>
          </a>
        </Reveal>
      </div>

      {/* ── Link + status shelf ── */}
      <div
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 px-6 lg:px-12 py-6"
        style={{ borderTop: '1px solid rgba(56,64,106,0.4)' }}
      >
        <nav className="flex flex-wrap gap-x-10 gap-y-5">
          {BIO.socials
            .filter((s) => s.platform !== 'Email')
            .map((social) => (
              <SocialLink key={social.platform} href={social.url} label={social.platform} handle={social.handle} />
            ))}
          <a
            href="https://www.figma.com/@jasonjiayuzhang"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-start gap-1"
          >
            <span className="font-mono text-[10px] tracking-label text-gold/70 uppercase">Figma</span>
            <span className="relative font-mono text-xs text-parchment/70 group-hover:text-parchment transition-colors duration-200">
              Community ↗
              <span
                className="absolute -bottom-px left-0 right-0 h-px bg-parchment/40"
                style={{
                  transform: 'scaleX(0)',
                  transformOrigin: 'center',
                  transition: 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                data-social-underline
              />
            </span>
          </a>
        </nav>

        {/* Live status readout */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex items-center gap-2.5">
            <SignalMeter />
            <span className="font-mono text-xs tracking-label text-parchment/70 uppercase">All systems nominal</span>
          </div>
          <LiveClock />
        </div>
      </div>

      {/* ── Baseline strip ── */}
      <div
        className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 lg:px-12 py-4"
        style={{ borderTop: '1px solid rgba(56,64,106,0.15)' }}
      >
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" className="w-[18px] h-[18px] object-contain" alt="" />
          <span className="font-mono text-xs text-parchment/60 tracking-label uppercase">
            © {year} {BIO.fullName}
          </span>
        </div>
        <span className="font-mono text-xs text-parchment/50 tracking-label uppercase">
          Designed &amp; engineered by {firstName}
        </span>
      </div>

      <style>{`
        footer a:hover [data-social-underline] { transform: scaleX(1) !important; }
        footer a:hover [data-cta-underline] { transform: scaleX(1) !important; }
        footer a:hover [style*="border-color"] { background-color: ${FOOTER_ACCENT}1a; }
      `}</style>
    </footer>
  )
}
