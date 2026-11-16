import { APIError, type CollectionBeforeChangeHook, type CollectionBeforeDeleteHook, type GlobalBeforeChangeHook } from 'payload'
import { writeBlocked } from '@/lib/password-policy'

type GateUser = { id?: number | string; mustChangePassword?: boolean | null; collection?: string }

function userOf(req: { user?: unknown }): GateUser | null {
  const user = req.user
  if (!user || typeof user !== 'object') return null
  return user as GateUser
}

export const blockWritesUntilPassword: CollectionBeforeChangeHook = ({ req, operation, data, originalDoc, collection, context }) => {
  const user = userOf(req)
  const blocked = writeBlocked({
    mustChangePassword: Boolean(user?.mustChangePassword),
    operation,
    collection: collection?.slug,
    self: Boolean(user && originalDoc && String(originalDoc.id) === String(user.id)),
    data: (data || null) as Record<string, unknown> | null,
    context: context as { passwordChange?: boolean; recordLogin?: boolean },
  })
  if (blocked) throw new APIError(blocked, 403)
  return data
}

export const blockDeleteUntilPassword: CollectionBeforeDeleteHook = ({ req }) => {
  const user = userOf(req)
  const blocked = writeBlocked({
    mustChangePassword: Boolean(user?.mustChangePassword),
    operation: 'delete',
  })
  if (blocked) throw new APIError(blocked, 403)
}

export const blockGlobalWritesUntilPassword: GlobalBeforeChangeHook = ({ req }) => {
  const user = userOf(req)
  const blocked = writeBlocked({
    mustChangePassword: Boolean(user?.mustChangePassword),
    operation: 'update',
    collection: 'global',
  })
  if (blocked) throw new APIError(blocked, 403)
}
