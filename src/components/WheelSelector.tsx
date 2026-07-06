import React, { useEffect, useRef, useState } from 'react'
import {
  snapAngle,
  angleToProjectIndex,
  projectIndexToAngle,
  applyFriction,
  clampVelocity,
  getMouseAngle,
  springToward,
  angularDelta,
  safeMod,
  SNAP_COUNT
} from '../utils/wheelMath'
import type { WheelState } from '../types/portfolio'
import { WHEEL_SECTIONS } from '../data/about'
import GeometricWheel, { type WheelHandle } from './GeometricWheel'
import { useIntro } from './IntroContext'

interface WheelSelectorProps {
  onProjectChange: (index: number) => void
  activeIndex: number
  autoAdvanceRef?: React.RefObject<boolean>
}

const FRICTION = 0.95
const SPRING_STIFFNESS = 0.15
const AUTO_SPRING_STIFFNESS = SPRING_STIFFNESS / 2 // ambient auto-advance rotates at half the speed of a manual snap
const SNAP_THRESHOLD = 0.4 // deg/frame

export default function WheelSelector({ onProjectChange, activeIndex, autoAdvanceRef }: WheelSelectorProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number>(0)
  const wheelHandleRef = useRef<WheelHandle>(null)

  const { hasLoaded, phase } = useIntro()
  const isPhase3 = hasLoaded || phase === 'phase03'

  const wheelRef = useRef<WheelState>({
    angle: projectIndexToAngle(0),
    targetAngle: projectIndexToAngle(0),
    activeIndex: 0,
    velocity: 0,
    isDragging: false,
  })

  // Only used to trigger re-render when active project changes (not every rAF frame)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_renderIndex, setRenderIndex] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const wheelAccumulator = useRef(0)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stiffnessRef = useRef(SPRING_STIFFNESS)

  // ── ANIMATION LOOP ────────────────────────────────────────────────────────

  useEffect(() => {
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 32)
      lastTime = now

      const w = wheelRef.current

      if (!w.isDragging) {
        w.velocity = applyFriction(w.velocity, FRICTION)

        if (Math.abs(w.velocity) < SNAP_THRESHOLD) {
          w.angle = springToward(w.angle, w.targetAngle, stiffnessRef.current)

          const newIndex = angleToProjectIndex(w.targetAngle)
          if (newIndex !== w.activeIndex) {
            w.activeIndex = newIndex
            onProjectChange(newIndex)
            // Only trigger a React re-render when the active item changes
            setRenderIndex(newIndex)
          }
        } else {
          w.angle += w.velocity * (dt / 16)
          w.targetAngle = snapAngle(w.angle)
        }
      }

      // Mutate the DOM directly — zero React overhead per frame
      wheelHandleRef.current?.setRotation(w.angle, w.velocity)

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [onProjectChange])

  // ── DRAG HANDLERS ────────────────────────────────────────────────────────

  const dragStartAngle = useRef(0)
  const dragLastAngle = useRef(0)
  const dragLastTime = useRef(0)
  const dragStartMouseAngle = useRef(0)
  const dragStartTime = useRef(0)

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isPhase3) return;
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = svgRef.current!.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const mouseAngle = getMouseAngle(e, rect, cx, cy)

    dragStartAngle.current = mouseAngle - wheelRef.current.angle
    dragLastAngle.current = mouseAngle
    dragLastTime.current = performance.now()
    dragStartMouseAngle.current = mouseAngle
    dragStartTime.current = performance.now()
    wheelRef.current.isDragging = true
    wheelRef.current.velocity = 0
    setIsPressed(true)
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!wheelRef.current.isDragging) return
    const rect = svgRef.current!.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const mouseAngle = getMouseAngle(e, rect, cx, cy)

    // directly map the wheel angle without modulo
    const newAngle = mouseAngle - dragStartAngle.current
    const now = performance.now()
    const dt = now - dragLastTime.current

    if (dt > 0) {
      const delta = angularDelta(wheelRef.current.angle, newAngle)
      wheelRef.current.velocity = clampVelocity(delta / (dt / 16), 14)
    }

    wheelRef.current.angle = newAngle
    dragLastAngle.current = mouseAngle
    dragLastTime.current = now
  }

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsPressed(false)
    if (wheelRef.current.isDragging) {
      wheelRef.current.isDragging = false
      
      const rect = svgRef.current!.getBoundingClientRect()
      const cx = rect.width / 2
      const cy = rect.height / 2
      const mouseAngle = getMouseAngle(e, rect, cx, cy)
      
      const dt = performance.now() - dragStartTime.current
      const deltaAngle = Math.abs(angularDelta(dragStartMouseAngle.current, mouseAngle))
      
      // Determine if it was a click (short time and little movement)
      if (dt < 400 && deltaAngle < 5) {
        const exactIndex = (wheelRef.current.angle - mouseAngle) / (360 / SNAP_COUNT)
        const clickedIndex = safeMod(Math.round(exactIndex), SNAP_COUNT)
        
        if (clickedIndex !== wheelRef.current.activeIndex) {
          onProjectChange(clickedIndex)
        }
      }
      
      wheelRef.current.targetAngle = snapAngle(wheelRef.current.angle)
    }
  }

  // ── SCROLL WHEEL HANDLER ─────────────────────────────────────────────────

  const scrollLockUntil = useRef(0)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (!isPhase3) return;
      
      const now = performance.now()
      
      if (wheelRef.current.isDragging) return

      // Strict delta-gate scroll lock: ignore all scroll events while locked
      if (now < scrollLockUntil.current) {
        return
      }

      // Reset the accumulator if the user stops scrolling for a short period
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        wheelAccumulator.current = 0
      }, 150)
      
      wheelAccumulator.current += e.deltaY

      // Delta-gate threshold required to actuate a turn
      if (Math.abs(wheelAccumulator.current) > 60) {
        const direction = Math.sign(wheelAccumulator.current)
        wheelAccumulator.current = 0
        scrollLockUntil.current = performance.now() + 650 // 650ms physical scroll lock
        
        const currentIndex = wheelRef.current.activeIndex
        // scroll down (positive delta) -> next index, scroll up -> prev index
        const nextIndex = safeMod(currentIndex + direction, SNAP_COUNT)
        
        onProjectChange(nextIndex)
      }
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [onProjectChange, isPhase3])

  // ── PROGRAMMATIC SNAP (from external activeIndex change) ─────────────────

  useEffect(() => {
    if (wheelRef.current.isDragging) return
    const target = projectIndexToAngle(activeIndex, wheelRef.current.targetAngle)
    wheelRef.current.targetAngle = target
    wheelRef.current.activeIndex = activeIndex
    wheelRef.current.velocity = 0

    if (autoAdvanceRef?.current) {
      stiffnessRef.current = AUTO_SPRING_STIFFNESS
      autoAdvanceRef.current = false
    } else {
      stiffnessRef.current = SPRING_STIFFNESS
    }
  }, [activeIndex, autoAdvanceRef])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 600"
      className="w-full h-full wheel-cursor no-select"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        touchAction: 'none',
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'transform 0.2s var(--ease-out)',
      }}
    >
      <GeometricWheel
        ref={wheelHandleRef}
        rotationAngle={wheelRef.current.angle}
        activeIndex={activeIndex}
        sections={WHEEL_SECTIONS}
        pressed={isPressed}
      />
    </svg>
  )
}
