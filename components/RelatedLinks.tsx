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
