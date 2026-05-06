// components/AdUnit.tsx
'use client'

import { useEffect } from 'react'

interface Props {
  slot: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({ slot }: Props) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // adsbygoogle not loaded (dev environment)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-client="ca-pub-3888875177929563"
      data-ad-slot={slot}
      data-ad-layout="in-article"
      data-ad-format="fluid"
    />
  )
}
