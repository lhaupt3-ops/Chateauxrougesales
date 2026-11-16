import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'sales'

export function roleOf(user: PayloadRequest['user']): Role | undefined {
  if (!user || typeof user !== 'object' || !('role' in user)) return undefined
  const role = (user as { role?: string }).role
  if (role === 'admin' || role === 'editor' || role === 'sales') return role
  return undefined
}

/**
 * Admin when the role says so. A user with no role is an admin only while they
 * are the only account, which covers the original owner created before `role` existed.
 */
export function hasAdminAccess(user: PayloadRequest['user'], userCount: number): boolean {
  const role = roleOf(user)
  if (role === 'admin') return true
  if (role || !user) return false
  return userCount === 1
}

async function userIsAdmin(req: PayloadRequest): Promise<boolean> {
  const role = roleOf(req.user)
  if (role === 'admin') return true
  if (role || !req.user) return false
  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req,
  })
  return hasAdminAccess(req.user, totalDocs)
}

export const isAdmin: Access = ({ req }) => userIsAdmin(req)

export const isAdminField: FieldAccess = ({ req }) => userIsAdmin(req)

export const isAdminOrEditor: Access = ({ req }) => {
  const role = roleOf(req.user)
  return role === 'admin' || role === 'editor'
}

export const isAdminOrSales: Access = ({ req }) => {
  const role = roleOf(req.user)
  return role === 'admin' || role === 'sales'
}

export const isAdminOrSalesField: FieldAccess = ({ req }) => {
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
