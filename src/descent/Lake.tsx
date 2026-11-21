import { BELIEFS, EDUCATION, TIMELINE, type TimelineEntry } from '../data/about'
import Edge from './Edge'

function Role({ t }: { t: TimelineEntry }) {
  return (
    <li className="grid gap-x-10 gap-y-1.5 py-6 md:grid-cols-[12rem_minmax(0,1fr)]">
      <p className="tabnum text-sm text-mist">{t.period}</p>
      <div>
        <p className="text-lg font-bold text-cream">
          {t.role} <span className="font-medium text-sand">at {t.org}</span>
        </p>
        <p className="mt-1.5 max-w-[64ch] text-paper">{t.detail}</p>
      </div>
    </li>
  )
}

const summary =
  'cursor-pointer list-none py-5 text-sm font-bold text-sand underline decoration-1 underline-offset-[0.4em] hover:text-cream [&::-webkit-details-marker]:hidden'

// About lies at the lake: the portrait stands on the shore and the water holds
// its reflection.
export default function Lake() {
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-h" data-alt={1100} className="relative z-30 bg-ground-deep outline-none">
      <Edge kind="shore" />
      <div className="band-inner pb-32 pt-14 md:pb-48 md:pt-16">
        <h2 id="about-h" className="wordmark !text-cream text-[clamp(3.5rem,9vw,7.5rem)]">
          The Climber
        </h2>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <figure className="md:self-start">
            <div className="mat p-2.5">
              <img src="/images/jason-headshot-1.webp" alt="Portrait of Jason Jiayu Zhang" loading="lazy" className="block aspect-[4/5] w-full object-cover" />
            </div>
            <div className="lake-reflection" aria-hidden="true">
              <div className="lake-mirror bg-cream p-2.5">
                <img src="/images/jason-headshot-1.webp" alt="" loading="lazy" className="block aspect-[4/5] w-full object-cover" />
              </div>
            </div>
            <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
              <filter id="lake-ripple" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.006 0.11" numOctaves="1" seed="4" />
                <feDisplacementMap in="SourceGraphic" scale="14" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </svg>
          </figure>

          <div>
            <p className="text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.02em] text-cream">
              {EDUCATION.degrees.join(' and ')} at {EDUCATION.institution}.
            </p>
            <p className="prose-body mt-6 text-lg text-paper">{EDUCATION.note}</p>
            <p className="mt-3 max-w-[60ch] text-sm text-mist">Tools: {EDUCATION.tools.join(', ')}.</p>

            <h3 className="mt-16 text-2xl font-bold text-cream md:text-3xl">What I believe</h3>
            <dl className="mt-6 space-y-7">
              {BELIEFS.map((b) => (
                <div key={b.headline}>
                  <dt className="text-xl font-bold leading-snug text-cream">{b.headline}</dt>
                  <dd className="mt-1.5 max-w-[60ch] text-paper">{b.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <h3 className="text-2xl font-bold text-cream md:text-3xl">Where I have worked</h3>
          <ol className="mt-6 divide-y divide-mist/20 border-y border-mist/20">
            {TIMELINE.slice(0, 3).map((t) => (
              <Role key={`${t.org}-${t.period}`} t={t} />
            ))}
          </ol>
          {TIMELINE.length > 3 && (
            <details className="group">
              <summary className={summary}>
                <span className="group-open:hidden">Show {TIMELINE.length - 3} more roles</span>
                <span className="hidden group-open:inline">Show fewer roles</span>
              </summary>
              <ol className="divide-y divide-mist/20 border-b border-mist/20">
                {TIMELINE.slice(3).map((t) => (
                  <Role key={`${t.org}-${t.period}`} t={t} />
                ))}
              </ol>
            </details>
          )}
        </div>
      </div>
    </section>
  )
}
