'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const BASE = '/admin/collections/applications'
const OPEN = `${BASE}?where[status][not_in][0]=won&where[status][not_in][1]=lost&where[status][not_in][2]=no_show`

export default function ApplicationListPresets() {
  const { user } = useAuth()
  const params = useSearchParams()
  const router = useRouter()
  const role = user && typeof user === 'object' && 'role' in user ? user.role : undefined

  useEffect(() => {
    if (role === 'sales' && params && params.toString() === '') router.replace(OPEN)
  }, [role, params, router])

  return (
    <nav className="cr-dash-links" aria-label="Lead filters">
      <Link href={OPEN}>Open leads</Link>
      <Link href={`${BASE}?where[status][equals]=booked`}>Booked</Link>
      <Link href={`${BASE}?where[waitlist][equals]=true`}>Waitlist</Link>
      <Link href={`${BASE}?where[tier][equals]=qualified&where[status][equals]=complete`}>Qualified, not booked</Link>
      <Link href={`${BASE}?view=all`}>All</Link>
    </nav>
  )
}
