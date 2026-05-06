import Link from 'next/link'
import { getDecadeBlurb, getEraBlurb, getErasForRange } from '../lib/eras'
import {
  describeInflationCumulative,
  describeAnnualRate,
  formatPercent,
} from '../lib/inflation'
import type { InflationResult } from '../lib/inflation'

interface Props {
  fromYear: number
  toYear: number
  result: InflationResult
  allYears: number[]
}

export default function InflationFromContent({
  fromYear,
  toYear,
  result,
  allYears,
}: Props) {
  const eras = getErasForRange(fromYear, toYear)
  const isSingleEra = eras.length === 1
  const midYear = Math.floor((fromYear + toYear) / 2)
  const yearSpan = toYear - fromYear
  const cumulativeDesc = describeInflationCumulative(result.cumulativePercent)
  const annualDesc = describeAnnualRate(result.avgAnnualRate)

  const sameStartYears = allYears
    .filter((y) => y !== toYear && y > fromYear && y - fromYear >= 5 && y % 5 === 0)
    .sort((a, b) => Math.abs(a - toYear) - Math.abs(b - toYear))
    .slice(0, 4)

  const sameEndYears = allYears
    .filter((y) => y !== fromYear && y < toYear && toYear - y >= 5)
    .sort((a, b) => Math.abs(a - fromYear) - Math.abs(b - fromYear))
    .slice(0, 4)

  return (
    <div className="mt-10 space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          What Drove Inflation from {fromYear} to {toYear}
        </h2>
        {isSingleEra ? (
          <>
            <p className="text-gray-700">{getDecadeBlurb(midYear)}</p>
            <p className="text-gray-700 mt-3">{getEraBlurb(midYear)}</p>
          </>
        ) : (
          eras.map((era) => (
            <p key={era.name} className="text-gray-700 mt-3">
              <strong>{era.name}:</strong> {era.blurb}
            </p>
          ))
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Understanding the Numbers
        </h2>
        <p className="text-gray-700">
          Over these {yearSpan} years, {cumulativeDesc} — a total inflation rate of{' '}
          {formatPercent(result.cumulativePercent)}. The annualized rate of{' '}
          {formatPercent(result.avgAnnualRate, 2)} per year was {annualDesc} of roughly
          3.3% per year.
        </p>
      </section>

      {(sameStartYears.length > 0 || sameEndYears.length > 0) && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Compare Other Periods
          </h2>
          {sameStartYears.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Starting from {fromYear}:
              </p>
              <div className="flex flex-wrap gap-2">
                {sameStartYears.map((y) => (
                  <Link
                    key={y}
                    href={`/inflation-from/${fromYear}/${y}`}
                    className="text-sm text-blue-600 hover:underline bg-gray-100 px-3 py-1 rounded"
                  >
                    {fromYear} to {y}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {sameEndYears.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Ending in {toYear}:
              </p>
              <div className="flex flex-wrap gap-2">
                {sameEndYears.map((y) => (
                  <Link
                    key={y}
                    href={`/inflation-from/${y}/${toYear}`}
                    className="text-sm text-blue-600 hover:underline bg-gray-100 px-3 py-1 rounded"
                  >
                    {y} to {toYear}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
