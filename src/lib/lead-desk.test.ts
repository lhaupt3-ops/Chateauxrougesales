import assert from 'node:assert/strict'
import test from 'node:test'
import { bookingFromApplication, displayName, fitGroups, nextAction, scoreBandLabel, sequenceActivity, subscriberFromApplication } from './lead-desk'

test('a lead name prefers the person and falls back to email', () => {
  assert.equal(displayName('Ada', 'Lovelace', 'ada@example.com'), 'Ada Lovelace')
  assert.equal(displayName('', '', 'ada@example.com'), 'ada@example.com')
  assert.equal(scoreBandLabel('not_yet'), 'Not yet')
})

test('fit answers use question labels instead of stored keys', () => {
  const groups = fitGroups({ offerType: 'coaching', setupFee: 'yes', pricePoint: '3000_9999' })
  const offer = groups.find((group) => group.title === 'Offer')
  assert.equal(offer?.rows[0].answer, '$3,000–$9,999')
  const fee = groups.find((group) => group.title === 'Setup-fee readiness')
  assert.match(fee?.rows[0].answer || '', /setup fee/i)
})

test('the next action follows the pipeline', () => {
  assert.match(nextAction({ status: 'partial' }), /unfinished/i)
  assert.match(nextAction({ tier: 'qualified', status: 'complete' }), /strategy-call/i)
  assert.match(nextAction({ outcome: 'won', status: 'booked' }), /won/i)
  const past = nextAction({ status: 'complete', tier: 'review', nextFollowUpAt: '2020-01-01T00:00:00.000Z', now: new Date('2026-01-01T00:00:00.000Z') })
  assert.match(past, /follow-up date has passed/i)
})

test('sequence sends become an activity log', () => {
  const rows = sequenceActivity([{ key: 'nurture-1', at: '2026-11-01T00:00:00.000Z', sent: true }])
  assert.equal(rows.length, 1)
  assert.match(rows[0].text, /nurture-1/)
})

test('bookings and subscribers are derived only when the application qualifies', () => {
  assert.equal(bookingFromApplication({ status: 'partial', email: 'a@b.com' }), null)
  const booking = bookingFromApplication({ status: 'booked', email: 'a@b.com', firstName: 'Ada', meetingStartAt: '2026-12-01T00:00:00.000Z' })
  assert.equal(booking?.status, 'scheduled')
  assert.equal(booking?.who, 'Ada')
  assert.equal(subscriberFromApplication({ email: 'a@b.com', status: 'complete' }), null)
  assert.equal(subscriberFromApplication({ email: 'a@b.com', waitlist: true })?.kind, 'waitlist')
})
