import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { Contact, FloorFooter } from '../descent/Valley'
import NotFoundPage from './NotFoundPage'
import { EXPERIMENTS } from '../data/portfolio'

export default function ExperimentPage() {
  const { id } = useParams<{ id: string }>()
  const i = EXPERIMENTS.findIndex((e) => e.id === id)
  const exp = EXPERIMENTS[i]
  useEffect(() => {
    if (exp) document.title = `${exp.title} — Studio — Jason Jiayu Zhang`
  }, [exp])
  if (!exp) return <NotFoundPage />
  const prev = EXPERIMENTS[(i - 1 + EXPERIMENTS.length) % EXPERIMENTS.length]
  const next = EXPERIMENTS[(i + 1) % EXPERIMENTS.length]

  return (
    <div className="min-h-screen">
      <Header label="Side Trails" />
      <main id="main" tabIndex={-1} className="outline-none mx-auto max-w-[1080px] px-3 pt-[7.5rem] md:px-6 md:pt-[9.5rem] lg:px-0">
        <Link to="/#studio" className="text-sm text-mist underline underline-offset-[0.3em] hover:text-cream">
          Back to the studio
        </Link>
        <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.03em] text-cream md:text-6xl">{exp.title}</h1>
        <p className="mt-3 text-mist">
          {exp.contextLabel} · <span className="tabnum">{exp.year}</span>
          {exp.role ? ` · ${exp.role}` : ''}
        </p>

        <figure className="mat mt-10 p-2.5 md:p-4">
          <img src={exp.imageUrl} alt={exp.title} className="block h-auto max-h-[80vh] w-full bg-sand/40 object-contain" />
        </figure>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {exp.log ? (
            <>
              <div>
                <h2 className="text-xl font-bold text-cream">What sparked it</h2>
                <p className="mt-2 text-paper">{exp.log.spark}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cream">What came out</h2>
                <p className="mt-2 text-paper">{exp.log.output}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cream">What I took from it</h2>
                <p className="mt-2 text-paper">{exp.log.sandbox}</p>
              </div>
            </>
          ) : (
            <p className="max-w-[60ch] text-lg text-paper md:col-span-3">{exp.description}</p>
          )}
        </div>

        <nav aria-label="More studio work" className="mt-20 flex justify-between gap-6 border-t border-sand/25 pt-6">
          <Link to={`/studio/${prev.id}`} className="group text-left">
            <span className="block text-xs text-mist">Previous</span>
            <span className="text-lg font-bold text-cream group-hover:underline">{prev.title}</span>
          </Link>
          <Link to={`/studio/${next.id}`} className="group text-right">
            <span className="block text-xs text-mist">Next</span>
            <span className="text-lg font-bold text-cream group-hover:underline">{next.title}</span>
          </Link>
        </nav>
      </main>
      <div className="mt-40 md:mt-56">
        <Contact />
      </div>
      <FloorFooter />
    </div>
  )
}
