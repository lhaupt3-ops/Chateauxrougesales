'use client'

import dynamic from 'next/dynamic'

const Analytics = dynamic(() => import('@/components/analytics/Analytics').then((mod) => mod.Analytics), { ssr: false })
const ConsentBanner = dynamic(() => import('@/components/analytics/Analytics').then((mod) => mod.ConsentBanner), { ssr: false })

export function DeferredAnalytics() {
  return (
    <>
      <Analytics />
      <ConsentBanner />
    </>
  )
}
