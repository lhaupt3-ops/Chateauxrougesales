import assert from 'node:assert/strict'
import test from 'node:test'
import { contentDesk } from './content-health'
import { salesQueue } from './sales-queue'

test('the journal desk separates drafts, scheduled posts, and missing fields', () => {
  const now = new Date('2026-11-16T00:00:00.000Z')
  const desk = contentDesk(
    [
      { id: 1, title: 'Draft', _status: 'draft', publishedAt: '2026-12-01T00:00:00.000Z', seo: {}, cta: {}, relatedPosts: [] },
      {
        id: 2,
        title: 'Live',
        _status: 'published',
        publishedAt: '2026-11-10T00:00:00.000Z',
        heroImage: 4,
        heroImageAlt: 'A desk',
        seo: { metaTitle: 'Live', metaDescription: 'A description' },
        cta: { heading: 'Apply' },
        relatedPosts: [3],
      },
    ],
    now,
  )
  assert.equal(desk.drafts.length, 1)
  assert.equal(desk.scheduled.length, 1)
  assert.equal(desk.recent.length, 1)
  assert.equal(desk.missing.length, 1)
  assert.ok(desk.missing[0].gaps.includes('meta description'))
  assert.ok(desk.missing[0].gaps.includes('internal link'))
})

test('the sales queue splits fresh, unbooked, booked, and nurture', () => {
  const queue = salesQueue(
    [
      { id: 1, createdAt: '2026-11-16T10:00:00.000Z', status: 'complete', tier: 'qualified' },
      { id: 2, createdAt: '2026-11-01T10:00:00.000Z', status: 'booked', bookingStatus: 'scheduled', meetingStartAt: '2026-11-20T10:00:00.000Z', tier: 'qualified' },
      { id: 3, createdAt: '2026-11-02T10:00:00.000Z', status: 'nurture', tier: 'not_yet' },
    ],
    { now: new Date('2026-11-16T12:00:00.000Z'), previousLoginAt: '2026-11-16T00:00:00.000Z' },
  )
  assert.deepEqual(queue.fresh.map((lead) => lead.id), [1])
  assert.deepEqual(queue.unbooked.map((lead) => lead.id), [1])
  assert.deepEqual(queue.booked.map((lead) => lead.id), [2])
  assert.deepEqual(queue.nurture.map((lead) => lead.id), [3])
})
