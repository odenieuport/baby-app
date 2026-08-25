import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useStore } from './store/useStore'
import { Onboarding } from './components/Onboarding'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Journal } from './pages/Journal'
import { Reglages } from './pages/Reglages'

const Croissance = lazy(() => import('./pages/Croissance').then((m) => ({ default: m.Croissance })))
const Rapport = lazy(() => import('./pages/Rapport').then((m) => ({ default: m.Rapport })))

function PageLoading() {
  return <div className="py-16 text-center text-sm text-[var(--color-text-muted)]">Chargement…</div>
}

export default function App() {
  const profile = useStore((s) => s.profile)

  if (!profile) {
    return <Onboarding />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/journal" element={<Navigate to="/journal/siestes" replace />} />
          <Route path="/journal/:section" element={<Journal />} />
          <Route
            path="/croissance"
            element={
              <Suspense fallback={<PageLoading />}>
                <Croissance />
              </Suspense>
            }
          />
          <Route
            path="/rapport"
            element={
              <Suspense fallback={<PageLoading />}>
                <Rapport />
              </Suspense>
            }
          />
          <Route path="/reglages" element={<Reglages />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
