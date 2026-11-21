import Landscape from './Landscape'
import Water from './Water'
import Logo from './Logo'
import SocialIcon from './SocialIcons'
import { BIO } from '../data/portfolio'

// The range again, with the cream bar set in front of its base and the water below.
export default function Footer() {
  const socials = [
    ...BIO.socials.filter((s) => s.platform !== 'Email'),
    ...BIO.socials.filter((s) => s.platform === 'Email'),
  ]
  return (
    <footer className="relative mt-24 md:mt-40">
      <div style={{ containerType: 'inline-size' }} className="relative">
        <Landscape />
        <div className="mat on-cream relative -mt-[3cqw] mx-3 flex flex-wrap items-center justify-between gap-4 px-5 py-4 md:mx-6">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto text-action" />
            <div>
              <p className="text-base font-bold leading-tight text-action">{BIO.fullName}</p>
              <p className="text-[0.75rem] uppercase tracking-[0.14em] text-peri-deep">Design Engineer © 2026</p>
            </div>
          </div>
          <ul className="flex items-center gap-1">
            {socials.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.url}
                  target={s.platform === 'Email' ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center text-action transition-transform hover:-translate-y-0.5"
                >
                  <SocialIcon platform={s.platform} className="h-6 w-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Water />
      </div>
    </footer>
  )
}
