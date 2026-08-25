import { useState } from 'react'
import { Milk } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { Feeding, FeedingType } from '../../types'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, Input, SegmentedControl, Textarea } from '../ui/Field'
import { Fab } from '../ui/Fab'
import { ListItem } from '../ui/ListItem'
import { EmptyState } from '../ui/EmptyState'
import { feedingTypeLabels } from '../../lib/constants'
import { formatDateTime, nowLocal, sortByDateDesc } from '../../lib/utils'

const typeOptions = (Object.keys(feedingTypeLabels) as FeedingType[]).map((v) => ({
  value: v,
  label: feedingTypeLabels[v],
}))

export function BiberonsTab() {
  const feedings = useStore((s) => s.feedings)
  const addFeeding = useStore((s) => s.addFeeding)
  const updateFeeding = useStore((s) => s.updateFeeding)
  const deleteFeeding = useStore((s) => s.deleteFeeding)

  const [editing, setEditing] = useState<Feeding | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [datetime, setDatetime] = useState(nowLocal())
  const [type, setType] = useState<FeedingType>('artificiel')
  const [quantityMl, setQuantityMl] = useState('')
  const [durationMin, setDurationMin] = useState('')
  const [side, setSide] = useState<Feeding['side']>('gauche')
  const [note, setNote] = useState('')

  const sorted = sortByDateDesc(feedings, (f) => f.datetime)
  const isBreast = type === 'maternel'

  function openAdd() {
    setEditing(null)
    setDatetime(nowLocal())
    setType('artificiel')
    setQuantityMl('')
    setDurationMin('')
    setSide('gauche')
    setNote('')
    setFormOpen(true)
  }

  function openEdit(f: Feeding) {
    setEditing(f)
    setDatetime(f.datetime.slice(0, 16))
    setType(f.type)
    setQuantityMl(f.quantityMl?.toString() ?? '')
    setDurationMin(f.durationMin?.toString() ?? '')
    setSide(f.side ?? 'gauche')
    setNote(f.note ?? '')
    setFormOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      datetime: new Date(datetime).toISOString(),
      type,
      quantityMl: quantityMl ? Number(quantityMl) : undefined,
      durationMin: isBreast && durationMin ? Number(durationMin) : undefined,
      side: isBreast ? side : undefined,
      note: note || undefined,
    }
    if (editing) updateFeeding(editing.id, payload)
    else addFeeding(payload)
    setFormOpen(false)
  }

  function subtitle(f: Feeding): string {
    const parts = [feedingTypeLabels[f.type]]
    if (f.quantityMl) parts.push(`${f.quantityMl} ml`)
    if (f.durationMin) parts.push(`${f.durationMin} min`)
    return parts.join(' · ')
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState icon={Milk} title="Aucun repas enregistré" subtitle="Ajoutez le premier biberon ou tétée." />
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
          {sorted.map((f) => (
            <ListItem
              key={f.id}
              icon={<Milk size={18} className="text-[var(--color-feed)]" />}
              iconBg="var(--color-feed-bg)"
              title={subtitle(f)}
              subtitle={formatDateTime(f.datetime)}
              onClick={() => openEdit(f)}
            />
          ))}
        </div>
      )}

      <Fab onClick={openAdd} label="Ajouter" />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier le repas' : 'Ajouter un repas'}>
        <form onSubmit={submit}>
          <Field label="Heure">
            <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
          </Field>
          <Field label="Type">
            <SegmentedControl value={type} onChange={setType} options={typeOptions} />
          </Field>
          {isBreast ? (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Durée (min)">
                <Input
                  type="number"
                  min={0}
                  value={durationMin}
                  onChange={(e) => setDurationMin(e.target.value)}
                />
              </Field>
              <Field label="Côté">
                <SegmentedControl
                  value={side ?? 'gauche'}
                  onChange={setSide}
                  options={[
                    { value: 'gauche', label: 'G' },
                    { value: 'droite', label: 'D' },
                    { value: 'les-deux', label: 'G+D' },
                  ]}
                />
              </Field>
            </div>
          ) : (
            <Field label="Quantité (ml)">
              <Input type="number" min={0} value={quantityMl} onChange={(e) => setQuantityMl(e.target.value)} />
            </Field>
          )}
          <Field label="Note (optionnel)">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            {editing && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  deleteFeeding(editing.id)
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
