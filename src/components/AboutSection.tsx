import { useState, useRef, useEffect } from 'react'
import { TIMELINE, BELIEFS, BOOKSHELF, ROTATIONS, PLAYGROUND, EDUCATION } from '../data/about'
import type { TimelineEntry, Belief, BookEntry } from '../data/about'
import { useScanline } from './ScanlineContext'
import { BIO, STATUS_CYCLE } from '../data/portfolio'

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
    transition: animState === 'exit' ? 'transform 0.32s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.25s ease' : animState === 'enter' ? 'none' : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
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
      {/* Center-out underline — expo-out gives a whip-snap reveal */}
      <span
        className="absolute -bottom-px left-0 right-0 h-px bg-parchment/50"
        style={{
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
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
        paddingBottom: open ? '14px' : '14px',
        transition: 'padding 0.35s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <button
        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Left — number + period */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-mono text-xs text-parchment/50 w-5 text-right">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className="font-mono text-xs tracking-label text-parchment/60 whitespace-nowrap"
            >
              {entry.period}
            </span>
          </div>

          {/* Center — role + org */}
          <div className="flex-1 min-w-0 pl-8">
            <p className="font-sans font-semibold text-sm text-parchment leading-snug" style={{ letterSpacing: '-0.02em' }}>
              {entry.role}
            </p>
            <p className="font-mono text-xs text-gold/70 mt-0.5">{entry.org}</p>
          </div>
        </div>

        {/* Right — expand toggle */}
        <span
          className="font-mono text-xs text-parchment/60 flex-shrink-0 mt-0.5"
          style={{
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          +
        </span>
      </button>

      {/* Expandable detail */}
      <div
        className="grid"
        style={{
          gridTemplateRows: open ? '1fr' : '0fr',
          // Expo-out: the grid row snaps open then eases — feels like a physical drawer
          transition: 'grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="overflow-hidden">
          <div className="pt-3 pl-8 space-y-2 pb-2">
            <p className="font-mono text-xs text-parchment/45 leading-relaxed">{entry.detail}</p>
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
function BeliefBlock({ belief }: { belief: Belief }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative py-5 border-b border-accent/20 last:border-b-0 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Vertical index bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(to bottom, transparent, #a39d7b, transparent)',
          opacity: hovered ? 0.6 : 0,
          // Expo-out: the bar whips in instantly, fades out quickly on leave
          transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      <div className="pl-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-parchment/50">{belief.index}</span>
          <div
            className="h-px flex-1"
            style={{
              background: 'linear-gradient(90deg, rgba(163,157,123,0.4), transparent)',
              width: hovered ? '100%' : '24px',
              maxWidth: hovered ? '80px' : '24px',
              transition: 'max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
        <h3
          className="font-sans font-bold text-sm text-parchment leading-tight mb-2"
          style={{
            letterSpacing: '-0.025em',
            color: hovered ? '#fff' : '#cfccbb',
            transition: 'color 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {belief.headline}
        </h3>
        <p
          className="font-mono text-xs leading-relaxed"
          style={{
            color: hovered ? 'rgba(207,204,187,0.6)' : 'rgba(207,204,187,0.35)',
            transition: 'color 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {belief.body}
        </p>
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
  queued: 'rgba(207,204,187,0.25)',
}

function TerminalSection({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      {/* Terminal prompt line */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-accent/20">
        <span className="font-mono text-xs text-gold/50">›</span>
        <span className="font-mono text-xs tracking-label text-gold/70 uppercase">{label}</span>
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
    <div className="mt-8 flex flex-col border border-accent/20 rounded-md overflow-hidden bg-[#0b0c10]/40 backdrop-blur-sm shadow-sm">
      {/* Terminal Header */}
      <div className="flex items-center px-3 py-1.5 border-b border-accent/20 bg-accent/5">
        <div className="flex gap-1.5 w-[36px] shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
          <div className="w-2 h-2 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 text-center font-mono text-xs text-parchment/60 uppercase tracking-widest">
          bash
        </div>
        <div className="w-[36px] shrink-0" />
      </div>

      {/* Terminal Body */}
      <div className="p-3 flex flex-col gap-2">
        {history.length > 0 && (
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(207,204,187,0.2) transparent' }}>
            {history.map((h, i) => (
              <div key={i} className="space-y-1" style={{ animation: 'fadeIn 0.2s ease both' }}>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-gold/50">›_</span>
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
          <span className="font-mono text-xs text-parchment/60">›_</span>
          {/* Inline hint layer — the ghost text behind the visible cursor */}
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
            onBlur={() => {
              // Keep focus if we click somewhere else inside the terminal, but allow blurring if scrolled away
            }}
            className="absolute opacity-0 inset-0 w-full h-full cursor-text"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}

// ─── About Section — Main Export ──────────────────────────────────────────────
export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<'books' | 'music' | 'play'>('books')
  const [activeGameId, setActiveGameId] = useState<string>('01')
  const [history, setHistory] = useState<Array<{ cmd: string, output: React.ReactNode }>>(
    () => loadHistory()
  )
  const [commandInput, setCommandInput] = useState('')
  const [uptimeStart] = useState(() => Date.now())
  const inputRef = useRef<HTMLInputElement>(null)
  const { scanlineActive, setScanlineActive, toggleScanline } = useScanline()


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
        // Find longest common prefix
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
          // If we already have the longest common prefix, show the possibilities in history
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
        // bare cat — ASCII kitty easter egg
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
        // scanlineActive is current state; after toggle, state flips — report what the new state will be
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
    <section id="about" className="relative py-12 md:py-20 border-t border-accent/25">
      {/* Section header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 px-6 lg:px-10 pb-4 border-b border-accent/20">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="label-caps">FOUNDATIONS /</span>
          <div className="w-px h-4 bg-accent/40" />
          <span className="font-mono text-xs text-parchment/60">ABOUT + BELIEFS + CATALOG</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-parchment/50">{EDUCATION.institution}</span>
          <div className="w-px h-3 bg-accent/30" />
          {EDUCATION.degrees.map((d, i) => (
            <span key={i} className="font-mono text-xs text-parchment/60">{d}</span>
          ))}
        </div>
      </div>

      {/* ── Personal Introduction Module ───────────────────────────────────── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-px border-l border-r border-b border-accent/15 mx-4 sm:mx-6 lg:mx-10"
      >
        {/* Copy Pane */}
        <div className="col-span-1 lg:col-span-2 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 border-b lg:border-b-0 lg:border-r border-accent/20 flex flex-col justify-center">
          <div className="mb-8">
            <div className="label-caps mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" />
              BEHIND THE PIXELS
            </div>
            <h2
              className="font-sans font-black text-parchment leading-tight mb-3"
              style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', letterSpacing: '-0.04em' }}
            >
              I’m Jason, a hybrid <span className="text-gold">design × engineer</span> who believes the ideal digital experiences live at the intersection of rigorous systems and poetic craft.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div>
              <p className="font-mono text-xs text-parchment/50 leading-relaxed">
                My work is driven by a curiosity for how systems, and teams, operate. Whether architecting a front-end component library or detailing micro-interactions, I make it a priority to understand the workflows and constraints of my engineering and product partners. By designing the collaboration as intentionally as the interface, I streamline how we design and ship together.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-parchment/50 leading-relaxed">
                Beyond the editor, I'm deeply invested in coordination in all its forms, whether calling tactical plays as an In-Game Leader, organizing design events as a Figma Campus Leader, or mentoring student designers. I thrive in environments where collective effort meets structured play. The best leadership is simply about clearing the path so others can execute.
              </p>
            </div>
          </div>

          {/* Terminal-like metadata */}
          <div className="mt-8 flex flex-wrap gap-6 pt-6 border-t border-accent/20">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-parchment/60 uppercase tracking-wider">Location</span>
              <span className="font-mono text-xs text-parchment/70">Davis, CA</span>
            </div>
            <div className="w-px h-8 bg-accent/20 hidden sm:block" />
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-parchment/60 uppercase tracking-wider">Class</span>
              <span className="font-mono text-xs text-parchment/70">Design Engineer</span>
            </div>
            <div className="w-px h-8 bg-accent/20 hidden sm:block" />
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-xs text-parchment/60 uppercase tracking-wider">Status</span>
              <RotatingStatusText />
            </div>
          </div>
        </div>

        {/* Imagery Pane */}
        <div className="col-span-1 lg:col-span-1 px-4 sm:px-6 lg:px-8 py-8 lg:py-10 flex flex-col justify-center items-center relative overflow-hidden bg-[#16192b]">
          {/* Subtle dotted background for the image pane */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#cfccbb 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div className="relative w-full max-w-[280px] aspect-[4/5] mx-auto flex items-center justify-center">
            {/* Image 1: Main portrait */}
            <div className="group absolute -top-2 right-0 w-[75%] aspect-[3/4] z-10 p-1 border border-accent/30 bg-[#0b0c10]/80 backdrop-blur-sm shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500" style={{ transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/images/jason-headshot-1.webp"
                  alt="Jason Portrait"
                  className="w-full h-full object-cover object-top grayscale contrast-125 brightness-90 mix-blend-luminosity group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:brightness-100"
                  style={{ transition: 'filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
                {/* Scanline overlay */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0 ${scanlineActive ? 'opacity-100' : 'opacity-30'}`}
                  style={{
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 4px, 3px 100%'
                  }}
                />
              </div>
            </div>

            {/* Image 2: Secondary / Action shot */}
            <div className="group absolute bottom-0 -left-4 w-[65%] aspect-square z-20 p-1 border border-accent/30 bg-[#0b0c10]/80 backdrop-blur-sm shadow-xl transform -rotate-3 hover:rotate-0 hover:z-30" style={{ transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/images/jason-headshot-2.webp"
                  alt="Jason at work"
                  className="w-full h-full object-cover object-[center_30%] grayscale contrast-125 brightness-90 mix-blend-luminosity group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:brightness-100"
                  style={{ transition: 'filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0 ${scanlineActive ? 'opacity-100' : 'opacity-30'}`}
                  style={{
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 4px, 3px 100%'
                  }}
                />
              </div>
            </div>

            {/* Decorative crosshairs */}
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-accent/50 z-30 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-accent/50 z-30 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[8px] text-accent/40 z-0 select-none">
              ASSET_SYS_READY
            </div>
          </div>
        </div>
      </div>

      {/* ── Three-column layout ───────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-px border-l border-r border-accent/15 mx-4 sm:mx-6 lg:mx-10"
      >

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 1 — Professional Foundations & Timeline
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b lg:border-b-0 lg:border-r border-accent/20">

          {/* Identity header */}
          <div className="mb-8">
            <div className="label-caps mb-2">TRAJECTORY</div>
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

          {/* Double major pill */}
          <div className="flex flex-wrap gap-2 mb-8">
            {EDUCATION.degrees.map((d) => (
              <div
                key={d}
                className="px-2 pt-0 pb-1 border border-accent/30 rounded-sm"
                style={{ background: 'rgba(56,64,106,0.15)' }}
              >
                <span className="font-mono text-xs tracking-label text-gold/70">{d}</span>
              </div>
            ))}
          </div>

          {/* Toolchain */}
          <div className="mb-8">
            <div className="label-caps mb-3 opacity-50">RAPID PROTOTYPING STACK</div>
            <div className="flex flex-wrap gap-1.5">
              {EDUCATION.tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-xs px-2 py-0.5 border border-accent/25 text-parchment/70 rounded-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="label-caps mb-4 opacity-50">EXPERIENCE</div>
            <div className="space-y-0 divide-y divide-transparent">
              {TIMELINE.map((entry, i) => (
                <TimelineRow key={entry.role} entry={entry} index={i} />
              ))}
            </div>
          </div>

          {/* Resume CTA */}
          <div className="mt-8 pt-6 border-t border-accent/20">
            <AnchorLine href={BIO.resumeUrl}>
              <span className="font-mono text-xs tracking-label uppercase text-gold/70 hover:text-gold transition-colors">
                View Full Resume ↗
              </span>
            </AnchorLine>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 2 — Human-First Beliefs
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b lg:border-b-0 lg:border-r border-accent/20">
          <div className="mb-8">
            <div className="label-caps mb-2">PHILOSOPHY</div>
            <h2
              className="font-sans font-black text-parchment leading-none mb-3"
              style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', letterSpacing: '-0.04em' }}
            >
              Human-First.
              <br />
              <span className="text-gold">Always.</span>
            </h2>
            <p className="font-mono text-xs text-parchment/70 leading-relaxed">
              Servant leadership. Authentic community. Real products. The following principles aren’t just values in a list. They’re operating constraints for my entire design journey.
            </p>
          </div>

          {/* Beliefs list */}
          <div className="space-y-0 divide-y divide-transparent">
            {BELIEFS.map((belief) => (
              <BeliefBlock key={belief.index} belief={belief} />
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            COLUMN 3 — Personal Catalog (Terminal Interface)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div>
            {/* Terminal header bar */}
            <div className="mb-6">
              <div className="label-caps mb-2">PERSONAL CATALOG</div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 border border-accent/30 rounded-sm mb-4"
                style={{ background: 'rgba(28,32,53,0.8)' }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
                <div className="w-2 h-2 rounded-full bg-green-400/60" />
                <div className="flex-1" />
                <span className="font-mono text-xs text-parchment/50">~/jjz/personal</span>
              </div>

              {/* Tab switcher */}
              <div className="flex border border-accent/25 rounded-sm overflow-hidden">
                {(['books', 'music', 'play'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab)
                      setCommandInput('')
                    }}
                    className="flex-1 py-1.5 font-mono text-xs tracking-label uppercase transition-all duration-250"
                    style={{
                      background: activeTab === tab ? 'rgba(56,64,106,0.4)' : 'transparent',
                      color: activeTab === tab ? '#cfccbb' : 'rgba(207,204,187,0.3)',
                      borderRight: tab !== 'play' ? '1px solid rgba(56,64,106,0.25)' : undefined,
                      transition: 'background 0.25s cubic-bezier(0.22,1,0.36,1), color 0.25s ease',
                    }}
                  >
                    {tab === 'books' ? '📚 shelf' : tab === 'music' ? '♫ now' : '◈ play'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── BOOKSHELF ── */}
            {activeTab === 'books' && (
              <TerminalSection label="The Bookshelf">
                <div className="space-y-1.5">
                  {BOOKSHELF.map((book, i) => (
                    <div
                      key={book.title}
                      className="flex items-start gap-2.5 py-1.5 border-b border-accent/10 last:border-b-0 group cursor-default"
                      style={{
                        opacity: 1,
                        animation: `fadeIn 0.3s ease ${i * 40}ms both`,
                      }}
                    >
                      <span
                        className="font-mono text-xs flex-shrink-0 mt-0.5"
                        style={{ color: STATUS_COLORS[book.status] }}
                      >
                        {STATUS_ICONS[book.status]}
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-parchment/70 leading-tight">
                          {book.title}
                        </p>
                        <p className="font-mono text-xs text-parchment/60 mt-0.5">
                          {book.author}
                          <span className="ml-2 opacity-50">— {book.category}</span>
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

            {/* ── ROTATIONS ── */}
            {activeTab === 'music' && (
              <TerminalSection label="Current Rotations">
                <div className="space-y-0">
                  {ROTATIONS.map((track, i) => (
                    <div
                      key={track.artist}
                      className="flex items-center justify-between py-2.5 border-b border-accent/10 last:border-b-0 group cursor-default"
                      style={{ animation: `fadeIn 0.3s ease ${i * 35}ms both` }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-parchment/50 w-4">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {/* Mini waveform visual */}
                        <div className="flex items-end gap-0.5 h-3">
                          {[3, 5, 2, 4, 6, 3, 5].map((h, j) => (
                            <div
                              key={j}
                              className="w-0.5 bg-gold/30 group-hover:bg-gold/60 rounded-full"
                              style={{
                                height: `${h * 2}px`,
                                transition: `height 0.3s cubic-bezier(0.22,1,0.36,1) ${j * 25}ms, background-color 0.3s ease`,
                              }}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="font-sans font-medium text-xs text-parchment/70 leading-none">
                            {track.note}
                          </p>
                          <p className="font-mono text-xs text-parchment/60 mt-0.5">{track.artist}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-parchment/50">♫</span>
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

            {/* ── PLAYGROUND ── */}
            {activeTab === 'play' && (
              <TerminalSection label="The Playground">
                <div className="flex gap-4">
                  {/* 25% Left Column: Directory Panel */}
                  <div className="w-1/4 shrink-0 flex flex-col space-y-4 pt-1 border-r border-accent/10 pr-2">
                    {PLAYGROUND.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => setActiveGameId(game.id)}
                        className="flex items-start gap-1.5 text-left group w-full cursor-pointer"
                      >
                        <span
                          className="font-mono text-xs leading-[1.2] transition-colors duration-200 mt-[1px]"
                          style={{ color: activeGameId === game.id ? '#ebd648' : 'transparent' }}
                        >
                          {'>'}
                        </span>
                        <span
                          className="font-mono text-xs tracking-label uppercase leading-tight transition-colors duration-200"
                          style={{ color: activeGameId === game.id ? '#cfccbb' : 'rgba(207,204,187,0.35)' }}
                        >
                          {game.id} <span className="opacity-50">//</span><br />
                          <span className="opacity-80">{game.title}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* 75% Right Column: Details Display Pane */}
                  <div className="w-3/4 flex-1 pl-2">
                    <div className="space-y-0">
                      {PLAYGROUND.find(g => g.id === activeGameId)?.specs.map((item, i) => (
                        <div
                          key={`${activeGameId}-${item.label}`}
                          className="flex items-start justify-between py-2.5 border-b border-accent/10 last:border-b-0"
                          style={{ animation: `fadeIn 0.3s ease ${i * 30}ms both` }}
                        >
                          <div>
                            <span className="font-mono text-xs tracking-label text-parchment/60 uppercase block">
                              {item.label}
                            </span>
                            <span className={`font-mono text-xs block mt-0.5 ${item.sublabel ? 'text-parchment/50' : 'opacity-0 select-none'}`}>
                              {item.sublabel || '—'}
                            </span>
                          </div>
                          <span
                            className="font-mono text-xs text-right mt-0.5"
                            style={{ color: i === 0 ? '#9cd5f8' : i === 2 ? '#ebd648' : '#cfccbb', opacity: 0.7 }}
                          >
                            {item.value}
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
          </div>
        </div>
      </div>

      {/* Blink keyframe injection */}
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
    </section>
  )
}
