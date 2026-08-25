import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDateShort } from '../../lib/utils'

export interface DailyPoint {
  date: string
  value: number
}

export function DailyBarChart({ data, color, unit }: { data: DailyPoint[]; color: string; unit: string }) {
  const hasData = data.some((d) => d.value > 0)
  if (!hasData) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
        Pas encore de données sur cette période
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="date"
          tickFormatter={formatDateShort}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={{ stroke: 'var(--color-border)' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip
          labelFormatter={(v) => formatDateShort(v as string)}
          formatter={(v) => [`${v} ${unit}`, '']}
          contentStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
