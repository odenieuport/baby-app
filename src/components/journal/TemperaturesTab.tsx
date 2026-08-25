import { useState } from 'react'
import { Thermometer } from 'lucide-react'
import { useStore } from '../../store/useStore'
import type { Temperature, TemperatureMethod } from '../../types'
import { Sheet } from '../ui/Sheet'
import { Button } from '../ui/Button'
import { Field, Input, Select, Textarea } from '../ui/Field'
import { Fab } from '../ui/Fab'
import { ListItem } from '../ui/ListItem'
import { EmptyState } from '../ui/EmptyState'
import { feverThresholdC, temperatureMethodLabels } from '../../lib/constants'
import { formatDateTime, nowLocal, sortByDateDesc } from '../../lib/utils'

const methodOptions = Object.keys(temperatureMethodLabels) as TemperatureMethod[]

export function TemperaturesTab() {
  const temperatures = useStore((s) => s.temperatures)
  const addTemperature = useStore((s) => s.addTemperature)
  const updateTemperature = useStore((s) => s.updateTemperature)
  const deleteTemperature = useStore((s) => s.deleteTemperature)

  const [editing, setEditing] = useState<Temperature | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [datetime, setDatetime] = useState(nowLocal())
  const [valueC, setValueC] = useState('37.0')
  const [method, setMethod] = useState<TemperatureMethod>('auriculaire')
  const [note, setNote] = useState('')

  const sorted = sortByDateDesc(temperatures, (t) => t.datetime)

  function openAdd() {
    setEditing(null)
    setDatetime(nowLocal())
    setValueC('37.0')
    setMethod('auriculaire')
    setNote('')
    setFormOpen(true)
  }

  function openEdit(t: Temperature) {
    setEditing(t)
    setDatetime(t.datetime.slice(0, 16))
    setValueC(String(t.valueC))
    setMethod(t.method)
    setNote(t.note ?? '')
    setFormOpen(true)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      datetime: new Date(datetime).toISOString(),
      valueC: Number(valueC),
      method,
      note: note || undefined,
    }
    if (editing) updateTemperature(editing.id, payload)
    else addTemperature(payload)
    setFormOpen(false)
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <EmptyState icon={Thermometer} title="Aucun relevé" subtitle="Ajoutez la première température." />
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
          {sorted.map((t) => {
            const fever = t.valueC >= feverThresholdC
            return (
              <ListItem
                key={t.id}
                icon={<Thermometer size={18} className={fever ? 'text-[var(--color-health)]' : 'text-[var(--color-temp)]'} />}
                iconBg={fever ? 'var(--color-health-bg)' : 'var(--color-temp-bg)'}
                title={`${t.valueC.toFixed(1)} °C${fever ? ' · Fièvre' : ''}`}
                subtitle={`${temperatureMethodLabels[t.method]} · ${formatDateTime(t.datetime)}`}
                onClick={() => openEdit(t)}
              />
            )
          })}
        </div>
      )}

      <Fab onClick={openAdd} label="Ajouter" />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier la température' : 'Ajouter une température'}>
        <form onSubmit={submit}>
          <Field label="Heure">
            <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
          </Field>
          <Field label="Température (°C)">
            <Input
              type="number"
              step={0.1}
              min={30}
              max={43}
              value={valueC}
              onChange={(e) => setValueC(e.target.value)}
              required
            />
          </Field>
          <Field label="Méthode">
            <Select value={method} onChange={(e) => setMethod(e.target.value as TemperatureMethod)}>
              {methodOptions.map((m) => (
                <option key={m} value={m}>
                  {temperatureMethodLabels[m]}
                </option>
              ))}
            </Select>
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
                  deleteTemperature(editing.id)
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
