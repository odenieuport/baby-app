import { useState } from 'react'
import { Stethoscope } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { MedicalVisit } from '../../types'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, Input, Textarea } from '../ui/Field'
import { Fab } from '../ui/Fab'
import { ListItem } from '../ui/ListItem'
import { EmptyState } from '../ui/EmptyState'
import { formatDate, nowLocal, sortByDateDesc } from '../../lib/utils'

export function VisitesTab() {
  const visits = useStore((s) => s.visits)
  const addVisit = useStore((s) => s.addVisit)
  const updateVisit = useStore((s) => s.updateVisit)
  const deleteVisit = useStore((s) => s.deleteVisit)

  const [editing, setEditing] = useState<MedicalVisit | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [date, setDate] = useState(nowLocal().slice(0, 10))
  const [reason, setReason] = useState('')
  const [doctor, setDoctor] = useState('')
  const [notes, setNotes] = useState('')
  const [nextAppointment, setNextAppointment] = useState('')

  const sorted = sortByDateDesc(visits, (v) => v.date)

  function openAdd() {
    setEditing(null)
    setDate(nowLocal().slice(0, 10))
    setReason('')
    setDoctor('')
    setNotes('')
    setNextAppointment('')
    setFormOpen(true)
  }

  function openEdit(v: MedicalVisit) {
    setEditing(v)
    setDate(v.date.slice(0, 10))
    setReason(v.reason)
    setDoctor(v.doctor ?? '')
    setNotes(v.notes ?? '')
    setNextAppointment(v.nextAppointment?.slice(0, 10) ?? '')
    setFormOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      date: new Date(date).toISOString(),
      reason: reason.trim(),
      doctor: doctor || undefined,
      notes: notes || undefined,
      nextAppointment: nextAppointment ? new Date(nextAppointment).toISOString() : null,
    }
    if (editing) updateVisit(editing.id, payload)
    else addVisit(payload)
    setFormOpen(false)
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState icon={Stethoscope} title="Aucune visite enregistrée" subtitle="Ajoutez la première visite médicale." />
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
          {sorted.map((v) => (
            <ListItem
              key={v.id}
              icon={<Stethoscope size={18} className="text-[var(--color-health)]" />}
              iconBg="var(--color-health-bg)"
              title={v.reason}
              subtitle={[v.doctor, formatDate(v.date)].filter(Boolean).join(' · ')}
              onClick={() => openEdit(v)}
            />
          ))}
        </div>
      )}

      <Fab onClick={openAdd} label="Ajouter" />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier la visite' : 'Ajouter une visite'}>
        <form onSubmit={submit}>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Motif">
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ex. Contrôle du 2e mois" required />
          </Field>
          <Field label="Médecin (optionnel)">
            <Input value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="Dr. Martin" />
          </Field>
          <Field label="Notes (optionnel)">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <Field label="Prochain rendez-vous (optionnel)">
            <Input type="date" value={nextAppointment} onChange={(e) => setNextAppointment(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            {editing && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  deleteVisit(editing.id)
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
