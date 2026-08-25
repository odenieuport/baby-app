import { NavLink } from 'react-router-dom'
import { Home, NotebookPen, LineChart, FileText, Settings } from 'lucide-react'
import { cx } from '../lib/utils'

const items = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/journal', label: 'Journal', icon: NotebookPen, end: false },
  { to: '/croissance', label: 'Croissance', icon: LineChart, end: false },
  { to: '/rapport', label: 'Rapport', icon: FileText, end: false },
  { to: '/reglages', label: 'Réglages', icon: Settings, end: false },
]

export function Nav() {
  return (
    <nav className="no-print sticky bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-2xl flex">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cx(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
                isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
