import assert from 'node:assert/strict'
import test from 'node:test'
import { funnelFromCounts, funnelIsThin, median, percentDelta, windowsFor, type LeadDoc } from './admin-metrics'
import { clearPostHogCache, loadPostHogFunnel } from './posthog-funnel'

test('median and deltas handle empty and even samples', () => {
  assert.equal(median([]), null)
  assert.equal(median([4, 1, 9]), 4)
  assert.equal(median([1, 3]), 2)
  assert.equal(percentDelta(10, 5), 1)
  assert.equal(percentDelta(1, 0), null)
})

test('windows count leads, tiers, bookings and a median time to book', () => {
  const now = new Date('2026-11-16T12:00:00.000Z')
  const docs: LeadDoc[] = [
    { id: 1, createdAt: '2026-11-16T08:00:00.000Z', status: 'partial' },
    {
      id: 2,
      createdAt: '2026-11-15T08:00:00.000Z',
      completedAt: '2026-11-15T09:00:00.000Z',
      bookedAt: '2026-11-15T11:00:00.000Z',
      status: 'booked',
      bookingStatus: 'scheduled',
      tier: 'qualified',
    },
    { id: 3, createdAt: '2026-11-10T08:00:00.000Z', status: 'complete', tier: 'review' },
    { id: 4, createdAt: '2026-10-01T08:00:00.000Z', status: 'complete', tier: 'not_yet' },
  ]
  const windows = windowsFor(docs, now)
  const today = windows[0]
  assert.equal(today.leads, 1)
  assert.equal(today.partial, 1)
  const week = windows[1]
  assert.equal(week.booked, 1)
  assert.equal(week.qualified, 1)
  assert.equal(week.medianHoursToBook, 2)
  const month = windows[2]
  assert.equal(month.review, 1)
  assert.equal(month.notYet, 0)
})

test('funnel drop-off is the share lost from the previous step', () => {
  const steps = funnelFromCounts(
    { $pageview: 100, cta_clicked: 40, apply_started: 20, apply_email_submitted: 10, application_submitted: 4, call_booking_confirmed: 2 },
    { email: 10, offer: 8 },
  )
  assert.equal(steps[0].dropOff, null)
  assert.equal(steps[1].dropOff, 0.6)
  assert.equal(steps.find((step) => step.label === 'Offer type')?.people, 8)
  assert.equal(steps.at(-1)?.people, 2)
  assert.equal(funnelIsThin(steps), false)
})

test('a tiny visit count hides drop-off noise', () => {
  const steps = funnelFromCounts({ $pageview: 6, cta_clicked: 1 }, {})
  assert.equal(funnelIsThin(steps), true)
})

test('PostHog is skipped cleanly when the key is missing', async () => {
  clearPostHogCache()
  delete process.env.POSTHOG_PERSONAL_API_KEY
  const result = await loadPostHogFunnel()
  assert.equal(result.available, false)
})
