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
  const yearSpan = Math.abs(toYear - fromYear)
  const avgAnnualRate =
    yearSpan > 0 ? (Math.pow(toCPI / fromCPI, 1 / yearSpan) - 1) * 100 : 0
  return { adjustedAmount, cumulativePercent, avgAnnualRate }
}

export function getChartData(
  amount: number,
  fromYear: number,
  toYear: number,
  cpi: CPIData
): Array<{ year: number; value: number }> {
  const fromCPI = cpi[String(fromYear)]
  const minYear = Math.min(fromYear, toYear)
  const maxYear = Math.max(fromYear, toYear)
  return Object.keys(cpi)
    .map(Number)
    .filter((y) => y >= minYear && y <= maxYear)
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
