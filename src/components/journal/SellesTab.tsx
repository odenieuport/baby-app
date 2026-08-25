import { useState } from 'react'
import { Droplets } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { Stool, StoolType } from '../../types'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Field'
import { Fab } from '../ui/Fab'
import { ListItem } from '../ui/ListItem'
import { EmptyState } from '../ui/EmptyState'
import { stoolTypeColors, stoolTypeLabels } from '../../lib/constants'
import { formatDateTime, nowLocal, sortByDateDesc } from '../../lib/utils'

const typeOptions = Object.keys(stoolTypeLabels) as StoolType[]

export function SellesTab() {
  const stools = useStore((s) => s.stools)
  const addStool = useStore((s) => s.addStool)
  const updateStool = useStore((s) => s.updateStool)
  const deleteStool = useStore((s) => s.deleteStool)

  const [editing, setEditing] = useState<Stool | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [datetime, setDatetime] = useState(nowLocal())
  const [type, setType] = useState<StoolType>('normale')
  const [color, setColor] = useState('')
  const [note, setNote] = useState('')

  const sorted = sortByDateDesc(stools, (s) => s.datetime)

  function openAdd() {
    setEditing(null)
    setDatetime(nowLocal())
    setType('normale')
    setColor('')
    setNote('')
    setFormOpen(true)
  }

  function openEdit(s: Stool) {
    setEditing(s)
    setDatetime(s.datetime.slice(0, 16))
    setType(s.type)
    setColor(s.color ?? '')
    setNote(s.note ?? '')
    setFormOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      datetime: new Date(datetime).toISOString(),
      type,
      color: color || undefined,
      note: note || undefined,
    }
    if (editing) updateStool(editing.id, payload)
    else addStool(payload)
    setFormOpen(false)
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState icon={Droplets} title="Aucune selle enregistrée" subtitle="Ajoutez le premier relevé." />
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
          {sorted.map((s) => (
            <ListItem
              key={s.id}
              icon={<Droplets size={18} style={{ color: stoolTypeColors[s.type] }} />}
              iconBg="var(--color-diaper-bg)"
              title={stoolTypeLabels[s.type] + (s.color ? ` · ${s.color}` : '')}
              subtitle={formatDateTime(s.datetime)}
              onClick={() => openEdit(s)}
            />
          ))}
        </div>
      )}

      <Fab onClick={openAdd} label="Ajouter" />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier la selle' : 'Ajouter une selle'}>
        <form onSubmit={submit}>
          <Field label="Heure">
            <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
          </Field>
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as StoolType)}>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {stoolTypeLabels[t]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Couleur (optionnel)">
            <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Ex. jaune moutarde" />
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
                  deleteStool(editing.id)
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
