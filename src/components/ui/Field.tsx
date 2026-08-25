import type { ReactNode } from 'react'

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[var(--color-text-muted)] mt-1">{hint}</span>}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-[15px] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass + (props.className ? ` ${props.className}` : '')} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={inputClass + ' resize-none' + (props.className ? ` ${props.className}` : '')} rows={props.rows ?? 3} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputClass + (props.className ? ` ${props.className}` : '')} />
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface-2)] flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={
            'flex-1 min-w-fit px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ' +
            (value === opt.value
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm'
              : 'text-[var(--color-text-muted)]')
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
