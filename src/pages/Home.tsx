import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Milk, Moon, Droplets, Thermometer, Play, Square, Stethoscope, Sparkles, Ruler } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Sheet } from '../components/ui/Sheet'
import { Button } from '../components/ui/Button'
import { Field, Input, SegmentedControl } from '../components/ui/Field'
import type { FeedingType, StoolType } from '../types'
import { feedingTypeLabels, feverThresholdC, stoolTypeColors, stoolTypeLabels } from '../lib/constants'
import { formatDurationMin, formatRelative, formatTime, minutesBetween, sortByDateDesc } from '../lib/utils'

type QuickSheet = 'biberon' | 'selle' | 'temperature' | null

const quickStoolTypes: StoolType[] = ['normale', 'molle', 'liquide', 'dure']

export function Home() {
  const navigate = useNavigate()
  const naps = useStore((s) => s.naps)
  const feedings = useStore((s) => s.feedings)
  const stools = useStore((s) => s.stools)
  const temperatures = useStore((s) => s.temperatures)
  const visits = useStore((s) => s.visits)
  const milestones = useStore((s) => s.milestones)
  const addNap = useStore((s) => s.addNap)
  const updateNap = useStore((s) => s.updateNap)
  const addFeeding = useStore((s) => s.addFeeding)
  const addStool = useStore((s) => s.addStool)
  const addTemperature = useStore((s) => s.addTemperature)

  const [quickSheet, setQuickSheet] = useState<QuickSheet>(null)

  const running = naps.find((n) => n.end === null) ?? null

  const today = new Date()
  const isToday = (iso: string) => {
    const d = new Date(iso)
    return d.toDateString() === today.toDateString()
  }
  const todayFeedings = feedings.filter((f) => isToday(f.datetime))
  const todayNaps = naps.filter((n) => n.end && isToday(n.start))
  const todaySleepMin = todayNaps.reduce((sum, n) => sum + minutesBetween(n.start, n.end!), 0)
  const todayStools = stools.filter((s) => isToday(s.datetime))

  const lastFeeding = sortByDateDesc(feedings, (f) => f.datetime)[0]
  const lastStool = sortByDateDesc(stools, (s) => s.datetime)[0]
  const lastTemp = sortByDateDesc(temperatures, (t) => t.datetime)[0]

  const timeline = useMemo(() => {
    type Item = { id: string; datetime: string; icon: React.ReactNode; bg: string; title: string; subtitle: string; to: string }
    const items: Item[] = []
    for (const n of naps.filter((n) => n.end)) {
      items.push({
        id: 'nap-' + n.id,
        datetime: n.start,
        icon: <Moon size={16} className="text-[var(--color-sleep)]" />,
        bg: 'var(--color-sleep-bg)',
        title: `Sieste · ${formatDurationMin(minutesBetween(n.start, n.end!))}`,
        subtitle: formatTime(n.start),
        to: '/journal/siestes',
      })
    }
    for (const f of feedings) {
      items.push({
        id: 'feed-' + f.id,
        datetime: f.datetime,
        icon: <Milk size={16} className="text-[var(--color-feed)]" />,
        bg: 'var(--color-feed-bg)',
        title: feedingTypeLabels[f.type] + (f.quantityMl ? ` · ${f.quantityMl} ml` : ''),
        subtitle: formatTime(f.datetime),
        to: '/journal/biberons',
      })
    }
    for (const s of stools) {
      items.push({
        id: 'stool-' + s.id,
        datetime: s.datetime,
        icon: <Droplets size={16} style={{ color: stoolTypeColors[s.type] }} />,
        bg: 'var(--color-diaper-bg)',
        title: `Selle · ${stoolTypeLabels[s.type]}`,
        subtitle: formatTime(s.datetime),
        to: '/journal/selles',
      })
    }
    for (const t of temperatures) {
      items.push({
        id: 'temp-' + t.id,
        datetime: t.datetime,
        icon: <Thermometer size={16} className="text-[var(--color-temp)]" />,
        bg: 'var(--color-temp-bg)',
        title: `${t.valueC.toFixed(1)} °C`,
        subtitle: formatTime(t.datetime),
        to: '/journal/temperatures',
      })
    }
    for (const v of visits) {
      items.push({
        id: 'visit-' + v.id,
        datetime: v.date,
        icon: <Stethoscope size={16} className="text-[var(--color-health)]" />,
        bg: 'var(--color-health-bg)',
        title: v.reason,
        subtitle: formatTime(v.date),
        to: '/journal/visites',
      })
    }
    for (const m of milestones) {
      items.push({
        id: 'milestone-' + m.id,
        datetime: m.date,
        icon: <Sparkles size={16} className="text-[var(--color-milestone)]" />,
        bg: 'var(--color-milestone-bg)',
        title: m.title,
        subtitle: formatTime(m.date),
        to: '/journal/etapes',
      })
    }
    return items.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()).slice(0, 8)
  }, [naps, feedings, stools, temperatures, visits, milestones])

  return (
    <div>
      <h1 className="text-xl font-semibold text-[var(--color-text)] mb-4 px-1">Aujourd'hui</h1>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard
          icon={<Milk size={16} className="text-[var(--color-feed)]" />}
          bg="var(--color-feed-bg)"
          label="Dernier repas"
          value={lastFeeding ? formatRelative(lastFeeding.datetime) : '—'}
          onClick={() => navigate('/journal/biberons')}
        />
        <StatCard
          icon={<Moon size={16} className="text-[var(--color-sleep)]" />}
          bg="var(--color-sleep-bg)"
          label="Sommeil aujourd'hui"
          value={todaySleepMin > 0 ? formatDurationMin(todaySleepMin) : '—'}
          onClick={() => navigate('/journal/siestes')}
        />
        <StatCard
          icon={<Droplets size={16} style={{ color: lastStool ? stoolTypeColors[lastStool.type] : undefined }} />}
          bg="var(--color-diaper-bg)"
          label="Dernière selle"
          value={lastStool ? formatRelative(lastStool.datetime) : '—'}
          onClick={() => navigate('/journal/selles')}
        />
        <StatCard
          icon={<Thermometer size={16} className="text-[var(--color-temp)]" />}
          bg="var(--color-temp-bg)"
          label="Température"
          value={lastTemp ? `${lastTemp.valueC.toFixed(1)} °C` : '—'}
          alert={lastTemp ? lastTemp.valueC >= feverThresholdC : false}
          onClick={() => navigate('/journal/temperatures')}
        />
      </div>

      <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2 px-1">
        Actions rapides
      </h2>
      <div className="grid grid-cols-4 gap-2.5 mb-6">
        <QuickAction icon={Milk} label="Repas" bg="var(--color-feed-bg)" color="var(--color-feed)" onClick={() => setQuickSheet('biberon')} />
        {running ? (
          <QuickAction
            icon={Square}
            label="Stop sieste"
            bg="var(--color-sleep-bg)"
            color="var(--color-sleep)"
            onClick={() => updateNap(running.id, { end: new Date().toISOString() })}
          />
        ) : (
          <QuickAction
            icon={Play}
            label="Sieste"
            bg="var(--color-sleep-bg)"
            color="var(--color-sleep)"
            onClick={() => addNap({ start: new Date().toISOString(), end: null })}
          />
        )}
        <QuickAction icon={Droplets} label="Selle" bg="var(--color-diaper-bg)" color="var(--color-diaper)" onClick={() => setQuickSheet('selle')} />
        <QuickAction icon={Thermometer} label="Temp." bg="var(--color-temp-bg)" color="var(--color-temp)" onClick={() => setQuickSheet('temperature')} />
      </div>

      {running && (
        <div className="rounded-2xl bg-[var(--color-sleep-bg)] p-3.5 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-sleep)] flex items-center justify-center animate-pulse">
            <Moon className="text-white" size={16} />
          </div>
          <p className="text-sm text-[var(--color-text)]">
            Sieste en cours depuis{' '}
            <span className="font-semibold">{formatDurationMin(minutesBetween(running.start, new Date().toISOString()))}</span>
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Activité récente</h2>
        <div className="flex gap-3 text-xs text-[var(--color-text-muted)]">
          <span>{todayFeedings.length} repas</span>
          <span>{todayNaps.length} sieste{todayNaps.length > 1 ? 's' : ''}</span>
          <span>{todayStools.length} selle{todayStools.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-8 text-center text-[var(--color-text-muted)]">
          <Ruler size={22} className="mx-auto mb-2" />
          Aucune activité pour l'instant. Utilisez les actions rapides pour commencer.
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] divide-y divide-[var(--color-border)] overflow-hidden">
          {timeline.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.to)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: item.bg }}>
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-text)] truncate">{item.title}</p>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] shrink-0">{item.subtitle}</span>
            </button>
          ))}
        </div>
      )}

      <QuickBiberonSheet open={quickSheet === 'biberon'} onClose={() => setQuickSheet(null)} onSubmit={addFeeding} />
      <QuickSelleSheet open={quickSheet === 'selle'} onClose={() => setQuickSheet(null)} onPick={addStool} />
      <QuickTemperatureSheet open={quickSheet === 'temperature'} onClose={() => setQuickSheet(null)} onSubmit={addTemperature} />
    </div>
  )
}

function StatCard({
  icon,
  bg,
  label,
  value,
  alert,
  onClick,
}: {
  icon: React.ReactNode
  bg: string
  label: string
  value: string
  alert?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] p-3.5 text-left transition-transform active:scale-[0.98] ' +
        (alert ? 'ring-2 ring-[var(--color-health)]' : '')
      }
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ background: bg }}>
        {icon}
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="text-[15px] font-semibold text-[var(--color-text)]">{value}</p>
    </button>
  )
}

function QuickAction({
  icon: Icon,
  label,
  bg,
  color,
  onClick,
}: {
  icon: React.ElementType
  label: string
  bg: string
  color: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: bg }}>
        <Icon size={22} style={{ color }} />
      </div>
      <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{label}</span>
    </button>
  )
}

function QuickBiberonSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (f: { datetime: string; type: FeedingType; quantityMl?: number }) => void
}) {
  const [type, setType] = useState<FeedingType>('artificiel')
  const [quantityMl, setQuantityMl] = useState(120)

  return (
    <Sheet open={open} onClose={onClose} title="Ajouter un repas">
      <Field label="Type">
        <SegmentedControl
          value={type}
          onChange={setType}
          options={[
            { value: 'artificiel', label: 'Biberon' },
            { value: 'maternel', label: 'Allaitement' },
            { value: 'diversification', label: 'Diversif.' },
          ]}
        />
      </Field>
      {type !== 'maternel' && (
        <Field label="Quantité (ml)">
          <div className="flex gap-2 flex-wrap">
            {[60, 90, 120, 150, 180, 210].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantityMl(q)}
                className={
                  'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ' +
                  (quantityMl === q
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)]')
                }
              >
                {q}
              </button>
            ))}
          </div>
        </Field>
      )}
      <Button
        fullWidth
        onClick={() => {
          onSubmit({ datetime: new Date().toISOString(), type, quantityMl: type !== 'maternel' ? quantityMl : undefined })
          onClose()
        }}
      >
        Enregistrer maintenant
      </Button>
    </Sheet>
  )
}

function QuickSelleSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean
  onClose: () => void
  onPick: (s: { datetime: string; type: StoolType }) => void
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Ajouter une selle">
      <p className="text-sm text-[var(--color-text-muted)] mb-3">Sélectionnez le type observé :</p>
      <div className="grid grid-cols-2 gap-2.5">
        {quickStoolTypes.map((t) => (
          <button
            key={t}
            onClick={() => {
              onPick({ datetime: new Date().toISOString(), type: t })
              onClose()
            }}
            className="rounded-xl border border-[var(--color-border)] py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-surface-2)] transition-colors"
          >
            <Droplets size={16} style={{ color: stoolTypeColors[t] }} />
            {stoolTypeLabels[t]}
          </button>
        ))}
      </div>
    </Sheet>
  )
}

function QuickTemperatureSheet({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (t: { datetime: string; valueC: number; method: 'auriculaire' }) => void
}) {
  const [valueC, setValueC] = useState('37.0')

  return (
    <Sheet open={open} onClose={onClose} title="Ajouter une température">
      <Field label="Température (°C)">
        <Input type="number" step={0.1} min={30} max={43} value={valueC} onChange={(e) => setValueC(e.target.value)} autoFocus />
      </Field>
      <Button
        fullWidth
        onClick={() => {
          onSubmit({ datetime: new Date().toISOString(), valueC: Number(valueC), method: 'auriculaire' })
          onClose()
        }}
      >
        Enregistrer maintenant
      </Button>
    </Sheet>
  )
}
