# Inflation Calculator — Design Spec

**Date:** 2026-04-23
**Status:** Approved
**Scope:** Phase 1 of a multi-tool site (inflation calculator → life simulator → paradoxes explorer). This spec covers the inflation calculator only.

---

## Overview

A static Next.js site that lets users calculate the inflation-adjusted value of any US dollar amount between any two years from 1913 to the present. The primary goal is SEO-driven ad revenue via thousands of programmatically generated static pages targeting long-tail search queries like "$100 in 1950 today."

---

## Architecture & Data Layer

**Stack:** Next.js 14+ (App Router), React, Tailwind CSS, Recharts, deployed on Vercel.

**Data source:** BLS CPI-U series (Consumer Price Index for All Urban Consumers, All Items, CUUR0000SA0). Free public API, no key required for basic use. Data goes back to 1913.

**Data pipeline:**
- A one-off script (`scripts/fetch-bls-data.ts`) fetches annual CPI averages from the BLS API and writes them to `data/cpi.json`.
- This script is re-run manually once per year (BLS publishes updated annual figures each January).
- `cpi.json` is committed to the repo and serves as the single source of truth for all calculations and page generation — no runtime API calls.

**Calculation:** Inflation multiplier = `CPI(target_year) / CPI(base_year)`. Applied to the input amount to produce the adjusted value.

**No database, no serverless functions, no runtime dependencies.** All pages are static files served from Vercel's CDN.

---

## Pages & URL Structure

### Homepage (`/`)
- Main interactive calculator (full client component)
- Inputs: dollar amount, from-year, to-year (dropdowns, 1913–2024)
- Output: adjusted value, cumulative inflation %, average annual rate
- Line chart (Recharts) showing value trajectory over selected range
- Contextual comparisons: equivalent months of average rent, tanks of gas, loaves of bread (static 2024 benchmarks hardcoded in source)
- 2 AdSense units (see Monetization)

### Programmatic SEO Page Type 1
**Pattern:** `/value-of-[amount]-dollars-in-[year]`
**Example:** `/value-of-100-dollars-in-1950`
**Estimated count:** ~1,800 pages (16 common amounts × 112 years, 1913–2024)

Common amounts to generate: 1, 5, 10, 20, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000

Each page shows the adjusted value in the current year as the primary answer, with the full interactive calculator embedded so users can modify inputs.

### Programmatic SEO Page Type 2
**Pattern:** `/inflation-from-[from]-to-[to]`
**Example:** `/inflation-from-1970-to-2000`
**Estimated count:** ~2,500+ pages (all year pairs where to_year − from_year ≥ 5, stepping from_year in 1-year increments, to_year in 5-year increments)

Generated for decade-spanning and milestone year pairs. Each page shows total inflation % and adjusted multiplier for the period.

### About (`/about`)
Brief explanation of methodology, BLS data source credit, and how CPI is calculated.

---

## Component Architecture

```
app/
├── page.tsx                              # Homepage
├── value-of-[amount]-dollars-in-[year]/
│   └── page.tsx                          # SEO page type 1
├── inflation-from-[from]-to-[to]/
│   └── page.tsx                          # SEO page type 2
└── about/
    └── page.tsx

components/
├── Calculator.tsx                        # Client component — interactive inputs + result
└── InflationChart.tsx                    # Recharts line chart wrapper

lib/
└── inflation.ts                          # Pure functions: calculate(), formatResult(), etc.

data/
└── cpi.json                              # Annual CPI values 1913–present

scripts/
└── fetch-bls-data.ts                     # Run once/year to refresh cpi.json
```

`Calculator.tsx` is the only client component. All pages are server components that pass pre-computed values as props; the calculator hydrates on the client for interactivity.

---

## SEO

**Per-page metadata (generated from params):**

| Element | Example |
|---|---|
| `<title>` | `$100 in 1950 → $1,130 in 2024 \| Inflation Calculator` |
| `<h1>` | `What is $100 from 1950 worth today?` |
| `<meta description>` | `$100 in 1950 had the same purchasing power as $1,130 in 2024. Adjust for inflation using CPI data from the Bureau of Labor Statistics.` |

**Internal linking:** Each programmatic page links to ±5 nearby years and 3–4 common amounts. Generated automatically from params — no manual maintenance.

**Sitemap:** Auto-generated at build time using `next-sitemap`, lists all static pages. Submit to Google Search Console on launch.

**robots.txt:** Standard, allow all.

---

## Monetization

**Network:** Google AdSense (start here; migrate to Ezoic or Mediavine as traffic grows for better RPMs).

**Ad placement per page:**
1. Below the result output (user must interact first — protects Core Web Vitals)
2. Between the chart and the contextual comparisons section

No ads above the fold. This protects LCP (Largest Contentful Paint) scores and user experience, both of which affect search rankings.

Finance-adjacent keywords typical CPM: $3–8.

---

## Out of Scope (v1)

- Future projections (what $100 today is worth in 2030, 2040, etc.)
- Non-US currencies or country-specific CPI
- User accounts or saved calculations
- Multiple inflation models (luxury inflation, housing-weighted, etc.)
- Share/export functionality

---

## Launch Checklist

- [ ] Domain registered and pointed to Vercel
- [ ] Google AdSense account created and approved
- [ ] Google Search Console set up
- [ ] `cpi.json` populated with 1913–2024 data
- [ ] All programmatic pages generating without errors
- [ ] Sitemap submitted to Search Console
- [ ] Core Web Vitals passing (Vercel analytics or PageSpeed Insights)
