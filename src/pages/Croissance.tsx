import { useMemo, useState } from 'react'
import { Ruler, Weight, CircleDot } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { GrowthMeasurement } from '../types'
import { Sheet } from '../components/ui/Sheet'
import { Button } from '../components/ui/Button'
import { Field, Input, Textarea } from '../components/ui/Field'
import { Fab } from '../components/ui/Fab'
import { EmptyState } from '../components/ui/EmptyState'
import { GrowthChart } from '../components/charts/GrowthChart'
import { formatAge, formatDate, nowLocal, sortByDateAsc, sortByDateDesc } from '../lib/utils'

export function Croissance() {
  const profile = useStore((s) => s.profile)!
  const growth = useStore((s) => s.growth)
  const addGrowth = useStore((s) => s.addGrowth)
  const updateGrowth = useStore((s) => s.updateGrowth)
  const deleteGrowth = useStore((s) => s.deleteGrowth)

  const [editing, setEditing] = useState<GrowthMeasurement | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [date, setDate] = useState(nowLocal().slice(0, 10))
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState('')
  const [note, setNote] = useState('')

  const sortedDesc = sortByDateDesc(growth, (g) => g.date)
  const sortedAsc = sortByDateAsc(growth, (g) => g.date)

  const weightData = useMemo(
    () => sortedAsc.filter((g) => g.weightKg != null).map((g) => ({ date: g.date, value: g.weightKg! })),
    [sortedAsc],
  )
  const heightData = useMemo(
    () => sortedAsc.filter((g) => g.heightCm != null).map((g) => ({ date: g.date, value: g.heightCm! })),
    [sortedAsc],
  )
  const headData = useMemo(
    () => sortedAsc.filter((g) => g.headCircumferenceCm != null).map((g) => ({ date: g.date, value: g.headCircumferenceCm! })),
    [sortedAsc],
  )

  const latest = sortedDesc[0]

  function openAdd() {
    setEditing(null)
    setDate(nowLocal().slice(0, 10))
    setWeightKg('')
    setHeightCm('')
    setHeadCircumferenceCm('')
    setNote('')
    setFormOpen(true)
  }

  function openEdit(g: GrowthMeasurement) {
    setEditing(g)
    setDate(g.date.slice(0, 10))
    setWeightKg(g.weightKg?.toString() ?? '')
    setHeightCm(g.heightCm?.toString() ?? '')
    setHeadCircumferenceCm(g.headCircumferenceCm?.toString() ?? '')
    setNote(g.note ?? '')
    setFormOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      date: new Date(date).toISOString(),
      weightKg: weightKg ? Number(weightKg) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      headCircumferenceCm: headCircumferenceCm ? Number(headCircumferenceCm) : undefined,
      note: note || undefined,
    }
    if (editing) updateGrowth(editing.id, payload)
    else addGrowth(payload)
    setFormOpen(false)
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--color-text)] mb-4 px-1">Croissance</h1>

      {growth.length === 0 ? (
        <EmptyState icon={Ruler} title="Aucune mesure enregistrée" subtitle="Ajoutez le poids, la taille et le périmètre crânien de bébé." />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <SummaryTile icon={Weight} label="Poids" value={latest?.weightKg ? `${latest.weightKg} kg` : '—'} color="var(--color-growth)" />
            <SummaryTile icon={Ruler} label="Taille" value={latest?.heightCm ? `${latest.heightCm} cm` : '—'} color="var(--color-growth)" />
            <SummaryTile icon={CircleDot} label="Périm. crânien" value={latest?.headCircumferenceCm ? `${latest.headCircumferenceCm} cm` : '—'} color="var(--color-growth)" />
          </div>

          <ChartCard title="Poids (kg)"><GrowthChart data={weightData} color="var(--color-growth)" unit="kg" /></ChartCard>
          <ChartCard title="Taille (cm)"><GrowthChart data={heightData} color="var(--color-primary)" unit="cm" /></ChartCard>
          <ChartCard title="Périmètre crânien (cm)"><GrowthChart data={headData} color="var(--color-milestone)" unit="cm" /></ChartCard>

          <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 px-1 mt-2">
            Historique des mesures
          </h2>
          <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden mb-6">
            {sortedDesc.map((g) => (
              <button
                key={g.id}
                onClick={() => openEdit(g)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--color-surface-2)] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">{formatDate(g.date)}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatAge(profile.birthDate, g.date)}</p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] text-right">
                  {[g.weightKg && `${g.weightKg} kg`, g.heightCm && `${g.heightCm} cm`, g.headCircumferenceCm && `${g.headCircumferenceCm} cm PC`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      <Fab onClick={openAdd} label="Mesure" />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier la mesure' : 'Ajouter une mesure'}>
        <form onSubmit={submit}>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Poids (kg)">
              <Input type="number" step={0.01} min={0} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
            </Field>
            <Field label="Taille (cm)">
              <Input type="number" step={0.1} min={0} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
            </Field>
          </div>
          <Field label="Périmètre crânien (cm)">
            <Input type="number" step={0.1} min={0} value={headCircumferenceCm} onChange={(e) => setHeadCircumferenceCm(e.target.value)} />
          </Field>
          <Field label="Note (optionnel)">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            {editing && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  deleteGrowth(editing.id)
                  setFormOpen(false)
                }}
              >
                Supprimer
              </Button>
            )}
            <Button type="submit" fullWidth>
              Enregistrer
            </Button>
          </div>
        </form>
      </Sheet>
    </div>
  )
}

function SummaryTile({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-3 text-center">
      <Icon size={18} style={{ color }} className="mx-auto mb-1" />
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--color-text)]">{value}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-4 mb-4">
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      {children}
    </div>
  )
}
