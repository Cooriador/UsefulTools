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
