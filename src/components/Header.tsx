import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { BIO } from '../data/portfolio'

const LINKS = [
  { label: 'Work', id: 'work' },
  { label: 'Studio', id: 'studio' },
  { label: 'About', id: 'about' },
]

// Cream bar that floats under the hero landscape, then sticks to the top.
// On the home page it also says which section is in view.
export default function Header({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { pathname } = useLocation()
  const home = pathname === '/'

  useEffect(() => {
    if (!home) return
    const els = ['work', 'studio', 'about', 'contact']
      .map((id) => document.getElementById(id === 'contact' ? 'contact-h' : id))
      .filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id === 'contact-h' ? 'contact' : hit.target.id)
        else if (window.scrollY < 300) setActive('')
      },
      { rootMargin: '-30% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [home])

  const link =
    'inline-flex min-h-11 items-center px-1 text-[0.75rem] font-medium uppercase tracking-[0.14em] decoration-1 underline-offset-[0.5em] hover:underline aria-[current=location]:font-bold aria-[current=location]:underline'

  return (
    <header className={`sticky top-3 z-40 mx-3 md:mx-6 ${className}`}>
      <div className="mat on-cream relative flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-3" aria-label="Jason Jiayu Zhang, home" onClick={() => setOpen(false)}>
          <Logo className="h-6 w-auto text-action" />
          <span className="hidden text-[0.8rem] font-bold uppercase tracking-[0.06em] text-action lg:inline">{BIO.fullName}</span>
        </Link>

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.id} to={`/#${l.id}`} className={link} aria-current={active === l.id ? 'location' : undefined}>
              {l.label}
            </Link>
          ))}
          <a href={BIO.resumeUrl} target="_blank" rel="noreferrer" className={link}>
            Resume
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={`mailto:${BIO.email}`}
            className="inline-flex min-h-11 items-center bg-action px-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-night focus-visible:outline-night"
          >
            Let's talk!
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center text-action md:hidden"
            aria-expanded={open}
            aria-controls={open ? 'mobile-nav' : undefined}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="mat on-cream mt-1 flex flex-col px-4 py-1 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.id} to={`/#${l.id}`} className={`${link} py-2`} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <a href={BIO.resumeUrl} target="_blank" rel="noreferrer" className={`${link} py-2`}>
            Resume
          </a>
        </nav>
      )}
    </header>
  )
}
