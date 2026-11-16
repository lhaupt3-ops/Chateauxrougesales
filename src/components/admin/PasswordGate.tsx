'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'

export default function PasswordGate({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const locked = Boolean(user && 'mustChangePassword' in user && user.mustChangePassword)

  useEffect(() => {
    if (locked && pathname && !pathname.includes('/set-password')) router.replace('/admin/set-password')
  }, [locked, pathname, router])

  return <>{children}</>
}
