# Content Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add substantial educational content to the homepage and two dynamic page types to satisfy Google AdSense quality requirements.

**Architecture:** Three new presentational components draw from a shared `lib/eras.ts` data file containing decade and economic era blurbs. Helper functions added to `lib/inflation.ts` generate plain-English descriptions. Components render server-side below the existing calculator on each page.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Jest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/eras.ts` | Create | Decade/era blurb data + lookup helpers |
| `lib/inflation.ts` | Edit | Add `describeInflationCumulative` and `describeAnnualRate` |
| `components/HomepageContent.tsx` | Create | Static educational content (5 sections) |
| `components/ValueOfContent.tsx` | Create | Era context + plain-English + related links |
| `components/InflationFromContent.tsx` | Create | Era context + plain-English + compare links |
| `app/page.tsx` | Edit | Add `<HomepageContent>` below calculator |
| `app/value-of/[amount]/[year]/page.tsx` | Edit | Add `<ValueOfContent>` below second ad unit |
| `app/inflation-from/[from]/[to]/page.tsx` | Edit | Add `<InflationFromContent>` below second ad unit |
| `__tests__/lib/eras.test.ts` | Create | Tests for era lookup functions |
| `__tests__/lib/inflation-descriptions.test.ts` | Create | Tests for plain-English helpers |

---

### Task 1: Create `lib/eras.ts`

**Files:**
- Create: `lib/eras.ts`
- Create: `__tests__/lib/eras.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/eras.test.ts`:

```typescript
import { getDecadeBlurb, getEraBlurb, getEraName, getErasForRange } from '../../lib/eras'

describe('getDecadeBlurb', () => {
  it('returns the 1970s blurb for year 1975', () => {
    expect(getDecadeBlurb(1975)).toContain('stagflation')
  })
  it('returns the 1910s blurb for year 1913', () => {
    expect(getDecadeBlurb(1913)).toContain('Federal Reserve')
  })
  it('returns a non-empty string for every year 1913–2024', () => {
    for (let y = 1913; y <= 2024; y++) {
      expect(getDecadeBlurb(y).length).toBeGreaterThan(0)
    }
  })
})

describe('getEraBlurb', () => {
  it('returns stagflation blurb for 1975', () => {
    expect(getEraBlurb(1975)).toContain('oil')
  })
  it('returns a non-empty string for every year 1913–2024', () => {
    for (let y = 1913; y <= 2024; y++) {
      expect(getEraBlurb(y).length).toBeGreaterThan(0)
    }
  })
})

describe('getEraName', () => {
  it('returns "Stagflation" for 1975', () => {
    expect(getEraName(1975)).toBe('Stagflation')
  })
  it('returns "Postwar Boom" for 1950', () => {
    expect(getEraName(1950)).toBe('Postwar Boom')
  })
  it('returns "COVID & Post-COVID" for 2022', () => {
    expect(getEraName(2022)).toBe('COVID & Post-COVID')
  })
})

describe('getErasForRange', () => {
  it('returns one era when range is within a single era', () => {
    const eras = getErasForRange(1950, 1960)
    expect(eras).toHaveLength(1)
    expect(eras[0].name).toBe('Postwar Boom')
  })
  it('returns multiple eras for a cross-era range', () => {
    const eras = getErasForRange(1965, 1990)
    expect(eras.length).toBeGreaterThanOrEqual(3)
    expect(eras.map((e) => e.name)).toContain('Stagflation')
  })
  it('returns eras in chronological order', () => {
    const eras = getErasForRange(1960, 2000)
    for (let i = 1; i < eras.length; i++) {
      expect(eras[i].startYear).toBeGreaterThan(eras[i - 1].startYear)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- --testPathPattern=eras --no-coverage
```
Expected: FAIL — "Cannot find module '../../lib/eras'"

- [ ] **Step 3: Create `lib/eras.ts`**

```typescript
export interface Era {
  name: string
  startYear: number
  endYear: number
  blurb: string
}

const DECADES: Record<number, string> = {
  1910: 'The 1910s opened with the newly created Federal Reserve still finding its footing. World War I mobilization drove surging demand and prices. Wartime production transformed American industry, but the decade ended with a sharp postwar inflation spike as price controls were lifted and pent-up consumer demand was unleashed after the armistice.',
  1920: 'The Roaring Twenties brought remarkable price stability after postwar turbulence. Mass production slashed costs for consumer goods like automobiles and appliances, keeping prices in check for much of the decade. Easy credit and stock market speculation fueled apparent prosperity, but underlying fragilities exploded into the open with the 1929 crash.',
  1930: "The Great Depression defined the 1930s with falling prices, not rising ones. The collapse of thousands of banks shrank the money supply dramatically. Unemployment peaked near 25%. Deflation made debt burdens heavier in real terms, trapping businesses and households in a vicious cycle. Roosevelt's New Deal programs gradually restored confidence, but full recovery awaited wartime mobilization.",
  1940: 'World War II transformed the 1940s economy. Wartime spending drove full employment and surging output even as civilian goods were rationed. Price controls suppressed official inflation during the war years, but pent-up demand exploded after controls were lifted in 1946, triggering a sharp inflationary surge. The decade ended with the economy reorienting to peacetime consumer spending.',
  1950: 'The 1950s brought steady postwar prosperity with manageable inflation. Suburbanization, the baby boom, and rising car ownership drove consumer spending. The Bretton Woods system kept the dollar stable internationally. Inflation averaged around 2–3% per year — punctuated by brief spikes during the Korean War buildup — delivering a decade of broadly stable purchasing power.',
  1960: "The early 1960s maintained the low inflation of the Eisenhower years. But President Johnson's decision to pursue both Great Society domestic programs and the Vietnam War without raising taxes began pushing prices higher by mid-decade. The Federal Reserve, reluctant to raise rates and choke off growth, allowed the money supply to expand too quickly, sowing the seeds of the inflation crisis ahead.",
  1970: 'The 1970s were defined by stagflation — the previously rare combination of high inflation and economic stagnation. Two oil price shocks (1973 and 1979) drove up energy costs, while structural monetary policy errors allowed inflationary expectations to become entrenched. By 1980, inflation was running near 14% annually — the worst sustained price surge in modern American history.',
  1980: "The 1980s opened with Federal Reserve Chair Paul Volcker's shock therapy: interest rates above 20% to crush inflation. The cure worked but triggered the deepest recession since the 1930s, with unemployment exceeding 10%. Inflation fell rapidly from double digits to under 4%. The subsequent Reagan-era boom rewarded the painful adjustment with a decade of growth and gradually declining prices.",
  1990: 'The 1990s delivered the longest peacetime expansion in US history. Technological productivity gains — particularly from computing and the internet — helped hold down prices even as unemployment fell. Globalization kept goods prices low as manufacturing shifted offshore. Inflation fell from around 5% in 1990 to under 2% by decade\'s end, a level not seen since the early 1960s.',
  2000: 'Inflation was moderate through the 2000s despite significant economic disruptions. The dot-com bust, 9/11, and subsequent military spending had limited inflationary effects. Rising oil and housing prices pushed prices higher mid-decade. The 2007–08 financial crisis caused a sharp deflationary episode, ending the decade with the Federal Reserve engaged in unprecedented monetary stimulus.',
  2010: "The 2010s presented an inflation puzzle: despite years of near-zero interest rates and quantitative easing, prices stubbornly undershot the Federal Reserve's 2% target. Globalization, automation, and weak labor bargaining power suppressed wages and prices. The decade challenged decades of economic assumptions about the relationship between employment and inflation.",
  2020: 'The COVID-19 pandemic triggered the most dramatic price surge since the 1970s. Historic supply chain disruptions, massive fiscal stimulus, and pent-up demand combined to push inflation to 9.1% in mid-2022 — the highest since 1981. The Federal Reserve raised rates from near zero to over 5% in under two years. Inflation moderated through 2023–2024 but remained a central economic and political issue.',
}

const ERAS: Era[] = [
  {
    name: 'World War I & Postwar',
    startYear: 1913,
    endYear: 1920,
    blurb: 'The Federal Reserve was established in 1913 just as wartime pressures began building. US entry into WWI in 1917 drove surging government spending and near-full employment, pushing prices steadily higher. After the armistice, pent-up consumer demand and the removal of price controls caused a sharp inflationary spike before the economy contracted sharply in the 1920–21 recession.',
  },
  {
    name: 'Roaring Twenties',
    startYear: 1920,
    endYear: 1929,
    blurb: 'After the 1920–21 recession, prices stabilized remarkably. Mass production — especially of automobiles and appliances — lowered the cost of consumer goods. The Federal Reserve kept credit relatively loose to maintain the gold standard peg, inadvertently encouraging the speculative lending that fueled the stock market boom of the late 1920s. Inflation was low, but imbalances were building beneath the surface.',
  },
  {
    name: 'Great Depression',
    startYear: 1929,
    endYear: 1939,
    blurb: 'The Great Depression brought deflation, not inflation. The collapse of the banking system shrank the money supply dramatically. Falling wages, falling prices, and falling output reinforced each other in a vicious spiral. New Deal programs — Social Security, the FDIC, public works — provided relief and limited recovery, but deflation made debt burdens heavier in real terms and full recovery required wartime spending.',
  },
  {
    name: 'World War II',
    startYear: 1939,
    endYear: 1945,
    blurb: "Wartime mobilization created full employment and surging demand at precisely the moment civilian goods production was curtailed. The government imposed price controls and rationing to suppress official inflation numbers. Once controls were lifted after the war's end, suppressed inflation was released, driving a sharp price surge in 1946–47 as consumers rushed to spend wartime savings.",
  },
  {
    name: 'Postwar Boom',
    startYear: 1945,
    endYear: 1965,
    blurb: 'The postwar era was one of the most prosperous in American history. Returning veterans, GI Bill benefits, suburbanization, and steadily rising wages drove strong growth with moderate inflation. The dollar\'s stability under the Bretton Woods system kept imported inflation in check. Inflation averaged roughly 2% per year — close to what economists now consider ideal — making this era a benchmark of stable, sustained purchasing power growth.',
  },
  {
    name: 'Great Society & Vietnam',
    startYear: 1965,
    endYear: 1973,
    blurb: "President Johnson's decision to pursue both Great Society domestic programs and the Vietnam War without raising taxes created structural inflationary pressure. \"Guns and butter\" spending overwhelmed the economy's productive capacity. Nixon's 1971 decision to abandon the gold standard removed a key inflation anchor. Wage and price controls introduced in 1971 temporarily suppressed prices but created shortages and delayed rather than resolved the underlying problem.",
  },
  {
    name: 'Stagflation',
    startYear: 1973,
    endYear: 1982,
    blurb: "Two oil price shocks — the 1973 OPEC embargo and the 1979 Iranian Revolution — drove energy prices to unprecedented highs and triggered supply-side inflation unlike anything in recent memory. The Federal Reserve kept monetary policy too loose for too long, allowing inflationary expectations to become deeply entrenched in wage and pricing decisions. Inflation reached nearly 14% in 1980 before Fed Chair Volcker's aggressive tightening began to work.",
  },
  {
    name: 'Disinflation',
    startYear: 1982,
    endYear: 1990,
    blurb: 'Fed Chair Paul Volcker chose to target money supply growth rather than interest rates, accepting whatever rate hike was necessary to break inflation. Rates exceeded 20%, triggering the deepest recession since the 1930s — unemployment exceeded 10%. But inflation fell rapidly from double digits to under 4% by 1984. The harsh medicine worked: inflationary expectations were broken, setting the stage for the long expansion that followed.',
  },
  {
    name: 'Moderate Growth',
    startYear: 1990,
    endYear: 2007,
    blurb: 'The "Great Moderation" brought steady growth, low inflation, and only brief, shallow recessions. Globalization kept goods prices low as manufacturing moved to lower-cost countries. Technology productivity gains dampened wage pressures. The Federal Reserve under Greenspan and Bernanke maintained credibility and gradually reduced inflation toward the 2% target. This long era of stability may have bred complacency about the risks building in the financial system.',
  },
  {
    name: 'Financial Crisis',
    startYear: 2007,
    endYear: 2012,
    blurb: 'The housing bust triggered the worst financial crisis since 1929. Deflation became a genuine concern as credit contracted sharply and unemployment surged toward 10%. The Federal Reserve cut rates to near zero and launched quantitative easing to prevent a deflationary spiral. Despite fears that money printing would ignite hyperinflation, weak consumer demand kept prices subdued throughout the slow and uneven recovery.',
  },
  {
    name: 'Low Inflation',
    startYear: 2012,
    endYear: 2020,
    blurb: "Economists were puzzled throughout this decade: despite years of near-zero interest rates, quantitative easing, and eventually record-low unemployment, inflation persistently fell short of the Federal Reserve's 2% target. Globalization, automation, weakened labor unions, and demographic shifts seemed to be structurally suppressing both wages and prices. The Fed spent years trying to generate the inflation it wanted — a complete reversal of its historic challenge.",
  },
  {
    name: 'COVID & Post-COVID',
    startYear: 2020,
    endYear: 9999,
    blurb: 'The COVID-19 pandemic combined historic supply chain disruptions with massive fiscal stimulus and pent-up consumer demand — a perfect storm for inflation. Prices surged to 9.1% annually in mid-2022, the highest since 1981. The Federal Reserve raised the federal funds rate from near zero to over 5% in under two years, the fastest tightening cycle in modern history. Inflation gradually moderated through 2023–2024 but remained elevated above the 2% target.',
  },
]

export function getDecadeBlurb(year: number): string {
  const decadeStart = Math.floor(year / 10) * 10
  return DECADES[decadeStart] ?? DECADES[1910]
}

export function getEraBlurb(year: number): string {
  const era = ERAS.find((e) => e.startYear <= year && year < e.endYear)
  return era?.blurb ?? ''
}

export function getEraName(year: number): string {
  const era = ERAS.find((e) => e.startYear <= year && year < e.endYear)
  return era?.name ?? ''
}

export function getErasForRange(fromYear: number, toYear: number): Era[] {
  return ERAS.filter((e) => e.endYear > fromYear && e.startYear <= toYear)
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npm test -- --testPathPattern=eras --no-coverage
```
Expected: PASS — all tests green

- [ ] **Step 5: Commit**

```
git add lib/eras.ts __tests__/lib/eras.test.ts
git commit -m "feat: add era/decade data and lookup helpers"
```

---

### Task 2: Add plain-English helpers to `lib/inflation.ts`

**Files:**
- Modify: `lib/inflation.ts`
- Create: `__tests__/lib/inflation-descriptions.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/inflation-descriptions.test.ts`:

```typescript
import { describeInflationCumulative, describeAnnualRate } from '../../lib/inflation'

describe('describeInflationCumulative', () => {
  it('< 25% → "prices rose modestly"', () => {
    expect(describeInflationCumulative(10)).toBe('prices rose modestly')
    expect(describeInflationCumulative(24.9)).toBe('prices rose modestly')
  })
  it('25–75% → "prices rose significantly"', () => {
    expect(describeInflationCumulative(25)).toBe('prices rose significantly')
    expect(describeInflationCumulative(74.9)).toBe('prices rose significantly')
  })
  it('75–150% → "prices roughly doubled"', () => {
    expect(describeInflationCumulative(75)).toBe('prices roughly doubled')
    expect(describeInflationCumulative(149.9)).toBe('prices roughly doubled')
  })
  it('150–300% → "prices roughly tripled"', () => {
    expect(describeInflationCumulative(150)).toBe('prices roughly tripled')
    expect(describeInflationCumulative(299.9)).toBe('prices roughly tripled')
  })
  it('>= 300% → "prices increased more than fourfold"', () => {
    expect(describeInflationCumulative(300)).toBe('prices increased more than fourfold')
    expect(describeInflationCumulative(500)).toBe('prices increased more than fourfold')
  })
})

describe('describeAnnualRate', () => {
  it('< 1.5% → "well below the historical average"', () => {
    expect(describeAnnualRate(0.5)).toBe('well below the historical average')
    expect(describeAnnualRate(1.49)).toBe('well below the historical average')
  })
  it('1.5–2.5% → "below the historical average"', () => {
    expect(describeAnnualRate(1.5)).toBe('below the historical average')
    expect(describeAnnualRate(2.49)).toBe('below the historical average')
  })
  it('2.5–4% → "roughly in line with the historical average"', () => {
    expect(describeAnnualRate(2.5)).toBe('roughly in line with the historical average')
    expect(describeAnnualRate(3.9)).toBe('roughly in line with the historical average')
  })
  it('4–6% → "above the historical average"', () => {
    expect(describeAnnualRate(4.0)).toBe('above the historical average')
    expect(describeAnnualRate(5.9)).toBe('above the historical average')
  })
  it('>= 6% → "well above the historical average"', () => {
    expect(describeAnnualRate(6.0)).toBe('well above the historical average')
    expect(describeAnnualRate(14.0)).toBe('well above the historical average')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```
npm test -- --testPathPattern=inflation-descriptions --no-coverage
```
Expected: FAIL — "describeInflationCumulative is not a function"

- [ ] **Step 3: Append helpers to `lib/inflation.ts`**

Add to the bottom of the existing `lib/inflation.ts` file:

```typescript
export function describeInflationCumulative(cumulativePercent: number): string {
  if (cumulativePercent < 25) return 'prices rose modestly'
  if (cumulativePercent < 75) return 'prices rose significantly'
  if (cumulativePercent < 150) return 'prices roughly doubled'
  if (cumulativePercent < 300) return 'prices roughly tripled'
  return 'prices increased more than fourfold'
}

export function describeAnnualRate(avgAnnualRate: number): string {
  if (avgAnnualRate < 1.5) return 'well below the historical average'
  if (avgAnnualRate < 2.5) return 'below the historical average'
  if (avgAnnualRate < 4.0) return 'roughly in line with the historical average'
  if (avgAnnualRate < 6.0) return 'above the historical average'
  return 'well above the historical average'
}
```

- [ ] **Step 4: Run test to verify it passes**

```
npm test -- --testPathPattern=inflation-descriptions --no-coverage
```
Expected: PASS — all 10 tests green

- [ ] **Step 5: Commit**

```
git add lib/inflation.ts __tests__/lib/inflation-descriptions.test.ts
git commit -m "feat: add plain-English inflation description helpers"
```

---

### Task 3: Create `components/HomepageContent.tsx`

**Files:**
- Create: `components/HomepageContent.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```
git add components/HomepageContent.tsx
git commit -m "feat: add homepage educational content component"
```

---

### Task 4: Wire HomepageContent into homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add import and component to `app/page.tsx`**

Replace the full contents of `app/page.tsx` with:

```tsx
// app/page.tsx
import type { Metadata } from 'next'
import cpiData from '../data/cpi.json'
import Calculator from '../components/Calculator'
import HomepageContent from '../components/HomepageContent'
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
        How much is a dollar worth over time? Enter any amount and year range to see the
        inflation-adjusted value, using CPI data from the Bureau of Labor Statistics
        (1913–{maxYear}).
      </p>
      <Calculator
        cpi={cpi}
        defaultAmount={100}
        defaultFromYear={1950}
        defaultToYear={maxYear}
      />
      <HomepageContent />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```
git add app/page.tsx
git commit -m "feat: add educational content to homepage"
```

---

### Task 5: Create `components/ValueOfContent.tsx`

**Files:**
- Create: `components/ValueOfContent.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```
git add components/ValueOfContent.tsx
git commit -m "feat: add ValueOfContent component"
```

---

### Task 6: Wire ValueOfContent into the value-of page

**Files:**
- Modify: `app/value-of/[amount]/[year]/page.tsx`

- [ ] **Step 1: Replace file contents**

```tsx
// app/value-of/[amount]/[year]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cpiData from '../../../../data/cpi.json'
import Calculator from '../../../../components/Calculator'
import AdUnit from '../../../../components/AdUnit'
import RelatedLinks from '../../../../components/RelatedLinks'
import ValueOfContent from '../../../../components/ValueOfContent'
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
  params: Promise<{ amount: string; year: string }>
}): Promise<Metadata> {
  const { amount: amountStr, year: yearStr } = await params
  const amount = parseInt(amountStr)
  const fromYear = parseInt(yearStr)
  if (!cpi[yearStr] || !AMOUNTS.includes(amount)) return {}
  const result = calculateInflation(amount, fromYear, MAX_YEAR, cpi)
  const adjusted = formatCurrency(result.adjustedAmount)
  const original = formatCurrency(amount)
  return {
    title: `${original} in ${fromYear} → ${adjusted} in ${MAX_YEAR} | Inflation Calculator`,
    description: `${original} in ${fromYear} had the same purchasing power as ${adjusted} in ${MAX_YEAR} (${formatPercent(result.cumulativePercent)} cumulative inflation). Calculated using CPI-U data from the Bureau of Labor Statistics.`,
    alternates: {
      canonical: `${process.env.SITE_URL || 'https://your-domain.com'}/value-of/${amountStr}/${yearStr}`,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ amount: string; year: string }>
}) {
  const { amount: amountStr, year: yearStr } = await params
  const amount = parseInt(amountStr)
  const fromYear = parseInt(yearStr)
  if (!cpi[yearStr] || !AMOUNTS.includes(amount) || isNaN(fromYear)) {
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

      <ValueOfContent
        amount={amount}
        fromYear={fromYear}
        maxYear={MAX_YEAR}
        result={result}
        allAmounts={AMOUNTS}
        allYears={ALL_YEARS}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```
git add "app/value-of/[amount]/[year]/page.tsx"
git commit -m "feat: add educational content to value-of pages"
```

---

### Task 7: Create `components/InflationFromContent.tsx`

**Files:**
- Create: `components/InflationFromContent.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```
git add components/InflationFromContent.tsx
git commit -m "feat: add InflationFromContent component"
```

---

### Task 8: Wire InflationFromContent into the inflation-from page

**Files:**
- Modify: `app/inflation-from/[from]/[to]/page.tsx`

- [ ] **Step 1: Replace file contents**

```tsx
// app/inflation-from/[from]/[to]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import cpiData from '../../../../data/cpi.json'
import Calculator from '../../../../components/Calculator'
import AdUnit from '../../../../components/AdUnit'
import InflationFromContent from '../../../../components/InflationFromContent'
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
  params: Promise<{ from: string; to: string }>
}): Promise<Metadata> {
  const { from, to } = await params
  const fromYear = parseInt(from)
  const toYear = parseInt(to)
  if (!cpi[from] || !cpi[to]) return {}
  const result = calculateInflation(100, fromYear, toYear, cpi)
  return {
    title: `Inflation ${fromYear} to ${toYear}: ${formatPercent(result.cumulativePercent)} | Inflation Calculator`,
    description: `US inflation from ${fromYear} to ${toYear} was ${formatPercent(result.cumulativePercent)}. $100 in ${fromYear} had the same purchasing power as ${formatCurrency(result.adjustedAmount)} in ${toYear}.`,
    alternates: {
      canonical: `${process.env.SITE_URL || 'https://your-domain.com'}/inflation-from/${from}/${to}`,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ from: string; to: string }>
}) {
  const { from, to } = await params
  const fromYear = parseInt(from)
  const toYear = parseInt(to)
  if (
    !cpi[from] ||
    !cpi[to] ||
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

      <InflationFromContent
        fromYear={fromYear}
        toYear={toYear}
        result={result}
        allYears={ALL_YEARS}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```
git add "app/inflation-from/[from]/[to]/page.tsx"
git commit -m "feat: add educational content to inflation-from pages"
```

---

### Task 9: Verify build

- [ ] **Step 1: Run type check**

```
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 2: Run all tests**

```
npm test -- --no-coverage
```
Expected: All tests pass

- [ ] **Step 3: Run production build**

```
npm run build
```
Expected: Build completes with no errors

- [ ] **Step 4: Fix and commit any issues**

If there are errors, fix them and commit:
```
git add -A
git commit -m "fix: resolve build issues from content enrichment"
```
