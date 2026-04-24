// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inflation Calculator — US Dollar Value Over Time',
  description:
    'Calculate the inflation-adjusted value of any US dollar amount using historical CPI data from the Bureau of Labor Statistics (1913–present).',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <header className="border-b bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-700">
              Inflation Calculator
            </a>
            <nav className="text-sm text-gray-500">
              <a href="/about" className="hover:underline">
                About
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t mt-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-500">
            <p>
              Data: U.S. Bureau of Labor Statistics CPI-U (CUUR0000SA0).
              Updated annually.
            </p>
            <p className="mt-1">
              <a href="/about" className="underline">
                About this tool
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
