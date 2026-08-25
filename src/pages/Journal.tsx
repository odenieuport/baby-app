import { useNavigate, useParams } from 'react-router-dom'
import { SiestesTab } from '../components/journal/SiestesTab'
import { BiberonsTab } from '../components/journal/BiberonsTab'
import { SellesTab } from '../components/journal/SellesTab'
import { TemperaturesTab } from '../components/journal/TemperaturesTab'
import { VisitesTab } from '../components/journal/VisitesTab'
import { EtapesTab } from '../components/journal/EtapesTab'

const sections = [
  { key: 'siestes', label: 'Siestes', Component: SiestesTab },
  { key: 'biberons', label: 'Repas', Component: BiberonsTab },
  { key: 'selles', label: 'Selles', Component: SellesTab },
  { key: 'temperatures', label: 'Températures', Component: TemperaturesTab },
  { key: 'visites', label: 'Visites', Component: VisitesTab },
  { key: 'etapes', label: 'Étapes', Component: EtapesTab },
] as const

export function Journal() {
  const { section } = useParams()
  const navigate = useNavigate()
  const current = sections.find((s) => s.key === section) ?? sections[0]

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => navigate(`/journal/${s.key}`)}
            className={
              'shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ' +
              (s.key === current.key
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]')
            }
          >
            {s.label}
          </button>
        ))}
      </div>
      <current.Component />
    </div>
  )
}
