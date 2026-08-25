import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { feverThresholdC } from '../../lib/constants'
import { formatDateShort } from '../../lib/utils'
import type { Temperature } from '../../types'

export function TemperatureChart({ data }: { data: Temperature[] }) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
        Pas encore de données sur cette période
      </div>
    )
  }

  const points = data.map((t) => ({ date: t.datetime, value: t.valueC }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
          width={36}
          domain={[35, 41]}
        />
        <ReferenceLine y={feverThresholdC} stroke="var(--color-health)" strokeDasharray="4 4" label={{ value: 'Fièvre', fontSize: 10, fill: 'var(--color-health)', position: 'insideTopRight' }} />
        <Tooltip
          labelFormatter={(v) => formatDateShort(v as string)}
          formatter={(v) => [`${Number(v).toFixed(1)} °C`, '']}
          contentStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            fontSize: 12,
          }}
        />
        <Line type="monotone" dataKey="value" stroke="var(--color-temp)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
