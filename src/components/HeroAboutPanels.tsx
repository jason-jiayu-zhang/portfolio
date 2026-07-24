import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { TIMELINE, BELIEFS, BOOKSHELF, ROTATIONS, PLAYGROUND, EDUCATION, WHEEL_SECTIONS } from '../data/about'
import type { BookEntry } from '../data/about'
import { useScanline } from './ScanlineContext'
import { BIO, STATUS_CYCLE } from '../data/portfolio'
import { useMagnetic } from '../hooks/useMagnetic'

// ── Section accent colors ───────────────────────────────────────────────────
// Single source of truth so each panel's own chrome (eyebrows, hairlines,
// rails) stays tied to the same color the wheel shows for that section.
export const SECTION_ACCENTS = {
  description: WHEEL_SECTIONS[0].accentColor,
  trajectory: WHEEL_SECTIONS[1].accentColor,
  philosophy: WHEEL_SECTIONS[2].accentColor,
  catalog: WHEEL_SECTIONS[3].accentColor,
}

// ── Reduced motion ──────────────────────────────────────────────────────────
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

// ── Reveal groups ───────────────────────────────────────────────────────────
// Content clusters into a few large groups instead of cascading individually.
export const GROUP_HEADER = 0
export const GROUP_META = 90
export const GROUP_CTA = 180

// ── Animated Element Wrapper ───────────────────────────────────────────────
interface AnimatedElementProps {
  delay: number
  children: React.ReactNode
  className?: string
  /** Stretch both wrapper divs to full height so a filling child can consume
      the panel band's leftover vertical space. */
  fill?: boolean
}

export function AnimatedElement({ delay, children, className = '', fill = false }: AnimatedElementProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`${fill ? 'min-h-0' : ''} ${className}`}>
      <div
        className={fill ? 'h-full min-h-0' : ''}
        style={{
          transform: show ? 'translateY(0)' : 'translateY(10px)',
          opacity: show ? 1 : 0,
          transition: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          willChange: show ? 'auto' : 'transform, opacity',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// SHARED PANEL SKELETON
// ═════════════════════════════════════════════════════════════════════════════
// Every hero-about section is one horizontal "instrument readout" sized for the
// wide, short band above the radar dome:
//   ┌ masthead ── eyebrow + title ─────────────────── meta ┐
//   │ body (fills width & height)                          │
//   └ telemetry rail (docks to the radar) ────────────────┘
// Sharing this rhythm makes switching sections feel like retuning one
// instrument rather than swapping four unrelated layouts.

function PanelShell({
  accent, eyebrow, title, meta, rail, children, bodyClassName = '',
}: {
  accent: string
  eyebrow: string
  title?: React.ReactNode
  meta?: React.ReactNode
  rail?: React.ReactNode
  children: React.ReactNode
  bodyClassName?: string
}) {
  return (
    <div className="h-full flex flex-col min-h-0">
      <AnimatedElement delay={GROUP_HEADER}>
        <header
          className="shrink-0 flex items-end justify-between gap-4 pb-3 mb-4 border-b"
          style={{ borderColor: `${accent}26` }}
        >
          <div className="min-w-0">
            <div className="label-caps flex items-center gap-2" style={{ color: accent }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
              {eyebrow}
            </div>
            {title && <div className="mt-2">{title}</div>}
          </div>
          {meta && (
            <div className="hidden sm:block shrink-0 text-right font-mono text-[10px] tracking-label uppercase text-parchment/40 leading-relaxed whitespace-pre-line">
              {meta}
            </div>
          )}
        </header>
      </AnimatedElement>

      <div className={`flex-1 min-h-0 flex flex-col ${bodyClassName}`}>{children}</div>

      {rail && (
        <AnimatedElement delay={GROUP_CTA}>
          <div className="shrink-0 mt-4 pt-3 border-t" style={{ borderColor: 'rgba(56,64,106,0.45)' }}>
            {rail}
          </div>
        </AnimatedElement>
      )}
    </div>
  )
}

// Horizontal telemetry strip — labeled mono readouts split by hairlines. The
// recurring bottom-of-band element that ties each section to the instrument.
function TelemetryRail({
  accent, items,
}: { accent: string; items: Array<{ label: string; value: React.ReactNode }> }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="hidden sm:block w-px h-6 bg-accent/25" aria-hidden />}
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-mono text-[9px] tracking-label uppercase" style={{ color: accent }}>
              {it.label}
            </span>
            <span className="font-mono text-xs text-parchment/75 leading-tight">{it.value}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

function RotatingStatusText() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [animState, setAnimState] = useState<'idle' | 'exit' | 'enter'>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAnimState('exit')
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % STATUS_CYCLE.length)
        setAnimState('enter')
        setTimeout(() => setAnimState('idle'), 200)
      }, 350)
    }, 10000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const textStyle: React.CSSProperties = {
    transform: animState === 'exit' ? 'translateY(-100%)' : animState === 'enter' ? 'translateY(4px)' : 'translateY(0)',
    opacity: animState === 'enter' ? 0 : 1,
    transition: animState === 'exit' ? 'transform 0.22s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.2s ease' : animState === 'enter' ? 'none' : 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease',
    willChange: 'transform, opacity',
    display: 'block',
  }

  return (
    <span className="overflow-hidden block min-h-[1.2em]">
      <span style={textStyle}>{STATUS_CYCLE[currentIdx].text}</span>
    </span>
  )
}

// ─── Animated underline link ──────────────────────────────────────────────────
function AnchorLine({
  href, children, external = true,
}: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group relative inline-block"
    >
      <span className="transition-colors duration-200">{children}</span>
      <span
        className="absolute -bottom-px left-0 right-0 h-px bg-gold/60"
        style={{
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        data-underline
      />
      <style>{`a:hover [data-underline] { transform: scaleX(1) !important; }`}</style>
    </a>
  )
}

function Blink() {
  return (
    <span
      className="inline-block w-1.5 h-3 bg-parchment/60 ml-0.5"
      style={{ animation: 'blink 1.1s step-end infinite' }}
    />
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// TERMINAL ENGINE (shared by the Catalog panel)
// ═════════════════════════════════════════════════════════════════════════════
const STATUS_ICONS: Record<BookEntry['status'], string> = {
  reading: '▶',
  done: '✓',
  queued: '○',
}
const STATUS_COLORS: Record<BookEntry['status'], string> = {
  reading: '#9cd5f8',
  done: '#4ade80',
  queued: 'rgba(207,204,187,0.5)',
}

function makeSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') + '.md'
}

const VFS: Record<string, Array<{ file: string; summary: string }>> = {
  books: BOOKSHELF.map(b => ({
    file: makeSlug(b.title),
    summary: [
      `📖 ${b.title}`,
      `Author : ${b.author}`,
      `Genre  : ${b.category}`,
      `Status : ${{ reading: '▶ Currently reading', done: '✓ Finished', queued: '○ Queued' }[b.status]}`,
    ].join('\n'),
  })),
  music: ROTATIONS.map(r => ({
    file: makeSlug(r.note),
    summary: `♫ ${r.note}\nArtist : ${r.artist}`,
  })),
  play: PLAYGROUND.map(g => ({
    file: makeSlug(g.title),
    summary: [
      `◈ ${g.title}`,
      ...g.specs.map(s => `  ${s.label.padEnd(16)} ${s.value}`),
    ].join('\n'),
  })),
}

const HISTORY_KEY = 'jason_terminal_history'
const HISTORY_CAP = 50

type HistoryEntry = { cmd: string; output: React.ReactNode }

const INITIAL_HISTORY: HistoryEntry[] = [
  { cmd: 'sysinfo', output: 'JasonOS v1.0.0\nType "help" for a list of available commands.' },
]

function loadHistory(): HistoryEntry[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Array<{ cmd: string; output: string }>
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(h => ({ cmd: h.cmd, output: h.output }))
      }
    }
  } catch { /* ignore */ }
  return INITIAL_HISTORY
}

function persistHistory(history: HistoryEntry[]) {
  try {
    const serializable = history
      .slice(-HISTORY_CAP)
      .map(h => ({ cmd: h.cmd, output: typeof h.output === 'string' ? h.output : '[rich output]' }))
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(serializable))
  } catch { /* ignore */ }
}

const ALL_COMMANDS = [
  'help', 'clear', 'ls', 'cd ', 'cat ', 'pwd', 'resume', 'contact', 'whoami',
  'sudo ', 'echo ', 'ping', 'coffee', 'uptime', 'rm -rf /', 'flip', 'unflip',
  'sysinfo', 'scanline', 'scanline on', 'scanline off', 'scanline toggle',
]

function InteractiveTerminalPrompt({
  history, commandInput, setCommandInput, handleCommand, inputRef, className = '',
}: {
  history: Array<{ cmd: string, output: React.ReactNode }>
  commandInput: string
  setCommandInput: (val: string) => void
  handleCommand: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  className?: string
}) {
  const historyEndRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (historyEndRef.current && historyEndRef.current.parentElement) {
      const parent = historyEndRef.current.parentElement
      parent.scrollTo({
        top: parent.scrollHeight,
        behavior: isInitialMount.current ? 'auto' : 'smooth',
      })
      isInitialMount.current = false
    }
  }, [history])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(nextIndex)
        setCommandInput(history[nextIndex].cmd)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1
        if (nextIndex >= history.length) {
          setHistoryIndex(-1)
          setCommandInput('')
        } else {
          setHistoryIndex(nextIndex)
          setCommandInput(history[nextIndex].cmd)
        }
      }
    } else {
      if (e.key === 'Enter') setHistoryIndex(-1)
      handleCommand(e)
    }
  }

  return (
    <div
      className={`flex flex-col border border-accent/20 rounded-md overflow-hidden bg-[#0b0c10]/40 backdrop-blur-lg shadow-sm cursor-text ${className}`}
      onClick={(e) => {
        // Focus the shell on any click that isn't a text selection, so the
        // whole window behaves like one big input. Don't steal focus mid-drag
        // or when the user is selecting output text.
        if (window.getSelection()?.toString()) return
        if ((e.target as HTMLElement).closest('a, button')) return
        inputRef.current?.focus()
      }}
    >
      <div data-window-handle className="shrink-0 h-[29px] flex items-center px-3 border-b border-accent/20 bg-accent/5 cursor-grab active:cursor-grabbing select-none">
        <div className="flex gap-1.5 w-[36px] shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <div className={`w-2 h-2 rounded-full bg-green-400/60 ${isFocused ? 'animate-pulse' : ''}`} />
        </div>
        <div className="flex-1 text-center font-mono text-xs text-parchment/65 uppercase tracking-widest">bash</div>
        <div className="w-[36px] shrink-0" />
      </div>

      <div data-cursor-text className="flex-1 min-h-0 p-3 flex flex-col gap-2">
        {history.length > 0 && (
          <div className="thin-scrollbar space-y-2 overflow-y-auto pr-2 flex-1 min-h-0 max-h-[clamp(100px,19vh,280px)] lg:max-h-none">
            {history.map((h, i) => (
              <div key={i} className="space-y-1" style={{ animation: 'fadeIn 0.2s ease both' }}>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-gold/88">›_</span>
                  <span className="font-mono text-xs text-parchment/70">{h.cmd}</span>
                </div>
                {h.output && (
                  <div className="font-mono text-xs text-parchment/70 pl-4 whitespace-pre-wrap">{h.output}</div>
                )}
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>
        )}
        <div
          className="flex items-center gap-1.5 relative cursor-text min-h-[20px] shrink-0"
          onClick={() => inputRef.current?.focus()}
        >
          <span className="font-mono text-xs text-parchment/65">›_</span>
          <span className="font-mono text-xs flex-1 whitespace-pre-wrap break-all pointer-events-none select-none" aria-hidden>
            <span className="text-parchment/70">{commandInput}</span>
            <Blink />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute opacity-0 inset-0 w-full h-full cursor-text"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 0 — About ("Behind the Pixels")
// ═════════════════════════════════════════════════════════════════════════════
interface DescriptionImage {
  src: string
  alt: string
  objectClassName: string
  collapsedObjectClassName?: string
  /** Extra cover-zoom so the subject reads at a consistent scale across frames. */
  zoom?: number
  /** Post-zoom pan (translate args, e.g. '-14%, -14%') to re-center the subject. */
  pan?: string
}

const DESCRIPTION_IMAGES: DescriptionImage[] = [
  {
    src: '/images/jason-headshot-1.webp',
    alt: 'Jason Portrait',
    objectClassName: 'object-[62%_20%]',
    collapsedObjectClassName: 'object-[64%_20%]',
    zoom: 1.04,
  },
  {
    src: '/images/jason-headshot-2.webp',
    alt: 'Jason at work',
    objectClassName: 'object-[50%_18%]',
    collapsedObjectClassName: 'object-[50%_18%]',
    zoom: 1.04,
  },
  {
    src: '/images/jason-thinking.webp',
    alt: 'Jason thinking',
    objectClassName: 'object-[60%_20%]',
    collapsedObjectClassName: 'object-[60%_20%]',
    zoom: 1.04,
  },
]

const IMAGE_CYCLE_MS = 15000 / DESCRIPTION_IMAGES.length

// ── Recruiter-facing signals ────────────────────────────────────────────────
// Proof pulled from real roles (see TIMELINE / PROJECTS); keywords are the
// role-match terms a recruiter skims for. Availability — edit to match status.
const CREDIBILITY_STATS: Array<{ value: string; label: string }> = [
  { value: '50K+', label: 'Users Shipped' },
  { value: 'Figma', label: 'Campus Leader' },
  { value: 'Design, Computer Engineering', label: 'UC Davis Degrees' },
]
const SKILL_KEYWORDS = ['Design Systems', 'Front-End', 'Figma-to-Code', 'Prototyping']
const AVAILABILITY = 'Open to Summer 2027 Roles'

function AvailabilityPill({ accent }: { accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] tracking-label uppercase text-parchment/80"
      style={{ borderColor: `${accent}59`, background: `${accent}14` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
      {AVAILABILITY}
    </span>
  )
}

function WorkCta() {
  const ref = useMagnetic<HTMLButtonElement>(0.28)
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => document.getElementById('featured-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="group inline-flex items-center gap-2 shrink-0 rounded-full border border-gold/45 bg-gold/5 px-3.5 py-1 font-mono text-[10px] tracking-label uppercase text-gold/90 hover:border-gold/80 hover:text-gold"
      style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease, border-color 0.2s ease' }}
    >
      View the Work
      <span className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
    </button>
  )
}

function CredibilityStrip({ accent }: { accent: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {CREDIBILITY_STATS.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <span className="hidden sm:block w-px h-7 bg-accent/25" aria-hidden />}
          <div className="flex flex-col">
            <span
              className="font-sans font-black leading-none text-parchment"
              style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.55rem)', letterSpacing: '-0.03em' }}
            >
              {s.value}
            </span>
            <span className="font-mono text-[9px] tracking-label uppercase mt-1" style={{ color: accent }}>
              {s.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

function SkillChips({ accent }: { accent: string }) {
  return (
    <div className="hero-chips flex flex-wrap gap-1.5">
      {SKILL_KEYWORDS.map((k) => (
        <span
          key={k}
          className="font-mono text-[10px] tracking-label px-2 py-0.5 border rounded-sm text-parchment/70"
          style={{ borderColor: `${accent}33` }}
        >
          {k}
        </span>
      ))}
    </div>
  )
}

// ── Name marquee ─────────────────────────────────────────────────────────────
// The hero name cycles horizontally across the full width above the portraits.
// Four copies (two identical halves) scroll left; a 50% shift loops seamlessly.
// Full-bleed via negative margins; edges dissolve into the background.
function NameMarquee() {
  const Unit = () => (
    <span className="inline-flex shrink-0 items-center">
      <span className="whitespace-pre">
        <span className="text-gold">JASON </span>
        <span className="text-parchment">JIAYU</span>
        <span className="text-gold"> ZHANG</span>
      </span>
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden
        className="shrink-0 mx-7 sm:mx-10 opacity-85"
        style={{ height: '0.64em', width: 'auto' }}
      />
    </span>
  )
  const Half = () => (
    <span className="inline-flex shrink-0 items-center">
      <Unit />
      <Unit />
    </span>
  )

  return (
    <div className="group/marquee relative w-screen left-1/2 -translate-x-1/2">
      <h1 className="sr-only">Jason Jiayu Zhang — Design Engineer</h1>
      <div
        aria-hidden
        className="overflow-hidden py-2 -my-2"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 2%, #000 98%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, #000 2%, #000 98%, transparent)',
        }}
      >
        <div
          className="name-marquee-track flex w-max whitespace-nowrap font-sans font-black tracking-ultra-tight"
          style={{ fontSize: 'min(clamp(3rem, 7.5vw, 6.25rem), 11vh)', lineHeight: 0.86, willChange: 'transform' }}
        >
          <Half />
          <Half />
        </div>
      </div>
    </div>
  )
}

export function DescriptionPanel() {
  const { scanlineActive } = useScanline()
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [hoveredImageIdx, setHoveredImageIdx] = useState<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const accent = SECTION_ACCENTS.description

  useEffect(() => {
    if (DESCRIPTION_IMAGES.length <= 1 || prefersReducedMotion) return
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % DESCRIPTION_IMAGES.length)
    }, IMAGE_CYCLE_MS)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const featured = hoveredImageIdx ?? activeImageIdx

  return (
    <PanelShell
      accent={accent}
      eyebrow="BEHIND THE PIXELS"
      meta={`PROFILE\n${String(featured + 1).padStart(2, '0')} / ${String(DESCRIPTION_IMAGES.length).padStart(2, '0')}`}
      rail={
        <TelemetryRail
          accent={accent}
          items={[
            { label: 'Location', value: 'Davis, CA' },
            { label: 'Class', value: 'Design Engineer' },
            { label: 'Status', value: <RotatingStatusText /> },
          ]}
        />
      }
    >
      {/* Name — the panel's hero statement, oversized and edge-to-edge */}
      <div className="hero-name-block shrink-0 mb-5 sm:mb-6">
        <AnimatedElement delay={0}>
          <NameMarquee />
        </AnimatedElement>
      </div>

      <div className="flex-1 min-h-0 grid lg:grid-cols-[1fr_minmax(0,1.05fr)] gap-6 lg:gap-10">
        {/* Narrative */}
        <AnimatedElement delay={220} fill className="min-h-0">
          <div className="hero-narrative h-full flex flex-col justify-center gap-4">
            <div>
              <h2
                className="font-sans font-black text-parchment leading-[1.02] max-w-xl"
                style={{ fontSize: 'clamp(1.35rem, 2.1vw, 1.9rem)', letterSpacing: '-0.04em' }}
              >
                A <span className="text-gold">design engineer</span> building where systems and craft meet.
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <AvailabilityPill accent={accent} />
                <WorkCta />
              </div>
            </div>
            <CredibilityStrip accent={accent} />
            <div className="hero-bio relative max-w-xl pl-4" style={{ borderLeft: `2px solid ${accent}59` }}>
              <span
                aria-hidden
                className="absolute -left-[2px] top-0 w-[2px] h-6"
                style={{ background: accent }}
              />
              <p className="font-mono text-xs text-parchment/55 leading-relaxed">
                <span className="text-parchment/90">My work is driven by a curiosity for how systems, and teams, operate.</span> Whether architecting a front-end component library or detailing micro-interactions, I make it a priority to understand the workflows and constraints of my engineering and product partners. By designing the collaboration as intentionally as the interface, I streamline how we design and ship together.
              </p>
            </div>
            <SkillChips accent={accent} />
          </div>
        </AnimatedElement>

        {/* Portrait filmstrip — active frame expands; the rest stay slim and desaturated */}
        <AnimatedElement delay={420} fill className="min-h-0">
          <div className="hero-filmstrip relative h-full min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] flex items-stretch gap-1.5 sm:gap-2">
            {DESCRIPTION_IMAGES.map((img, i) => {
              const isFeatured = i === featured
              const activeObjClass = isFeatured ? img.objectClassName : (img.collapsedObjectClassName ?? img.objectClassName)
              return (
                <button
                  key={img.src}
                  type="button"
                  onMouseEnter={() => setHoveredImageIdx(i)}
                  onMouseLeave={() => setHoveredImageIdx(null)}
                  onFocus={() => setHoveredImageIdx(i)}
                  onBlur={() => setHoveredImageIdx(null)}
                  className={`group relative min-w-[50px] sm:min-w-[60px] h-full overflow-hidden rounded-sm border p-1 bg-[#0b0c10]/80 ${
                    isFeatured ? 'border-gold/60' : 'border-accent/30'
                  }`}
                  style={{
                    flexGrow: isFeatured ? 2.5 : 1,
                    flexBasis: 0,
                    transition: 'flex-grow 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
                  }}
                  aria-label={img.alt}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[1px]">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className={`absolute inset-0 w-full h-full object-cover ${activeObjClass} contrast-125 ${
                        isFeatured ? 'saturate-100 brightness-100' : 'saturate-[0.35] brightness-[0.65]'
                      }`}
                      style={{
                        transition: 'filter 0.5s cubic-bezier(0.16, 1, 0.3, 1), object-position 0.4s ease, transform 0.4s ease',
                        transform: img.zoom ? `scale(${img.zoom}) translate(${img.pan ?? '0, 0'})` : undefined,
                        transformOrigin: 'center 20%',
                      }}
                    />
                    <div
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isFeatured ? 'opacity-0' : scanlineActive ? 'opacity-100' : 'opacity-40'
                        }`}
                      style={{
                        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                        backgroundSize: '100% 4px, 3px 100%',
                      }}
                    />
                    {/* vertical caption on slim frames */}
                    <span
                      className={`absolute bottom-2 left-2 font-mono text-[9px] tracking-label uppercase transition-opacity duration-300 ${isFeatured ? 'opacity-0' : 'opacity-60'
                        }`}
                      style={{ writingMode: 'vertical-rl', color: '#cfccbb' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {isFeatured && (
                    <>
                      <span className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold/60 pointer-events-none" />
                      <span className="absolute bottom-2 right-2 font-mono text-[9px] text-gold/70 pointer-events-none select-none">
                        {String(i + 1).padStart(2, '0')}/{String(DESCRIPTION_IMAGES.length).padStart(2, '0')}
                      </span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </AnimatedElement>
      </div>
    </PanelShell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 1 — Trajectory (horizontal timeline)
// ═════════════════════════════════════════════════════════════════════════════
function TimelineStation({
  entry, above, accent,
}: { entry: typeof TIMELINE[number]; above: boolean; accent: string }) {
  return (
    <div className="group relative flex-1 min-w-0 h-full px-1.5">
      {/* connector from node to card */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-px bg-accent/40 ${above ? 'bottom-1/2 h-5' : 'top-1/2 h-5'}`}
      />
      {/* node on the axis */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <span
          className="relative block w-2.5 h-2.5 rounded-full border-2 transition-transform duration-200 group-hover:scale-125"
          style={{ borderColor: accent, backgroundColor: '#0b0c10' }}
        >
          <span
            className="absolute inset-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: accent }}
          />
        </span>
      </div>
      {/* card — grows away from the axis on hover */}
      <div className={`absolute left-0 right-1.5 ${above ? 'bottom-1/2 mb-6' : 'top-1/2 mt-6'}`}>
        <div className="font-mono text-[10px] tracking-label uppercase text-parchment/50">{entry.period}</div>
        <div
          className="font-sans font-semibold text-sm text-parchment leading-snug mt-1 transition-colors duration-200"
          style={{ letterSpacing: '-0.02em' }}
        >
          {entry.role}
        </div>
        <div className="font-mono text-xs text-gold/85 mt-0.5 leading-snug">{entry.org}</div>
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-label px-1.5 py-0.5 border rounded-sm text-parchment/70"
                  style={{ borderColor: `${accent}40` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TrajectoryPanel() {
  const accent = SECTION_ACCENTS.trajectory

  return (
    <PanelShell
      accent={accent}
      eyebrow="TRAJECTORY"
      meta={`${String(TIMELINE.length).padStart(2, '0')} ROLES\n2025 → 2026`}
      title={
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2
            className="font-sans font-black text-parchment leading-none"
            style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', letterSpacing: '-0.04em' }}
          >
            Design × Engineering
          </h2>
          <span className="font-mono text-xs text-parchment/55 leading-snug max-w-md hidden md:block">
            {EDUCATION.note}
          </span>
        </div>
      }
      rail={
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2 shrink-0">
            {EDUCATION.degrees.map((d) => (
              <span
                key={d}
                className="font-mono text-xs tracking-label text-gold/88 px-2 py-1 border rounded-sm whitespace-nowrap"
                style={{ borderColor: `${accent}40`, background: 'rgba(56,64,106,0.18)' }}
              >
                {d}
              </span>
            ))}
          </div>
          <span className="hidden sm:block w-px h-6 bg-accent/25" aria-hidden />
          <div className="thin-scrollbar flex gap-1.5 overflow-x-auto flex-1 min-w-0 py-0.5">
            {EDUCATION.tools.map((tool) => (
              <span
                key={tool}
                className="font-mono text-[11px] px-2 py-0.5 border border-accent/25 text-parchment/65 rounded-sm whitespace-nowrap shrink-0"
              >
                {tool}
              </span>
            ))}
          </div>
          <span className="hidden lg:block w-px h-6 bg-accent/25" aria-hidden />
          <AnchorLine href={BIO.resumeUrl}>
            <span className="font-mono text-xs tracking-label uppercase text-gold/88 group-hover:text-gold transition-colors inline-flex items-center gap-1 whitespace-nowrap">
              Full Resume
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </span>
          </AnchorLine>
        </div>
      }
    >
      {/* Desktop: horizontal time axis with alternating stations, vertically
          centered in the band so cards clear the masthead and the rail */}
      <AnimatedElement delay={GROUP_META} fill className="hidden lg:block flex-1 min-h-0">
        <div className="h-full flex items-center">
          <div className="relative w-full h-[72%] min-h-[220px] max-h-[320px]">
            <div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}66 10%, ${accent}66 90%, transparent)` }}
            />
            <div className="relative h-full flex">
              {TIMELINE.map((entry, i) => (
                <TimelineStation key={`${entry.org}-${entry.role}`} entry={entry} above={i % 2 === 0} accent={accent} />
              ))}
            </div>
          </div>
        </div>
      </AnimatedElement>

      {/* Mobile: vertical stacked timeline */}
      <AnimatedElement delay={GROUP_META} className="lg:hidden min-h-0">
        <div className="thin-scrollbar overflow-y-auto -mr-2 pr-2 max-h-[46vh] relative pl-4">
          <div className="absolute left-1 top-1 bottom-1 w-px" style={{ backgroundColor: `${accent}55` }} />
          {TIMELINE.map((entry) => (
            <div key={`${entry.org}-${entry.role}`} className="relative py-2.5 border-b border-accent/15 last:border-b-0">
              <span
                className="absolute -left-[13px] top-4 w-2 h-2 rounded-full border-2"
                style={{ borderColor: accent, backgroundColor: '#0b0c10' }}
              />
              <div className="font-mono text-[10px] tracking-label uppercase text-parchment/50">{entry.period}</div>
              <div className="font-sans font-semibold text-sm text-parchment leading-snug mt-0.5">{entry.role}</div>
              <div className="font-mono text-xs text-gold/85">{entry.org}</div>
            </div>
          ))}
        </div>
      </AnimatedElement>
    </PanelShell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 2 — Philosophy (headline + full manifesto list)
// ═════════════════════════════════════════════════════════════════════════════
export function PhilosophyPanel() {
  const accent = SECTION_ACCENTS.philosophy
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <PanelShell
      accent={accent}
      eyebrow="PHILOSOPHY"
      meta={`${String(BELIEFS.length).padStart(2, '0')} PRINCIPLES`}
      rail={
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {['Servant leadership', 'Authentic community', 'Real products'].map((creed, i) => (
            <React.Fragment key={creed}>
              {i > 0 && <span className="font-mono text-xs" style={{ color: accent }}>·</span>}
              <span className="font-mono text-xs tracking-label uppercase text-parchment/70">{creed}</span>
            </React.Fragment>
          ))}
        </div>
      }
    >
      <div className="flex-1 min-h-0 grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] gap-6 lg:gap-12">
        {/* Manifesto headline */}
        <AnimatedElement delay={GROUP_META} fill className="min-h-0">
          <div className="h-full flex flex-col justify-center">
            <h2
              className="font-sans font-black text-parchment mb-3"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3.4rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
            >
              Human-First.
              <br />
              <span className="text-gold">Always.</span>
            </h2>
            <p className="font-mono text-xs text-parchment/70 leading-relaxed max-w-sm">
              These aren't just values in a list. They're the operating constraints for my entire design journey.
            </p>
          </div>
        </AnimatedElement>

        {/* All five principles, always visible, filling the height */}
        <AnimatedElement delay={GROUP_CTA} fill className="min-h-0">
          <div className="thin-scrollbar h-full min-h-0 flex flex-col overflow-y-auto lg:overflow-visible max-h-[46vh] lg:max-h-none">
            {BELIEFS.map((belief, i) => {
              const isActive = activeIndex === i
              return (
                <div
                  key={belief.index}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="group relative flex gap-3 sm:gap-4 lg:flex-1 lg:min-h-0 items-center py-2.5 pl-4 border-b border-accent/15 last:border-b-0 cursor-default"
                >
                  <span
                    className="font-mono text-sm tabular-nums shrink-0 pt-0.5 transition-colors duration-200"
                    style={{ color: isActive ? accent : 'rgba(207,204,187,0.4)' }}
                  >
                    {belief.index}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="font-sans font-bold text-sm sm:text-[15px] leading-snug transition-colors duration-200"
                      style={{ letterSpacing: '-0.02em', color: isActive ? '#fff' : '#cfccbb' }}
                    >
                      {belief.headline}
                    </h3>
                    <p className="font-mono text-[11px] leading-snug text-parchment/60 mt-1">{belief.body}</p>
                  </div>
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: accent,
                      height: isActive ? '70%' : '0%',
                      opacity: isActive ? 0.9 : 0,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </AnimatedElement>
      </div>
    </PanelShell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 3 — Catalog (registers + live terminal)
// ═════════════════════════════════════════════════════════════════════════════
type CatalogTab = 'books' | 'music' | 'play'

const CATALOG_TABS: Array<{ id: CatalogTab; icon: string; label: string }> = [
  { id: 'books', icon: '📚', label: 'Shelf' },
  { id: 'music', icon: '♫', label: 'Playlist' },
  { id: 'play', icon: '◈', label: 'Play' },
]

// Bookshelf grouped by category, categories sorted alphabetically.
const BOOKS_BY_CATEGORY: Array<[string, BookEntry[]]> = Object.entries(
  BOOKSHELF.reduce<Record<string, BookEntry[]>>((acc, b) => {
    ; (acc[b.category] ??= []).push(b)
    return acc
  }, {})
).sort(([a], [b]) => a.localeCompare(b))

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const handler = () => setDesktop(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return desktop
}

// Free-floating window. On desktop it renders through a portal into the hero
// section (above the wheel's stacking layer and outside the content band's
// overflow clip), positioned over an invisible placeholder that holds its grid
// slot — so it can be dragged anywhere, including over the telemetry rail and the
// radar dome. Any child title bar tagged `data-window-handle` is the drag grip;
// grabbing raises it to the front. Buttons/inputs in the handle don't start a
// drag. On smaller screens it just renders inline in the stacked grid.
function DraggableWindow({
  children, className = '', z, onFocus,
}: { children: React.ReactNode; className?: string; z: number; onFocus: () => void }) {
  const isDesktop = useIsDesktop()
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [slot, setSlot] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)

  useEffect(() => { setHost(document.getElementById('featured')) }, [])

  // Keep the floating window locked onto its grid placeholder (offset by any drag).
  useLayoutEffect(() => {
    const ph = placeholderRef.current
    if (!isDesktop || !ph || !host) return
    const measure = () => {
      const pr = ph.getBoundingClientRect()
      const hr = host.getBoundingClientRect()
      setSlot({ left: pr.left - hr.left, top: pr.top - hr.top, width: pr.width, height: pr.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ph)
    ro.observe(host)
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [isDesktop, host])

  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    const handle = target.closest('[data-window-handle]')
    if (!handle || !e.currentTarget.contains(handle)) return
    if (target.closest('button, a, input, [role="button"]')) return
    onFocus()
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y }
    setIsDragging(true)
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* no active pointer */ }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    setPos({ x: drag.current.ox + (e.clientX - drag.current.sx), y: drag.current.oy + (e.clientY - drag.current.sy) })
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return
    drag.current = null
    setIsDragging(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* not captured */ }
  }

  if (!isDesktop) {
    return <div className={`h-full min-h-0 ${className}`}>{children}</div>
  }

  return (
    <>
      {/* Placeholder — reserves the grid slot; the real window floats over it. */}
      <div ref={placeholderRef} className={`h-full min-h-0 ${className}`} aria-hidden />
      {host && slot && createPortal(
        <div
          className="absolute"
          style={{
            left: slot.left + pos.x,
            top: slot.top + pos.y,
            width: slot.width,
            height: slot.height,
            zIndex: 40 + z,
            transition: isDragging ? 'none' : 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            touchAction: isDragging ? 'none' : undefined,
            willChange: isDragging ? 'left, top' : 'auto',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {children}
        </div>,
        host
      )}
    </>
  )
}

// ── Mini paint ────────────────────────────────────────────────────────────────
const PAINT_COLORS = ['#ebd648', '#9cd5f8', '#a855f7', '#4ade80', '#f87171', '#cfccbb']
const PAINT_BG = '#0b0c10'

function MiniPaint({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [color, setColor] = useState(PAINT_COLORS[0])
  const [erasing, setErasing] = useState(false)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const inited = useRef(false)

  // Size the canvas to its container (DPR-aware) and lay down the backdrop.
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const fit = () => {
      const rect = wrap.getBoundingClientRect()
      if (rect.width < 1 || rect.height < 1) return
      const dpr = window.devicePixelRatio || 1
      const ctx = canvas.getContext('2d')!
      // Preserve the current drawing across a resize (skip the first fit — the
      // default 300×150 buffer is transparent and would punch a hole in the fill).
      const prev = inited.current ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = PAINT_BG
      ctx.fillRect(0, 0, rect.width, rect.height)
      if (prev) ctx.putImageData(prev, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      inited.current = true
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  const at = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const stroke = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const p = at(e)
    const l = last.current ?? p
    ctx.strokeStyle = erasing ? PAINT_BG : color
    ctx.lineWidth = erasing ? 14 : 3
    ctx.beginPath()
    ctx.moveTo(l.x, l.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }
  const down = (e: React.PointerEvent) => {
    drawing.current = true
    last.current = at(e)
    try { canvasRef.current!.setPointerCapture(e.pointerId) } catch { /* no active pointer */ }
    stroke(e)
  }
  const up = () => { drawing.current = false; last.current = null }
  const clear = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = PAINT_BG
    ctx.fillRect(0, 0, rect.width, rect.height)
  }

  return (
    <div className={`flex flex-col min-h-0 border border-accent/20 rounded-md overflow-hidden bg-[#0b0c10]/40 backdrop-blur-lg shadow-sm ${className}`}>
      {/* Title bar (drag handle) */}
      <div data-window-handle className="shrink-0 h-[29px] flex items-center px-3 border-b border-accent/20 bg-accent/5 cursor-grab active:cursor-grabbing select-none">
        <div className="flex gap-1.5 w-[36px] shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <div className="w-2 h-2 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 text-center font-mono text-xs text-parchment/65 lowercase tracking-widest">paint</div>
        <div className="w-[36px] shrink-0" />
      </div>

      {/* Toolbar — swatches, eraser, clear */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-accent/20">
        <div className="flex items-center gap-1.5">
          {PAINT_COLORS.map((c) => {
            const selected = !erasing && c === color
            return (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => { setColor(c); setErasing(false) }}
                className="w-3.5 h-3.5 rounded-full transition-transform hover:scale-110"
                style={{ background: c, outline: selected ? `1.5px solid ${c}` : 'none', outlineOffset: 2, boxShadow: selected ? `0 0 0 1px ${PAINT_BG}` : 'none' }}
              />
            )
          })}
        </div>
        <div className="w-px h-3.5 bg-accent/25 shrink-0" />
        <button
          type="button"
          onClick={() => setErasing((v) => !v)}
          aria-pressed={erasing}
          className={`font-mono text-[9px] tracking-label uppercase px-1.5 py-0.5 rounded-sm border transition-colors ${erasing ? 'text-parchment border-parchment/40 bg-accent/10' : 'text-parchment/50 border-accent/25 hover:text-parchment/80'}`}
        >
          Erase
        </button>
        <button
          type="button"
          onClick={clear}
          className="font-mono text-[9px] tracking-label uppercase px-1.5 py-0.5 rounded-sm border border-accent/25 text-parchment/50 hover:text-parchment/80 transition-colors ml-auto"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="flex-1 min-h-[150px] relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
          onPointerDown={down}
          onPointerMove={stroke}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={up}
        />
      </div>
    </div>
  )
}

// A browser window that mirrors the bash window's chrome — same dots, same
// hairlines — but swaps the title for tabs and an address bar. It shares the
// terminal's activeTab, so `cd music` flips the tab and clicking a tab moves the
// shell's working directory. Two windows, one filesystem.
function CatalogBrowser({
  activeTab, setActiveTab, accent, counts, children,
}: {
  activeTab: CatalogTab
  setActiveTab: (t: CatalogTab) => void
  accent: string
  counts: Record<CatalogTab, number>
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full min-h-0 border border-accent/20 rounded-md overflow-hidden bg-[#0b0c10]/40 backdrop-blur-lg shadow-sm">
      {/* Title bar — traffic lights + browser tabs (drag handle) */}
      <div data-window-handle className="shrink-0 h-[29px] flex items-end gap-2.5 pl-3 pr-2 border-b border-accent/20 bg-accent/5 cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center gap-1.5 shrink-0 self-center">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <div className="w-2 h-2 rounded-full bg-green-400/60" />
        </div>
        <div className="thin-scrollbar flex items-end gap-0.5 flex-1 min-w-0 overflow-x-auto -mb-px">
          {CATALOG_TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={isActive}
                className={`group relative flex items-center gap-1 shrink-0 px-2 py-1 rounded-t-md whitespace-nowrap font-mono text-[10px] tracking-label uppercase transition-colors ${isActive ? 'text-parchment' : 'text-parchment/45 hover:text-parchment/75'
                  }`}
                style={
                  isActive
                    ? { background: `${accent}1f`, borderTop: `1px solid ${accent}`, boxShadow: `inset 0 -1px 0 0 rgba(11,12,16,0.55)` }
                    : undefined
                }
              >
                <span className="text-[11px] leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="text-[9px] text-parchment/40">{String(counts[tab.id]).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Address bar — reflects the shell's current working directory */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 border-b border-accent/20">
        <span className="font-mono text-parchment/25 text-sm leading-none select-none" aria-hidden>‹ ›</span>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 rounded-full bg-accent/[0.08] px-2.5 py-0.5">
          <svg width="9" height="9" viewBox="0 0 12 12" className="shrink-0" aria-hidden>
            <circle cx="6" cy="6" r="5" fill="none" stroke={accent} strokeWidth="1" opacity="0.7" />
            <path d="M1 6h10" stroke={accent} strokeWidth="0.7" opacity="0.7" />
            <path d="M6 1c2 1.6 2 8.4 0 10M6 1c-2 1.6-2 8.4 0 10" fill="none" stroke={accent} strokeWidth="0.7" opacity="0.7" />
          </svg>
          <span className="font-mono text-[10px] text-parchment/55 truncate">jason.os/personal/{activeTab}</span>
        </div>
      </div>

      {/* Page */}
      <div
        key={activeTab}
        className="thin-scrollbar flex-1 min-h-0 overflow-y-auto p-3 max-h-[42vh] lg:max-h-none"
        style={{ animation: 'fadeIn 0.25s ease both' }}
      >
        {children}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

export function CatalogPanel() {
  const [history, setHistory] = useState<Array<{ cmd: string, output: React.ReactNode }>>(() => loadHistory())
  const [commandInput, setCommandInput] = useState('')
  const [activeTab, setActiveTab] = useState<'books' | 'music' | 'play'>('books')
  const [uptimeStart] = useState(() => Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const { scanlineActive, setScanlineActive, toggleScanline } = useScanline()
  const accent = SECTION_ACCENTS.catalog

  // Stacking order for the draggable windows — grabbing one raises it to the top.
  const [zOrder, setZOrder] = useState<Record<'browser' | 'terminal' | 'paint', number>>({ browser: 1, terminal: 2, paint: 3 })
  const zTop = useRef(3)
  const focusWindow = useCallback((id: 'browser' | 'terminal' | 'paint') => {
    zTop.current += 1
    setZOrder(prev => (prev[id] === zTop.current ? prev : { ...prev, [id]: zTop.current }))
  }, [])

  // Auto-focus the terminal when it scrolls into view; blur when it leaves so
  // we don't hijack keyboard scrolling when the user isn't looking at it.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) inputRef.current?.focus({ preventScroll: true })
        else inputRef.current?.blur()
      },
      { threshold: 0.1 }
    )
    if (inputRef.current) observer.observe(inputRef.current)
    return () => observer.disconnect()
  }, [])

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (!commandInput) return
      const lower = commandInput.toLowerCase()
      let completions: string[] = []

      if (lower.startsWith('cat ')) {
        const arg = lower.slice(4)
        const files = VFS[activeTab]?.map(f => f.file) ?? []
        completions = files.filter(f => f.startsWith(arg)).map(f => 'cat ' + f)
      } else if (lower.startsWith('cd ')) {
        const arg = lower.slice(3)
        const dirs = ['books', 'music', 'play', 'shelf', 'now']
        completions = dirs.filter(d => d.startsWith(arg)).map(d => 'cd ' + d)
      } else {
        completions = ALL_COMMANDS.filter(c => c.startsWith(lower))
      }

      if (completions.length === 1) {
        setCommandInput(completions[0])
      } else if (completions.length > 1) {
        let prefix = completions[0]
        for (let i = 1; i < completions.length; i++) {
          let j = 0
          while (j < prefix.length && j < completions[i].length && prefix[j] === completions[i][j]) j++
          prefix = prefix.slice(0, j)
        }
        if (prefix.length > commandInput.length) {
          setCommandInput(prefix)
        } else {
          const output = completions.map(c => {
            if (c.startsWith('cat ') && commandInput.startsWith('cat ')) return c.slice(4)
            if (c.startsWith('cd ') && commandInput.startsWith('cd ')) return c.slice(3)
            return c.trim()
          }).join('  ')
          setHistory(prev => {
            const next = [...prev, { cmd: commandInput, output }]
            persistHistory(next)
            return next
          })
        }
      }
      return
    }

    if (e.key === 'Enter') {
      const cmd = commandInput.trim()
      if (!cmd) return

      let output: React.ReactNode = ''
      const lowerCmd = cmd.toLowerCase()

      if (lowerCmd === 'help') {
        output = [
          'Available commands:',
          '  help, clear, ls, cd <dir>, cat <file>, pwd',
          '  resume, contact, whoami, uptime',
          '  sudo, echo, ping, coffee, flip, unflip, rm -rf /',
          '  scanline [on|off|toggle]',
          '',
          'Directories: books  music  play',
          'Tip: type "ls" to list files, "cat <file>.md" to read one.',
        ].join('\n')
      } else if (lowerCmd === 'clear') {
        const cleared: HistoryEntry[] = []
        setHistory(cleared)
        persistHistory(cleared)
        setCommandInput('')
        return
      } else if (lowerCmd === 'pwd') {
        output = `~/jjz/personal/${activeTab}`
      } else if (lowerCmd === 'cd ..' || lowerCmd === 'cd ~') {
        output = '~/jjz/personal'
      } else if (lowerCmd.startsWith('cd ')) {
        const target = lowerCmd.slice(3).trim()
        if (target === 'books' || target === 'shelf') {
          setActiveTab('books')
          output = 'cd ~/jjz/personal/books'
        } else if (target === 'music' || target === 'now') {
          setActiveTab('music')
          output = 'cd ~/jjz/personal/music'
        } else if (target === 'play') {
          setActiveTab('play')
          output = 'cd ~/jjz/personal/play'
        } else {
          output = `cd: no such file or directory: ${target}\nAvailable directories: books  music  play`
        }
      } else if (lowerCmd === 'ls') {
        const vfsFiles = VFS[activeTab]
        const dirEmoji = activeTab === 'books' ? '📚' : activeTab === 'music' ? '♫' : '◈'
        output = `${dirEmoji} ${activeTab}/\n${vfsFiles.map(f => '  ' + f.file).join('\n')}`
      } else if (lowerCmd.startsWith('cat ')) {
        const arg = lowerCmd.slice(4).trim()
        const vfsFiles = VFS[activeTab] ?? []
        const entry = vfsFiles.find(f => f.file === arg || f.file === arg + '.md')
        if (entry) output = entry.summary
        else output = `cat: ${arg}: No such file in current directory\nRun "ls" to list available files.`
      } else if (lowerCmd === 'cat') {
        output = <pre className="font-mono text-xs leading-tight mt-1">{`
          ——————
         ╱ ＞　　 フ
        |   _  _1
       ╱ \\\` ミ_xノ
      /        |
      /   |    J
   __|     \\ \\ \\
  ╱ _|     | | |
 | (_ \\____\\_),_)
  \\__)`}</pre>
      } else if (lowerCmd === 'resume') {
        window.open(BIO.resumeUrl, '_blank')
        output = 'Opening resume...'
      } else if (lowerCmd === 'contact') {
        output = "Let's connect! Check the footer for my social links."
      } else if (lowerCmd === 'whoami') {
        output = 'Jason Jiayu Zhang — Designer & Engineer'
      } else if (lowerCmd.startsWith('sudo ')) {
        output = 'User is not in the sudoers file. This incident will be reported.'
      } else if (lowerCmd === 'sudo') {
        output = 'usage: sudo command'
      } else if (lowerCmd.startsWith('echo ')) {
        output = cmd.slice(5)
      } else if (lowerCmd === 'echo') {
        output = ''
      } else if (lowerCmd === 'ping') {
        output = 'PONG'
      } else if (lowerCmd === 'coffee') {
        output = <span>Let's chat! Schedule a time here: <br /><a href="https://calendar.app.google/Vp2ioxnPTR66xhUo6" target="_blank" rel="noreferrer" className="text-gold hover:underline">https://calendar.app.google/Vp2ioxnPTR66xhUo6</a></span>
      } else if (lowerCmd === 'uptime') {
        const secs = Math.floor((Date.now() - uptimeStart) / 1000)
        output = `up ${secs} seconds`
      } else if (lowerCmd === 'rm -rf /') {
        output = "Permission denied: Please don't delete my portfolio."
      } else if (lowerCmd === 'flip') {
        output = '(╯°□°）╯︵ ┻━┻'
      } else if (lowerCmd === 'unflip') {
        output = '┬─┬ ノ( ゜-゜ノ)'
      } else if (lowerCmd === 'sysinfo') {
        output = 'JasonOS v1.0.0\nType "help" for a list of available commands.'
      } else if (lowerCmd === 'scanline toggle' || lowerCmd === 'scanlines') {
        toggleScanline()
        output = !scanlineActive
          ? 'Scanline overlay enabled. Retro CRT filter active.'
          : 'Scanline overlay disabled. Clean visual filter active.'
      } else if (lowerCmd === 'scanline off') {
        setScanlineActive(false)
        output = 'Scanline overlay disabled. Clean visual filter active.'
      } else if (lowerCmd === 'scanline on') {
        setScanlineActive(true)
        output = 'Scanline overlay enabled. Retro CRT filter active.'
      } else if (lowerCmd === 'scanline') {
        output = `Scanline overlay is currently ${scanlineActive ? 'ON' : 'OFF'}.\nUsage: scanline [on|off|toggle]`
      } else {
        output = `command not found: ${cmd}`
      }

      setHistory(prev => {
        const next = [...prev, { cmd, output }]
        persistHistory(next)
        return next
      })
      setCommandInput('')
    }
  }

  const readingNow = BOOKSHELF.find(b => b.status === 'reading')

  return (
    <PanelShell
      accent={accent}
      eyebrow="PERSONAL CATALOG"
      meta={`~/jjz/personal`}
      title={
        <p className="font-mono text-xs text-parchment/60 leading-snug max-w-xl mt-1">
          Off-hours registry — what I'm reading, hearing, and playing. The shell is real; type{' '}
          <span className="text-gold/80">help</span> and poke around.
        </p>
      }
      rail={
        <TelemetryRail
          accent={accent}
          items={[
            { label: 'Reading', value: readingNow ? readingNow.title : '—' },
            { label: 'Playlist', value: String(ROTATIONS.length).padStart(2, '0') },
            { label: 'Playing', value: PLAYGROUND.map(g => g.title).slice(0, 1).join('') },
          ]}
        />
      }
    >
      <AnimatedElement delay={GROUP_META} fill className="flex-1 min-h-0">
        <div className="relative h-full min-h-0 grid grid-cols-1 lg:grid-rows-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)] gap-5 lg:gap-6">
          {/* Registers as a browser window — one tab at a time, synced to the shell */}
          <DraggableWindow z={zOrder.browser} onFocus={() => focusWindow('browser')}>
            <CatalogBrowser
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              accent={accent}
              counts={{ books: BOOKSHELF.length, music: ROTATIONS.length, play: PLAYGROUND.length }}
            >
              {activeTab === 'books' && (
                <div className="space-y-3">
                  {BOOKS_BY_CATEGORY.map(([category, books]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-[9px] tracking-label uppercase shrink-0" style={{ color: accent }}>{category}</span>
                        <span className="h-px flex-1 bg-accent/15" />
                        <span className="font-mono text-[9px] text-parchment/30 shrink-0">{String(books.length).padStart(2, '0')}</span>
                      </div>
                      <div className="space-y-1.5">
                        {books.map((book) => (
                          <div key={book.title} className="flex items-start gap-2 group cursor-default">
                            <span
                              className="font-mono text-xs shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-125"
                              style={{ color: STATUS_COLORS[book.status] }}
                            >
                              {STATUS_ICONS[book.status]}
                            </span>
                            <div className="min-w-0">
                              <p className="font-mono text-xs text-parchment/75 leading-tight">{book.title}</p>
                              <p className="font-mono text-[10px] text-parchment/45 mt-0.5">{book.author}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'music' && (
                <div className="space-y-0">
                  {ROTATIONS.map((track, i) => (
                    <div
                      key={`${track.artist}-${track.note}`}
                      className="flex items-center gap-2 py-1.5 border-b border-accent/10 last:border-b-0 group cursor-default"
                    >
                      <span className="font-mono text-[10px] text-parchment/40 w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex items-end gap-0.5 h-3 shrink-0">
                        {[3, 5, 2, 4, 6].map((h, j) => (
                          <div
                            key={j}
                            className={`w-0.5 bg-gold/30 group-hover:bg-gold/60 rounded-full ${i === 0 ? 'waveform-bar' : ''}`}
                            style={{
                              height: `${h * 2}px`,
                              transition: 'background-color 0.25s ease',
                              animationDuration: i === 0 ? `${0.7 + (j % 4) * 0.22}s` : undefined,
                              animationDelay: i === 0 ? `${j * 0.09}s` : undefined,
                            }}
                          />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans font-medium text-xs text-parchment/75 leading-tight truncate">{track.note}</p>
                        <p className="font-mono text-[10px] text-parchment/45">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'play' && (
                <div className="space-y-3.5">
                  {PLAYGROUND.map((game) => (
                    <div key={game.id} className="cursor-default">
                      <div className="flex items-baseline gap-1.5 mb-1.5 pb-1 border-b border-accent/10">
                        <span className="font-mono text-[10px]" style={{ color: accent }}>{game.id}</span>
                        <p className="font-sans font-semibold text-xs leading-tight" style={{ color: accent }}>{game.title}</p>
                      </div>
                      <dl className="grid grid-cols-[minmax(0,6.5rem)_1fr] gap-x-2 gap-y-1 pl-5">
                        {game.specs.map((s) => (
                          <React.Fragment key={s.label}>
                            <dt className="font-mono text-[9px] tracking-label uppercase text-parchment/40 leading-snug">{s.label}</dt>
                            <dd className="min-w-0 font-mono text-[10px] text-parchment/70 leading-snug">
                              {s.value}
                              {s.sublabel && <span className="text-parchment/35"> · {s.sublabel}</span>}
                            </dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </CatalogBrowser>
          </DraggableWindow>

          {/* Live terminal */}
          <DraggableWindow z={zOrder.terminal} onFocus={() => focusWindow('terminal')} className="min-h-[200px]">
            <InteractiveTerminalPrompt
              history={history}
              commandInput={commandInput}
              setCommandInput={setCommandInput}
              handleCommand={handleCommand}
              inputRef={inputRef}
              className="h-full"
            />
          </DraggableWindow>

          {/* Mini paint */}
          <DraggableWindow z={zOrder.paint} onFocus={() => focusWindow('paint')} className="min-h-[220px]">
            <MiniPaint className="h-full" />
          </DraggableWindow>
        </div>
      </AnimatedElement>
    </PanelShell>
  )
}
