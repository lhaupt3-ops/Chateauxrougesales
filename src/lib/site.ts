export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  return raw.replace(/\/$/, '')
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

export function isProductionIndexable(): boolean {
  if (process.env.ALLOW_INDEXING === 'true') return true
  if (process.env.ALLOW_INDEXING === 'false') return false
  return process.env.VERCEL_ENV === 'production'
}

export const SITE_NAME = 'Chateaux Rouge'

export const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'msn.com',
  'ymail.com',
])

const DISPOSABLE = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'yopmail.com',
  'trashmail.com',
  'getnada.com',
  'dispostable.com',
  'sharklasers.com',
])

export function emailDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || ''
}

export function isDisposableEmail(email: string): boolean {
  return DISPOSABLE.has(emailDomain(email))
}

export function emailDomainType(email: string): 'free' | 'business' {
  return FREE_EMAIL_DOMAINS.has(emailDomain(email)) ? 'free' : 'business'
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function normalizeWebsite(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withProtocol)
    if (!url.hostname.includes('.')) return ''
    return url.toString()
  } catch {
    return ''
  }
}
