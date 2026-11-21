import { BIO } from '../data/portfolio'
import Edge from './Edge'
import { Arrow } from './Camp'

// The valley floor: the last ask, then the ground the page stands on.
export function Contact() {
  return (
    <section id="contact" tabIndex={-1} aria-labelledby="contact-h" data-alt={300} className="relative z-[35] bg-night outline-none">
      <Edge kind="valley" />
      <div className="band-inner pt-16 md:pt-24">
        <h2 id="contact-h" className="wordmark text-[clamp(3.6rem,13vw,10rem)] !text-sand">
          <a href={`mailto:${BIO.email}`} className="transition-colors hover:!text-cream">
            Rope up<span className="sr-only-x">: email {BIO.fullName}</span>
          </a>
        </h2>
        <p className="mt-6 max-w-[40ch] text-lg text-mist">Want to talk about the work, a role, or something you are making? Write any time.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a href={`mailto:${BIO.email}`} className="text-lg text-cream underline decoration-1 underline-offset-[0.35em] hover:text-white">
            {BIO.email}
          </a>
          <a
            href={BIO.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="mat on-cream inline-flex min-h-11 items-center gap-2 px-5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-action transition-colors hover:bg-white"
          >
            Open resume <Arrow up className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

export function FloorFooter() {
  const socials = BIO.socials.filter((s) => s.platform !== 'Email')
  return (
    <footer data-alt={0} className="bg-night">
      <div className="band-inner pb-8 pt-32 md:pt-48">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-mist/20 pt-6">
          <div>
            <p className="font-bold text-cream">{BIO.fullName}</p>
            <p className="text-sm text-mist">Design Engineer · © 2026</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {socials.map((s) => (
              <li key={s.platform}>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm font-bold text-cream underline-offset-[0.4em] hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="tabnum text-sm text-mist" aria-hidden="true">
            0 m · valley floor
          </p>
        </div>
      </div>
    </footer>
  )
}
