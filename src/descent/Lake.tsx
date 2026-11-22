import { EDUCATION, TIMELINE, type TimelineEntry } from '../data/about'
import Beliefs from './Beliefs'
import Edge from './Edge'

// Each role is a pitch on the route: a marker on the dashed line, current
// roles filled, past ones hollow.
function Role({ t }: { t: TimelineEntry }) {
  const current = /present/i.test(t.period)
  return (
    <li className="relative pb-8 pl-8 last:pb-0">
      <span
        aria-hidden="true"
        className={`absolute left-0 top-[0.4rem] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-cream ${current ? 'bg-cream' : 'bg-ground-deep'}`}
      />
      <p className="tabnum text-xs font-medium uppercase tracking-[0.12em] text-mist">{t.period}</p>
      <p className="mt-1.5 text-lg font-bold leading-snug text-cream">{t.role}</p>
      <p className="text-sm font-medium text-sand">{t.org}</p>
      <p className="mt-2 max-w-[56ch] text-paper">{t.detail}</p>
    </li>
  )
}

const summary =
  'cursor-pointer list-none pl-9 pt-6 text-sm font-bold text-sand underline decoration-1 underline-offset-[0.4em] hover:text-cream [&::-webkit-details-marker]:hidden'

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

            <div className="mt-14 md:mt-16">
              <h3 className="text-2xl font-bold text-cream md:text-3xl">The logbook</h3>
              <p className="mt-1 text-sm text-mist">Where I have worked, most recent first.</p>
              <ol className="mt-8 ml-1 border-l border-dashed border-mist/40">
                {TIMELINE.slice(0, 3).map((t) => (
                  <Role key={`${t.org}-${t.period}`} t={t} />
                ))}
              </ol>
              {TIMELINE.length > 3 && (
                <details className="group">
                  <summary className={summary}>
                    <span className="group-open:hidden">Show {TIMELINE.length - 3} earlier roles</span>
                    <span className="hidden group-open:inline">Show fewer roles</span>
                  </summary>
                  <ol className="ml-1 mt-6 border-l border-dashed border-mist/40">
                    {TIMELINE.slice(3).map((t) => (
                      <Role key={`${t.org}-${t.period}`} t={t} />
                    ))}
                  </ol>
                </details>
              )}
            </div>
          </div>
        </div>

        <Beliefs />

      </div>
    </section>
  )
}
