import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDateShort } from '../../lib/utils'

export interface GrowthPoint {
  date: string
  value: number
}

export function GrowthChart({ data, color, unit }: { data: GrowthPoint[]; color: string; unit: string }) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
        Pas encore de données
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <XAxis
          dataKey="date"
          tickFormatter={formatDateShort}
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={{ stroke: 'var(--color-border)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
          width={40}
          domain={['dataMin - 1', 'dataMax + 1']}
        />
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
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
