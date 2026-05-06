import Link from 'next/link'
import { getDecadeBlurb, getEraBlurb, getEraName } from '../lib/eras'
import {
  describeInflationCumulative,
  describeAnnualRate,
  formatPercent,
} from '../lib/inflation'
import type { InflationResult } from '../lib/inflation'

interface Props {
  amount: number
  fromYear: number
  maxYear: number
  result: InflationResult
  allAmounts: number[]
  allYears: number[]
}

export default function ValueOfContent({
  amount,
  fromYear,
  maxYear,
  result,
  allAmounts,
  allYears,
}: Props) {
  const eraName = getEraName(fromYear)
  const decadeBlurb = getDecadeBlurb(fromYear)
  const eraBlurb = getEraBlurb(fromYear)
  const yearSpan = maxYear - fromYear
  const cumulativeDesc = describeInflationCumulative(result.cumulativePercent)
  const annualDesc = describeAnnualRate(result.avgAnnualRate)

  const amountIndex = allAmounts.indexOf(amount)
  const relatedAmounts = [
    ...allAmounts.slice(Math.max(0, amountIndex - 2), amountIndex),
    ...allAmounts.slice(amountIndex + 1, amountIndex + 3),
  ].slice(0, 4)

  const decadeStart = Math.floor(fromYear / 10) * 10
  const decadeYears = [-20, -10, 10, 20]
    .map((offset) => decadeStart + offset)
    .filter((y) => y !== fromYear && allYears.includes(y))
    .slice(0, 4)

  return (
    <div className="mt-10 space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Historical Context: {eraName}
        </h2>
        <p className="text-gray-700">{decadeBlurb}</p>
        <p className="text-gray-700 mt-3">{eraBlurb}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">What This Means</h2>
        <p className="text-gray-700">
          Over the {yearSpan} years from {fromYear} to {maxYear}, {cumulativeDesc} — a
          cumulative inflation rate of {formatPercent(result.cumulativePercent)}. The
          average annual inflation rate over this period was{' '}
          {formatPercent(result.avgAnnualRate, 2)}, which is {annualDesc} of roughly
          3.3% per year.
        </p>
      </section>

      {(relatedAmounts.length > 0 || decadeYears.length > 0) && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Compare Related Calculations
          </h2>
          {relatedAmounts.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Same year, different amounts:
              </p>
              <div className="flex flex-wrap gap-2">
                {relatedAmounts.map((a) => (
                  <Link
                    key={a}
                    href={`/value-of/${a}/${fromYear}`}
                    className="text-sm text-blue-600 hover:underline bg-gray-100 px-3 py-1 rounded"
                  >
                    ${a.toLocaleString()} in {fromYear}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {decadeYears.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Same amount, neighboring decades:
              </p>
              <div className="flex flex-wrap gap-2">
                {decadeYears.map((y) => (
                  <Link
                    key={y}
                    href={`/value-of/${amount}/${y}`}
                    className="text-sm text-blue-600 hover:underline bg-gray-100 px-3 py-1 rounded"
                  >
                    ${amount.toLocaleString()} in {y}
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
