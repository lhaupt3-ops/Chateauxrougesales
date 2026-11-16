'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/components/analytics/track'

export function OutcomeViewed({ tier, page }: { tier?: string | null; page: 'book' | 'next-steps' | 'confirmed' }) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true
    track('apply_outcome_viewed', { tier: tier || '', page })
  }, [page, tier])

  return null
}
