import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Logo from '../components/Logo'
import { RESUME } from '../data/resume'
import { ridge } from '../descent/terrain'
import { BIO } from '../data/portfolio'

// The resume as one Letter page. On screen it is a sheet on the dusk ground;
// printed (and so in public/Resume.pdf, which `npm run resume` prints from this
// route) only the sheet remains. Everything is real text in reading order, so
// applicant tracking systems parse it: each section's label comes before it.

const RIDGE_H = 60
const RIDGE = ridge(11, RIDGE_H, 0.15, 0.9)

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="resume-section">
      <h2 className="resume-label">{label}</h2>
      <div>{children}</div>
    </section>
  )
}

export default function ResumePage() {
  const sheet = useRef<HTMLElement>(null)
  useEffect(() => {
    document.title = `Resume — ${RESUME.name}`
    // For `npm run resume`: once the type has loaded, record whether the
    // content fits one Letter page, so a sheet that overflows (and would print
    // cut off) is refused rather than shipped.
    document.fonts.ready.then(() => {
      const el = sheet.current
      if (!el) return
      const over = el.scrollHeight - 11 * 96
      document.documentElement.dataset.resumeFit = over > 0 ? `over-${Math.ceil(over)}px` : 'ok'
    })
  }, [])

  return (
    <div className="min-h-screen">
      <div className="resume-chrome">
        <Header label="Resume" />
      </div>
      <main id="main" tabIndex={-1} className="resume-main outline-none mx-auto max-w-[1080px] px-3 pb-24 pt-[7.5rem] md:px-6 md:pt-[9.5rem] lg:px-0">
        <div className="resume-chrome mx-auto mb-6 flex max-w-[8.5in] flex-wrap items-center justify-between gap-4">
          <h1 className="wordmark !text-sand text-[clamp(2.4rem,6vw,4rem)]">Resume</h1>
          <a
            href={BIO.resumeUrl}
            download="Jason-Jiayu-Zhang-Resume.pdf"
            className="mat on-cream inline-flex min-h-11 items-center gap-2 px-5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-action transition-colors hover:bg-white"
          >
            Download PDF
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" aria-hidden="true">
              <path d="M10 3.5v10M5.5 9l4.5 4.5L14.5 9M4 16.5h12" />
            </svg>
          </a>
        </div>

        <article ref={sheet} className="resume-sheet" aria-label={`Resume of ${RESUME.name}`}>
          <header className="resume-head">
            <div>
              <p className="resume-name">
                <Logo className="resume-logo" />
                {RESUME.name}
              </p>
              <p className="resume-title">{RESUME.title}</p>
            </div>
            <ul className="resume-contact">
              {RESUME.contact.map((c) => (
                <li key={c.href} className={'printOnly' in c && c.printOnly ? 'print-only' : undefined}>
                  <a href={c.href}>{c.label}</a>
                </li>
              ))}
            </ul>
          </header>

          {/* The rule under the name is a ridge line: the site's drawn edge, in ink. */}
          <svg className="resume-ridge" viewBox={`0 0 1440 ${RIDGE_H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d={RIDGE} />
          </svg>

          <Section label="Experience">
            {RESUME.experience.map((r) => (
              <div key={r.org} className="resume-role">
                <p className="resume-row">
                  <span>
                    <strong>{r.org}</strong>
                    <span className="resume-sep" aria-hidden="true"> · </span>
                    <span className="resume-sub">{r.role}</span>
                  </span>
                  <span className="resume-date">{r.period}</span>
                </p>
                <ul className="resume-points">
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section label="Education">
            <p className="resume-row">
              <span>
                <strong>{RESUME.education.school}</strong>
                <span className="resume-sep" aria-hidden="true"> · </span>
                <span className="resume-sub">{RESUME.education.degrees}</span>
              </span>
              <span className="resume-date">{RESUME.education.period}</span>
            </p>
          </Section>

          <Section label="Awards">
            <ul className="resume-awards">
              {RESUME.awards.map((a) => (
                <li key={a.name}>
                  <strong>{a.name}</strong>, {a.at}
                  {a.year && ` ${a.year}`}
                </li>
              ))}
            </ul>
          </Section>

          <Section label="Skills">
            <div className="resume-skills">
              {RESUME.skills.map((g) => (
                <p key={g.group}>
                  <strong>{g.group}:</strong> {g.items.join(', ')}
                </p>
              ))}
            </div>
          </Section>
        </article>
      </main>
    </div>
  )
}
