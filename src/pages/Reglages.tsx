import { useRef, useState } from 'react'
import { Download, Upload, Trash2, Baby } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Button } from '../components/ui/Button'
import { Field, Input, SegmentedControl } from '../components/ui/Field'
import { Sheet } from '../components/ui/Sheet'
import type { Profile } from '../types'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 px-1">
        {title}
      </h2>
      <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
        {children}
      </div>
    </section>
  )
}

function Row({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={
        'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[var(--color-surface-2)] ' +
        (danger ? 'text-[var(--color-health)]' : 'text-[var(--color-text)]')
      }
    >
      <Icon size={18} />
      <span className="text-[15px] font-medium">{label}</span>
    </button>
  )
}

export function Reglages() {
  const profile = useStore((s) => s.profile)!
  const setProfile = useStore((s) => s.setProfile)
  const resetAll = useStore((s) => s.resetAll)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(profile.name)
  const [birthDate, setBirthDate] = useState(profile.birthDate)
  const [sex, setSex] = useState<Profile['sex']>(profile.sex)

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfile({ name: name.trim(), birthDate, sex })
    setEditOpen(false)
  }

  function exportData() {
    const raw = localStorage.getItem('baby-app-data')
    if (!raw) return
    const blob = new Blob([raw], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bebe-suivi-${profile.name.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = reader.result as string
        JSON.parse(text)
        localStorage.setItem('baby-app-data', text)
        window.location.reload()
      } catch {
        alert("Fichier invalide : impossible d'importer ces données.")
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--color-text)] mb-4 px-1">Réglages</h1>

      <Section title="Profil">
        <Row icon={Baby} label="Modifier le profil de bébé" onClick={() => setEditOpen(true)} />
      </Section>

      <Section title="Données">
        <Row icon={Download} label="Exporter les données (JSON)" onClick={exportData} />
        <Row icon={Upload} label="Importer des données" onClick={() => fileInputRef.current?.click()} />
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importData} />
        <Row icon={Trash2} label="Réinitialiser toutes les données" onClick={() => setConfirmReset(true)} danger />
      </Section>

      <p className="text-xs text-center text-[var(--color-text-muted)] mt-8 px-6">
        Toutes les données sont stockées uniquement sur cet appareil. Pensez à exporter régulièrement une
        sauvegarde.
      </p>

      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="Modifier le profil">
        <form onSubmit={saveProfile}>
          <Field label="Prénom du bébé">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Date de naissance">
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              required
            />
          </Field>
          <Field label="Sexe">
            <SegmentedControl
              value={sex}
              onChange={setSex}
              options={[
                { value: 'fille', label: 'Fille' },
                { value: 'garcon', label: 'Garçon' },
                { value: 'autre', label: 'Autre' },
              ]}
            />
          </Field>
          <Button type="submit" fullWidth>
            Enregistrer
          </Button>
        </form>
      </Sheet>

      <Sheet open={confirmReset} onClose={() => setConfirmReset(false)} title="Confirmer la réinitialisation">
        <p className="text-[15px] text-[var(--color-text)] mb-4">
          Cette action supprimera définitivement toutes les données enregistrées (siestes, biberons, mesures,
          etc.). Cette action est irréversible.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={() => setConfirmReset(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              resetAll()
              setConfirmReset(false)
            }}
          >
            Réinitialiser
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
