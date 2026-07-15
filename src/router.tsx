// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-SIDE ROUTER
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import App from './App'
import Header from './components/Header'
import { lazy, Suspense } from 'react'
import { ScanlineProvider, useScanline } from './components/ScanlineContext'
import { SmoothScroll } from './components/SmoothScroll'

const ProjectCaseStudyPage = lazy(() => import('./pages/ProjectCaseStudyPage'))
const ExperimentLogPage = lazy(() => import('./pages/ExperimentLogPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
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
    <SmoothScroll>
      <ScrollRestoration />
      <Outlet />
    </SmoothScroll>
  )
}

// Styled fallback for thrown route/render faults — reuses the 404 console in
// its 'error' variant so an unexpected crash still lands somewhere considered.
function RouteErrorBoundary() {
  const error = useRouteError()
  const faultLabel = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'unhandled exception'
  return (
    <PageShell>
      <Suspense fallback={<div className="min-h-screen bg-primary" />}>
        <NotFoundPage variant="error" faultLabel={faultLabel} />
      </Suspense>
    </PageShell>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
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
      {
        // Catch-all — any unresolvable URL lands on the off-grid recovery console.
        path: '*',
        element: (
          <PageShell>
            <Suspense fallback={<div className="min-h-screen bg-primary" />}>
              <NotFoundPage />
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
