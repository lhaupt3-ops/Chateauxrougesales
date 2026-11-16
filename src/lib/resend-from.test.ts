import assert from 'node:assert/strict'
import test from 'node:test'
import { resendFromIdentity, usableResendFrom } from './resend-from'

test('a Name <address> from-line splits into both parts', () => {
  assert.deepEqual(resendFromIdentity('Chateaux Rouge <hello@chateaux.example>'), {
    name: 'Chateaux Rouge',
    address: 'hello@chateaux.example',
  })
})

test('a bare address keeps the default name', () => {
  assert.deepEqual(resendFromIdentity('hello@chateaux.example'), {
    name: 'Chateaux Rouge',
    address: 'hello@chateaux.example',
  })
})

test('a missing from-line uses the Resend onboarding address', () => {
  assert.deepEqual(resendFromIdentity(''), {
    name: 'Chateaux Rouge',
    address: 'onboarding@resend.dev',
  })
})

test('a CMS sender on resend.dev falls back to the env from-line', () => {
  const fallback = 'Chateaux Rouge <hello@chateauxrouge.com>'
  assert.equal(usableResendFrom('Chateaux Rouge <onboarding@resend.dev>', fallback), fallback)
  assert.equal(usableResendFrom('Chateaux Rouge <Onboarding@Resend.DEV>', fallback), fallback)
  assert.equal(usableResendFrom('onboarding@resend.dev', fallback), fallback)
  assert.equal(usableResendFrom('  ', fallback), fallback)
  assert.equal(usableResendFrom(null, fallback), fallback)
  assert.equal(usableResendFrom('Chateaux Rouge <hello@chateauxrouge.com>', fallback), 'Chateaux Rouge <hello@chateauxrouge.com>')
})
