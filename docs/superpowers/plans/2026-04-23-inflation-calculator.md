# Inflation Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js inflation calculator site with ~4,000 SEO pages targeting long-tail queries like "$100 in 1950 today," monetized with Google AdSense.

**Architecture:** Next.js 14+ App Router with full static generation (`generateStaticParams`). BLS CPI-U data is fetched once via a script and stored in `data/cpi.json`; all pages are generated at build time from this file. No database, no serverless functions — Vercel serves static HTML from CDN.

**Tech Stack:** Next.js 14+, React 18, TypeScript, Tailwind CSS, Recharts, next-sitemap, Jest + React Testing Library

---

## File Map

| File | Responsibility |
|---|---|
| `data/cpi.json` | Annual CPI-U values 1913–present (source of truth) |
| `scripts/fetch-bls-data.ts` | One-time script to populate `cpi.json` from BLS |
| `lib/inflation.ts` | Pure calculation functions (testable, no side effects) |
| `lib/benchmarks.ts` | 2024 price benchmarks for contextual comparisons |
| `components/Calculator.tsx` | Client component — interactive inputs + result display |
| `components/InflationChart.tsx` | Recharts line chart (client component) |
| `components/AdUnit.tsx` | Google AdSense unit wrapper (client component) |
| `components/RelatedLinks.tsx` | Internal links to nearby years/amounts (server component) |
| `app/layout.tsx` | Root layout — AdSense script, nav, footer |
| `app/page.tsx` | Homepage with main calculator |
| `app/value-of/[amount]/[year]/page.tsx` | SEO page type 1: "$X in YEAR today" |
| `app/inflation-from/[from]/[to]/page.tsx` | SEO page type 2: "Inflation from YEAR to YEAR" |
| `app/about/page.tsx` | Methodology + data source |
| `next-sitemap.config.js` | Sitemap generation config |
| `jest.config.ts` | Jest configuration |
| `__tests__/inflation.test.ts` | Unit tests for calculation functions |
| `__tests__/Calculator.test.tsx` | Component tests for Calculator |

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 1: Scaffold the project**

Run in `S:/Claude Projects/UsefulTools (Empty)`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

Expected: Next.js project created with TypeScript, Tailwind, App Router enabled.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install recharts next-sitemap
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest tsx
```

Expected: `node_modules` updated, no errors.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000` — should show the default Next.js welcome page. Stop the server with Ctrl+C.

- [ ] **Step 4: Initialize git and commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with TypeScript, Tailwind, Recharts"
```

---

## Task 2: Configure Jest

**Files:**
- Create: `jest.config.ts`, `jest.setup.ts`

- [ ] **Step 1: Write jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 2: Add test script to package.json**

In `package.json`, find the `"scripts"` section and add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 3: Verify Jest runs (no tests yet)**

```bash
npm test -- --passWithNoTests
```

Expected output: `Test Suites: 0 passed` — no errors.

- [ ] **Step 4: Commit**

```bash
git add jest.config.ts package.json
git commit -m "feat: configure Jest with Next.js test environment"
```

---

## Task 3: Write Inflation Calculation Library (TDD)

**Files:**
- Create: `lib/inflation.ts`
- Create: `__tests__/inflation.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// __tests__/inflation.test.ts
import '@testing-library/jest-dom'
import {
  calculateInflation,
  getChartData,
  formatCurrency,
  formatPercent,
  type CPIData,
} from '../lib/inflation'

const mockCPI: CPIData = {
  '1950': 24.1,
  '1960': 29.6,
  '1970': 38.8,
  '2024': 314.0,
}

describe('calculateInflation', () => {
  it('calculates adjusted amount', () => {
    const { adjustedAmount } = calculateInflation(100, 1950, 2024, mockCPI)
    expect(adjustedAmount).toBeCloseTo(100 * (314.0 / 24.1), 1)
  })

  it('calculates cumulative percent', () => {
    const { cumulativePercent } = calculateInflation(100, 1950, 2024, mockCPI)
    expect(cumulativePercent).toBeCloseTo(((314.0 - 24.1) / 24.1) * 100, 1)
  })

  it('calculates average annual rate', () => {
    const { avgAnnualRate } = calculateInflation(100, 1950, 2024, mockCPI)
    const expected = (Math.pow(314.0 / 24.1, 1 / 74) - 1) * 100
    expect(avgAnnualRate).toBeCloseTo(expected, 2)
  })

  it('returns zero inflation when fromYear equals toYear', () => {
    const result = calculateInflation(100, 1950, 1950, mockCPI)
    expect(result.adjustedAmount).toBeCloseTo(100, 2)
    expect(result.cumulativePercent).toBeCloseTo(0, 2)
    expect(result.avgAnnualRate).toBe(0)
  })

  it('scales linearly with input amount', () => {
    const r1 = calculateInflation(100, 1950, 2024, mockCPI)
    const r2 = calculateInflation(200, 1950, 2024, mockCPI)
    expect(r2.adjustedAmount).toBeCloseTo(r1.adjustedAmount * 2, 2)
  })
})

describe('getChartData', () => {
  it('returns one entry per year in range', () => {
    const data = getChartData(100, 1950, 1970, mockCPI)
    expect(data).toHaveLength(3)
    expect(data[0]).toEqual({ year: 1950, value: 100 })
    expect(data[2].year).toBe(1970)
  })

  it('first value always equals input amount', () => {
    const data = getChartData(250, 1950, 2024, mockCPI)
    expect(data[0].value).toBe(250)
  })
})

describe('formatCurrency', () => {
  it('formats whole dollars', () => {
    expect(formatCurrency(1302)).toBe('$1,302.00')
  })

  it('formats cents', () => {
    expect(formatCurrency(9.99)).toBe('$9.99')
  })
})

describe('formatPercent', () => {
  it('adds + sign for positive values', () => {
    expect(formatPercent(25.5)).toBe('+25.5%')
  })

  it('uses - sign for negative values', () => {
    expect(formatPercent(-5.3)).toBe('-5.3%')
  })

  it('respects decimals parameter', () => {
    expect(formatPercent(3.14159, 2)).toBe('+3.14%')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/inflation.test.ts
```

Expected: FAIL — `Cannot find module '../lib/inflation'`

- [ ] **Step 3: Implement lib/inflation.ts**

```typescript
// lib/inflation.ts
export interface CPIData {
  [year: string]: number
}

export interface InflationResult {
  adjustedAmount: number
  cumulativePercent: number
  avgAnnualRate: number
}

export function calculateInflation(
  amount: number,
  fromYear: number,
  toYear: number,
  cpi: CPIData
): InflationResult {
  const fromCPI = cpi[String(fromYear)]
  const toCPI = cpi[String(toYear)]
  const adjustedAmount = amount * (toCPI / fromCPI)
  const cumulativePercent = ((toCPI - fromCPI) / fromCPI) * 100
  const years = toYear - fromYear
  const avgAnnualRate =
    years > 0 ? (Math.pow(toCPI / fromCPI, 1 / years) - 1) * 100 : 0
  return { adjustedAmount, cumulativePercent, avgAnnualRate }
}

export function getChartData(
  amount: number,
  fromYear: number,
  toYear: number,
  cpi: CPIData
): Array<{ year: number; value: number }> {
  const fromCPI = cpi[String(fromYear)]
  return Object.keys(cpi)
    .map(Number)
    .filter((y) => y >= fromYear && y <= toYear)
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      value: Math.round((amount * (cpi[String(year)] / fromCPI)) * 100) / 100,
    }))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercent(value: number, decimals = 1): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/inflation.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/inflation.ts __tests__/inflation.test.ts
git commit -m "feat: add inflation calculation library with tests"
```

---

## Task 4: Fetch BLS CPI Data

**Files:**
- Create: `scripts/fetch-bls-data.ts`
- Create: `data/cpi.json` (generated by running the script)

- [ ] **Step 1: Write the fetch script**

```typescript
// scripts/fetch-bls-data.ts
import fs from 'fs'
import path from 'path'

const SERIES_ID = 'CUUR0000SA0'
const DATA_URL =
  'https://download.bls.gov/pub/time.series/cu/cu.data.1.AllItems'
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'cpi.json')

async function main() {
  console.log('Fetching CPI data from BLS...')
  const res = await fetch(DATA_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const text = await res.text()

  // Prefer M13 (BLS annual average); fall back to averaging monthly data
  const m13: Record<string, number> = {}
  const monthly: Record<string, number[]> = {}

  for (const line of text.split('\n').slice(1)) {
    const parts = line.trim().split('\t')
    if (parts.length < 4) continue
    const [series, year, period, value] = parts.map((p) => p.trim())
    if (series !== SERIES_ID) continue
    if (period === 'M13') {
      m13[year] = parseFloat(value)
    } else if (/^M(0[1-9]|1[0-2])$/.test(period)) {
      if (!monthly[year]) monthly[year] = []
      monthly[year].push(parseFloat(value))
    }
  }

  const cpi: Record<string, number> = {}
  const allYears = new Set([...Object.keys(m13), ...Object.keys(monthly)])
  for (const year of allYears) {
    if (m13[year] !== undefined) {
      cpi[year] = Math.round(m13[year] * 100) / 100
    } else if (monthly[year]?.length) {
      const avg =
        monthly[year].reduce((a, b) => a + b, 0) / monthly[year].length
      cpi[year] = Math.round(avg * 100) / 100
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(cpi).sort(([a], [b]) => parseInt(a) - parseInt(b))
  )

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sorted, null, 2))

  const years = Object.keys(sorted)
  console.log(
    `✓ Saved ${years.length} years (${years[0]}–${years[years.length - 1]}) to ${OUTPUT_PATH}`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 2: Add script to package.json**

In `package.json` scripts section, add:
```json
"fetch-cpi": "npx tsx scripts/fetch-bls-data.ts"
```

- [ ] **Step 3: Run the script**

```bash
npm run fetch-cpi
```

Expected output:
```
Fetching CPI data from BLS...
✓ Saved 112 years (1913–2024) to .../data/cpi.json
```

- [ ] **Step 4: Spot-check cpi.json**

Open `data/cpi.json` and verify:
- First entry is `"1913"` with a value around `9.8`
- Most recent year has a value around `310–320`
- No `null` or `NaN` values

- [ ] **Step 5: Add cpi.json and commit**

```bash
git add data/cpi.json scripts/fetch-bls-data.ts package.json
git commit -m "feat: add BLS CPI fetch script and historical cpi.json data"
```

---

## Task 5: Write Benchmarks Library

**Files:**
- Create: `lib/benchmarks.ts`

- [ ] **Step 1: Write lib/benchmarks.ts**

```typescript
// lib/benchmarks.ts
export interface Benchmark {
  label: string
  price2024: number
  unit: string
}

// 2024 US average prices (hardcoded — update annually with cpi.json)
export const BENCHMARKS: Benchmark[] = [
  { label: 'Months of avg. rent', price2024: 1_500, unit: 'months' },
  { label: 'Tanks of gas (12 gal)', price2024: 42, unit: 'tanks' },
  { label: 'Loaves of bread', price2024: 4, unit: 'loaves' },
]
```

- [ ] **Step 2: Commit**

```bash
git add lib/benchmarks.ts
git commit -m "feat: add 2024 price benchmarks for contextual comparisons"
```

---

## Task 6: Write InflationChart Component

**Files:**
- Create: `components/InflationChart.tsx`

- [ ] **Step 1: Write components/InflationChart.tsx**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/InflationChart.tsx
git commit -m "feat: add InflationChart Recharts component"
```

---

## Task 7: Write Calculator Component (TDD)

**Files:**
- Create: `components/Calculator.tsx`
- Create: `__tests__/Calculator.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
// __tests__/Calculator.test.tsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from '../components/Calculator'
import type { CPIData } from '../lib/inflation'

const mockCPI: CPIData = {
  '1950': 24.1,
  '1960': 29.6,
  '1970': 38.8,
  '2024': 314.0,
}

describe('Calculator', () => {
  it('renders the adjusted value for default inputs', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={2024}
      />
    )
    // 100 * (314 / 24.1) = ~$1,302.49
    expect(screen.getByText(/\$1,302/)).toBeInTheDocument()
  })

  it('renders cumulative percent', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={2024}
      />
    )
    expect(screen.getByText(/Cumulative inflation/i)).toBeInTheDocument()
  })

  it('updates result when amount input changes', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={2024}
      />
    )
    const input = screen.getByLabelText(/Amount/i)
    fireEvent.change(input, { target: { value: '200' } })
    // 200 * (314 / 24.1) ≈ $2604.98
    expect(screen.getByText(/\$2,604/)).toBeInTheDocument()
  })

  it('shows from-year label in result', () => {
    render(
      <Calculator
        cpi={mockCPI}
        defaultAmount={100}
        defaultFromYear={1960}
        defaultToYear={2024}
      />
    )
    expect(screen.getByText(/in 1960/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/Calculator.test.tsx
```

Expected: FAIL — `Cannot find module '../components/Calculator'`

- [ ] **Step 3: Write components/Calculator.tsx**

```tsx
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
  const [fromYear, setFromYear] = useState(defaultFromYear ?? 1950)
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/Calculator.test.tsx
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: All 13 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add components/Calculator.tsx __tests__/Calculator.test.tsx
git commit -m "feat: add Calculator component with tests"
```

---

## Task 8: Write AdUnit Component

**Files:**
- Create: `components/AdUnit.tsx`

> **Note:** Replace `ca-pub-XXXXXXXXXXXXXXXX` with your actual AdSense publisher ID after AdSense approval. The slot IDs (`data-ad-slot`) also come from your AdSense account — create two ad units there and substitute those IDs in the page files.

- [ ] **Step 1: Write components/AdUnit.tsx**

```tsx
// components/AdUnit.tsx
'use client'

import { useEffect } from 'react'

interface Props {
  slot: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({ slot }: Props) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not loaded (dev environment)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AdUnit.tsx
git commit -m "feat: add AdUnit wrapper for Google AdSense"
```

---

## Task 9: Write RelatedLinks Component

**Files:**
- Create: `components/RelatedLinks.tsx`

- [ ] **Step 1: Write components/RelatedLinks.tsx**

```tsx
// components/RelatedLinks.tsx
interface Props {
  amount: number
  year: number
  years: number[]
  amounts: number[]
}

export default function RelatedLinks({ amount, year, years, amounts }: Props) {
  const nearbyYears = years
    .filter(
      (y) =>
        y !== year &&
        Math.abs(y - year) >= 5 &&
        Math.abs(y - year) <= 20 &&
        Math.abs(y - year) % 5 === 0
    )
    .slice(0, 5)

  const nearbyAmounts = amounts.filter((a) => a !== amount).slice(0, 4)

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-base font-semibold text-gray-700 mb-3">
        Related Calculations
      </h2>
      <div className="flex flex-wrap gap-2">
        {nearbyYears.map((y) => (
          <a
            key={y}
            href={`/value-of/${amount}/${y}`}
            className="text-sm text-blue-600 hover:underline bg-gray-100 px-3 py-1 rounded"
          >
            ${amount.toLocaleString()} in {y}
          </a>
        ))}
        {nearbyAmounts.map((a) => (
          <a
            key={a}
            href={`/value-of/${a}/${year}`}
            className="text-sm text-blue-600 hover:underline bg-gray-100 px-3 py-1 rounded"
          >
            ${a.toLocaleString()} in {year}
          </a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/RelatedLinks.tsx
git commit -m "feat: add RelatedLinks component for internal SEO linking"
```

---

## Task 10: Write Root Layout

**Files:**
- Modify: `app/layout.tsx`

> **Note:** Replace `ca-pub-XXXXXXXXXXXXXXXX` in the AdSense script src with your actual publisher ID. This is the same ID used in `AdUnit.tsx`.

- [ ] **Step 1: Replace app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inflation Calculator — US Dollar Value Over Time',
  description:
    'Calculate the inflation-adjusted value of any US dollar amount using historical CPI data from the Bureau of Labor Statistics (1913–present).',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <header className="border-b bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-700">
              Inflation Calculator
            </a>
            <nav className="text-sm text-gray-500">
              <a href="/about" className="hover:underline">
                About
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t mt-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-500">
            <p>
              Data: U.S. Bureau of Labor Statistics CPI-U (CUUR0000SA0).
              Updated annually.
            </p>
            <p className="mt-1">
              <a href="/about" className="underline">
                About this tool
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with header, footer, AdSense script"
```

---

## Task 11: Write Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
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
```

- [ ] **Step 2: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Calculator renders with year dropdowns
- Changing amount/years updates result instantly
- Chart renders
- No console errors

Stop the server.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add homepage with main inflation calculator"
```

---

## Task 12: Write SEO Page Type 1 (value-of/[amount]/[year])

**Files:**
- Create: `app/value-of/[amount]/[year]/page.tsx`

> **URL pattern:** `/value-of/100/1950` renders "What is $100 from 1950 worth today?"
> Note: Next.js App Router requires each dynamic segment in its own folder. The URL uses `/value-of/AMOUNT/YEAR` instead of the conceptual `/value-of-100-dollars-in-1950` — the title and h1 contain the full keyword phrase.

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "app/value-of/[amount]/[year]"
```

- [ ] **Step 2: Write app/value-of/[amount]/[year]/page.tsx**

```tsx
// app/value-of/[amount]/[year]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cpiData from '../../../../data/cpi.json'
import Calculator from '../../../../components/Calculator'
import AdUnit from '../../../../components/AdUnit'
import RelatedLinks from '../../../../components/RelatedLinks'
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
  params: { amount: string; year: string }
}): Promise<Metadata> {
  const amount = parseInt(params.amount)
  const fromYear = parseInt(params.year)
  if (!cpi[params.year] || !AMOUNTS.includes(amount)) return {}
  const result = calculateInflation(amount, fromYear, MAX_YEAR, cpi)
  const adjusted = formatCurrency(result.adjustedAmount)
  const original = formatCurrency(amount)
  return {
    title: `${original} in ${fromYear} → ${adjusted} in ${MAX_YEAR} | Inflation Calculator`,
    description: `${original} in ${fromYear} had the same purchasing power as ${adjusted} in ${MAX_YEAR} (${formatPercent(result.cumulativePercent)} cumulative inflation). Calculated using CPI-U data from the Bureau of Labor Statistics.`,
  }
}

export default function Page({
  params,
}: {
  params: { amount: string; year: string }
}) {
  const amount = parseInt(params.amount)
  const fromYear = parseInt(params.year)
  if (!cpi[params.year] || !AMOUNTS.includes(amount) || isNaN(fromYear)) {
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
        <AdUnit slot="SLOT_ID_1" />
      </div>

      <Calculator
        cpi={cpi}
        defaultAmount={amount}
        defaultFromYear={fromYear}
        defaultToYear={MAX_YEAR}
      />

      <div className="my-8">
        <AdUnit slot="SLOT_ID_2" />
      </div>

      <RelatedLinks
        amount={amount}
        year={fromYear}
        years={ALL_YEARS}
        amounts={AMOUNTS}
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify a sample page**

```bash
npm run dev
```

Open `http://localhost:3000/value-of/100/1950`. Verify:
- H1 reads "What is $100 from 1950 worth today?"
- Adjusted value displays correctly (~$1,302)
- Related links render
- No console errors

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add "app/value-of/[amount]/[year]/page.tsx"
git commit -m "feat: add programmatic SEO pages for value-of/[amount]/[year]"
```

---

## Task 13: Write SEO Page Type 2 (inflation-from/[from]/[to])

**Files:**
- Create: `app/inflation-from/[from]/[to]/page.tsx`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "app/inflation-from/[from]/[to]"
```

- [ ] **Step 2: Write app/inflation-from/[from]/[to]/page.tsx**

```tsx
// app/inflation-from/[from]/[to]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cpiData from '../../../../data/cpi.json'
import Calculator from '../../../../components/Calculator'
import AdUnit from '../../../../components/AdUnit'
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
  params: { from: string; to: string }
}): Promise<Metadata> {
  const fromYear = parseInt(params.from)
  const toYear = parseInt(params.to)
  if (!cpi[params.from] || !cpi[params.to]) return {}
  const result = calculateInflation(100, fromYear, toYear, cpi)
  return {
    title: `Inflation ${fromYear} to ${toYear}: ${formatPercent(result.cumulativePercent)} | Inflation Calculator`,
    description: `US inflation from ${fromYear} to ${toYear} was ${formatPercent(result.cumulativePercent)}. $100 in ${fromYear} had the same purchasing power as ${formatCurrency(result.adjustedAmount)} in ${toYear}.`,
  }
}

export default function Page({
  params,
}: {
  params: { from: string; to: string }
}) {
  const fromYear = parseInt(params.from)
  const toYear = parseInt(params.to)
  if (
    !cpi[params.from] ||
    !cpi[params.to] ||
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
    </div>
  )
}
```

- [ ] **Step 3: Verify a sample page**

```bash
npm run dev
```

Open `http://localhost:3000/inflation-from/1970/2000`. Verify:
- H1 reads "US Inflation from 1970 to 2000"
- Percent and adjusted value display correctly
- Calculator is pre-set to 1970–2000

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add "app/inflation-from/[from]/[to]/page.tsx"
git commit -m "feat: add programmatic SEO pages for inflation-from/[from]/[to]"
```

---

## Task 14: Write About Page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Write app/about/page.tsx**

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Inflation Calculator',
  description:
    'How this inflation calculator works, where the data comes from, and its limitations.',
}

export default function About() {
  return (
    <div className="prose max-w-prose">
      <h1>About This Calculator</h1>
      <p>
        This inflation calculator uses the{' '}
        <strong>Consumer Price Index for All Urban Consumers (CPI-U)</strong>,
        series CUUR0000SA0, published by the U.S. Bureau of Labor Statistics
        (BLS). The CPI measures the average change over time in prices paid by
        urban consumers for a market basket of goods and services.
      </p>

      <h2>How the Calculation Works</h2>
      <p>
        To find the inflation-adjusted value, we divide the CPI of the target
        year by the CPI of the base year, then multiply by the original amount:
      </p>
      <pre className="bg-gray-100 p-4 rounded text-sm not-prose">
        Adjusted Value = Original Amount × (CPI[target year] / CPI[base year])
      </pre>
      <p>
        Annual average CPI values are used (not monthly data), which provides a
        stable, representative figure for each calendar year.
      </p>

      <h2>Data Source</h2>
      <p>
        All data comes from the U.S. Bureau of Labor Statistics. Annual figures
        are updated each January when BLS publishes the prior year&apos;s data.
      </p>

      <h2>Limitations</h2>
      <p>
        CPI measures average inflation across urban consumers nationally. Actual
        purchasing power changes vary by location, income level, and individual
        spending patterns. Use this tool for general estimates, not precise
        personal financial planning.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Open `http://localhost:3000/about`. Verify page renders cleanly.

Stop the server.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: add about page with methodology and data source"
```

---

## Task 15: Configure next-sitemap

**Files:**
- Create: `next-sitemap.config.js`
- Modify: `package.json` (add postbuild script)

- [ ] **Step 1: Write next-sitemap.config.js**

```javascript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  changefreq: 'yearly',
  priority: 0.7,
  sitemapSize: 7_000,
}
```

- [ ] **Step 2: Add postbuild script to package.json**

In `package.json` scripts section, add:
```json
"postbuild": "next-sitemap"
```

- [ ] **Step 3: Run a build to verify sitemap generates**

```bash
npm run build
```

Expected: Build completes, then `next-sitemap` runs. You should see `public/sitemap*.xml` and `public/robots.txt` created.

Check the file count:
```bash
ls public/sitemap*.xml | wc -l
```

Expected: 1–3 sitemap files (split at 7,000 entries each) covering all ~4,000 pages.

- [ ] **Step 4: Commit**

```bash
git add next-sitemap.config.js package.json public/sitemap*.xml public/robots.txt
git commit -m "feat: add next-sitemap for auto-generated sitemap and robots.txt"
```

---

## Task 16: Deploy to Vercel

- [ ] **Step 1: Create a GitHub repository**

Go to github.com → New repository → name it (e.g., `inflation-calculator`) → Create.

Then push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/inflation-calculator.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Import to Vercel**

1. Go to vercel.com → Add New Project → Import Git Repository
2. Select your `inflation-calculator` repo
3. Framework: Next.js (auto-detected)
4. Add environment variable: `SITE_URL` = your domain (e.g., `https://your-domain.com`)
5. Click Deploy

Expected: Build runs, deploys successfully. Vercel provides a preview URL.

- [ ] **Step 3: Point your domain to Vercel**

In Vercel project settings → Domains → Add your domain → Follow DNS instructions.

- [ ] **Step 4: Set up Google Search Console**

1. Go to search.google.com/search-console → Add Property → enter your domain
2. Verify ownership (Vercel makes this easy — use the HTML tag method, add it to `app/layout.tsx` `<head>`)
3. Sitemaps → Submit → enter `https://your-domain.com/sitemap.xml`

- [ ] **Step 5: Set up Google AdSense**

1. Go to adsense.google.com → Sign up with your domain
2. Add the AdSense verification code to `app/layout.tsx` (AdSense will provide a `<meta>` tag)
3. Wait for AdSense approval (typically 1–3 days for new sites; the site needs some content)
4. Once approved, create two ad units in AdSense → copy their slot IDs
5. Replace `SLOT_ID_1` and `SLOT_ID_2` in `app/value-of/[amount]/[year]/page.tsx` and `app/inflation-from/[from]/[to]/page.tsx` with your real slot IDs
6. Replace `ca-pub-XXXXXXXXXXXXXXXX` in `components/AdUnit.tsx` and `app/layout.tsx` with your real publisher ID
7. Commit and push — Vercel auto-deploys

---

## Post-Launch Checklist

- [ ] Verify `https://your-domain.com/value-of/100/1950` renders correctly
- [ ] Verify `https://your-domain.com/inflation-from/1970/2000` renders correctly
- [ ] Check Core Web Vitals in Vercel Analytics or PageSpeed Insights — LCP should be under 2.5s
- [ ] Confirm sitemap is accepted in Google Search Console (no errors)
- [ ] Confirm AdSense ads render on deployed site (not in dev — AdSense is blocked in dev)
- [ ] Monitor Search Console for first impressions (typically 2–4 weeks after submission)
