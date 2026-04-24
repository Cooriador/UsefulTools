// components/InflationChart.tsx
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '../lib/inflation'

interface Props {
  data: Array<{ year: number; value: number }>
}

export default function InflationChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(v: number) => formatCurrency(v)}
          width={90}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(v: number) => [formatCurrency(v), 'Value']}
          labelFormatter={(l) => `Year: ${l}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
