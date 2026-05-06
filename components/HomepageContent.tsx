export default function HomepageContent() {
  return (
    <div className="mt-12 space-y-10 text-gray-700">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What Is Inflation?</h2>
        <p>
          Inflation is the rate at which the general level of prices for goods and services
          rises over time, reducing the purchasing power of money. When inflation runs at 3%
          per year, a basket of goods that costs $100 today will cost $103 next year. Over
          decades, this compounding effect is dramatic: $100 in 1950 had the same purchasing
          power as roughly $1,300 today.
        </p>
        <p className="mt-3">
          The difference between a nominal dollar amount and its real (inflation-adjusted)
          value is essential for any meaningful comparison across time. A salary of $10,000
          in 1970 was genuinely substantial — the equivalent of over $80,000 today. Without
          adjusting for inflation, historical financial figures are misleading. This calculator
          converts any amount between any two years to its real equivalent using official
          government price data.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          How the Consumer Price Index Works
        </h2>
        <p>
          This calculator uses the{' '}
          <strong>Consumer Price Index for All Urban Consumers (CPI-U)</strong>, published by
          the U.S. Bureau of Labor Statistics. The CPI measures the average change over time
          in prices paid by urban consumers for a fixed &ldquo;market basket&rdquo; of goods
          and services — including food, housing, apparel, transportation, medical care,
          recreation, and education. The basket is periodically updated to reflect actual
          consumer spending patterns.
        </p>
        <p className="mt-3">
          This calculator uses annual average CPI values rather than monthly figures. Annual
          averages smooth out seasonal fluctuations and temporary price shocks, giving a more
          representative figure for each calendar year. The BLS publishes the prior year&apos;s
          annual average each January. Data covers 1913 — the first full year of Federal
          Reserve operation and the earliest year for which continuous CPI records exist —
          through the most recent complete year.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          How to Use This Calculator
        </h2>
        <p>
          Enter a dollar amount, select a starting year, and select an ending year. The
          calculator shows the equivalent value in the ending year, the cumulative inflation
          rate over the period, and the average annual inflation rate. You can adjust any
          input to instantly recalculate.
        </p>
        <p className="mt-3">
          <strong>Example:</strong> To find what a $50,000 salary from 1990 would need to be
          today to maintain the same purchasing power, enter $50,000, set the from-year to
          1990, and the to-year to the current year. The result tells you the minimum salary
          increase needed just to keep up with inflation — before any real wage growth. This
          is one of the most common uses for an inflation calculator in personal finance and
          salary negotiation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Common Uses</h2>
        <p>
          Inflation calculators are used across a wide range of personal, professional, and
          academic contexts:
        </p>
        <ul className="mt-2 space-y-2 list-disc list-inside">
          <li>
            <strong>Salary and wage comparisons:</strong> Determine whether a pay raise kept
            up with inflation, or compare compensation across different career eras.
          </li>
          <li>
            <strong>Historical pricing research:</strong> Understand what historical prices
            for homes, tuition, cars, or consumer goods represent in today&apos;s dollars.
          </li>
          <li>
            <strong>Real wage analysis:</strong> Identify periods of genuine purchasing power
            growth versus inflation-masked stagnation.
          </li>
          <li>
            <strong>Legal and financial contexts:</strong> Courts, attorneys, and accountants
            frequently convert historical dollar amounts for settlements, estates, and
            contract disputes.
          </li>
          <li>
            <strong>Academic and journalistic research:</strong> Economists, historians, and
            journalists use CPI-adjusted figures to make meaningful comparisons across
            decades.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-6">
          <div>
            <dt className="font-semibold text-gray-900">
              Why does this calculator use annual CPI averages instead of monthly data?
            </dt>
            <dd className="mt-1">
              Monthly CPI figures fluctuate due to seasonal patterns and temporary shocks —
              gasoline prices spike in summer, food prices vary with harvests, and one-time
              events can distort a single month&apos;s reading. Annual averages smooth these
              fluctuations and provide a more reliable, representative figure for each
              calendar year. For most comparison purposes — salaries, historical pricing,
              financial planning — annual averages are the appropriate benchmark.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">
              What is the difference between CPI-U and CPI-W?
            </dt>
            <dd className="mt-1">
              CPI-U (All Urban Consumers) covers about 93% of the US population — all urban
              and metropolitan residents, including professionals, retirees, and the
              self-employed. CPI-W (Urban Wage Earners and Clerical Workers) covers a
              narrower subset, roughly 29% of the population, and is used primarily to
              calculate Social Security cost-of-living adjustments. CPI-U is the broader,
              more widely cited measure and the standard choice for general inflation
              calculations.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">
              How accurate is this inflation data?
            </dt>
            <dd className="mt-1">
              The BLS CPI-U data is the official US government inflation measure and is
              widely considered the most authoritative source for historical US price levels.
              All price index calculations involve methodological choices — how to weight
              different goods, how to handle quality improvements, and how to account for
              substitution effects. The BLS updates its methodology periodically. Historical
              figures before the 1940s are less granular and involve more reconstruction than
              post-WWII data.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900">
              Why does my personal experience of inflation feel higher than the official rate?
            </dt>
            <dd className="mt-1">
              The CPI measures average inflation across all urban consumers nationally. Your
              personal inflation rate depends on what you actually buy. If you spend a higher
              share of income on housing in an expensive city, or on medical care, or on
              college tuition — all categories that have risen faster than general CPI —
              your effective inflation rate will be higher than the headline figure. The
              official CPI is a useful benchmark, but individual experiences vary
              significantly by location, income level, and spending pattern.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
