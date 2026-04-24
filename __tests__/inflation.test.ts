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
