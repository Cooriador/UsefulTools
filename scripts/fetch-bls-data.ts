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
