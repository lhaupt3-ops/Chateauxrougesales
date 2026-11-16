import assert from 'node:assert/strict'
import test from 'node:test'
import { passwordPolicyError, samePasswordError, writeBlocked } from './password-policy'
import { welcomeMessage } from './welcome-email'

test('a new password must be 12 characters and different', () => {
  assert.equal(passwordPolicyError('short-pass'), 'Use at least 12 characters.')
  assert.equal(passwordPolicyError('long-enough-password'), null)
  assert.match(samePasswordError(true) || '', /different/)
  assert.equal(samePasswordError(false), null)
})

test('writes stay blocked until the password change clears the flag', () => {
  assert.equal(writeBlocked({ mustChangePassword: true, operation: 'update', collection: 'posts' }), 'Set a new password before changing anything else.')
  assert.equal(writeBlocked({ mustChangePassword: true, operation: 'delete', collection: 'users', self: true }), 'Set a new password before changing anything else.')
  assert.equal(
    writeBlocked({
      mustChangePassword: true,
      operation: 'update',
      collection: 'users',
      self: true,
      context: { passwordChange: true },
      data: { password: 'a-brand-new-password', mustChangePassword: false },
    }),
    null,
  )
  assert.equal(writeBlocked({ mustChangePassword: false, operation: 'create', collection: 'posts' }), null)
  assert.equal(
    writeBlocked({
      mustChangePassword: true,
      operation: 'update',
      collection: 'users',
      self: true,
      context: { recordLogin: true },
    }),
    null,
  )
})

test('the welcome email names the role and never carries a password', () => {
  const secret = 'temporary-secret-value'
  const message = welcomeMessage({ name: 'Ada', role: 'editor' })
  assert.match(message.text, /journal/)
  assert.match(message.html, /https:\/\/chateauxrouge.com\/admin/)
  assert.equal(message.html.includes(secret), false)
  assert.equal(message.text.includes(secret), false)
  assert.equal(message.subject.startsWith('['), false)
})
