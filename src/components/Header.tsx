import React, { useEffect, useRef, useState } from 'react'
import { STATUS_CYCLE, BIO } from '../data/portfolio'
import { useIntro } from './IntroContext'

// ── Hardware-style signal meter ─────────────────────────────────────────────
function PulseDot() {
  return (
    <span className="inline-flex items-end gap-[2px] h-2.5 mr-2 flex-shrink-0" aria-hidden="true">
      <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-1" />
      <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-2" />
      <span className="w-[2px] h-full bg-gold/70 origin-bottom animate-signal-bar-3" />
    </span>
  )
}

// ── Animated Status Bar ────────────────────────────────────────────────────
function StatusBar() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [animState, setAnimState] = useState<'idle' | 'exit' | 'enter'>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const textRef = useRef<HTMLSpanElement>(null)
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (textRef.current) {
      setContainerWidth(textRef.current.offsetWidth)
    }
  }, [currentIdx])

  const { hasLoaded, phase } = useIntro()
  const isPhase3 = hasLoaded || phase === 'phase03'

  useEffect(() => {
    if (!isPhase3) return;
    
    intervalRef.current = setInterval(() => {
      // Trigger exit
      setAnimState('exit')
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % STATUS_CYCLE.length)
        setAnimState('enter')
        setTimeout(() => setAnimState('idle'), 200)
      }, 350)
    }, 15000)

    return () => clearInterval(intervalRef.current)
  }, [isPhase3])

  const status = STATUS_CYCLE[currentIdx]

  const textStyle: React.CSSProperties = {
    transform:
      animState === 'exit'
        ? 'translateY(-100%)'
        : animState === 'enter'
          ? 'translateY(4px)'
          : 'translateY(0)',
    opacity: animState === 'enter' ? 0 : 1,
    transition:
      animState === 'exit'
        ? 'transform 0.22s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.2s ease'
        : animState === 'enter'
          ? 'none'
          : 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease',
    willChange: 'transform, opacity',
  }

  if (!isPhase3) return null;

  return (
    <div className={`flex items-center gap-0 px-3 py-1 border border-accent/40 rounded-sm bg-surface/20 backdrop-blur-sm transition-all duration-200 ease-in-out ${!hasLoaded ? 'animate-mask-right' : ''}`}>
      <PulseDot />
      <div 
        className="overflow-hidden flex items-center transition-all duration-200 ease-in-out"
        style={{ width: containerWidth ? `${containerWidth}px` : 'auto', height: '1.1em' }}
      >
        <span
          ref={textRef}
          className="font-mono text-xs tracking-label text-parchment/70 whitespace-nowrap block"
          style={textStyle}
        >
          {status.text}
        </span>
      </div>
    </div>
  )
}

// ── Header ─────────────────────────────────────────────────────────────────
export default function Header() {
  const { hasLoaded, phase } = useIntro()
  const isPhase2 = hasLoaded || phase === 'phase02' || phase === 'phase03'
  const isPhase3 = hasLoaded || phase === 'phase03'

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center"
      style={{ borderBottom: '1px solid rgba(56, 64, 106, 0.5)' }}
    >
      {/* Subtle blur backdrop */}
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-md" />

      {/* Content */}
      <div className="relative w-full flex items-center justify-between px-4 sm:px-6">
        {/* ── Left: Branding & Status ── */}
        {isPhase2 && (
        <div className={`flex items-center gap-3 ${!hasLoaded ? 'animate-mask-right' : ''}`}>
          {/* JJZ monogram — routes home */}
          <a
            href="#featured"
            onClick={(e) => handleScroll(e, 'featured')}
            className="flex items-center gap-1.5 group"
          >
            <img
              src="/favicon.svg"
              className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110 object-contain"
              alt="Logo"
            />
            <span
              className="font-mono text-gold leading-none mb-[1px]"
              style={{ fontSize: '9px', letterSpacing: '0.05em' }}
            >
              ©25
            </span>
          </a>

          {/* Vertical separator */}
          <div className="w-px h-4 bg-accent/50" />

          <span className="label-caps hidden sm:block">Portfolio</span>

          {/* Vertical separator & Status Bar */}
          <div className="w-px h-4 bg-accent/50 hidden sm:block" />

          <div className="hidden sm:block">
            <StatusBar />
          </div>
        </div>
        )}

        {/* ── Center: Empty (for layout balance) ── */}
        <div className="absolute left-1/2 -translate-x-1/2">
        </div>

        {/* ── Right: Nav links ── */}
        {isPhase3 && (
        <nav className={`flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar min-w-0 ${!hasLoaded ? 'animate-fade-down' : ''}`}>
          <a
            href="#studio"
            onClick={(e) => handleScroll(e, 'studio')}
            className="font-mono text-xs tracking-label text-parchment/65 hover:text-parchment transition-colors duration-200 uppercase flex-shrink-0"
          >
            Studio
          </a>
          <a
            href="#archive"
            onClick={(e) => handleScroll(e, 'archive')}
            className="font-mono text-xs tracking-label text-parchment/50 hover:text-parchment transition-colors duration-200 uppercase flex-shrink-0"
          >
            Index
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, 'about')}
            className="font-mono text-xs tracking-label text-parchment/65 hover:text-parchment transition-colors duration-200 uppercase flex-shrink-0"
          >
            About
          </a>
          <a
            href={BIO.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 border border-parchment/20 rounded-sm hover:border-parchment/60 hover:bg-parchment/5 transition-all duration-200 group flex-shrink-0"
          >
            <span className="font-mono text-xs tracking-label text-parchment/65 group-hover:text-parchment uppercase transition-colors duration-200">
              Resume
            </span>
            <svg viewBox="0 0 10 10" className="w-2 h-2 text-gold/88 group-hover:text-gold transition-colors">
              <path
                d="M2 8 L8 2 M4 2 L8 2 L8 6"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>
        )}
      </div>
    </header>
  )
}
