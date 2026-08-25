import { Plus } from 'lucide-react'

export function Fab({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-30 bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] right-5 flex items-center gap-2 rounded-full bg-[var(--color-primary)] text-white pl-4 pr-5 py-3.5 shadow-[var(--shadow-card)] active:scale-95 transition-transform"
    >
      <Plus size={20} />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}
