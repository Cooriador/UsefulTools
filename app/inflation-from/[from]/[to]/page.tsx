// app/inflation-from/[from]/[to]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cpiData from '../../../../data/cpi.json'
import Calculator from '../../../../components/Calculator'
import AdUnit from '../../../../components/AdUnit'
import InflationFromContent from '../../../../components/InflationFromContent'
import {
  calculateInflation,
  formatCurrency,
  formatPercent,
  type CPIData,
} from '../../../../lib/inflation'

const cpi = cpiData as CPIData
const ALL_YEARS = Object.keys(cpi)
  .map(Number)
  .sort((a, b) => a - b)

export function generateStaticParams() {
  const params: { from: string; to: string }[] = []
  for (const fromYear of ALL_YEARS) {
    for (const toYear of ALL_YEARS) {
      if (toYear - fromYear >= 5 && toYear % 5 === 0) {
        params.push({ from: String(fromYear), to: String(toYear) })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ from: string; to: string }>
}): Promise<Metadata> {
  const { from, to } = await params
  const fromYear = parseInt(from)
  const toYear = parseInt(to)
  if (!cpi[from] || !cpi[to]) return {}
  const result = calculateInflation(100, fromYear, toYear, cpi)
  return {
    title: `Inflation ${fromYear} to ${toYear}: ${formatPercent(result.cumulativePercent)} | Inflation Calculator`,
    description: `US inflation from ${fromYear} to ${toYear} was ${formatPercent(result.cumulativePercent)}. $100 in ${fromYear} had the same purchasing power as ${formatCurrency(result.adjustedAmount)} in ${toYear}.`,
    alternates: {
      canonical: `${process.env.SITE_URL || 'https://your-domain.com'}/inflation-from/${from}/${to}`,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ from: string; to: string }>
}) {
  const { from, to } = await params
  const fromYear = parseInt(from)
  const toYear = parseInt(to)
  if (
    !cpi[from] ||
    !cpi[to] ||
    toYear <= fromYear ||
    toYear - fromYear < 5 ||
    toYear % 5 !== 0
  ) {
    notFound()
  }
  const result = calculateInflation(100, fromYear, toYear, cpi)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        US Inflation from {fromYear} to {toYear}
      </h1>
      <p className="text-gray-600 mb-6">
        US inflation from {fromYear} to {toYear} was{' '}
        <strong className="text-gray-900">
          {formatPercent(result.cumulativePercent)}
        </strong>
        . $100 in {fromYear} had the same purchasing power as{' '}
        <strong className="text-gray-900">
          {formatCurrency(result.adjustedAmount)}
        </strong>{' '}
        in {toYear} (avg. {formatPercent(result.avgAnnualRate, 2)}/yr).
      </p>

      <div className="my-6">
        <AdUnit slot="SLOT_ID_1" />
      </div>

      <Calculator
        cpi={cpi}
        defaultAmount={100}
        defaultFromYear={fromYear}
        defaultToYear={toYear}
      />

      <div className="my-8">
        <AdUnit slot="SLOT_ID_2" />
      </div>

      <InflationFromContent
        fromYear={fromYear}
        toYear={toYear}
        result={result}
        allYears={ALL_YEARS}
      />
    </div>
  )
}
