import { useEffect, useRef, useState } from 'react'

type CursorState = 'default' | 'pointer' | 'text' | 'not-allowed'

function getCursorState(el: Element | null): CursorState {
  if (!el) return 'default'
  if (el.closest('[disabled], [aria-disabled="true"]')) return 'not-allowed'
  if (el.closest('input, textarea, [contenteditable="true"]')) return 'text'
  if (el.closest('a, button, [role="button"], summary, select, label, .wheel-cursor')) return 'pointer'
  return 'default'
}

// Frame 543 — square viewfinder brackets
function DefaultGlyph() {
  return (
    <>
      <path d="M4 8V4H8" stroke="var(--color-parchment)" strokeWidth="1" fill="none" />
      <path d="M16 4H20V8" stroke="var(--color-parchment)" strokeWidth="1" fill="none" />
      <path d="M20 16V20H16" stroke="var(--color-parchment)" strokeWidth="1" fill="none" />
      <path d="M8 20H4V16" stroke="var(--color-parchment)" strokeWidth="1" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="var(--color-gold)" />
    </>
  )
}

// Tightened + gold-lit variant of the default brackets — "lock-on" for interactive elements
function PointerGlyph() {
  return (
    <>
      <path d="M7 10V7H10" stroke="var(--color-gold)" strokeWidth="1.25" fill="none" />
      <path d="M14 7H17V10" stroke="var(--color-gold)" strokeWidth="1.25" fill="none" />
      <path d="M17 14V17H14" stroke="var(--color-gold)" strokeWidth="1.25" fill="none" />
      <path d="M10 17H7V14" stroke="var(--color-gold)" strokeWidth="1.25" fill="none" />
      <circle cx="12" cy="12" r="2" fill="var(--color-gold)" />
    </>
  )
}

// Frame 542 — up/down chevrons flanking the dot
function TextGlyph() {
  return (
    <>
      <path d="M9 8L12 5L15 8" stroke="var(--color-parchment)" strokeWidth="1" fill="none" />
      <path d="M9 16L12 19L15 16" stroke="var(--color-parchment)" strokeWidth="1" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="var(--color-gold)" />
    </>
  )
}

// Frame 547 — diagonal X
function NotAllowedGlyph() {
  return (
    <>
      <line x1="4" y1="4" x2="9" y2="9" stroke="var(--color-parchment)" strokeWidth="1" />
      <line x1="20" y1="4" x2="15" y2="9" stroke="var(--color-parchment)" strokeWidth="1" />
      <line x1="4" y1="20" x2="9" y2="15" stroke="var(--color-parchment)" strokeWidth="1" />
      <line x1="20" y1="20" x2="15" y2="15" stroke="var(--color-parchment)" strokeWidth="1" />
      <circle cx="12" cy="12" r="1.5" fill="var(--color-gold)" />
    </>
  )
}

const GLYPHS: Record<CursorState, () => React.ReactElement> = {
  default: DefaultGlyph,
  pointer: PointerGlyph,
  text: TextGlyph,
  'not-allowed': NotAllowedGlyph,
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<CursorState>('default')
  const [state, setState] = useState<CursorState>('default')

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    document.documentElement.classList.add('custom-cursor-active')

    const handleMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      cursor.style.opacity = '1'

      const next = getCursorState(e.target as Element | null)
      if (next !== stateRef.current) {
        stateRef.current = next
        setState(next)
      }
    }
    const handleDown = () => cursor.classList.add('is-active')
    const handleUp = () => cursor.classList.remove('is-active')
    const handleLeaveWindow = () => { cursor.style.opacity = '0' }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    document.documentElement.addEventListener('mouseleave', handleLeaveWindow)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
      document.documentElement.removeEventListener('mouseleave', handleLeaveWindow)
    }
  }, [])

  const Glyph = GLYPHS[state]

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden style={{ opacity: 0 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Glyph />
      </svg>
    </div>
  )
}
