import { useEffect } from 'react'

// Every route sits at an altitude on the mountain. Moving between pages is a
// climb or a descent, and the view transition moves that way: going down to
// camp, the summit slides up out of view and camp rises in from below;
// climbing back, the reverse. Pages at the same height simply cross-fade.
// The direction is written to <html data-descent> just before React Router
// starts the transition, and index.css reads it.
export function altitudeOf(pathname: string) {
  if (pathname === '/') return 4200
  if (pathname.startsWith('/case-studies/')) return 3600
  if (pathname.startsWith('/studio/')) return 1900
  if (pathname === '/notes' || pathname.startsWith('/notes/')) return 700
  return 0
}

/** Marks each in-app link click with the direction it travels. */
export function useDescentDirection() {
  useEffect(() => {
    const root = document.documentElement
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.origin !== location.origin) return
      const from = altitudeOf(location.pathname)
      const to = altitudeOf(a.pathname)
      root.dataset.descent = to < from ? 'down' : to > from ? 'up' : 'level'
    }
    // Capture, so the mark is set before the router's own click handler runs.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
}
