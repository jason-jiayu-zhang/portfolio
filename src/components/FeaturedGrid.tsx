import { Link } from 'react-router-dom'
import { PROJECTS } from '../data/portfolio'

// ─── Featured Grid ──────────────────────────────────────────────────────────
// Static fallback for the 4 wheel projects — surfaces role & stack even if
// a viewer scrolls past the interactive wheel without engaging it.
export default function FeaturedGrid() {
  return (
    <section id="featured-grid" className="relative pt-8 md:pt-12 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-4 border-b border-accent/30">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="label-caps text-gold">FEATURED /</span>
          <div className="w-px h-4 bg-accent/50" />
          <span className="font-mono text-xs text-parchment/65 tracking-wide">
            ALL FOUR, AT A GLANCE
          </span>
        </div>
        <span className="label-caps opacity-90">{PROJECTS.length.toString().padStart(2, '0')} PROJECTS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-primary pl-px pt-px border-b border-r border-accent/20">
        {PROJECTS.map((proj, i) => (
          <Link
            key={proj.id}
            to={`/work/${proj.id}`}
            viewTransition
            className="group relative flex flex-col gap-3 p-4 sm:p-5 border border-accent/20 -mt-px -ml-px bg-primary cursor-pointer hover:bg-surface/10 transition-colors duration-200"
          >
            {/* Accent bar — ties back to wheel color coding */}
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: proj.accentColor, opacity: 0.7 }} />

            {/* Preview thumbnail */}
            <div className="relative -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-1 aspect-video overflow-hidden border-b border-accent/20 bg-surface/10">
              {proj.caseStudy?.images?.[0] ? (
                <img
                  src={proj.caseStudy.images[0].src}
                  alt={proj.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-[opacity,transform] duration-200 ease-out"
                  style={{ willChange: 'transform, opacity' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-200">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={proj.accentColor} strokeWidth="0.75">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" strokeDasharray="2 3" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between font-mono text-xs tracking-label uppercase text-parchment/50">
              <span>0{i + 1} / 0{PROJECTS.length}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full border"
                  style={{
                    backgroundColor: proj.status === 'live' ? proj.accentColor : 'transparent',
                    borderColor: proj.status === 'live' ? proj.accentColor : 'rgba(207,204,187,0.3)',
                  }}
                />
                {proj.status === 'live' ? 'Live' : proj.status === 'offline' ? 'Offline' : 'Archived'}
              </span>
            </div>

            <div>
              <h3 className="font-sans font-bold text-lg text-parchment leading-tight tracking-tight group-hover:opacity-80 transition-opacity">
                {proj.title}
              </h3>
              <p className="font-mono text-xs mt-1" style={{ color: proj.accentColor }}>
                {proj.role}
              </p>
            </div>

            <p className="font-mono text-xs text-parchment/65 leading-relaxed">
              {proj.subtitle}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-1">
              {proj.tools.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 text-[10px] font-mono tracking-label rounded-sm border border-accent/25 text-parchment/70"
                >
                  {t}
                </span>
              ))}
            </div>

            {proj.metrics[0] && (
              <div className="flex flex-col gap-0.5 mt-auto pt-3">
                <span className="font-mono text-[10px] tracking-label text-parchment/50 uppercase">
                  {proj.metrics[0].label}
                </span>
                <span className="font-mono text-sm font-medium" style={{ color: proj.accentColor }}>
                  {proj.metrics[0].value}
                </span>
              </div>
            )}

            <div className="font-mono text-xs text-parchment/65 group-hover:translate-x-1 group-hover:text-white transition-all duration-200">
              Read Case Study →
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
