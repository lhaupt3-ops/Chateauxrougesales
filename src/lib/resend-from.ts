const DEFAULT_FROM_NAME = 'Chateaux Rouge'
const DEFAULT_FROM_ADDRESS = 'onboarding@resend.dev'

/** CMS values that still point at Resend's sandbox are ignored in favour of the env sender. */
export function usableResendFrom(cmsValue: string | null | undefined, fallback: string): string {
  const value = cmsValue?.trim() ?? ''
  if (!value || value.toLowerCase().includes('@resend.dev')) return fallback
  return value
}

export function resendFromIdentity(value: string | null | undefined): { name: string; address: string } {
  const raw = value?.trim() || ''
  if (!raw) return { name: DEFAULT_FROM_NAME, address: DEFAULT_FROM_ADDRESS }
  const named = raw.match(/^(?:"([^"]+)"|([^<]*?))\s*<([^>]+)>\s*$/)
  if (named) {
    const name = (named[1] || named[2] || '').trim() || DEFAULT_FROM_NAME
    const address = named[3].trim()
    return { name, address: address || DEFAULT_FROM_ADDRESS }
  }
  if (raw.includes('@') && !raw.includes(' ')) return { name: DEFAULT_FROM_NAME, address: raw }
  return { name: DEFAULT_FROM_NAME, address: DEFAULT_FROM_ADDRESS }
}
