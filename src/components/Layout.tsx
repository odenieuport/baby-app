import { Outlet, useNavigate } from 'react-router-dom'
import { Moon } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Nav } from './Nav'
import { formatAge } from '../lib/utils'

export function Layout() {
  const profile = useStore((s) => s.profile)
  const navigate = useNavigate()

  return (
    <div className="min-h-svh flex flex-col bg-[var(--color-bg)]">
      <header className="no-print sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shrink-0"
          >
            <Moon className="text-white" size={18} />
          </button>
          <div className="min-w-0">
            <p className="font-semibold text-[var(--color-text)] leading-tight truncate">
              {profile?.name ?? 'Bébé Suivi'}
            </p>
            {profile && (
              <p className="text-xs text-[var(--color-text-muted)] leading-tight">
                {formatAge(profile.birthDate)}
              </p>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-4">
        <Outlet />
      </main>
      <Nav />
    </div>
  )
}
