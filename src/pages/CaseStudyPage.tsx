import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import Altimeter from '../descent/Altimeter'
import type { Stop } from '../descent/Altimeter'
import Edge from '../descent/Edge'
import RouteProfile, { RouteList } from '../descent/RouteProfile'
import type { Waypoint } from '../descent/RouteProfile'
import { Arrow } from '../descent/Camp'
import { campAlt } from '../descent/terrain'
import { FloorFooter } from '../descent/Valley'
import { PROJECTS } from '../data/portfolio'
import type { CaseStudyCallout, CaseStudyImage, CaseStudyList } from '../types/portfolio'

type Band = 'alpine' | 'treeline' | 'lake' | 'camp' | 'valley'
type Leg = { id: string; label: string; short?: string; band: Band; waypoint?: boolean }

const VALLEY_ALT = 300
const round10 = (n: number) => Math.round(n / 10) * 10
const fmt = new Intl.NumberFormat('en-US')

function Prose({ paragraphs, list, after, className = 'mt-5' }: { paragraphs?: string[]; list?: CaseStudyList; after?: string[]; className?: string }) {
  if (!paragraphs?.length && !list && !after?.length) return null
  const ListTag = list?.ordered ? 'ol' : 'ul'
  return (
    <div className={`cs-prose text-paper ${className}`}>
      {paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
      {list && (
        <ListTag className={`${paragraphs?.length ? 'mt-4' : ''} space-y-2.5 pl-6 ${list.ordered ? 'list-decimal' : 'list-disc'} marker:text-sand`}>
          {list.items.map((item, i) => {
            const [lead, ...rest] = item.split(': ')
            return (
              <li key={i} className="pl-1">
                {rest.length ? (
                  <>
                    <strong className="font-bold text-cream">{lead}.</strong> {rest.join(': ')}
                  </>
                ) : (
                  item
                )}
              </li>
            )
          })}
        </ListTag>
      )}
      {after?.map((p, i) => (
        <p key={i} className={i === 0 && list ? 'mt-4' : undefined}>
          {p}
        </p>
      ))}
    </div>
  )
}

function Callouts({ items }: { items: CaseStudyCallout[] }) {
  return (
    <div className="mt-6 grid max-w-[52rem] gap-4 md:grid-cols-2">
      {items.map((c, i) => (
        <div key={i}>
          {c.label && <h4 className="mb-2 text-lg font-bold text-cream">{c.label}</h4>}
          <p className="mat on-cream px-5 py-4 text-[0.95rem] leading-snug text-night">
            {c.lead && <strong className="font-bold">{c.lead} </strong>}
            {c.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function Screen({ image, eager = false, caption = true }: { image: CaseStudyImage; eager?: boolean; caption?: boolean }) {
  return (
    <figure className="mat on-cream p-2 md:p-2.5">
      <img
        src={image.src}
        alt={image.description ?? image.label}
        width={1600}
        height={1200}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchPriority: 'high' as const } : {})}
        className="block h-auto w-full bg-sand/50"
      />
      {caption && (
        <figcaption className="px-1 pb-0.5 pt-2.5 text-sm leading-snug">
          <span className="font-bold text-action">{image.label}</span>
          {image.description && <span className="text-night/80"> · {image.description}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/** One leg of the route: a stop on the altimeter and an anchor target. */
function Section({ leg, alt, children }: { leg: Leg; alt: number; children: ReactNode }) {
  // Waypoint legs repeat the profile: a dashed contour across the band, the
  // diamond marker and the larger heading. Minor stops get a tick and a step down.
  const major = Boolean(leg.waypoint)
  return (
    <section
      id={leg.id}
      data-alt={alt}
      tabIndex={-1}
      aria-labelledby={`${leg.id}-h`}
      className={`cs-stop outline-none lg:grid lg:grid-cols-12 lg:gap-x-10 ${major ? 'border-t border-dashed border-cream/30 pt-10 md:pt-12' : ''}`}
    >
      {/* At lg the heading and its altitude stand in the margin and stay with the section. */}
      <div className="lg:sticky lg:top-8 lg:col-span-4 lg:self-start lg:pr-4">
        <h2
          id={`${leg.id}-h`}
          className={`max-w-[34rem] font-bold leading-[1.2] tracking-[-0.01em] text-cream ${major ? 'text-[1.5rem] md:text-[1.875rem]' : 'text-xl md:text-[1.5rem]'}`}
        >
          {leg.label}
        </h2>
        <p className="tabnum mt-2.5 flex items-center gap-2.5 text-[0.8rem] font-medium text-mist">
          {major ? (
            <span className="h-2 w-2 rotate-45 bg-sand" aria-hidden="true" />
          ) : (
            <span className="h-px w-2 bg-mist" aria-hidden="true" />
          )}
          {fmt.format(alt)} m
        </p>
      </div>
      <div className="mt-5 lg:col-span-8 lg:mt-0 [&>*:first-child]:mt-0">{children}</div>
    </section>
  )
}

function buildEmbedSrc(src: string) {
  try {
    const url = new URL(src)
    // Defaults only: a link exported with its own colors keeps them.
    const defaults = { bg: 'transparent', text: '1c2035', empty: 'e0dcd0' }
    for (const [k, v] of Object.entries(defaults)) if (!url.searchParams.has(k)) url.searchParams.set(k, v)
    return url.toString()
  } catch {
    return src
  }
}

/** The Fimanu embed sleeps on a free host; say so until the frame has loaded. */
function LiveEmbed({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)
  const embedSrc = useMemo(() => buildEmbedSrc(src), [src])
  return (
    <div
      className="mat on-cream relative mt-6 h-[228px] w-full max-w-[52rem] overflow-hidden sm:h-[204px]"
      style={{ colorScheme: 'only light' }}
    >
      {!loaded && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-[0.95rem] text-action" role="status">
          Waking the widget. It runs on a free host, so this can take a few seconds.
        </p>
      )}
      <iframe
        title="Live Figma activity heatmap"
        src={embedSrc}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ colorScheme: 'only light' }}
        className={`relative block h-full w-full border-0 bg-transparent transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

const BAND_CLASS: Record<Band, string> = {
  alpine: 'z-10 bg-peri-deep',
  treeline: 'z-20 bg-ground',
  lake: 'z-30 bg-ground-deep',
  camp: 'z-[35] bg-[#262a48]',
  valley: 'z-40 bg-night',
}
const EDGE: Record<Exclude<Band, 'alpine'>, 'treeline' | 'shore' | 'camp' | 'valley'> = {
  treeline: 'treeline',
  lake: 'shore',
  camp: 'camp',
  valley: 'valley',
}

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const { hash } = useLocation()
  const index = PROJECTS.findIndex((p) => p.id === slug)
  const project = PROJECTS[index]
  const cs = project?.caseStudy
  const top = campAlt(Math.max(0, index))

  // Every image shown in the story; Screens only lists the rest.
  const hero = cs?.images?.[0]
  const screens = useMemo(() => {
    if (!cs?.images) return []
    const shown = new Set([hero?.src, ...(cs.sections ?? []).flatMap((s) => (s.blocks ?? []).map((b) => b.image?.src))])
    return cs.images.filter((img) => !shown.has(img.src))
  }, [cs, hero])

  const legs = useMemo<Leg[]>(() => {
    if (!cs) return []
    const story = cs.sections ?? []
    const out: Leg[] = []
    if (cs.problemSpace?.length) out.push({ id: 'problem', label: 'The Problem', short: 'Problem', band: 'alpine', waypoint: true })
    story.forEach((s, i) =>
      out.push({ id: s.id, label: s.title, short: s.nav, band: 'treeline', waypoint: Boolean(s.blocks?.length) || (i === 0 && !cs.problemSpace?.length) }),
    )
    if (cs.systemArchitecture?.length) out.push({ id: 'built', label: 'How it works', band: 'treeline' })
    out.push({ id: 'results', label: 'Results', band: 'lake', waypoint: true })
    if (cs.figmaActivityEmbedUrl) out.push({ id: 'live', label: 'Live activity', short: 'Live', band: 'lake' })
    if (cs.lessons) out.push({ id: 'lessons', label: 'What I learned', short: 'Learned', band: 'camp', waypoint: true })
    if (cs.roadmap) out.push({ id: 'roadmap', label: "What's next", band: 'camp' })
    if (screens.length) out.push({ id: 'screens', label: 'Screens', band: 'valley' })
    out.push({ id: 'next', label: 'Next ascent', band: 'valley' })
    return out
  }, [cs, screens])

  // The route steps down evenly from the camp to the valley floor.
  const altOf = useMemo(() => {
    const m = new Map<string, number>()
    legs.forEach((l, i) => m.set(l.id, round10(top - ((i + 1) * (top - VALLEY_ALT)) / legs.length)))
    return m
  }, [legs, top])

  const stops = useMemo<Stop[]>(
    () => [{ id: 'top', label: 'Camp', alt: top }, ...legs.map((l) => ({ id: l.id, label: l.label, short: l.short, alt: altOf.get(l.id)! }))],
    [legs, altOf, top],
  )
  const waypoints = useMemo<Waypoint[]>(
    () => legs.filter((l) => l.waypoint).map((l) => ({ id: l.id, label: l.label, short: l.short, alt: altOf.get(l.id)! })),
    [legs, altOf],
  )

  useEffect(() => {
    if (!project) return
    document.title = `${project.title} — Jason Jiayu Zhang`
    const el = hash ? document.getElementById(hash.slice(1)) : null
    if (el) {
      el.scrollIntoView()
      el.focus({ preventScroll: true })
    } else window.scrollTo(0, 0)
  }, [project, hash])

  if (!project || !cs) return <NotFoundPage />

  const next = PROJECTS[(index + 1) % PROJECTS.length]
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length]
  const lede = cs.lede ?? cs.glance?.impact ?? cs.executiveSummary
  const long = project.slug.length > 9
  const legsIn = (band: Band) => legs.filter((l) => l.band === band)

  const facts: [string, string | undefined][] = [
    ['Role', project.role],
    ['When', project.timeline],
    ['Team', project.team],
    ['Built with', project.tools.join(', ')],
  ]

  const renderLeg = (leg: Leg): ReactNode => {
    const alt = altOf.get(leg.id)!
    const story = cs.sections?.find((s) => s.id === leg.id)
    if (story)
      return (
        <Section key={leg.id} leg={leg} alt={alt}>
          <Prose paragraphs={story.paragraphs} list={story.list} after={story.after} />
          {story.blocks?.map((b) => (
            <div key={b.heading} className="mt-12">
              <h3 className="max-w-[34rem] text-[1.125rem] font-bold leading-[1.35] text-cream md:text-xl">{b.heading}</h3>
              <Prose paragraphs={b.paragraphs} list={b.list} after={b.after} className="mt-3" />
              {b.callouts && <Callouts items={b.callouts} />}
              {b.image && (
                <div className="mt-7 max-w-[52rem]">
                  <Screen image={b.image} />
                </div>
              )}
            </div>
          ))}
        </Section>
      )

    switch (leg.id) {
      case 'problem':
        return (
          <Section key={leg.id} leg={leg} alt={alt}>
            <Prose paragraphs={cs.problemSpace} />
            {cs.problemCallouts && <Callouts items={cs.problemCallouts} />}
          </Section>
        )
      case 'built':
        return (
          <Section key={leg.id} leg={leg} alt={alt}>
            <Prose paragraphs={cs.systemArchitecture} />
          </Section>
        )
      case 'results':
        return (
          <Section key={leg.id} leg={leg} alt={alt}>
            <ul className="mt-2 max-w-[52rem] border-t border-mist/20">
              {cs.validation.map((v) => {
                const line = typeof v === 'string' ? { figure: '', body: v } : v
                return (
                  <li key={line.body} className="grid gap-x-8 gap-y-2 border-b border-mist/20 py-6 md:grid-cols-[11rem_minmax(0,1fr)] md:items-baseline">
                    {line.figure ? (
                      <span className="tabnum text-[2.6rem] font-black leading-none tracking-[-0.03em] text-sand">
                        {line.figure}
                      </span>
                    ) : (
                      <span className="hidden md:block" aria-hidden="true" />
                    )}
                    <p className="max-w-[34rem] text-[1.0625rem] leading-[1.6] text-paper">{line.body}</p>
                  </li>
                )
              })}
            </ul>
            {cs.resultsNote && <p className="mt-5 max-w-[34rem] text-sm leading-relaxed text-mist">{cs.resultsNote}</p>}
            {cs.analyticsEmbedUrl && (
              <figure className="mt-10 max-w-[52rem]">
                <div className="mat on-cream relative h-[400px] w-full overflow-hidden bg-white" style={{ colorScheme: 'only light' }}>
                  <iframe
                    title="Cattlelog unique users over all time (PostHog)"
                    src={cs.analyticsEmbedUrl}
                    loading="lazy"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    className="block h-full w-full border-0"
                  />
                </div>
                {cs.analyticsEmbedNote && (
                  <figcaption className="mt-3 text-sm leading-relaxed text-mist">{cs.analyticsEmbedNote}</figcaption>
                )}
              </figure>
            )}
          </Section>
        )
      case 'live':
        return (
          <Section key={leg.id} leg={leg} alt={alt}>
            <p className="cs-prose mt-4 text-paper">
              {cs.liveActivityNote ??
                'The public embed widget, running against real Figma files. It loads from a free host, so it can take a few seconds to wake.'}
            </p>
            <LiveEmbed key={cs.figmaActivityEmbedUrl} src={cs.figmaActivityEmbedUrl!} />
            <a
              href={cs.figmaActivityEmbedUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] font-bold text-cream underline decoration-1 underline-offset-[0.4em] hover:text-white"
            >
              Open the widget in its own tab <Arrow up className="h-4 w-4" />
            </a>
          </Section>
        )
      case 'lessons':
        return (
          <Section key={leg.id} leg={leg} alt={alt}>
            {cs.lessons!.intro && <Prose paragraphs={[cs.lessons!.intro]} />}
            <ol className="mt-10 space-y-12">
              {cs.lessons!.items.map((l) => (
                <li key={l.title}>
                  <h3 className="max-w-[34rem] text-[1.125rem] font-bold leading-[1.35] text-cream md:text-xl">{l.title}</h3>
                  <p className="cs-prose mt-2 text-paper">{l.body}</p>
                  {l.rule && (
                    <p className="mat on-cream mt-5 max-w-[34rem] px-5 py-4 text-[0.95rem] leading-snug text-night">
                      <strong className="font-bold">The rule now: </strong>
                      {l.rule}
                    </p>
                  )}
                </li>
              ))}
            </ol>
            {cs.lessons!.outro && <Prose paragraphs={[cs.lessons!.outro]} className="mt-10" />}
          </Section>
        )
      case 'roadmap':
        return (
          <Section key={leg.id} leg={leg} alt={alt}>
            <Prose paragraphs={[cs.roadmap!]} />
          </Section>
        )
      case 'screens':
        return (
          <Section key={leg.id} leg={leg} alt={alt}>
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {screens.map((img) => (
                <Screen key={img.src} image={img} />
              ))}
            </div>
          </Section>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-night">
      <Altimeter stops={stops} top={top} fallbackId="top" homeLink back={{ to: '/#work', label: 'Ascents' }} />

      <header id="top" data-alt={top} tabIndex={-1} className="relative bg-peri text-night outline-none">
        <div className="band-inner pb-[calc(clamp(110px,18vw,250px)+28px)] pt-28 lg:pt-[8svh]">
          <h1
            className={`wordmark !text-night ${long ? 'text-[clamp(3rem,7vw,6.25rem)]' : 'text-[clamp(3.4rem,8.4vw,8.5rem)]'} !leading-[0.86]`}
          >
            {project.slug}
          </h1>
          <p className="mt-4 max-w-[26ch] text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold leading-[1.15] tracking-[-0.015em]">{project.subtitle}</p>
          <dl className="mt-7 grid max-w-[60rem] gap-x-10 gap-y-4 text-[0.95rem] sm:grid-cols-2 xl:grid-cols-[auto_auto_minmax(0,1fr)]">
            {facts
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className={k === 'Built with' ? 'sm:col-span-2 xl:col-span-3' : undefined}>
                  <dt className="text-[0.75rem] font-bold uppercase tracking-[0.14em]">{k}</dt>
                  <dd className={`mt-1 ${k === 'When' ? 'tabnum' : ''}`}>{v}</dd>
                </div>
              ))}
          </dl>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="mat on-cream mt-7 inline-flex min-h-11 items-center gap-2 px-5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-action transition-colors hover:bg-white"
            >
              Visit {project.title} <Arrow up className="h-4 w-4" />
            </a>
          )}
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        <div className={`relative ${BAND_CLASS.alpine}`}>
          <RouteProfile waypoints={waypoints} seed={7 + index * 4} />
          <div className="band-inner pb-32 pt-2 md:pb-48 md:pt-6">
            <div className="mb-8 md:hidden">
              <RouteList waypoints={waypoints} />
            </div>
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-x-10">
              <div className="lg:col-span-5">
                <p className="text-[clamp(1.2rem,1.7vw,1.45rem)] font-medium leading-[1.45] text-cream">{lede}</p>
                {cs.facts && (
                  <dl className="mt-8 space-y-5">
                    {cs.facts.map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-bold text-cream">{k}</dt>
                        <dd className="mt-1 text-paper">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
              {hero && (
                <div className="lg:col-span-7">
                  <Screen image={hero} eager caption={false} />
                </div>
              )}
            </div>
            {legsIn('alpine').length > 0 && <div className="mt-24 space-y-24 md:mt-32 md:space-y-28">{legsIn('alpine').map(renderLeg)}</div>}
          </div>
        </div>

        {(['treeline', 'lake', 'camp', 'valley'] as const).map((band) => {
          const inBand = legsIn(band)
          if (!inBand.length) return null
          return (
            <div key={band} className={`relative ${BAND_CLASS[band]}`}>
              <Edge kind={EDGE[band]} />
              <div className={`band-inner ${band === 'valley' ? 'pt-16 md:pt-24' : 'pb-32 pt-10 md:pb-48 md:pt-16'}`}>
                <div className="space-y-24 md:space-y-28">
                  {inBand.map((leg) =>
                    leg.id === 'next' ? (
                      <section key="next" id="next" data-alt={altOf.get('next')} tabIndex={-1} aria-labelledby="next-h" className="cs-stop outline-none">
                        <h2 id="next-h" className={`wordmark !text-sand ${next.slug.length > 9 ? 'text-[clamp(2.8rem,8vw,6rem)]' : 'text-[clamp(3.6rem,11vw,8.5rem)]'}`}>
                          <Link to={`/case-studies/${next.id}`} className="inline-flex items-baseline gap-[0.15em] transition-colors hover:!text-cream">
                            <span className="sr-only-x">Next ascent: </span>
                            {next.slug}
                            <Arrow className="h-[0.42em] w-[0.42em] shrink-0" />
                          </Link>
                        </h2>
                        <p className="mt-5 max-w-[40ch] text-lg text-mist">
                          Next ascent, camp at {fmt.format(campAlt((index + 1) % PROJECTS.length))} m. {next.subtitle}.
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2">
                          <Link
                            to={`/case-studies/${prev.id}`}
                            className="inline-flex min-h-11 items-center text-[0.95rem] font-bold text-cream underline decoration-1 underline-offset-[0.4em] hover:text-white"
                          >
                            Back to {prev.title}
                          </Link>
                          <Link
                            to="/#work"
                            className="inline-flex min-h-11 items-center text-[0.95rem] font-bold text-cream underline decoration-1 underline-offset-[0.4em] hover:text-white"
                          >
                            All ascents
                          </Link>
                        </div>
                      </section>
                    ) : (
                      renderLeg(leg)
                    ),
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </main>
      <FloorFooter />
    </div>
  )
}
