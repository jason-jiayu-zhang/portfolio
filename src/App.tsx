
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import CustomCursor from './components/CustomCursor'
import { useIntro, IntroProvider } from './components/IntroContext'
import { useScanline } from './components/ScanlineContext'
import './index.css'
import { lazy, Suspense } from 'react'

const FeaturedGrid = lazy(() => import('./components/FeaturedGrid'))
const StudioSection = lazy(() => import('./components/StudioSection'))
const Footer = lazy(() => import('./components/Footer'))

function AppContent() {
  const { phase } = useIntro()
  const isPhase3 = phase === 'phase03'
  const { scanlineActive } = useScanline()

  return (
    <div className={`min-h-screen flex flex-col bg-primary${scanlineActive ? ' scanline-overlay' : ''}`}>
      <CustomCursor />

      {/* Persistent nav */}
      <Header />

      <main className="flex-1 flex flex-col">
        {/* § 1 — Wheel featured: 100vh split */}
        <HeroSection />

        {isPhase3 && (
          <Suspense fallback={null}>
            {/* § 1.5 — Featured grid: static fallback for the 4 wheel projects */}
            <div className="contain-section">
              <FeaturedGrid />
            </div>

            {/* § 2 — Studio section: off-a-whim experiments */}
            <div className="contain-section">
              <StudioSection />
            </div>
          </Suspense>
        )}
      </main>

      {/* § 5 — Baseline footer */}
      {isPhase3 && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
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
