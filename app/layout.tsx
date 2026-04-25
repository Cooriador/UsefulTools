// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3888875177929563"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <header className="border-b bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-700">
              Inflation Calculator
            </Link>
            <nav className="text-sm text-gray-500">
              <Link href="/about" className="hover:underline">
                About
              </Link>
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
              <Link href="/about" className="underline">
                About this tool
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
