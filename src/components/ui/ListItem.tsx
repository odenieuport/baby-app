import type { ReactNode } from 'react'

export function ListItem({
  icon,
  iconBg,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  icon: ReactNode
  iconBg: string
  title: string
  subtitle: string
  trailing?: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-surface-2)]"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-[var(--color-text)] truncate">{title}</p>
        <p className="text-xs text-[var(--color-text-muted)] truncate">{subtitle}</p>
      </div>
      {trailing && <span className="text-xs text-[var(--color-text-muted)] shrink-0">{trailing}</span>}
    </button>
  )
}
