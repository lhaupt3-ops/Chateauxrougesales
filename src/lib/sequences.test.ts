import assert from 'node:assert/strict'
import test from 'node:test'
import { dueStepKeys, stepsFor } from './sequences'

const hour = 60 * 60 * 1000

test('nurture has five steps and follow-ups have three', () => {
  assert.equal(stepsFor('nurture').length, 5)
  assert.equal(stepsFor('partial').length, 3)
  assert.equal(stepsFor('qualified').length, 3)
})

test('only the steps whose delay has passed are due', () => {
  const enrolled = Date.parse('2026-11-01T00:00:00.000Z')
  const keys = dueStepKeys({
    kind: 'nurture',
    enrolledAt: new Date(enrolled).toISOString(),
    sent: ['nurture-1'],
    now: enrolled + 73 * hour,
    stopped: false,
  })
  assert.deepEqual(keys, ['nurture-2'])
})

test('a stopped sequence sends nothing', () => {
  const keys = dueStepKeys({
    kind: 'qualified',
    enrolledAt: new Date('2026-11-01T00:00:00.000Z').toISOString(),
    sent: [],
    now: Date.parse('2026-12-01T00:00:00.000Z'),
    stopped: true,
  })
  assert.deepEqual(keys, [])
})
