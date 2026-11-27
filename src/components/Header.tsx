import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import TopActions from './TopActions'
import { BIO } from '../data/portfolio'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Ascents', to: '/#work' },
  { label: 'Notes', to: '/notes' },
]

/**
 * The chrome for pages off the mountain (notes, studio pieces, the lost page).
 * It sits exactly where the home page's does: the action row top right on
 * desktop, and below lg the same bar across the top, naming the page where
 * home reads its altitude. It is fixed, so pages pad their own top.
 */
export default function Header({ label }: { label: string }) {
  const [open, setOpen] = useState(false)
  const row = 'flex min-h-11 items-center text-[0.8rem] font-medium uppercase tracking-[0.12em] text-action'

  return (
    <>
      <TopActions homeMark />

      <div className="site-bar fixed inset-x-3 top-3 z-50 lg:hidden">
        <div className="mat on-cream flex h-14 items-center justify-between gap-3 pl-3 pr-1">
          <Link viewTransition to="/" className="flex min-h-11 items-center text-action" aria-label={`${BIO.fullName}, home`} onClick={() => setOpen(false)}>
            <Logo className="h-5 w-auto" />
          </Link>
          <p className="mr-auto min-w-0 truncate text-[0.68rem] font-medium uppercase tracking-[0.12em] text-peri-deep">{label}</p>
          <a href={`mailto:${BIO.email}`} className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap bg-action px-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-cream">
            Let's talk
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center text-action"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
        <nav id="site-menu" aria-label="Site" hidden={!open} className="mat on-cream mt-1 px-3 py-2">
          <ul>
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link viewTransition={!l.to.includes('#')} to={l.to} className={row} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={BIO.resumeUrl} target="_blank" rel="noreferrer" className={row}>
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
