// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Inflation Calculator',
  description:
    'How this inflation calculator works, where the data comes from, and its limitations.',
}

export default function About() {
  return (
    <div className="max-w-prose space-y-6 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">About This Calculator</h1>
      <p>
        This inflation calculator uses the{' '}
        <strong>Consumer Price Index for All Urban Consumers (CPI-U)</strong>,
        series CUUR0000SA0, published by the U.S. Bureau of Labor Statistics
        (BLS). The CPI measures the average change over time in prices paid by
        urban consumers for a market basket of goods and services.
      </p>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">How the Calculation Works</h2>
        <p>
          To find the inflation-adjusted value, we divide the CPI of the target
          year by the CPI of the base year, then multiply by the original amount:
        </p>
        <pre className="bg-gray-100 p-4 rounded text-sm mt-2 overflow-x-auto">
          Adjusted Value = Original Amount × (CPI[target year] / CPI[base year])
        </pre>
        <p className="mt-2">
          Annual average CPI values are used (not monthly data), which provides a
          stable, representative figure for each calendar year.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Source</h2>
        <p>
          All data comes from the U.S. Bureau of Labor Statistics. Annual figures
          are updated each January when BLS publishes the prior year&apos;s data.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Limitations</h2>
        <p>
          CPI measures average inflation across urban consumers nationally. Actual
          purchasing power changes vary by location, income level, and individual
          spending patterns. Use this tool for general estimates, not precise
          personal financial planning.
        </p>
      </div>
    </div>
  )
}
