import React, { useState, useRef, useEffect, useCallback } from 'react'
import { TIMELINE, BELIEFS, BOOKSHELF, ROTATIONS, PLAYGROUND, EDUCATION, WHEEL_SECTIONS } from '../data/about'
import type { TimelineEntry, Belief, BookEntry } from '../data/about'
import { useScanline } from './ScanlineContext'
import { BIO, STATUS_CYCLE } from '../data/portfolio'

// ── Section accent colors ───────────────────────────────────────────────────
// Single source of truth so each panel's own chrome (headers, accent lines,
// glows) stays tied to the same color the wheel shows for that section.
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
// Mirrors the hero's original stagger pattern: content clusters into a few
// large groups instead of cascading individually.
export const GROUP_HEADER = 0
export const GROUP_META = 90
export const GROUP_CTA = 180

// ── Animated Element Wrapper ───────────────────────────────────────────────
interface AnimatedElementProps {
  delay: number
  children: React.ReactNode
  className?: string
}

export function AnimatedElement({ delay, children, className = '' }: AnimatedElementProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`${className}`}>
      <div
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
    display: 'block'
  }

  return (
    <span className="font-mono text-xs text-parchment/70 overflow-hidden block min-h-[1.2em]">
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
      <span className="text-parchment/70 group-hover:text-parchment transition-colors duration-200">
        {children}
      </span>
      <span
        className="absolute -bottom-px left-0 right-0 h-px bg-parchment/50"
        style={{
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        data-underline
      />
      <style>{`
        a:hover [data-underline] { transform: scaleX(1) !important; }
      `}</style>
    </a>
  )
}

// ─── Timeline entry row ───────────────────────────────────────────────────────
function TimelineRow({ entry, index }: { entry: TimelineEntry; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="group border-b border-accent/20 last:border-b-0"
      style={{
        paddingTop: '14px',
        paddingBottom: '14px',
        transition: 'padding 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <button
        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-mono text-xs text-parchment/65 w-5 text-right">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs tracking-label text-parchment/65 truncate max-w-[130px] sm:max-w-none sm:whitespace-nowrap">
              {entry.period}
            </span>
          </div>

          <div className="flex-1 min-w-0 pl-8">
            <p className="font-sans font-semibold text-sm text-parchment leading-snug" style={{ letterSpacing: '-0.02em' }}>
              {entry.role}
            </p>
            <p className="font-mono text-xs text-gold/88 mt-0.5">{entry.org}</p>
          </div>
        </div>

        <span
          className="font-mono text-sm text-parchment/65 group-hover:text-[var(--row-accent)] flex-shrink-0 mt-0.5 transition-colors duration-200"
          style={{
            '--row-accent': SECTION_ACCENTS.trajectory,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease',
          } as React.CSSProperties}
        >
          +
        </span>
      </button>

      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="overflow-hidden">
          <div className="pt-3 pl-8 space-y-2 pb-2">
            <p className="font-mono text-xs text-parchment/65 leading-relaxed">{entry.detail}</p>
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs tracking-label px-1.5 py-0.5 border border-accent/30 text-parchment/70 rounded-sm"
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

// ─── Belief block ─────────────────────────────────────────────────────────────
function BeliefBlock({
  belief, active, onHover, onLeave,
}: { belief: Belief; active: boolean; onHover: () => void; onLeave: () => void }) {
  return (
    <div
      className="relative py-5 border-b border-accent/20 last:border-b-0 cursor-default"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{
          background: active
            ? `linear-gradient(to bottom, transparent, ${SECTION_ACCENTS.philosophy}, transparent)`
            : 'linear-gradient(to bottom, transparent, #a39d7b, transparent)',
          opacity: active ? 0.7 : 0,
          transition: 'opacity 0.2s ease, background 0.2s ease',
        }}
      />

      <div className="pl-4">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="font-mono text-xs text-parchment/65 inline-block"
            style={{
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transformOrigin: 'left center',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {belief.index}
          </span>
          <div
            className="h-px flex-1"
            style={{
              background: 'linear-gradient(90deg, rgba(163,157,123,0.4), transparent)',
              width: active ? '100%' : '24px',
              maxWidth: active ? '80px' : '24px',
              transition: 'max-width 0.2s ease',
            }}
          />
        </div>
        <h3
          className="font-sans font-bold text-sm text-parchment leading-tight mb-2"
          style={{
            letterSpacing: '-0.025em',
            color: active ? '#fff' : '#cfccbb',
            transition: 'color 0.2s ease',
          }}
        >
          {belief.headline}
        </h3>
        <p
          className="font-mono text-xs leading-loose"
          style={{
            color: active ? 'rgba(207,204,187,0.85)' : 'rgba(207,204,187,0.65)',
            transition: 'color 0.2s ease',
          }}
        >
          {belief.body}
        </p>
      </div>
    </div>
  )
}

// ─── Beliefs list — auto-cycles the active block, hover takes over instantly ──
function BeliefsList() {
  const [activeIndex, setActiveIndex] = useState(0)
  const pausedRef = useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => {
      if (pausedRef.current) return
      setActiveIndex((prev) => (prev + 1) % BELIEFS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <div>
      <div className="space-y-0">
        {BELIEFS.map((belief, i) => (
          <BeliefBlock
            key={belief.index}
            belief={belief}
            active={i === activeIndex}
            onHover={() => {
              pausedRef.current = true
              setActiveIndex(i)
            }}
            onLeave={() => {
              pausedRef.current = false
            }}
          />
        ))}
      </div>

      {/* Progress indicator — shows which belief is active in the auto-cycle */}
      <div className="flex items-center gap-1.5 mt-4">
        {BELIEFS.map((belief, i) => (
          <div key={belief.index} className="h-0.5 flex-1 rounded-full overflow-hidden bg-accent/20">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: SECTION_ACCENTS.philosophy,
                transform: i === activeIndex ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left center',
                opacity: i === activeIndex ? 0.9 : 0,
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Terminal list ─────────────────────────────────────────────────────────────
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

function TerminalSection({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-accent/20">
        <span className="font-mono text-xs text-gold/88">›</span>
        <span className="font-mono text-xs tracking-label text-gold/88 uppercase">{label}</span>
      </div>
      {children}
    </div>
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

// ─── Virtual file system for ls / cat ──────────────────────────────────────────────
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

// ─── Session-persistent history helpers ─────────────────────────────────────────
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
  'sysinfo', 'scanline', 'scanline on', 'scanline off', 'scanline toggle'
];

// ─── Typewriter reveal — used by playground spec values on entry change ──────
function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [count, setCount] = useState(text.length)

  useEffect(() => {
    setCount(0)
    if (!text) return
    const stepMs = Math.max(8, 300 / text.length)
    let i = 0
    const interval = setInterval(() => {
      i++
      setCount(i)
      if (i >= text.length) clearInterval(interval)
    }, stepMs)
    return () => clearInterval(interval)
  }, [text])

  return <span className={className}>{text.slice(0, count)}</span>
}

function InteractiveTerminalPrompt({
  history,
  commandInput,
  setCommandInput,
  handleCommand,
  inputRef,
}: {
  history: Array<{ cmd: string, output: React.ReactNode }>;
  commandInput: string;
  setCommandInput: (val: string) => void;
  handleCommand: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const historyEndRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (historyEndRef.current && historyEndRef.current.parentElement) {
      const parent = historyEndRef.current.parentElement;
      parent.scrollTo({
        top: parent.scrollHeight,
        behavior: isInitialMount.current ? 'auto' : 'smooth'
      });
      isInitialMount.current = false;
    }
  }, [history])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setCommandInput(history[nextIndex].cmd);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= history.length) {
          setHistoryIndex(-1);
          setCommandInput('');
        } else {
          setHistoryIndex(nextIndex);
          setCommandInput(history[nextIndex].cmd);
        }
      }
    } else {
      if (e.key === 'Enter') {
        setHistoryIndex(-1);
      }
      handleCommand(e);
    }
  };

  return (
    <div className="mt-8 flex flex-col border border-accent/20 rounded-md overflow-hidden bg-[#0b0c10]/40 backdrop-blur-lg shadow-sm">
        <div className="flex items-center px-3 py-1.5 border-b border-accent/20 bg-accent/5">
          <div className="flex gap-1.5 w-[36px] shrink-0">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
            <div className={`w-2 h-2 rounded-full bg-green-400/60 ${isFocused ? 'animate-pulse' : ''}`} />
          </div>
          <div className="flex-1 text-center font-mono text-xs text-parchment/65 uppercase tracking-widest">
            bash
          </div>
          <div className="w-[36px] shrink-0" />
        </div>

        <div className="p-3 flex flex-col gap-2">
          {history.length > 0 && (
            <div className="thin-scrollbar space-y-2 max-h-[200px] sm:max-h-[320px] overflow-y-auto pr-2">
              {history.map((h, i) => (
                <div key={i} className="space-y-1" style={{ animation: 'fadeIn 0.2s ease both' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-gold/88">›_</span>
                    <span className="font-mono text-xs text-parchment/70">{h.cmd}</span>
                  </div>
                  {h.output && (
                    <div className="font-mono text-xs text-parchment/70 pl-4 whitespace-pre-wrap">
                      {h.output}
                    </div>
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
            <span
              className="font-mono text-xs flex-1 whitespace-pre-wrap break-all pointer-events-none select-none"
              aria-hidden
            >
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 0 — Description ("Behind the Pixels")
// ═════════════════════════════════════════════════════════════════════════════
interface DescriptionImage {
  src: string
  alt: string
  /** Small resting rotation + vertical offset — the "slight misalignment" of a hand-placed photo row */
  rotateDeg: number
  offsetY: number
  objectClassName: string
}

const DESCRIPTION_IMAGES: DescriptionImage[] = [
  {
    src: '/images/jason-headshot-1.webp',
    alt: 'Jason Portrait',
    rotateDeg: -3,
    offsetY: 0,
    objectClassName: 'object-top',
  },
  {
    src: '/images/jason-headshot-2.webp',
    alt: 'Jason at work',
    rotateDeg: 2,
    offsetY: -8,
    objectClassName: 'object-[center_30%]',
  },
  {
    src: '/images/jason-thinking.webp',
    alt: 'Jason thinking',
    rotateDeg: -2,
    offsetY: 6,
    objectClassName: 'object-center',
  },
  {
    src: '/images/jason-solemn.webp',
    alt: 'Jason, solemn portrait',
    rotateDeg: 3,
    offsetY: -4,
    objectClassName: 'object-center',
  },
]

// The hero wheel dwells on each section for 15s (see HeroSection's
// AUTO_ADVANCE_MS) — split that evenly across however many portraits there
// are so the color highlight has cycled through all of them once per visit.
const IMAGE_CYCLE_MS = 15000 / DESCRIPTION_IMAGES.length

export function DescriptionPanel() {
  const { scanlineActive } = useScanline()
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [hoveredImageIdx, setHoveredImageIdx] = useState<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (DESCRIPTION_IMAGES.length <= 1 || prefersReducedMotion) return
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % DESCRIPTION_IMAGES.length)
    }, IMAGE_CYCLE_MS)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <div className="flex flex-col">
      <AnimatedElement delay={GROUP_HEADER}>
        <div className="label-caps mb-2 flex items-center gap-2" style={{ color: SECTION_ACCENTS.description }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" />
          BEHIND THE PIXELS
        </div>
        <h2
          className="font-sans font-black text-parchment leading-tight mb-6"
          style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.2rem)', letterSpacing: '-0.04em' }}
        >
          I'm Jason, a{' '}
          <span className="text-gold">
            design engineer
          </span>{' '}
          who believes the ideal digital experiences live at the intersection of systems and craft.
        </h2>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_META} className="mb-6">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs text-parchment/65 leading-relaxed">
            My work is driven by a curiosity for how systems, and teams, operate. Whether architecting a front-end component library or detailing micro-interactions, I make it a priority to understand the workflows and constraints of my engineering and product partners. By designing the collaboration as intentionally as the interface, I streamline how we design and ship together.
          </p>
          <p className="font-mono text-xs text-parchment/65 leading-relaxed">
            Beyond the editor, I'm deeply invested in coordination in all its forms, whether calling tactical plays as an In-Game Leader, organizing design events as a Figma Campus Leader, or mentoring student designers. I thrive in environments where collective effort meets structured play. The best leadership is simply about building a path so others can execute.
          </p>
        </div>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_META} className="mb-8">
        <div className="flex flex-wrap gap-6 pt-6 pb-4 border-t border-b border-accent/20">
          <div className="group flex flex-col gap-1.5 cursor-default">
            <span className="font-mono text-xs text-gold uppercase tracking-wider">Location</span>
            <span className="font-mono text-xs text-parchment/70 group-hover:text-parchment/90 transition-colors duration-200">Davis, CA</span>
          </div>
          <div className="w-px h-8 bg-accent/20 hidden sm:block" />
          <div className="group flex flex-col gap-1.5 cursor-default">
            <span className="font-mono text-xs text-gold uppercase tracking-wider">Class</span>
            <span className="font-mono text-xs text-parchment/70 group-hover:text-parchment/90 transition-colors duration-200">Design Engineer</span>
          </div>
          <div className="w-px h-8 bg-accent/20 hidden sm:block" />
          <div className="group flex flex-col gap-1.5 cursor-default">
            <span className="font-mono text-xs text-gold uppercase tracking-wider">Status</span>
            <RotatingStatusText />
          </div>
        </div>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_CTA}>
        <div className="relative w-full mx-auto flex items-center justify-center py-8 px-3 sm:px-2 lg:px-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] text-accent/40 z-0 select-none">
            ASSET_SYS_READY
          </div>

          {DESCRIPTION_IMAGES.map((img, i) => {
            const isActive = i === activeImageIdx
            const isHovered = hoveredImageIdx === i
            // Stacking priority: 1) hovered photo, 2) the auto-cycling active photo, 3) original array order
            const zIndex = isHovered ? 60 : isActive ? 45 : 10 + i
            const flatten = isHovered || isActive
            const scale = isHovered ? 1.08 : isActive ? 1.05 : 1

            return (
              <div
                key={img.src}
                className={`group relative flex-1 min-w-0 aspect-[3/4] p-1 border backdrop-blur-sm ${i === 0 ? '' : '-ml-2 sm:-ml-3'} ${
                  isActive ? 'glow-pulse border-gold/60 bg-[#0b0c10]/90' : 'border-accent/30 bg-[#0b0c10]/80 shadow-xl'
                }`}
                style={{
                  zIndex,
                  transform: `translateY(${flatten ? 0 : img.offsetY}px) rotate(${flatten ? 0 : img.rotateDeg}deg) scale(${scale})`,
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
                  ...(isActive ? { '--glow-color': `${SECTION_ACCENTS.description}80` } as React.CSSProperties : {}),
                }}
                onMouseEnter={() => setHoveredImageIdx(i)}
                onMouseLeave={() => setHoveredImageIdx(null)}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading={isActive ? 'eager' : 'lazy'}
                    className={`w-full h-full object-cover ${img.objectClassName} contrast-125 group-hover:saturate-100 group-hover:brightness-100 ${isActive ? 'saturate-100 brightness-100' : 'saturate-[0.35] brightness-[0.7]'}`}
                    style={{ transition: 'filter 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-0 ${isActive ? 'opacity-0' : scanlineActive ? 'opacity-100' : 'opacity-30'}`}
                    style={{
                      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                      backgroundSize: '100% 4px, 3px 100%'
                    }}
                  />
                </div>
              </div>
            )
          })}

          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/50 z-50 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-accent/50 z-50 pointer-events-none" />
          <div className="absolute bottom-2 right-2 font-mono text-[9px] text-accent/50 z-50 pointer-events-none select-none">
            {String(activeImageIdx + 1).padStart(2, '0')}/{String(DESCRIPTION_IMAGES.length).padStart(2, '0')}
          </div>
        </div>
      </AnimatedElement>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 1 — Trajectory
// ═════════════════════════════════════════════════════════════════════════════
export function TrajectoryPanel() {
  return (
    <div className="flex flex-col">
      <AnimatedElement delay={GROUP_HEADER} className="mb-8">
        <div className="flex items-start gap-3">
          <div className="w-0.5 h-10 mt-1 flex-shrink-0" style={{ backgroundColor: SECTION_ACCENTS.trajectory }} />
          <div>
            <div className="label-caps mb-2" style={{ color: SECTION_ACCENTS.trajectory }}>TRAJECTORY</div>
            <h2
              className="font-sans font-black text-parchment leading-none mb-3"
              style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', letterSpacing: '-0.04em' }}
            >
              Design × Engineering
            </h2>
            <p className="font-mono text-xs text-parchment/70 leading-relaxed">
              {EDUCATION.note}
            </p>
          </div>
        </div>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_META} className="mb-8">
        <div className="flex flex-wrap gap-2">
          {EDUCATION.degrees.map((d) => (
            <div
              key={d}
              className="px-2 pt-0 pb-1 border border-accent/30 rounded-sm transition-colors duration-200 cursor-default"
              style={{ background: 'rgba(56,64,106,0.15)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${SECTION_ACCENTS.trajectory}80`
                e.currentTarget.style.background = 'rgba(56,64,106,0.28)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.background = 'rgba(56,64,106,0.15)'
              }}
            >
              <span className="font-mono text-xs tracking-label text-gold/88">{d}</span>
            </div>
          ))}
        </div>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_META} className="mb-8">
        <div className="label-caps mb-3 opacity-90">RAPID PROTOTYPING STACK</div>
        <div className="flex flex-wrap gap-1.5 bg-surface/5 border-l-2 border-accent/25 pl-3 pr-2 py-2 rounded-r-sm">
          {EDUCATION.tools.map((tool) => (
            <span
              key={tool}
              className="font-mono text-xs px-2 py-0.5 border border-accent/25 text-parchment/70 rounded-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_CTA} className="mb-8">
        <div className="label-caps mb-4 opacity-90">EXPERIENCE</div>
        <div className="space-y-0">
          {TIMELINE.map((entry, i) => (
            <TimelineRow key={`${entry.org}-${entry.role}`} entry={entry} index={i} />
          ))}
        </div>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_CTA}>
        <div className="pt-6 border-t border-accent/20">
          <AnchorLine href={BIO.resumeUrl}>
            <span className="font-mono text-xs tracking-label uppercase text-gold/88 group-hover:text-gold transition-colors inline-flex items-center gap-1">
              View Full Resume
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </span>
          </AnchorLine>
        </div>
      </AnimatedElement>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 2 — Philosophy
// ═════════════════════════════════════════════════════════════════════════════
export function PhilosophyPanel() {
  return (
    <div className="flex flex-col">
      <AnimatedElement delay={GROUP_HEADER} className="mb-8">
        <div className="label-caps mb-2" style={{ color: SECTION_ACCENTS.philosophy }}>PHILOSOPHY</div>
        <h2
          className="font-sans font-black text-parchment leading-none mb-3"
          style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', letterSpacing: '-0.04em' }}
        >
          Human-First.
          <br />
          <span className="text-gold" style={{ textShadow: `0 0 20px ${SECTION_ACCENTS.philosophy}33` }}>Always.</span>
        </h2>
        <p className="font-mono text-xs text-parchment/70 leading-relaxed">
          Servant leadership. Authentic community. Real products. The following principles aren't just values in a list. They're operating constraints for my entire design journey.
        </p>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_META}>
        <BeliefsList />
      </AnimatedElement>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WHEEL SLOT 3 — Catalog (Terminal Interface)
// ═════════════════════════════════════════════════════════════════════════════
const TAB_ORDER: Array<'books' | 'music' | 'play'> = ['books', 'music', 'play']
// The hero wheel ambiently auto-advances to the next section every 15s (see
// HeroSection's AUTO_ADVANCE_MS) — each catalog tab gets an equal 1/3 slice
// of that window so all 3 have been shown by the time the wheel moves on.
const TAB_CYCLE_MS = 5000

export function CatalogPanel() {
  const [activeTab, setActiveTab] = useState<'books' | 'music' | 'play'>('books')
  const [activeGameId, setActiveGameId] = useState<string>('01')
  const [history, setHistory] = useState<Array<{ cmd: string, output: React.ReactNode }>>(
    () => loadHistory()
  )
  const [commandInput, setCommandInput] = useState('')
  const [uptimeStart] = useState(() => Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const { scanlineActive, setScanlineActive, toggleScanline } = useScanline()

  // ── AMBIENT TAB CYCLE ──────────────────────────────────────────────────
  // Auto-rotates shelf → now → play. Clicking a tab doesn't stop the cycle —
  // it just resets the timer, so the manually-picked tab gets the full
  // dwell time before cycling continues.
  const tabCycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeTabRef = useRef(activeTab)

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  const resetTabCycle = useCallback(() => {
    if (tabCycleTimerRef.current) clearInterval(tabCycleTimerRef.current)
    tabCycleTimerRef.current = setInterval(() => {
      const nextIdx = (TAB_ORDER.indexOf(activeTabRef.current) + 1) % TAB_ORDER.length
      setActiveTab(TAB_ORDER[nextIdx])
    }, TAB_CYCLE_MS)
  }, [])

  useEffect(() => {
    resetTabCycle()
    return () => {
      if (tabCycleTimerRef.current) clearInterval(tabCycleTimerRef.current)
    }
  }, [resetTabCycle])

  // Auto-focus the terminal when it scrolls into view, and blur when it leaves
  // so we don't hijack keyboard scrolling when the user isn't looking at it.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          inputRef.current?.focus({ preventScroll: true })
        } else {
          inputRef.current?.blur()
        }
      },
      { threshold: 0.1 }
    )

    if (inputRef.current) {
      observer.observe(inputRef.current)
    }

    return () => observer.disconnect()
  }, [activeTab])

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!commandInput) return;
      const lower = commandInput.toLowerCase();
      let completions: string[] = [];

      if (lower.startsWith('cat ')) {
        const arg = lower.slice(4);
        const files = VFS[activeTab]?.map(f => f.file) ?? [];
        completions = files.filter(f => f.startsWith(arg)).map(f => 'cat ' + f);
      } else if (lower.startsWith('cd ')) {
        const arg = lower.slice(3);
        const dirs = ['books', 'music', 'play', 'shelf', 'now'];
        completions = dirs.filter(d => d.startsWith(arg)).map(d => 'cd ' + d);
      } else {
        completions = ALL_COMMANDS.filter(c => c.startsWith(lower));
      }

      if (completions.length === 1) {
        setCommandInput(completions[0]);
      } else if (completions.length > 1) {
        let prefix = completions[0];
        for (let i = 1; i < completions.length; i++) {
          let j = 0;
          while (j < prefix.length && j < completions[i].length && prefix[j] === completions[i][j]) {
            j++;
          }
          prefix = prefix.slice(0, j);
        }

        if (prefix.length > commandInput.length) {
          setCommandInput(prefix);
        } else {
          const output = completions.map(c => {
            if (c.startsWith('cat ') && commandInput.startsWith('cat ')) return c.slice(4);
            if (c.startsWith('cd ') && commandInput.startsWith('cd ')) return c.slice(3);
            return c.trim();
          }).join('  ');

          setHistory(prev => {
            const next = [...prev, { cmd: commandInput, output }];
            persistHistory(next);
            return next;
          });
        }
      }
      return;
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
        if (entry) {
          output = entry.summary
        } else {
          output = `cat: ${arg}: No such file in current directory\nRun "ls" to list available files.`
        }
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

  return (
    <div className="flex flex-col">
      <AnimatedElement delay={GROUP_HEADER} className="mb-6">
        <div className="label-caps mb-2" style={{ color: SECTION_ACCENTS.catalog }}>PERSONAL CATALOG</div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 border border-accent/30 rounded-sm mb-4"
          style={{ background: 'rgba(28,32,53,0.8)' }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <div className="w-2 h-2 rounded-full bg-green-400/60" />
          <div className="flex-1" />
          <span className="font-mono text-xs text-parchment/65">~/jjz/personal</span>
        </div>

        <div className="relative flex border border-accent/25 rounded-sm overflow-hidden">
          {(['books', 'music', 'play'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setCommandInput('')
                resetTabCycle()
              }}
              className="relative z-10 flex-1 py-1.5 font-mono text-xs tracking-label uppercase transition-colors duration-200"
              style={{
                color: activeTab === tab ? '#cfccbb' : 'rgba(207,204,187,0.65)',
                borderRight: tab !== 'play' ? '1px solid rgba(56,64,106,0.25)' : undefined,
              }}
            >
              <span className="sm:hidden">{tab === 'books' ? '📚' : tab === 'music' ? '♫' : '◈'}</span>
              <span className="hidden sm:inline">{tab === 'books' ? '📚 shelf' : tab === 'music' ? '♫ now' : '◈ play'}</span>
            </button>
          ))}
          {/* Sliding underline indicator */}
          <div
            className="absolute bottom-0 left-0 h-0.5 w-1/3"
            style={{
              backgroundColor: SECTION_ACCENTS.catalog,
              transform: `translateX(${TAB_ORDER.indexOf(activeTab) * 100}%)`,
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </AnimatedElement>

      <AnimatedElement delay={GROUP_META}>
        {activeTab === 'books' && (
          <TerminalSection label="The Bookshelf">
            <div className="space-y-1.5">
              {BOOKSHELF.map((book, i) => (
                <div
                  key={book.title}
                  className="flex items-start gap-2.5 py-1.5 px-1 -mx-1 rounded-sm border-b border-accent/10 last:border-b-0 group cursor-default hover:bg-surface/5 transition-colors duration-200"
                  style={{
                    opacity: 1,
                    animation: `fadeIn 0.25s ease ${i * 40}ms both`,
                  }}
                >
                  <span
                    className="font-mono text-xs flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-125"
                    style={{ color: STATUS_COLORS[book.status] }}
                  >
                    {STATUS_ICONS[book.status]}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-parchment/70 leading-tight">
                      {book.title}
                    </p>
                    <p className="font-mono text-xs text-parchment/65 mt-0.5">
                      {book.author}
                      <span className="ml-2">— {book.category}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <InteractiveTerminalPrompt
              history={history}
              commandInput={commandInput}
              setCommandInput={setCommandInput}
              handleCommand={handleCommand}
              inputRef={inputRef}
            />
          </TerminalSection>
        )}

        {activeTab === 'music' && (
          <TerminalSection label="Current Rotations">
            <div className="space-y-0">
              {ROTATIONS.map((track, i) => (
                <div
                  key={track.artist}
                  className="flex items-center justify-between py-2.5 border-b border-accent/10 last:border-b-0 group cursor-default"
                  style={{ animation: `fadeIn 0.25s ease ${i * 35}ms both` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-parchment/65 w-4">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-end gap-0.5 h-3">
                      {[3, 5, 2, 4, 6, 3, 5].map((h, j) => (
                        <div
                          key={j}
                          className={`w-0.5 bg-gold/30 group-hover:bg-gold/60 rounded-full ${i === 0 ? 'waveform-bar' : ''}`}
                          style={{
                            height: `${h * 2}px`,
                            transition: `height 0.25s cubic-bezier(0.22,1,0.36,1) ${j * 25}ms, background-color 0.25s ease`,
                            animationDuration: i === 0 ? `${0.7 + (j % 4) * 0.22}s` : undefined,
                            animationDelay: i === 0 ? `${j * 0.09}s` : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-xs text-parchment/70 leading-none">
                        {track.note}
                      </p>
                      <p className="font-mono text-xs text-parchment/65 mt-0.5">{track.artist}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-parchment/65">♫</span>
                </div>
              ))}
            </div>
            <InteractiveTerminalPrompt
              history={history}
              commandInput={commandInput}
              setCommandInput={setCommandInput}
              handleCommand={handleCommand}
              inputRef={inputRef}
            />
          </TerminalSection>
        )}

        {activeTab === 'play' && (
          <TerminalSection label="The Playground">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/4 shrink-0 flex sm:flex-col gap-4 pt-1 sm:border-r border-accent/10 sm:pr-2 overflow-x-auto">
                {PLAYGROUND.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setActiveGameId(game.id)}
                    className="flex items-start gap-1.5 text-left group w-full cursor-pointer flex-shrink-0"
                  >
                    <span
                      className="font-mono text-xs leading-[1.2] transition-colors duration-200 mt-[1px]"
                      style={{ color: activeGameId === game.id ? '#ebd648' : 'transparent' }}
                    >
                      {'>'}
                    </span>
                    <span
                      className="font-mono text-xs tracking-label uppercase leading-tight transition-colors duration-200"
                      style={{ color: activeGameId === game.id ? '#cfccbb' : 'rgba(207,204,187,0.65)' }}
                    >
                      {game.id} <span>//</span><br />
                      <span>{game.title}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="sm:w-3/4 flex-1 sm:pl-2">
                <div className="space-y-0">
                  {PLAYGROUND.find(g => g.id === activeGameId)?.specs.map((item, i) => (
                    <div
                      key={`${activeGameId}-${item.label}`}
                      className="flex items-start justify-between py-2.5 border-b border-accent/10 last:border-b-0"
                      style={{ animation: `fadeIn 0.25s ease ${i * 30}ms both` }}
                    >
                      <div>
                        <span className="font-mono text-xs tracking-label text-parchment/65 uppercase block">
                          {item.label}
                        </span>
                        <span className={`font-mono text-xs block mt-0.5 ${item.sublabel ? 'text-parchment/65' : 'opacity-0 select-none'}`}>
                          {item.sublabel || '—'}
                        </span>
                      </div>
                      <span
                        className="font-mono text-xs text-right mt-0.5"
                        style={{ color: i === 0 ? '#9cd5f8' : i === 2 ? '#ebd648' : '#cfccbb', opacity: 0.7 }}
                      >
                        <TypewriterText text={item.value} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <InteractiveTerminalPrompt
              history={history}
              commandInput={commandInput}
              setCommandInput={setCommandInput}
              handleCommand={handleCommand}
              inputRef={inputRef}
            />
          </TerminalSection>
        )}
      </AnimatedElement>
    </div>
  )
}
