import { BIO } from '../data/portfolio'

// Center-out underline link
function SocialLink({ href, label, handle }: { href: string; label: string; handle: string }) {
  return (
    <a
      href={href}
      target={label !== 'Email' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="group flex flex-col items-start gap-0.5"
    >
      <span className="font-mono text-xs tracking-label text-parchment/65 group-hover:text-parchment/70 uppercase transition-colors duration-200">
        {label}
      </span>
      <span className="relative font-mono text-xs text-parchment/65 group-hover:text-parchment/65 transition-colors duration-200">
        {handle}
        {/* Center-out underline — expo-out gives whip-snap reveal */}
        <span
          className="absolute -bottom-px left-0 right-0 h-px bg-parchment/40"
          style={{
            transform: 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          data-social-underline
        />
      </span>
      <style>{`a:hover [data-social-underline] { transform: scaleX(1) !important; }`}</style>
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative mt-auto bg-primary"
      style={{ borderTop: '1px solid rgba(56,64,106,0.4)' }}
    >
      {/* Tagline strip */}
      <div className="flex items-center justify-center py-3 border-b border-accent/15">
        <p className="font-mono text-xs text-parchment/65 tracking-wide italic">
          "{BIO.tagline}"
        </p>
      </div>

      {/* Main row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 lg:px-10 py-6 md:py-5">
        {/* Left — identity */}
        <div className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            className="w-[18px] h-[18px] object-contain"
            alt="Logo"
          />
          <span className="font-mono text-xs text-parchment/70 tracking-label uppercase">
            {BIO.fullName}
          </span>
          <div className="hidden sm:block w-px h-3 bg-accent/50" />
          <span className="hidden sm:block font-mono text-xs text-parchment/65 tracking-label uppercase">
            {BIO.roles[0]}
          </span>
        </div>

        {/* Center — social links with center-out underlines */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-8">
          {BIO.socials.map((social) => (
            <SocialLink
              key={social.platform}
              href={social.url}
              label={social.platform}
              handle={social.handle}
            />
          ))}
        </nav>

        {/* Right — copyright */}
        <div className="font-mono text-xs text-parchment/65 tracking-label">
          © {year}
        </div>
      </div>

      {/* Baseline strip */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-2 px-8 lg:px-10 py-3 sm:py-2 text-center"
        style={{ borderTop: '1px solid rgba(56,64,106,0.15)' }}
      >
        <span className="font-mono text-xs text-parchment/65 tracking-label uppercase">
          DESIGNED & ENGINEERED BY {BIO.fullName.split(' ')[0]}
        </span>
        <span className="font-mono text-xs text-parchment/65 tracking-label uppercase">
          ALL SYSTEMS NOMINAL
        </span>
      </div>
    </footer>
  )
}
