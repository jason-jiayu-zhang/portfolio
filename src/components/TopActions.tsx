import { Link, useLocation } from 'react-router-dom'
import { BIO } from '../data/portfolio'
import Logo from './Logo'

const item =
  'inline-flex min-h-11 items-center px-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-action underline-offset-[0.5em] hover:underline aria-[current=page]:underline'

/**
 * Desktop: the ways out, pinned top right on every page so they never move
 * between pages. Off the home page the mark leads the row, back to the summit.
 */
export default function TopActions({ homeMark = false }: { homeMark?: boolean }) {
  const { pathname } = useLocation()
  const onNotes = pathname === '/notes' || pathname.startsWith('/notes/')
  return (
    <div className="site-actions mat on-cream fixed right-4 top-4 z-50 hidden items-center gap-1 p-1 lg:flex">
      {homeMark && (
        <Link viewTransition to="/" className="inline-flex min-h-11 items-center gap-2 px-3 text-action" aria-label={`${BIO.fullName}, home`}>
          <Logo className="h-5 w-auto" />
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em]">JJZ</span>
        </Link>
      )}
      <Link viewTransition to="/notes" className={item} aria-current={pathname === '/notes' ? 'page' : onNotes ? 'location' : undefined}>
        Notes
      </Link>
      <a href={BIO.resumeUrl} target="_blank" rel="noreferrer" className={item}>
        Resume
      </a>
      <a href={`mailto:${BIO.email}`} className="inline-flex min-h-11 items-center bg-action px-4 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-night">
        Let's talk
      </a>
    </div>
  )
}
