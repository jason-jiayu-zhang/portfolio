
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FeaturedGrid from './components/FeaturedGrid'
import StudioSection from './components/StudioSection'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import { useIntro, IntroProvider } from './components/IntroContext'
import { useScanline } from './components/ScanlineContext'
import './index.css'

function AppContent() {
  const { phase } = useIntro()
  const isPhase3 = phase === 'phase03'
  const { scanlineActive } = useScanline()

  return (
    <div className={`min-h-screen flex flex-col bg-primary${scanlineActive ? ' scanline-overlay' : ''}`}>
      {/* Persistent nav */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* § 1 — Wheel featured: 100vh split */}
        <HeroSection />

        {isPhase3 && (
          <>
            {/* § 1.5 — Featured grid: static fallback for the 4 wheel projects */}
            <div className="contain-section">
              <FeaturedGrid />
            </div>

            {/* § 2 — Studio section: off-a-whim experiments */}
            <div className="contain-section">
              <StudioSection />
            </div>

            {/* § 4 — 3-column About / Foundations */}
            <div className="contain-section">
              <AboutSection />
            </div>
          </>
        )}
      </main>

      {/* § 5 — Baseline footer */}
      {isPhase3 && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <IntroProvider>
      <AppContent />
    </IntroProvider>
  )
}
