import assert from 'node:assert/strict'
import test from 'node:test'
import { resendFromIdentity } from './resend-from'

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
