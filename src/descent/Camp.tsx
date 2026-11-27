import { Link } from 'react-router-dom'
import type { Project } from '../types/portfolio'

const fmt = new Intl.NumberFormat('en-US')

export function Arrow({ className = '', up = false }: { className?: string; up?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
      {up ? <path d="M6 14L14 6M7.5 6H14v6.5" /> : <path d="M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5" />}
    </svg>
  )
}

/**
 * One camp on the way down: the product on a cream mat, a second screen pinned
 * against its lower corner, and the facts beside it. Camps alternate sides so
 * the trail between them switches back.
 */
export function Camp({ project, alt, flip }: { project: Project; alt: number; flip: boolean }) {
  const [main, second] = project.caseStudy?.images ?? []
  const name = project.slug
  const long = name.length > 9
  // The wordmark sits in a 5/12 column from lg up, so a viewport-based size alone
  // overruns it near 1024px. Cap it so the longest word fits the column itself:
  // Satoshi Black caps at -0.035em run ~0.62em a letter; 0.68 leaves headroom.
  const longestWord = Math.max(...name.split(/\s+/).map((w) => w.length))
  const fit = `${(100 / (longestWord * 0.68)).toFixed(2)}cqi`
  const size = long ? 'clamp(2.4rem,5.4vw,4.25rem)' : 'clamp(2.8rem,6.6vw,5.5rem)'

  return (
    <article
      data-alt={alt}
      aria-labelledby={`camp-${project.id}`}
      className="relative grid items-center gap-y-8 md:gap-y-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8"
    >
      <div className={`relative lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`}>
        <div className="mat p-2 md:p-2.5">
          <div className="aspect-[16/10] overflow-hidden bg-sand/50">
            {main && (
              <img src={main.src} alt={`${project.title}: ${main.label}`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            )}
          </div>
        </div>
        {second && (
          <div className={`mat absolute -bottom-10 hidden w-[38%] p-1.5 md:block -right-6 ${flip ? 'lg:-left-6 lg:right-auto' : ''}`}>
            <div className="aspect-[4/3] overflow-hidden bg-sand/50">
              <img src={second.src} alt={`${project.title}: ${second.label}`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            </div>
          </div>
        )}
      </div>

      <div className={`min-w-0 [container-type:inline-size] lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1' : ''}`}>
        <h3
          id={`camp-${project.id}`}
          className="wordmark !text-sand"
          style={{ fontSize: `min(${size}, ${fit})` }}
        >
          {name}
        </h3>
        <p className="mt-4 max-w-[34ch] text-lg leading-snug text-cream">{project.subtitle}</p>
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[0.95rem]">
          <dt className="text-paper/80">Role</dt>
          <dd className="text-cream">{project.role}</dd>
          {project.timeline && (
            <>
              <dt className="text-paper/80">When</dt>
              <dd className="tabnum text-cream">{project.timeline}</dd>
            </>
          )}
          {project.team && (
            <>
              <dt className="text-paper/80">Team</dt>
              <dd className="text-cream">{project.team}</dd>
            </>
          )}
        </dl>
        {project.badge && (
          <p className="mt-6 inline-block bg-tan px-3 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-night">{project.badge}</p>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to={`/case-studies/${project.id}`}
            className="mat on-cream inline-flex min-h-11 items-center gap-2 px-5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-action transition-colors hover:bg-white"
          >
            Read the case study <Arrow className="h-4 w-4" />
            <span className="sr-only-x"> for {project.title}</span>
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-[0.8rem] font-bold text-cream underline decoration-1 underline-offset-[0.4em] hover:text-white"
            >
              Visit {project.title} <Arrow up className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

/** The switchback between two camps, with the altitude marked at the turn. */
export function Switchback({ from, alt }: { from: 'left' | 'right'; alt: number }) {
  const a = from === 'left' ? 30 : 70
  const b = from === 'left' ? 70 : 30
  return (
    <div className="relative h-28 md:h-40" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block">
        <path
          d={`M${a} 0L${a} 28L${b} 72L${b} 100`}
          fill="none"
          stroke="#eeebe2"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <svg viewBox="0 0 10 100" preserveAspectRatio="none" className="absolute inset-y-0 left-6 h-full w-4 lg:hidden">
        <path d="M5 0L5 100" stroke="#eeebe2" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />
      </svg>
      <p className="tabnum absolute left-12 top-1/2 flex -translate-y-1/2 items-center gap-2 bg-peri-deep px-3 py-1 text-sm text-paper lg:left-1/2 lg:-translate-x-1/2">
        <svg viewBox="0 0 14 10" className="h-2.5 w-3.5 text-sand" aria-hidden="true">
          <path d="M0 10L7 0L14 10ZM5.2 10L7 6.6L8.8 10Z" fill="currentColor" fillRule="evenodd" />
        </svg>
        Camp at {fmt.format(alt)} m
      </p>
    </div>
  )
}
