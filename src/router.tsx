import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration, Navigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { SmoothScroll } from './components/SmoothScroll'

const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const ExperimentPage = lazy(() => import('./pages/ExperimentPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const fallback = <div className="min-h-screen bg-ground" />

function RootLayout() {
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
    children: [
      { index: true, element: <HomePage /> },
      { path: 'case-studies/:slug', element: <Suspense fallback={fallback}><CaseStudyPage /></Suspense> },
      { path: 'work/:slug', element: <LegacyWorkRedirect /> },
      { path: 'studio/:id', element: <Suspense fallback={fallback}><ExperimentPage /></Suspense> },
      { path: '*', element: <Suspense fallback={fallback}><NotFoundPage /></Suspense> },
    ],
  },
])

export function RouterRoot() {
  return <RouterProvider router={router} />
}
