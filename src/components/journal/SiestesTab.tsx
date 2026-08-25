import { useEffect, useState } from 'react'
import { Moon, Play, Square } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { Nap } from '../../types'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, Input, Textarea } from '../ui/Field'
import { Fab } from '../ui/Fab'
import { ListItem } from '../ui/ListItem'
import { EmptyState } from '../ui/EmptyState'
import { formatDateTime, formatDurationMin, minutesBetween, nowLocal, sortByDateDesc } from '../../lib/utils'

export function SiestesTab() {
  const naps = useStore((s) => s.naps)
  const addNap = useStore((s) => s.addNap)
  const updateNap = useStore((s) => s.updateNap)
  const deleteNap = useStore((s) => s.deleteNap)

  const [editing, setEditing] = useState<Nap | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [start, setStart] = useState(nowLocal())
  const [end, setEnd] = useState(nowLocal())
  const [note, setNote] = useState('')
  const [, forceTick] = useState(0)

  const running = naps.find((n) => n.end === null) ?? null

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => forceTick((t) => t + 1), 1000 * 15)
    return () => clearInterval(id)
  }, [running])

  const sorted = sortByDateDesc(naps.filter((n) => n.end !== null), (n) => n.start)

  function openAdd() {
    setEditing(null)
    setStart(nowLocal())
    setEnd(nowLocal())
    setNote('')
    setFormOpen(true)
  }

  function openEdit(n: Nap) {
    setEditing(n)
    setStart(n.start.slice(0, 16))
    setEnd((n.end ?? n.start).slice(0, 16))
    setNote(n.note ?? '')
    setFormOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const startIso = new Date(start).toISOString()
    const endIso = new Date(end).toISOString()
    if (editing) {
      updateNap(editing.id, { start: startIso, end: endIso, note: note || undefined })
    } else {
      addNap({ start: startIso, end: endIso, note: note || undefined })
    }
    setFormOpen(false)
  }

  return (
    <div>
      {running ? (
        <div className="rounded-2xl bg-[var(--color-sleep-bg)] p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[var(--color-sleep)] flex items-center justify-center">
              <Moon className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">Sieste en cours</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Depuis {formatDurationMin(minutesBetween(running.start, new Date().toISOString()))}
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => updateNap(running.id, { end: new Date().toISOString() })}>
            <Square size={16} /> Terminer
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          fullWidth
          className="mb-4"
          onClick={() => addNap({ start: new Date().toISOString(), end: null })}
        >
          <Play size={16} /> Démarrer une sieste
        </Button>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon={Moon} title="Aucune sieste enregistrée" subtitle="Ajoutez la première sieste de bébé." />
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
          {sorted.map((n) => (
            <ListItem
              key={n.id}
              icon={<Moon size={18} className="text-[var(--color-sleep)]" />}
              iconBg="var(--color-sleep-bg)"
              title={formatDurationMin(minutesBetween(n.start, n.end!))}
              subtitle={formatDateTime(n.start)}
              onClick={() => openEdit(n)}
            />
          ))}
        </div>
      )}

      <Fab onClick={openAdd} label="Ajouter" />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier la sieste' : 'Ajouter une sieste'}>
        <form onSubmit={submit}>
          <Field label="Début">
            <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
          </Field>
          <Field label="Fin">
            <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
          </Field>
          <Field label="Note (optionnel)">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex. endormie facilement" />
          </Field>
          <div className="flex gap-2">
            {editing && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  deleteNap(editing.id)
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
