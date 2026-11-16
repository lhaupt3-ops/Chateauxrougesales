export const PASSWORD_MIN = 12
export const PASSWORD_LOCKED = 'Set a new password before changing anything else.'

export function passwordPolicyError(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`
  return null
}

export function samePasswordError(matchesCurrent: boolean): string | null {
  if (matchesCurrent) return 'Choose a password that is different from the current one.'
  return null
}

export function writeBlocked(input: {
  mustChangePassword?: boolean
  operation: 'create' | 'read' | 'update' | 'delete'
  collection?: string
  self?: boolean
  data?: Record<string, unknown> | null
  context?: { passwordChange?: boolean; recordLogin?: boolean }
}): string | null {
  if (!input.mustChangePassword) return null
  if (input.operation === 'read') return null
  if (input.context?.recordLogin && input.operation === 'update' && input.collection === 'users' && input.self) return null
  if (input.context?.passwordChange && input.operation === 'update' && input.collection === 'users' && input.self) {
    const password = input.data?.password
    if (typeof password !== 'string') return 'Enter a new password.'
    const policy = passwordPolicyError(password)
    if (policy) return policy
    if (input.data?.mustChangePassword !== false) return 'The password change has to clear the flag.'
    return null
  }
  return PASSWORD_LOCKED
}
