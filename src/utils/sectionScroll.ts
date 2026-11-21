/**
 * Extra room above an anchor target, on top of its CSS `scroll-margin-top`.
 * Anything that needs to know where a jump lands (the altimeter) reads this.
 */
export const ANCHOR_OFFSET = 88

type Scroller = (top: number) => void
let smooth: Scroller | null = null

/** SmoothScroll registers its smooth scroller here so jumps go through it. */
export function setSmoothScroller(fn: Scroller | null) {
  smooth = fn
}

/** Where an anchor jump puts `el`'s top edge, in px from the viewport top. */
export function landingTop(el: Element) {
  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop)
  return ANCHOR_OFFSET + (Number.isNaN(margin) ? 0 : margin)
}

/**
 * Scroll to a section the same way every time, smoothly when Lenis is running
 * and instantly under reduced motion, then hand focus to it.
 */
export function scrollToSection(id: string) {
  const el = id === 'top' ? null : document.getElementById(id)
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const top = el ? Math.min(maxScroll, Math.max(0, el.getBoundingClientRect().top + window.scrollY - landingTop(el))) : 0
  if (smooth) smooth(top)
  else window.scrollTo({ top })
  ;(el ?? document.getElementById('top'))?.focus({ preventScroll: true })
}
