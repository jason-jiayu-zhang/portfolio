import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, Navigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { SmoothScroll } from './components/SmoothScroll'
import { NOTES, loadBody } from './data/notes'
import { useDescentDirection } from './utils/descent'

const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const ExperimentPage = lazy(() => import('./pages/ExperimentPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const fallback = <div className="min-h-screen bg-ground" />

function RootLayout() {
  useDescentDirection()
  return (
    <SmoothScroll>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollRestoration />
      <Outlet />
    </SmoothScroll>
  )
}

function LegacyWorkRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/case-studies/${slug}`} replace />
}

function RouteErrorBoundary() {
  const error = useRouteError()
  const faultLabel = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unhandled error'
  return (
    <Suspense fallback={fallback}>
      <NotFoundPage variant="error" faultLabel={faultLabel} />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    hydrateFallbackElement: fallback,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'case-studies/:slug', element: <Suspense fallback={fallback}><CaseStudyPage /></Suspense> },
      { path: 'work/:slug', element: <LegacyWorkRedirect /> },
      { path: 'studio/:id', element: <Suspense fallback={fallback}><ExperimentPage /></Suspense> },
      // Notes resolve their code (and a note its text) before the page changes,
      // so the view transition moves between two finished pages, never a blank one.
      { path: 'notes', lazy: async () => ({ Component: (await import('./pages/NotesPage')).default }) },
      {
        path: 'notes/:slug',
        loader: ({ params }) => {
          const note = NOTES.find((n) => n.slug === params.slug)
          return note ? loadBody(note) : null
        },
        lazy: async () => ({ Component: (await import('./pages/NotePage')).default }),
      },
      { path: 'resume', lazy: async () => ({ Component: (await import('./pages/ResumePage')).default }) },
      { path: '*', element: <Suspense fallback={fallback}><NotFoundPage /></Suspense> },
    ],
  },
])

export function RouterRoot() {
  return <RouterProvider router={router} />
}
