import { useEffect, useRef } from 'react'
import RangeLayers from '../art/RangeLayers'
import { SCENE_H, SCENE_W } from '../art/geometry'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

/**
 * The range, drawn in code. Layers drift a few pixels with the pointer. There is
 * no idle animation: a frame loop runs only while the layers are still easing
 * toward the pointer, and the custom property is scoped to this svg so no
 * style recalculation leaves it.
 */
export default function Landscape({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const svg = ref.current
    if (!svg || reduced || !window.matchMedia('(hover: hover)').matches) return
    let px = 0
    let target = 0
    let raf = 0
    let visible = true
    let last = 0

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      px += (target - px) * Math.min(1, dt * 5)
      svg.style.setProperty('--px', px.toFixed(3))
      raf = Math.abs(target - px) > 0.002 && visible ? requestAnimationFrame(step) : 0
    }
    const kick = () => {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(step)
      }
    }
    const onMove = (e: PointerEvent) => {
      target = (e.clientX / window.innerWidth - 0.5) * 2
      kick()
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(svg)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduced])

  return (
    <svg
      ref={ref}
      className={`landscape ${className}`}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      role="img"
      aria-label="Layered mountains with a sand ridge rising to the summit"
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'hidden' }}
    >
      <RangeLayers parallax />
    </svg>
  )
}
