import { useLayoutEffect, useRef, useState } from 'react'

// Arms an element only if it starts below the fold, then reveals it once when it
// scrolls into view. Elements already on screen never hide, so nothing flashes.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
    setArmed(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, armed, shown] as const
}
