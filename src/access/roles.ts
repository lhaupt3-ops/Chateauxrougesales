import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'sales'

export function roleOf(user: PayloadRequest['user']): Role | undefined {
  if (!user || typeof user !== 'object' || !('role' in user)) return undefined
  const role = (user as { role?: string }).role
  if (role === 'admin' || role === 'editor' || role === 'sales') return role
  return undefined
}

export const isAdmin: Access = ({ req }) => roleOf(req.user) === 'admin'

export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === 'admin'

export const isAdminOrEditor: Access = ({ req }) => {
  const role = roleOf(req.user)
  return role === 'admin' || role === 'editor'
}

export const isAdminOrSales: Access = ({ req }) => {
  const role = roleOf(req.user)
  return role === 'admin' || role === 'sales'
}

export const publishedOrContentTeam: Access = ({ req }) => {
  const role = roleOf(req.user)
  if (role === 'admin' || role === 'editor') return true
  if (role === 'sales') return false
  return {
    _status: {
      equals: 'published',
    },
  }
}

function roleFromUnknown(user: unknown): string | undefined {
  if (user && typeof user === 'object' && 'role' in user) {
    const role = (user as { role?: unknown }).role
    return typeof role === 'string' ? role : undefined
  }
  return undefined
}

export function hideFromSales({ user }: { user: unknown }): boolean {
  return roleFromUnknown(user) === 'sales'
}

export function hideFromEditor({ user }: { user: unknown }): boolean {
  return roleFromUnknown(user) === 'editor'
}

export function adminOnly({ user }: { user: unknown }): boolean {
  return roleFromUnknown(user) !== 'admin'
}
