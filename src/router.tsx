// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-SIDE ROUTER
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom'
import App from './App'
import Header from './components/Header'
import { lazy, Suspense } from 'react'
import { ScanlineProvider, useScanline } from './components/ScanlineContext'

const ProjectCaseStudyPage = lazy(() => import('./pages/ProjectCaseStudyPage'))
const ExperimentLogPage = lazy(() => import('./pages/ExperimentLogPage'))
const Footer = lazy(() => import('./components/Footer'))

// ── Shell wrapper for sub-pages (Header + Footer only) ───────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  const { scanlineActive } = useScanline()
  return (
    <div className={`min-h-screen flex flex-col bg-primary${scanlineActive ? ' scanline-overlay' : ''}`}>
      <Header />
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'work/:slug',
        element: (
          <PageShell>
            <Suspense fallback={<div className="min-h-screen bg-primary" />}>
              <ProjectCaseStudyPage />
            </Suspense>
          </PageShell>
        ),
      },
      {
        path: 'studio/:id',
        element: (
          <PageShell>
            <Suspense fallback={<div className="min-h-screen bg-primary" />}>
              <ExperimentLogPage />
            </Suspense>
          </PageShell>
        ),
      },
    ],
  },
])


export function RouterRoot() {
  return (
    <ScanlineProvider>
      <RouterProvider router={router} />
    </ScanlineProvider>
  )
}
