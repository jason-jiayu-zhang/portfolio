import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { BIO } from '../data/portfolio'
import Logo from '../components/Logo'
import { landingTop, scrollToSection } from '../utils/sectionScroll'

export type Stop = { id: string; label: string; alt: number; /** Rail label when `label` is too long */ short?: string }

const HOME_STOPS: readonly Stop[] = [
  { id: 'summit', label: 'Summit', alt: 4200 },
  { id: 'work', label: 'Ascents', alt: 3600 },
  { id: 'studio', label: 'Side Trails', alt: 1900 },
  { id: 'about', label: 'The Climber', alt: 1100 },
  { id: 'base-camp', label: 'Base Camp', alt: 700 },
  { id: 'contact', label: 'Rope up', alt: 300 },
]

const fmt = new Intl.NumberFormat('en-US')

/**
 * Reads the altitude off the page. Every band and camp carries `data-alt`.
 * Each mark is pinned to the scroll position at which an anchor jump lands it
 * (its `scroll-margin-top` plus the shared offset, clamped to what the page can
 * actually scroll), and the reading interpolates between those positions. So
 * jumping to a stop reads exactly that stop's altitude, even one too near the
 * bottom to reach its usual landing line. Readouts and the marker are written
 * straight to the DOM; React only hears when the current stop changes.
 */
function useAltitude(stops: readonly Stop[], top: number, fallbackId: string) {
  const readouts = useRef<HTMLElement[]>([])
  const markerRef = useRef<HTMLDivElement | null>(null)
  const [stop, setStop] = useState<string>(stops[0].id)

  useEffect(() => {
    let raf = 0
    let last = -1
    // Mark positions are page coordinates, so they only change when layout
    // does. Read them on mount and resize, never per scroll frame: reading
    // getBoundingClientRect while scrolling forces a layout every frame.
    let marks: { y: number; at: number; alt: number }[] = []
    const layout = () => {
      const y0 = window.scrollY
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      // Camps and the floor have no landing of their own; they read against
      // the work band's, so the camps stay evenly spaced inside it.
      const stopIds = new Set(stops.map((s) => s.id))
      const anchor = document.getElementById(fallbackId)
      const fallbackLanding = anchor ? landingTop(anchor) : 0
      marks = [...document.querySelectorAll<HTMLElement>('[data-alt]')]
        .map((el) => {
          const y = el.getBoundingClientRect().top + y0
          const landing = stopIds.has(el.id) ? landingTop(el) : fallbackLanding
          return { y, at: Math.min(maxScroll, Math.max(0, y - landing)), alt: Number(el.dataset.alt) }
        })
        .sort((a, b) => a.y - b.y)
        // Marks squeezed onto one scroll position (the page ran out below
        // them) keep only the first, so a reachable stop beats the floor.
        .filter((m, i, arr) => i === 0 || m.at > arr[i - 1].at)
    }
    const measure = () => {
      raf = 0
      if (!marks.length) return
      const pos = window.scrollY
      let alt = marks[0].alt
      for (let i = 1; i < marks.length; i++) {
        const a = marks[i - 1]
        const b = marks[i]
        if (pos >= b.at - 1) {
          alt = b.alt
          continue
        }
        // Within a pixel of a mark reads as the mark: smooth scrolling settles
        // on sub-pixel positions, and short stretches turn those into metres.
        if (pos > a.at + 1) alt = a.alt + ((b.alt - a.alt) * (pos - a.at)) / (b.at - a.at)
        else alt = a.alt
        break
      }
      const shown = Math.max(0, Math.round(alt / 5) * 5)
      if (shown === last) return
      last = shown
      const text = fmt.format(shown)
      readouts.current.forEach((el) => (el.textContent = text))
      markerRef.current?.style.setProperty('--fall', String(1 - shown / top))
      const current = [...stops].reverse().find((s) => shown <= s.alt + 1) ?? stops[0]
      setStop(current.id)
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    const relayout = () => {
      layout()
      queue()
    }
    layout()
    measure()
    // Images and fonts settle after mount and change the page height; the
    // observer catches those as well as window resizes.
    const ro = new ResizeObserver(relayout)
    ro.observe(document.body)
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', relayout)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', relayout)
    }
  }, [stops, top, fallbackId])

  const readoutRef = (el: HTMLElement | null) => {
    if (el && !readouts.current.includes(el)) readouts.current.push(el)
  }
  return { stop, readoutRef, markerRef }
}

const href = (id: string, first: string) => (id === first ? '#top' : `#${id}`)

/** Section links scroll through one path so they land where the altimeter expects. */
function jump(e: MouseEvent<HTMLAnchorElement>, id: string, first: string) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  e.stopPropagation()
  const target = id === first ? 'top' : id
  history.replaceState(history.state, '', `#${target}`)
  scrollToSection(target)
}

type Props = {
  /** The named stops on the scale; the first is the page top (#top). */
  stops?: readonly Stop[]
  /** The altitude the scale starts at. */
  top?: number
  /** The section camps and the floor read their landing against. */
  fallbackId?: string
  /** On a page other than home, the mark leads back home instead of to the top. */
  homeLink?: boolean
  /** A way back up, listed under the mark (e.g. to the Ascents band). */
  back?: { to: string; label: string }
}

export default function Altimeter({ stops = HOME_STOPS, top = 4200, fallbackId = 'work', homeLink = false, back }: Props) {
  const { stop, readoutRef, markerRef } = useAltitude(stops, top, fallbackId)
  const [open, setOpen] = useState(false)
  const first = stops[0].id
  const current = stops.find((s) => s.id === stop) ?? stops[0]
  // Room for every stop: home's five fit the standard scale, a long case study grows it.
  const scaleH = Math.max(248, (stops.length - 1) * 26)
  const markLabel = homeLink ? `${BIO.fullName}, home` : `${BIO.fullName}, back to the summit`

  return (
    <>
      {/* Desktop: the instrument at the left edge */}
      <nav aria-label="Sections" className="altimeter mat on-cream fixed left-4 top-1/2 z-50 hidden w-[140px] -translate-y-1/2 flex-col px-4 pb-5 pt-4 lg:flex">
        {homeLink ? (
          <Link to="/" className="-mx-1 flex min-h-11 items-center gap-2 px-1 text-action" aria-label={markLabel}>
            <Logo className="h-5 w-auto" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em]">JJZ</span>
          </Link>
        ) : (
          <a href="#top" onClick={(e) => jump(e, first, first)} className="-mx-1 flex min-h-11 items-center gap-2 px-1 text-action" aria-label={markLabel}>
            <Logo className="h-5 w-auto" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em]">JJZ</span>
          </a>
        )}
        {back && (
          <Link to={back.to} className="-mx-1 flex min-h-6 items-center gap-1.5 px-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-action underline-offset-[0.4em] hover:text-night hover:underline">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
              <path d="M16.5 10h-12M9 5.5L4.5 10 9 14.5" />
            </svg>
            {back.label}
          </Link>
        )}
        <p className="mt-3 border-t border-action/20 pt-3 text-night" aria-hidden="true">
          <span ref={readoutRef} className="tabnum block text-[1.7rem] font-black leading-none tracking-[-0.03em]">
            {fmt.format(top)}
          </span>
          <span className="mt-1 block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-peri-deep">metres</span>
        </p>
        <div ref={markerRef} className="relative mt-5" style={{ height: scaleH }}>
          <span className="absolute bottom-0 left-[5px] top-0 w-px bg-action/35" aria-hidden="true" />
          <span className="alt-marker absolute left-0 top-0 h-full w-0" aria-hidden="true">
            <svg viewBox="0 0 12 10" className="absolute -left-px -top-[5px] h-[10px] w-3 text-action">
              <path d="M0 10L6 0L12 10Z" fill="currentColor" />
            </svg>
          </span>
          <ol className="contents">
            {stops.map((s) => (
              <li key={s.id} className="absolute left-0 right-0 -translate-y-1/2" style={{ top: `${(1 - s.alt / top) * 100}%` }}>
                <a
                  href={href(s.id, first)}
                  onClick={(e) => jump(e, s.id, first)}
                  aria-current={stop === s.id ? 'location' : undefined}
                  className="group flex min-h-6 items-center gap-2.5 whitespace-nowrap pl-[18px] text-[0.72rem] font-medium uppercase tracking-[0.12em] text-action hover:text-night aria-[current=location]:font-bold aria-[current=location]:text-night"
                >
                  <span className="absolute left-[2px] h-px w-[7px] bg-action group-aria-[current=location]:w-[11px]" aria-hidden="true" />
                  {s.short ?? s.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Desktop: the two ways out, always in reach */}
      <div className="mat on-cream fixed right-4 top-4 z-50 hidden items-center gap-1 p-1 lg:flex">
        <a href={BIO.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center px-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-action underline-offset-[0.5em] hover:underline">
          Resume
        </a>
        <a href={`mailto:${BIO.email}`} className="inline-flex min-h-11 items-center bg-action px-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-night">
          Let's talk
        </a>
      </div>

      {/* Below lg: a bar across the top carrying the same reading */}
      <div className="fixed inset-x-3 top-3 z-50 lg:hidden">
        <div className="mat on-cream flex h-14 items-center justify-between gap-3 pl-3 pr-1">
          {homeLink ? (
            <Link to="/" className="flex min-h-11 items-center text-action" aria-label={markLabel}>
              <Logo className="h-5 w-auto" />
            </Link>
          ) : (
            <a href="#top" onClick={(e) => jump(e, first, first)} className="flex min-h-11 items-center text-action" aria-label={markLabel}>
              <Logo className="h-5 w-auto" />
            </a>
          )}
          <p className="tabnum mr-auto flex min-w-0 items-baseline gap-1.5 whitespace-nowrap text-night" aria-hidden="true">
            <span ref={readoutRef} className="text-[1.05rem] font-black tracking-[-0.02em]">
              {fmt.format(top)}
            </span>
            <span className="truncate text-[0.68rem] font-medium uppercase tracking-[0.12em] text-peri-deep">m · {current.short ?? current.label}</span>
          </p>
          <a href={`mailto:${BIO.email}`} className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap bg-action px-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-cream">
            Let's talk
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center text-action"
            aria-expanded={open}
            aria-controls="stops-menu"
            aria-label={open ? 'Close sections' : 'Open sections'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
        <nav id="stops-menu" aria-label="Sections" hidden={!open} className="mat on-cream mt-1 px-3 py-2">
          <ol>
            {stops.map((s) => (
              <li key={s.id}>
                <a
                  href={href(s.id, first)}
                  onClick={(e) => {
                    setOpen(false)
                    jump(e, s.id, first)
                  }}
                  aria-current={stop === s.id ? 'location' : undefined}
                  className="flex min-h-11 items-center justify-between text-[0.8rem] font-medium uppercase tracking-[0.12em] text-action aria-[current=location]:font-bold aria-[current=location]:text-night"
                >
                  {s.label}
                  <span className="tabnum text-[0.75rem] normal-case tracking-normal text-peri-deep">{fmt.format(s.alt)} m</span>
                </a>
              </li>
            ))}
            {back && (
              <li>
                <Link to={back.to} className="flex min-h-11 items-center text-[0.8rem] font-medium uppercase tracking-[0.12em] text-action">
                  {back.label}
                </Link>
              </li>
            )}
            <li>
              <a href={BIO.resumeUrl} target="_blank" rel="noreferrer" className="flex min-h-11 items-center text-[0.8rem] font-bold uppercase tracking-[0.12em] text-action">
                Resume
              </a>
            </li>
          </ol>
        </nav>
      </div>
    </>
  )
}
