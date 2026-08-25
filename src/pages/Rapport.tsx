import { useMemo, useState } from 'react'
import { Printer } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Button } from '../components/ui/Button'
import { SegmentedControl } from '../components/ui/Field'
import { GrowthChart } from '../components/charts/GrowthChart'
import { DailyBarChart } from '../components/charts/DailyBarChart'
import { TemperatureChart } from '../components/charts/TemperatureChart'
import { DistributionChart } from '../components/charts/DistributionChart'
import { milestoneCategoryColors, milestoneCategoryLabels, stoolTypeColors, stoolTypeLabels } from '../lib/constants'
import { dateKey, dayBuckets, formatAge, formatDate, minutesBetween, sortByDateAsc, sortByDateDesc } from '../lib/utils'
import type { StoolType } from '../types'

type Range = 7 | 14 | 30 | 90

export function Rapport() {
  const profile = useStore((s) => s.profile)!
  const naps = useStore((s) => s.naps)
  const feedings = useStore((s) => s.feedings)
  const stools = useStore((s) => s.stools)
  const temperatures = useStore((s) => s.temperatures)
  const visits = useStore((s) => s.visits)
  const milestones = useStore((s) => s.milestones)
  const growth = useStore((s) => s.growth)

  const [range, setRange] = useState<Range>(14)

  const buckets = useMemo(() => dayBuckets(range), [range])
  const rangeStartMs = useMemo(() => new Date(buckets[0]).getTime(), [buckets])

  const sleepByDay = useMemo(() => {
    const map = new Map(buckets.map((d) => [d, 0]))
    for (const n of naps) {
      if (!n.end) continue
      const key = dateKey(n.start)
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + minutesBetween(n.start, n.end))
    }
    return buckets.map((d) => ({ date: d, value: Math.round(((map.get(d) ?? 0) / 60) * 10) / 10 }))
  }, [naps, buckets])

  const feedVolumeByDay = useMemo(() => {
    const map = new Map(buckets.map((d) => [d, 0]))
    for (const f of feedings) {
      if (!f.quantityMl) continue
      const key = dateKey(f.datetime)
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + f.quantityMl)
    }
    return buckets.map((d) => ({ date: d, value: map.get(d) ?? 0 }))
  }, [feedings, buckets])

  const feedCountByDay = useMemo(() => {
    const map = new Map(buckets.map((d) => [d, 0]))
    for (const f of feedings) {
      const key = dateKey(f.datetime)
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1)
    }
    return buckets.map((d) => ({ date: d, value: map.get(d) ?? 0 }))
  }, [feedings, buckets])

  const tempsInRange = useMemo(
    () => sortByDateAsc(temperatures.filter((t) => new Date(t.datetime).getTime() >= rangeStartMs), (t) => t.datetime),
    [temperatures, rangeStartMs],
  )

  const stoolDistribution = useMemo(() => {
    const counts = new Map<StoolType, number>()
    for (const s of stools) {
      if (new Date(s.datetime).getTime() < rangeStartMs) continue
      counts.set(s.type, (counts.get(s.type) ?? 0) + 1)
    }
    return (Object.keys(stoolTypeLabels) as StoolType[])
      .map((t) => ({ label: stoolTypeLabels[t], value: counts.get(t) ?? 0, color: stoolTypeColors[t] }))
      .filter((d) => d.value > 0)
  }, [stools, rangeStartMs])

  const weightData = useMemo(
    () => sortByDateAsc(growth.filter((g) => g.weightKg != null), (g) => g.date).map((g) => ({ date: g.date, value: g.weightKg! })),
    [growth],
  )
  const heightData = useMemo(
    () => sortByDateAsc(growth.filter((g) => g.heightCm != null), (g) => g.date).map((g) => ({ date: g.date, value: g.heightCm! })),
    [growth],
  )
  const headData = useMemo(
    () =>
      sortByDateAsc(growth.filter((g) => g.headCircumferenceCm != null), (g) => g.date).map((g) => ({
        date: g.date,
        value: g.headCircumferenceCm!,
      })),
    [growth],
  )

  const milestonesSorted = sortByDateAsc(milestones, (m) => m.date)
  const visitsSorted = sortByDateDesc(visits, (v) => v.date)

  return (
    <div>
      <div className="no-print flex items-center justify-between mb-4 gap-3">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Rapport pédiatre</h1>
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer size={16} /> Imprimer / PDF
        </Button>
      </div>

      <div className="no-print mb-5">
        <SegmentedControl
          value={range}
          onChange={setRange}
          options={[
            { value: 7, label: '7 j' },
            { value: 14, label: '14 j' },
            { value: 30, label: '30 j' },
            { value: 90, label: '90 j' },
          ]}
        />
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">Rapport de suivi — {profile.name}</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {formatAge(profile.birthDate)} · né(e) le {formatDate(profile.birthDate)} · période : {range} derniers jours ·
          généré le {formatDate(new Date().toISOString())}
        </p>
      </div>

      <ChartCard title="Poids (kg)"><GrowthChart data={weightData} color="var(--color-growth)" unit="kg" /></ChartCard>
      <ChartCard title="Taille (cm)"><GrowthChart data={heightData} color="var(--color-primary)" unit="cm" /></ChartCard>
      <ChartCard title="Périmètre crânien (cm)"><GrowthChart data={headData} color="var(--color-milestone)" unit="cm" /></ChartCard>

      <ChartCard title={`Sommeil (h/jour) — ${range} derniers jours`}>
        <DailyBarChart data={sleepByDay} color="var(--color-sleep)" unit="h" />
      </ChartCard>

      <ChartCard title={`Volume de lait (ml/jour) — ${range} derniers jours`}>
        <DailyBarChart data={feedVolumeByDay} color="var(--color-feed)" unit="ml" />
      </ChartCard>

      <ChartCard title={`Nombre de repas/jour — ${range} derniers jours`}>
        <DailyBarChart data={feedCountByDay} color="var(--color-feed)" unit="repas" />
      </ChartCard>

      <ChartCard title={`Température — ${range} derniers jours`}>
        <TemperatureChart data={tempsInRange} />
      </ChartCard>

      <ChartCard title={`Selles par type — ${range} derniers jours`}>
        <DistributionChart data={stoolDistribution} />
      </ChartCard>

      <ChartCard title="Étapes de développement">
        {milestonesSorted.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">Aucune étape enregistrée.</p>
        ) : (
          <ul className="space-y-2">
            {milestonesSorted.map((m) => (
              <li key={m.id} className="flex items-start gap-2.5 text-sm">
                <span
                  className="mt-1 w-2 h-2 rounded-full shrink-0"
                  style={{ background: milestoneCategoryColors[m.category] }}
                />
                <span className="text-[var(--color-text-muted)] shrink-0 w-20">{formatDate(m.date)}</span>
                <span className="text-[var(--color-text)]">
                  {m.title}
                  <span className="text-[var(--color-text-muted)]"> · {milestoneCategoryLabels[m.category]}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </ChartCard>

      <ChartCard title="Visites médicales">
        {visitsSorted.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">Aucune visite enregistrée.</p>
        ) : (
          <ul className="space-y-3">
            {visitsSorted.map((v) => (
              <li key={v.id} className="text-sm">
                <p className="font-medium text-[var(--color-text)]">
                  {formatDate(v.date)} — {v.reason} {v.doctor && <span className="text-[var(--color-text-muted)]">({v.doctor})</span>}
                </p>
                {v.notes && <p className="text-[var(--color-text-muted)]">{v.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-soft)] print:shadow-none print:border print:border-[var(--color-border)] p-4 mb-4 break-inside-avoid">
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">{title}</h3>
      {children}
    </div>
  )
}
