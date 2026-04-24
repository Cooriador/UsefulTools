// app/page.tsx
import type { Metadata } from 'next'
import cpiData from '../data/cpi.json'
import Calculator from '../components/Calculator'
import type { CPIData } from '../lib/inflation'

const cpi = cpiData as CPIData
const years = Object.keys(cpi).map(Number).sort((a, b) => a - b)
const maxYear = years[years.length - 1]

export const metadata: Metadata = {
  title: 'US Inflation Calculator — Dollar Value 1913–Present',
  description: `Calculate the inflation-adjusted value of any US dollar amount from 1913 to ${maxYear}. Uses CPI-U data from the Bureau of Labor Statistics.`,
}

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">US Inflation Calculator</h1>
      <p className="text-gray-600 mb-8">
        How much is a dollar worth over time? Enter any amount and year range
        to see the inflation-adjusted value, using CPI data from the Bureau of
        Labor Statistics (1913–{maxYear}).
      </p>
      <Calculator
        cpi={cpi}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={maxYear}
      />
    </div>
  )
}
