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
