import assert from 'node:assert/strict'
import test from 'node:test'
import type { PayloadRequest } from 'payload'
import { hasAdminAccess } from './roles'

type User = PayloadRequest['user']

const user = (role?: string | null): User => ({ id: 1, role }) as User

test('an admin stays an admin no matter how many users exist', () => {
  assert.equal(hasAdminAccess(user('admin'), 1), true)
  assert.equal(hasAdminAccess(user('admin'), 4), true)
})

test('editor and sales stay non-admin even when they are the only user', () => {
  assert.equal(hasAdminAccess(user('editor'), 1), false)
  assert.equal(hasAdminAccess(user('sales'), 1), false)
})

test('a user with no role is an admin only while they are the sole account', () => {
  assert.equal(hasAdminAccess(user(null), 1), true)
  assert.equal(hasAdminAccess(user(''), 1), true)
  assert.equal(hasAdminAccess({ id: 1 } as User, 1), true)
  assert.equal(hasAdminAccess(user(null), 0), false)
  assert.equal(hasAdminAccess(user(null), 2), false)
  assert.equal(hasAdminAccess(null, 1), false)
})
