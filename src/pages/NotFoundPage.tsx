// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE C — Off-Grid Recovery Console (404 / route error)
// Route: * (catch-all) + root errorElement
// Layout: Mission-control "signal lost" screen with a live recovery terminal.
//
// The brief: don't ship a stock 404. An unresolvable URL is the ultimate edge
// case, so this page treats it like one worth caring about — it echoes the exact
// vector the visitor hit, triangulates the nearest *real* destinations from the
// live portfolio data (so it can never drift), and hands them an interactive
// console to reroute. Every unexpected input still lands somewhere graceful.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BIO, PROJECTS, EXPERIMENTS } from '../data/portfolio'
import { usePrefersReducedMotion } from '../components/HeroAboutPanels'

const ACCENT = '#a39d7b' // gold — the site's signal tone

type Variant = 'notfound' | 'error'

interface NotFoundPageProps {
  /** 'notfound' = unresolvable URL (catch-all); 'error' = thrown route fault. */
  variant?: Variant
  /** Optional fault detail surfaced by the router error boundary. */
  faultLabel?: string
}

// ── Console line model ───────────────────────────────────────────────────────
type Tone = 'muted' | 'signal' | 'error' | 'echo'
interface Line {
  text: string
  tone: Tone
}

const TONE_CLASS: Record<Tone, string> = {
  muted: 'text-parchment/50',
  signal: 'text-gold-bright',
  error: 'text-[#e0a3a3]',
  echo: 'text-parchment/80',
}

// ── Recovered destinations — derived from live data so they never go stale ────
interface Recovered {
  cmd: string
  label: string
  coord: string
  to: string
}

const firstProject = PROJECTS[0]
const firstExperiment = EXPERIMENTS[0]

// Boot telemetry — kept out of the component so it isn't reallocated per render
// and the console effect can depend cleanly on just the requested vector.
function buildBootLines(vector: string, isError: boolean): Line[] {
  return [
    { text: `> tracing requested vector … ${vector}`, tone: 'muted' },
    {
      text: isError
        ? `> handler faulted while resolving route`
        : `> vector resolves to ∅  (no route bound)`,
      tone: 'error',
    },
    { text: `> triangulating nearest known signals …`, tone: 'muted' },
    { text: `> ${RECOVERED.length} coordinates recovered. type "help" to reroute.`, tone: 'signal' },
  ]
}

const RECOVERED: Recovered[] = [
  { cmd: 'home', label: 'Home base', coord: 'ORIGIN · 00.00', to: '/' },
  {
    cmd: 'work',
    label: 'Selected work',
    coord: `${PROJECTS.length} case files`,
    to: `/work/${firstProject.id}`,
  },
  {
    cmd: 'studio',
    label: 'Studio experiments',
    coord: `${EXPERIMENTS.length} logs`,
    to: `/studio/${firstExperiment.id}`,
  },
  { cmd: 'resume', label: 'Résumé', coord: 'PDF · external', to: BIO.resumeUrl },
]

// ── Live coordinate readout — mirrors the hero/footer HUD, DOM-written so the
//    console never re-renders on mousemove. ───────────────────────────────────
function useCoordReadout(ref: React.RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (ref.current)
        ref.current.textContent = `X:${String(e.clientX).padStart(4, '0')} Y:${String(
          e.clientY,
        ).padStart(4, '0')}`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [ref])
}

// ── Radar — echoes the footer dome + experiment concentric motif, with a sweep
//    that circles looking for a signal it will never find. ─────────────────────
function Radar({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 320 320" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Static rings */}
      {[150, 112, 74, 38].map((r, i) => (
        <circle
          key={r}
          cx={160}
          cy={160}
          r={r}
          stroke={ACCENT}
          strokeOpacity={0.1 + i * 0.04}
          strokeWidth={0.6}
          strokeDasharray={i === 1 ? '3 8' : undefined}
        />
      ))}
      {/* Crosshair */}
      <line x1={160} y1={6} x2={160} y2={314} stroke={ACCENT} strokeOpacity={0.12} strokeWidth={0.5} />
      <line x1={6} y1={160} x2={314} y2={160} stroke={ACCENT} strokeOpacity={0.12} strokeWidth={0.5} />
      {/* Tick spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2
        const x1 = 160 + Math.cos(a) * 150
        const y1 = 160 + Math.sin(a) * 150
        const x2 = 160 + Math.cos(a) * (i % 6 === 0 ? 138 : 145)
        const y2 = 160 + Math.sin(a) * (i % 6 === 0 ? 138 : 145)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ACCENT} strokeOpacity={0.22} strokeWidth={0.6} />
      })}

      {/* Rotating sweep wedge */}
      <g style={{ transformOrigin: '160px 160px' }} className={reduced ? '' : 'nf-sweep'}>
        <defs>
          <linearGradient id="nf-sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.28" />
          </linearGradient>
        </defs>
        <path d="M160 160 L310 160 A150 150 0 0 0 268 55 Z" fill="url(#nf-sweep-grad)" />
        <line x1={160} y1={160} x2={310} y2={160} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1} />
      </g>

      {/* The signal that can't be located — pings faintly, off-center */}
      <g style={{ transformOrigin: '212px 118px' }}>
        <circle cx={212} cy={118} r={3} fill="#e0a3a3" opacity={0.9} />
        <circle
          cx={212}
          cy={118}
          r={3}
          fill="none"
          stroke="#e0a3a3"
          strokeWidth={1}
          className={reduced ? '' : 'nf-blip'}
        />
      </g>

      {/* Center hub */}
      <circle cx={160} cy={160} r={4} fill={ACCENT} opacity={0.5} />
      <circle cx={160} cy={160} r={9} stroke={ACCENT} strokeOpacity={0.3} strokeWidth={0.6} />
    </svg>
  )
}

export default function NotFoundPage({ variant = 'notfound', faultLabel }: NotFoundPageProps) {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)

  const coordRef = useRef<HTMLSpanElement>(null)
  useCoordReadout(coordRef)

  // The exact path the visitor hit — the edge case, echoed back verbatim.
  const requestedVector =
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/'

  const isError = variant === 'error'
  const code = isError ? '500' : '404'
  const eyebrow = isError ? '§ ERR · 500 — System fault' : '§ ERR · 404 — Uncharted coordinates'
  const headlineLead = isError ? "Something's" : "You've wandered"
  const headlineAccent = isError ? 'come loose.' : 'off the grid.'
  const bodyCopy = isError
    ? "A part of the site threw an unexpected fault. It's logged — and even a broken path gets a proper landing, not a blank screen."
    : "This vector doesn't resolve to anything on the map. But you found an edge case — and around here, edge cases get the same care as the main path."

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  // ── Recovery console ───────────────────────────────────────────────────────
  // Under reduced motion the full boot log is present from first paint; otherwise
  // it types out line-by-line via the effect below. A ref gates the animation so
  // it plays exactly once, keeping any commands the visitor has since entered.
  const [lines, setLines] = useState<Line[]>(() =>
    reduced ? buildBootLines(requestedVector, isError) : [],
  )
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  // Gate flips only once a line actually prints — so StrictMode's mount→cleanup→
  // mount cycle (which clears the pending timers before any fire) still replays
  // the boot on the second mount instead of leaving the console blank.
  const bootedRef = useRef(reduced)

  useEffect(() => {
    if (bootedRef.current) return
    const boot = buildBootLines(requestedVector, isError)
    const timers = boot.map((line, i) =>
      setTimeout(() => {
        bootedRef.current = true
        setLines((prev) => [...prev, line])
      }, 420 + i * 520),
    )
    return () => timers.forEach(clearTimeout)
  }, [requestedVector, isError])

  // Keep the log pinned to the newest line.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines])

  const print = useCallback((next: Line[]) => setLines((prev) => [...prev, ...next]), [])

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase()
      // Echo the command the way a real shell would.
      print([{ text: `guest@jjz:~$ ${raw}`, tone: 'echo' }])
      if (!cmd) return

      const match = RECOVERED.find((r) => r.cmd === cmd)

      switch (cmd) {
        case 'help':
        case '?':
          print([
            { text: 'available commands —', tone: 'muted' },
            { text: '  home · work · studio · resume   reroute to a live destination', tone: 'signal' },
            { text: '  ls                              list recovered coordinates', tone: 'signal' },
            { text: '  whoami                          who runs this station', tone: 'signal' },
            { text: '  clear                           wipe the console', tone: 'signal' },
          ])
          return
        case 'ls':
        case 'dir':
          print(RECOVERED.map((r) => ({ text: `  ${r.cmd.padEnd(8)} → ${r.to}`, tone: 'muted' as Tone })))
          return
        case 'whoami':
          print([{ text: `${BIO.fullName} — ${BIO.title}. ${BIO.roles.join(' · ')}.`, tone: 'signal' }])
          return
        case 'clear':
        case 'cls':
          setLines([])
          return
        case 'sudo':
          print([{ text: "nice try — you already have every permission here.", tone: 'muted' }])
          return
        default:
          break
      }

      if (match) {
        print([{ text: `> locking onto "${match.label}" … rerouting.`, tone: 'signal' }])
        window.setTimeout(() => {
          if (match.to.startsWith('/') && !match.to.endsWith('.pdf')) navigate(match.to)
          else window.open(match.to, '_blank', 'noopener,noreferrer')
        }, 420)
        return
      }

      print([{ text: `command not found: ${cmd} — type "help" for options.`, tone: 'error' }])
    },
    [navigate, print],
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  const revealStyle = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(14px)',
    transition: reduced
      ? 'none'
      : `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <div
      className="relative flex flex-col overflow-hidden bg-primary"
      style={{ minHeight: 'calc(100svh - 48px)' }}
    >
      {/* ── Decorative backdrop — blueprint wash + horizon glow ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-fine bg-grid-md opacity-50" />
        <div
          className="absolute inset-x-0 top-0 h-[65%]"
          style={{ background: `radial-gradient(ellipse 70% 80% at 72% 12%, ${ACCENT}12 0%, transparent 70%)` }}
        />
      </div>

      {/* ── Top HUD strip ── */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-12 pt-[calc(48px+1.25rem)] pb-4">
        <span className="label-caps opacity-70" style={revealStyle(0)}>
          {eyebrow}
        </span>
        <span
          ref={coordRef}
          className="hidden md:inline font-mono text-xs tracking-label text-parchment/40 tabular-nums"
          style={revealStyle(60)}
        >
          X:0000 Y:0000
        </span>
      </div>

      {/* ── Body: statement · radar ── */}
      <div className="relative z-10 flex-1 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-8 items-center px-6 lg:px-12 py-6">
        {/* Left — the statement + console */}
        <div className="min-w-0 order-2 lg:order-1">
          {/* Status ping */}
          <div className="flex items-center gap-2.5 mb-6" style={revealStyle(80)}>
            <span className="relative flex h-2 w-2">
              {!reduced && (
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ background: '#e0a3a3', animation: 'sonarPing 2s ease-out infinite' }}
                />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#e0a3a3' }} />
            </span>
            <span className="label-caps opacity-80">Signal lost · code {code}</span>
          </div>

          {/* Headline */}
          <h1 className="headline-xl text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block" style={revealStyle(120)}>
              {headlineLead}
            </span>
            <span className="block" style={revealStyle(180)}>
              <span className="italic font-light text-gold" style={{ letterSpacing: '-0.03em' }}>
                {headlineAccent}
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-xl font-sans text-base sm:text-lg text-parchment/70 leading-relaxed" style={revealStyle(240)}>
            {bodyCopy}
          </p>

          {/* Requested-vector echo — the specific edge case, surfaced verbatim */}
          <div
            className="mt-6 inline-flex items-center gap-3 px-3 py-2 rounded-sm glass-panel max-w-full"
            style={revealStyle(300)}
          >
            <span className="font-mono text-[10px] tracking-label text-gold/70 uppercase shrink-0">
              {isError ? 'Fault' : 'Requested vector'}
            </span>
            <span className="font-mono text-xs text-parchment/80 truncate">
              {isError ? faultLabel ?? 'unhandled exception' : requestedVector}
            </span>
          </div>

          {/* ── Recovery console ── */}
          <div
            className="mt-8 rounded-md glass-panel overflow-hidden"
            style={revealStyle(360)}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Console title bar */}
            <div
              className="flex items-center justify-between px-3.5 py-2"
              style={{ borderBottom: '1px solid rgba(56,64,106,0.4)' }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-end gap-[2px] h-2.5" aria-hidden="true">
                  <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-1" />
                  <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-2" />
                  <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-3" />
                </span>
                <span className="font-mono text-[10px] tracking-label text-parchment/60 uppercase">
                  Recovery console
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-label text-gold/60 uppercase">jjz-station</span>
            </div>

            {/* Log */}
            <div
              ref={logRef}
              className="px-3.5 py-3 font-mono text-xs leading-relaxed h-[168px] overflow-y-auto thin-scrollbar"
              aria-live="polite"
            >
              {lines.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap break-words ${TONE_CLASS[line.tone]}`}>
                  {line.text}
                </div>
              ))}

              {/* Prompt */}
              <form onSubmit={onSubmit} className="flex items-center gap-2 mt-1">
                <span className="text-gold/80 shrink-0">guest@jjz:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  aria-label="Recovery console command input"
                  placeholder="type 'help'"
                  className="flex-1 min-w-0 bg-transparent outline-none text-parchment placeholder:text-parchment/30 caret-gold"
                />
              </form>
            </div>
          </div>

          {/* Recovered-signal quick links (for non-typers) + primary CTA */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" style={revealStyle(420)}>
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 font-mono text-xs tracking-label uppercase text-parchment hover:text-gold-bright transition-colors"
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full border transition-colors"
                style={{ borderColor: `${ACCENT}66` }}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gold transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
              </span>
              Return to base
            </Link>

            <span className="hidden sm:block w-px h-4 bg-accent/50" />

            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              {RECOVERED.filter((r) => r.cmd !== 'home').map((r) =>
                r.to.startsWith('/') && !r.to.endsWith('.pdf') ? (
                  <Link
                    key={r.cmd}
                    to={r.to}
                    className="font-mono text-xs tracking-label uppercase text-parchment/55 hover:text-parchment transition-colors"
                  >
                    {r.cmd}
                  </Link>
                ) : (
                  <a
                    key={r.cmd}
                    href={r.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs tracking-label uppercase text-parchment/55 hover:text-parchment transition-colors"
                  >
                    {r.cmd} ↗
                  </a>
                ),
              )}
            </nav>
          </div>
        </div>

        {/* Right — radar */}
        <div className="order-1 lg:order-2 flex items-center justify-center" style={revealStyle(200)}>
          <div className="relative w-[240px] sm:w-[300px] lg:w-[360px] aspect-square">
            <Radar reduced={reduced} />
            {/* Big code glyph, ghosted behind the radar center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="font-sans font-black text-parchment/[0.06] tracking-ultra-tight select-none"
                style={{ fontSize: 'clamp(5rem, 14vw, 9rem)' }}
              >
                {code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Baseline strip ── */}
      <div
        className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4"
        style={{ borderTop: '1px solid rgba(56,64,106,0.4)' }}
      >
        <span className="font-mono text-[10px] sm:text-xs tracking-label text-parchment/45 uppercase">
          Off-grid — but the door's still open
        </span>
        <span className="font-mono text-[10px] sm:text-xs tracking-label text-parchment/45 uppercase">
          © {new Date().getFullYear()} {BIO.name}
        </span>
      </div>

      {/* Local animations — scoped to this page, disabled under reduced-motion by
          the `reduced` guard on the elements that carry these classes. */}
      <style>{`
        @keyframes nfSweep { to { transform: rotate(360deg); } }
        .nf-sweep { animation: nfSweep 4s linear infinite; }
        @keyframes nfBlip {
          0%   { transform: scale(1);   opacity: 0.9; }
          70%  { transform: scale(3.2); opacity: 0; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        .nf-blip { transform-box: fill-box; transform-origin: center; animation: nfBlip 2.4s ease-out infinite; }
      `}</style>
    </div>
  )
}
