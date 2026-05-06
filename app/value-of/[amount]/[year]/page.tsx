// app/value-of/[amount]/[year]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cpiData from '../../../../data/cpi.json'
import Calculator from '../../../../components/Calculator'
import AdUnit from '../../../../components/AdUnit'
import RelatedLinks from '../../../../components/RelatedLinks'
import ValueOfContent from '../../../../components/ValueOfContent'
import {
  calculateInflation,
  formatCurrency,
  formatPercent,
  type CPIData,
} from '../../../../lib/inflation'

const cpi = cpiData as CPIData
const AMOUNTS = [
  1, 5, 10, 20, 25, 50, 100, 250, 500, 1_000, 2_500, 5_000, 10_000, 25_000,
  50_000, 100_000,
]
const ALL_YEARS = Object.keys(cpi)
  .map(Number)
  .sort((a, b) => a - b)
const MAX_YEAR = ALL_YEARS[ALL_YEARS.length - 1]

export function generateStaticParams() {
  return AMOUNTS.flatMap((amount) =>
    ALL_YEARS.map((year) => ({
      amount: String(amount),
      year: String(year),
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ amount: string; year: string }>
}): Promise<Metadata> {
  const { amount: amountStr, year: yearStr } = await params
  const amount = parseInt(amountStr)
  const fromYear = parseInt(yearStr)
  if (!cpi[yearStr] || !AMOUNTS.includes(amount)) return {}
  const result = calculateInflation(amount, fromYear, MAX_YEAR, cpi)
  const adjusted = formatCurrency(result.adjustedAmount)
  const original = formatCurrency(amount)
  return {
    title: `${original} in ${fromYear} → ${adjusted} in ${MAX_YEAR} | Inflation Calculator`,
    description: `${original} in ${fromYear} had the same purchasing power as ${adjusted} in ${MAX_YEAR} (${formatPercent(result.cumulativePercent)} cumulative inflation). Calculated using CPI-U data from the Bureau of Labor Statistics.`,
    alternates: {
      canonical: `${process.env.SITE_URL || 'https://your-domain.com'}/value-of/${amountStr}/${yearStr}`,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ amount: string; year: string }>
}) {
  const { amount: amountStr, year: yearStr } = await params
  const amount = parseInt(amountStr)
  const fromYear = parseInt(yearStr)
  if (!cpi[yearStr] || !AMOUNTS.includes(amount) || isNaN(fromYear)) {
    notFound()
  }
  const result = calculateInflation(amount, fromYear, MAX_YEAR, cpi)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        What is {formatCurrency(amount)} from {fromYear} worth today?
      </h1>
      <p className="text-gray-600 mb-6">
        {formatCurrency(amount)} in {fromYear} is worth{' '}
        <strong className="text-gray-900">
          {formatCurrency(result.adjustedAmount)}
        </strong>{' '}
        in {MAX_YEAR}, accounting for{' '}
        {formatPercent(result.cumulativePercent)} cumulative inflation.
      </p>

      <div className="my-6">
        <AdUnit slot="7165271233" />
      </div>

      <Calculator
        cpi={cpi}
        defaultAmount={amount}
        defaultFromYear={fromYear}
        defaultToYear={MAX_YEAR}
      />

      <div className="my-8">
        <AdUnit slot="9582267152" />
      </div>

      <RelatedLinks
        amount={amount}
        year={fromYear}
        years={ALL_YEARS}
        amounts={AMOUNTS}
      />

      <ValueOfContent
        amount={amount}
        fromYear={fromYear}
        maxYear={MAX_YEAR}
        result={result}
        allAmounts={AMOUNTS}
        allYears={ALL_YEARS}
      />
    </div>
  )
}
