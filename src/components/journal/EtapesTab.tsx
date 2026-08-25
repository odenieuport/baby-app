import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { Milestone, MilestoneCategory } from '../../types'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, Input, SegmentedControl, Textarea } from '../ui/Field'
import { Fab } from '../ui/Fab'
import { ListItem } from '../ui/ListItem'
import { EmptyState } from '../ui/EmptyState'
import { milestoneCategoryColors, milestoneCategoryLabels } from '../../lib/constants'
import { formatDate, nowLocal, sortByDateDesc } from '../../lib/utils'

const categoryOptions = (Object.keys(milestoneCategoryLabels) as MilestoneCategory[]).map((v) => ({
  value: v,
  label: milestoneCategoryLabels[v],
}))

export function EtapesTab() {
  const milestones = useStore((s) => s.milestones)
  const addMilestone = useStore((s) => s.addMilestone)
  const updateMilestone = useStore((s) => s.updateMilestone)
  const deleteMilestone = useStore((s) => s.deleteMilestone)

  const [editing, setEditing] = useState<Milestone | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [date, setDate] = useState(nowLocal().slice(0, 10))
  const [category, setCategory] = useState<MilestoneCategory>('physique')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const sorted = sortByDateDesc(milestones, (m) => m.date)

  function openAdd() {
    setEditing(null)
    setDate(nowLocal().slice(0, 10))
    setCategory('physique')
    setTitle('')
    setDescription('')
    setFormOpen(true)
  }

  function openEdit(m: Milestone) {
    setEditing(m)
    setDate(m.date.slice(0, 10))
    setCategory(m.category)
    setTitle(m.title)
    setDescription(m.description ?? '')
    setFormOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      date: new Date(date).toISOString(),
      category,
      title: title.trim(),
      description: description || undefined,
    }
    if (editing) updateMilestone(editing.id, payload)
    else addMilestone(payload)
    setFormOpen(false)
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState icon={Sparkles} title="Aucune étape enregistrée" subtitle="Notez les premiers progrès de bébé." />
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
          {sorted.map((m) => (
            <ListItem
              key={m.id}
              icon={<Sparkles size={18} style={{ color: milestoneCategoryColors[m.category] }} />}
              iconBg="var(--color-milestone-bg)"
              title={m.title}
              subtitle={`${milestoneCategoryLabels[m.category]} · ${formatDate(m.date)}`}
              onClick={() => openEdit(m)}
            />
          ))}
        </div>
      )}

      <Fab onClick={openAdd} label="Ajouter" />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Modifier l'étape" : 'Ajouter une étape'}>
        <form onSubmit={submit}>
          <Field label="Titre">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Premier sourire" required />
          </Field>
          <Field label="Catégorie">
            <SegmentedControl value={category} onChange={setCategory} options={categoryOptions} />
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Description (optionnel)">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            {editing && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  deleteMilestone(editing.id)
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
