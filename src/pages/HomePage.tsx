import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BIO, PROJECTS } from '../data/portfolio'
import Altimeter from '../descent/Altimeter'
import Summit from '../descent/Summit'
import { Camp, Switchback } from '../descent/Camp'
import Treeline from '../descent/Treeline'
import Edge from '../descent/Edge'
import Lake from '../descent/Lake'
import BaseCamp from '../descent/BaseCamp'
import { Contact, FloorFooter } from '../descent/Valley'

// Camps step down 300 m at a time below the work band's 3,600 m mark.
const campAlt = (i: number) => 3400 - i * 300

export default function HomePage() {
  const { hash } = useLocation()
  useEffect(() => {
    document.title = `${BIO.fullName} — Design Engineer`
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      el?.scrollIntoView()
      el?.focus({ preventScroll: true })
    }
  }, [hash])

  const [first, middle, last] = BIO.fullName.split(' ')

  return (
    <div className="min-h-screen bg-night">
      <Altimeter />

      <header id="top" data-alt={4200} className="relative min-h-[max(600px,80svh)] overflow-clip bg-peri">
        <Summit className="absolute inset-x-0 bottom-0 h-[56%] w-full md:h-full" />
        <div className="band-inner relative pb-[calc(var(--hero-overlap)+var(--ridge-h)+2rem)] pt-24 lg:pt-[max(5rem,11svh)]">
          <h1 className="wordmark !text-night text-[clamp(3.4rem,8.4vw,8.5rem)] !leading-[0.84]">
            {first} {middle}
            <br />
            {last}
          </h1>
          <p className="mt-6 max-w-[21ch] text-[clamp(1.35rem,2.2vw,1.9rem)] font-bold leading-[1.15] tracking-[-0.015em] text-night">
            To discover every peak of design.
          </p>
          <p className="mt-3 max-w-[30ch] text-base text-night md:text-lg">
            I'm a product designer, engineer, and manager, shipping products for over 65,000 users.
          </p>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        <section id="work" tabIndex={-1} aria-labelledby="work-h" data-alt={3600} className="relative z-10 mt-[calc(var(--hero-overlap)*-1)] bg-peri-deep outline-none">
          <Edge kind="ridge" />
          <div className="band-inner pb-40 pt-4 md:pb-56 md:pt-0">
            <h2 id="work-h" className="wordmark relative -top-1 !text-sand text-[clamp(3.5rem,9vw,7.5rem)]">
              Ascents
            </h2>
            <div className="mt-6 md:mt-8">
              {PROJECTS.map((p, i) => (
                <div key={p.id}>
                  {i > 0 && <Switchback from={i % 2 === 1 ? 'left' : 'right'} alt={campAlt(i)} />}
                  <Camp project={p} alt={campAlt(i)} flip={i % 2 === 1} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Treeline />
        <Lake />
        <BaseCamp />
        <Contact />
      </main>
      <FloorFooter />
    </div>
  )
}
