'use client'

import { useEffect } from 'react'
import { track } from './track'

export function GuideViewed() {
  useEffect(() => {
    track('lead_magnet_view', { resource: 'are-you-ready-for-closers', page: window.location.pathname })
  }, [])
  return null
}
