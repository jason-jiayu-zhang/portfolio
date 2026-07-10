import { useEffect, useRef } from 'react'

// Magnetic pull — while the pointer is over the element, it eases toward the
// cursor and springs back on leave. The trailing feel comes from a CSS
// `transition` on `transform` at the call site. Skipped for touch / reduced motion.
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      // Recover the resting centre by removing the transform already applied,
      // so the element chasing the cursor doesn't feed back into the reading.
      const cx = r.left + r.width / 2 - tx
      const cy = r.top + r.height / 2 - ty
      tx = (e.clientX - cx) * strength
      ty = (e.clientY - cy) * strength
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${tx}px, ${ty}px)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      tx = 0
      ty = 0
      el.style.transform = 'translate(0px, 0px)'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return ref
}
