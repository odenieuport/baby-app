import { useState } from 'react'
import { Moon } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Button } from './ui/Button'
import { Field, Input, SegmentedControl } from './ui/Field'
import type { Profile } from '../types'

export function Onboarding() {
  const setProfile = useStore((s) => s.setProfile)
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState<Profile['sex']>('fille')

  const canSubmit = name.trim().length > 0 && birthDate.length > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setProfile({ name: name.trim(), birthDate, sex })
  }

  return (
    <div className="min-h-svh flex items-center justify-center px-6 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center mb-4 shadow-[var(--shadow-card)]">
            <Moon className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">Bienvenue</h1>
          <p className="text-[var(--color-text-muted)] text-center mt-1">
            Créons le profil de votre bébé pour commencer le suivi.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <Field label="Prénom du bébé">
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Léa"
              required
            />
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
          <Button type="submit" fullWidth disabled={!canSubmit} className="mt-2">
            Commencer le suivi
          </Button>
        </form>
      </div>
    </div>
  )
}
