// components/Calculator.tsx
'use client'

import { useState, useMemo } from 'react'
import {
  calculateInflation,
  getChartData,
  formatCurrency,
  formatPercent,
  type CPIData,
} from '../lib/inflation'
import { BENCHMARKS } from '../lib/benchmarks'
import InflationChart from './InflationChart'

interface Props {
  cpi: CPIData
  defaultAmount?: number
  defaultFromYear?: number
  defaultToYear?: number
}

export default function Calculator({
  cpi,
  defaultAmount = 100,
  defaultFromYear,
  defaultToYear,
}: Props) {
  const years = useMemo(
    () => Object.keys(cpi).map(Number).sort((a, b) => a - b),
    [cpi]
  )
  const maxYear = years[years.length - 1]

  const [amount, setAmount] = useState(defaultAmount)
  const [fromYear, setFromYear] = useState(defaultFromYear ?? years[0])
  const [toYear, setToYear] = useState(defaultToYear ?? maxYear)

  const result = useMemo(
    () => calculateInflation(amount, fromYear, toYear, cpi),
    [amount, fromYear, toYear, cpi]
  )

  const chartData = useMemo(
    () => getChartData(amount, fromYear, toYear, cpi),
    [amount, fromYear, toYear, cpi]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label
            htmlFor="calc-amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount ($)
          </label>
          <input
            id="calc-amount"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
            className="border rounded px-3 py-2 w-36 text-right"
          />
        </div>
        <div>
          <label
            htmlFor="calc-from"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From Year
          </label>
          <select
            id="calc-from"
            value={fromYear}
            onChange={(e) => setFromYear(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {years
              .filter((y) => y < toYear)
              .map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="calc-to"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To Year
          </label>
          <select
            id="calc-to"
            value={toYear}
            onChange={(e) => setToYear(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {years
              .filter((y) => y > fromYear)
              .map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <p className="text-sm text-gray-600">
          {formatCurrency(amount)} in {fromYear} is worth
        </p>
        <p className="text-4xl font-bold text-blue-700 mt-1">
          {formatCurrency(result.adjustedAmount)}
        </p>
        <p className="text-sm text-gray-500 mt-1">in {toYear}</p>
        <div className="mt-4 flex gap-8 text-sm">
          <div>
            <span className="text-gray-500">Cumulative inflation</span>
            <p className="font-semibold">
              {formatPercent(result.cumulativePercent)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Avg. annual rate</span>
            <p className="font-semibold">
              {formatPercent(result.avgAnnualRate, 2)}/yr
            </p>
          </div>
        </div>
      </div>

      <InflationChart data={chartData} />

      <div className="grid grid-cols-3 gap-4 text-sm">
        {BENCHMARKS.map((b) => {
          const qty = result.adjustedAmount / b.price2024
          return (
            <div key={b.label} className="bg-gray-50 rounded p-3">
              <p className="text-gray-500 text-xs mb-1">{b.label}</p>
              <p className="font-medium">
                {qty >= 1
                  ? qty.toFixed(1)
                  : `${(qty * 100).toFixed(0)}%`}{' '}
                {b.unit}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
