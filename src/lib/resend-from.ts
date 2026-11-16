const DEFAULT_FROM_NAME = 'Chateaux Rouge'
const DEFAULT_FROM_ADDRESS = 'onboarding@resend.dev'

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
