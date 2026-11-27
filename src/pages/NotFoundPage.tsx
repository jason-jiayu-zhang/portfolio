import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { Contact, FloorFooter } from '../descent/Valley'

export default function NotFoundPage({ variant = 'missing', faultLabel }: { variant?: 'missing' | 'error'; faultLabel?: string }) {
  const error = variant === 'error'
  return (
    <div className="min-h-screen">
      <Header label="Off the trail" />
      <main id="main" tabIndex={-1} className="outline-none mx-auto max-w-[1080px] px-3 pb-10 pt-[9.5rem] md:px-6 md:pt-[11.5rem] lg:px-0">
        <h1 className="wordmark !text-cream text-[length:clamp(3rem,11vw,8rem)]">{error ? 'Lost the trail' : 'Off the trail'}</h1>
        <p className="mt-6 max-w-[52ch] text-lg text-paper">
          {error
            ? 'Something broke on the way up. Head back to the base and try again.'
            : 'There is no page at this address. The work, the studio and the resume are all back at the base.'}
        </p>
        {faultLabel && <p className="tabnum mt-3 text-sm text-mist">{faultLabel}</p>}
        <Link to="/" className="on-cream mat mt-8 inline-flex min-h-11 items-center px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-action">
          Back to base
        </Link>
      </main>
      <div className="mt-40 md:mt-56">
        <Contact />
      </div>
      <FloorFooter />
    </div>
  )
}
