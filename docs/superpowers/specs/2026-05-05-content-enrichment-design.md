# Content Enrichment Design
**Date:** 2026-05-05
**Goal:** Add substantial educational content to homepage, `/value-of/[amount]/[year]`, and `/inflation-from/[from]/[to]` pages to satisfy Google AdSense quality requirements.

---

## Background

The site was rejected by AdSense for "low value / thin content." Each page currently has one short intro paragraph plus a calculator widget. This design adds meaningful written content to all three page types without restructuring the existing layout.

---

## Shared Infrastructure

### `lib/eras.ts`

A single data file holding two sets of content buckets used by both dynamic page types.

**Decade buckets** — keyed by decade start year (1910, 1920, … 2020). Each entry is a ~60-word paragraph describing the economic character of that decade.

Decades to cover: 1910s, 1920s, 1930s, 1940s, 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s.

**Economic era buckets** — keyed by era name, each with a `startYear`, `endYear`, and a ~60-word paragraph. Eras:

| Era | Years |
|-----|-------|
| World War I & Postwar | 1913–1920 |
| Roaring Twenties | 1920–1929 |
| Great Depression | 1929–1939 |
| World War II | 1939–1945 |
| Postwar Boom | 1945–1965 |
| Great Society & Vietnam | 1965–1973 |
| Stagflation | 1973–1982 |
| Disinflation | 1982–1990 |
| Moderate Growth | 1990–2007 |
| Financial Crisis | 2007–2012 |
| Low Inflation | 2012–2020 |
| COVID & Post-COVID | 2020–present |

**Helper functions exported from `lib/eras.ts`:**
- `getDecadeBlurb(year: number): string` — returns the blurb for the decade containing `year`
- `getEraBlurb(year: number): string` — returns the blurb for the economic era containing `year`
- `getEraName(year: number): string` — returns the era name string for use in headings
- `getErasForRange(fromYear: number, toYear: number): Era[]` — returns all eras that overlap the given range, for multi-era inflation-from pages

---

## Homepage (`app/page.tsx`)

The existing intro paragraph and `<Calculator>` component stay at the top. A new `<HomepageContent>` component is added below the calculator, containing five H2 sections:

### Section 1: What Is Inflation?
Two paragraphs. Explains inflation as the general rise in prices over time, the difference between nominal and real dollar value, and why it matters for understanding purchasing power across decades.

### Section 2: How the Consumer Price Index Works
Two paragraphs. Explains what CPI-U measures, the "market basket" concept, why BLS publishes annual averages, and why this calculator uses annual CPI rather than monthly figures.

### Section 3: How to Use This Calculator
One to two paragraphs with a concrete example (e.g., comparing a $50,000 salary from 1990 to today). Walks through the input fields and what the result represents.

### Section 4: Common Uses
Short introductory sentence followed by a bulleted list:
- Comparing salaries or wages across eras
- Historical pricing research (real estate, tuition, consumer goods)
- Understanding wage stagnation in real terms
- Legal and estate contexts requiring inflation adjustment

### Section 5: Frequently Asked Questions
Four Q&A pairs in a `<dl>` or styled accordion:
1. Why does this calculator use annual CPI averages instead of monthly data?
2. What is the difference between CPI-U and CPI-W?
3. How accurate is this inflation data?
4. Why does my personal experience of inflation feel higher than the official rate?

**New component:** `components/HomepageContent.tsx` — purely presentational, no props needed.

---

## Value-of Pages (`app/value-of/[amount]/[year]/page.tsx`)

Three new sections added below the existing calculator and ad units.

### Section 1: Historical Context — [Era Name]
Heading uses `getEraName(year)` (e.g., "Historical Context: Stagflation Era").

Body is two adjacent paragraphs: first `getDecadeBlurb(year)` (~60–75 words setting the decade scene), then `getEraBlurb(year)` (~60–75 words on the macro forces of that era). Each blurb is complete prose on its own — no runtime string concatenation.

### Section 2: What This Means
One paragraph generated from the calculated result:
- Names the cumulative inflation in plain English (e.g., "prices roughly tripled" for ~200%)
- States the annualized rate
- Compares to the long-run US average of ~3.3%/year (above / below / roughly in line)

Logic lives inline in the page component using thresholds:
- < 1.5%/yr → "well below the historical average"
- 1.5–2.5%/yr → "below the historical average"
- 2.5–4%/yr → "roughly in line with the historical average"
- 4–6%/yr → "above the historical average"
- > 6%/yr → "well above the historical average"

Cumulative plain-English mapping:
- < 25% → "prices rose modestly"
- 25–75% → "prices rose significantly"
- 75–150% → "prices roughly doubled"
- 150–300% → "prices roughly tripled"
- > 300% → "prices increased more than fourfold"

### Section 3: Compare Related Calculations
Heading: "Compare Related Calculations"

Two sub-groups of links rendered as inline lists:
1. **Same year, different amounts** — links to `/value-of/[amount]/[year]` for 3–4 neighboring amounts from the `AMOUNTS` array (amounts immediately above and below the current amount).
2. **Same amount, neighboring decades** — links to `/value-of/[amount]/[year]` for the same amount in the nearest round years (e.g., if current year is 1975, link to 1950, 1960, 1980, 1990).

**New component:** `components/ValueOfContent.tsx` — accepts `amount`, `fromYear`, `maxYear`, `result` (inflation result object), and `allAmounts`/`allYears` arrays.

---

## Inflation-from Pages (`app/inflation-from/[from]/[to]/page.tsx`)

Three new sections added below the existing calculator and ad units.

### Section 1: What Drove Inflation from [from] to [to]
Heading uses the year range (e.g., "What Drove Inflation from 1965 to 1980").

Body: calls `getErasForRange(fromYear, toYear)`. 
- If the range falls within a single era: one ~150-word paragraph combining decade and era blurbs for the midpoint year.
- If the range spans two or more eras: one paragraph per era (each ~80 words), describing the transition (e.g., "The period began during the Postwar Boom... By the late 1960s, Vietnam spending and Great Society programs began pushing prices upward...").

### Section 2: Understanding the Numbers
One paragraph generated from calculated data:
- States the cumulative rate in plain English (same thresholds as value-of pages)
- States the annualized rate
- Compares to the long-run average (~3.3%/yr)
- If multi-era span, names the era most associated with peak inflation in that range (derived from the era blurb data — no additional CPI calculations needed).

### Section 3: Compare Other Periods
Two sub-groups of links:
1. **Same start year, different end years** — 3–4 links to other end years (nearest multiples of 10 or 5 that are valid routes).
2. **Same end year, different start years** — 3–4 links to other start years.

**New component:** `components/InflationFromContent.tsx` — accepts `fromYear`, `toYear`, `result`, `cpi` (for sub-era calculations), and `allYears`.

---

## What Is Not Changing

- Page structure, routing, and URL patterns are unchanged.
- The `<Calculator>` component is unchanged.
- The `<AdUnit>` component and its placement are unchanged.
- The `<RelatedLinks>` component on value-of pages is kept; during implementation, review it to ensure the new "Compare Related Calculations" section doesn't duplicate its links.
- No new routes are added.

---

## File Summary

| File | Action |
|------|--------|
| `lib/eras.ts` | New — era/decade data and helper functions |
| `components/HomepageContent.tsx` | New — static homepage educational content |
| `components/ValueOfContent.tsx` | New — dynamic content sections for value-of pages |
| `components/InflationFromContent.tsx` | New — dynamic content sections for inflation-from pages |
| `app/page.tsx` | Edit — add `<HomepageContent>` below calculator |
| `app/value-of/[amount]/[year]/page.tsx` | Edit — add `<ValueOfContent>` below existing ad unit |
| `app/inflation-from/[from]/[to]/page.tsx` | Edit — add `<InflationFromContent>` below existing ad unit |
