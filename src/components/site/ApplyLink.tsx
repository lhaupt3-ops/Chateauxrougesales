'use client'

import Link from 'next/link'
import { trackCta, type CtaLocation } from '@/components/analytics/track'

export function ApplyLink({
  location,
  className,
  children,
  dataCta,
}: {
  location: CtaLocation
  className?: string
  children: React.ReactNode
  dataCta?: string
}) {
  return (
    <Link href="/apply" className={className} data-cta={dataCta || location} onClick={() => trackCta(location)}>
      {children}
    </Link>
  )
}
