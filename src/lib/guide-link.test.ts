import assert from 'node:assert/strict'
import test from 'node:test'
import { applicantEmail } from './email-messages'
import { FLAGSHIP_GUIDE, SCORECARD_SLUG, guideEmailUrl, guideTarget } from './guide-link'

const cms = [{ slug: 'show-rate-notes', title: 'Show rate notes' }]

test('the guide email link opens the scorecard, the flagship guide, or a published note', () => {
  assert.equal(guideTarget(SCORECARD_SLUG, [], 'abc').path, '/resources/closer-readiness-scorecard?id=abc')
  assert.equal(guideTarget(FLAGSHIP_GUIDE, [], 'abc').path, '/resources/are-you-ready-for-closers?id=abc')
  assert.equal(guideTarget('show-rate-notes', cms, 'abc').path, '/resources/show-rate-notes?id=abc')
  assert.equal(guideTarget('show-rate-notes', cms, 'abc').title, 'Show rate notes')
})

test('an empty or unknown guide slug falls back to the flagship guide, not the index', () => {
  for (const raw of ['', '   ', 'not-a-guide', 'resources']) {
    const path = guideTarget(raw, cms, 'abc').path
    assert.equal(path, '/resources/are-you-ready-for-closers?id=abc')
    assert.equal(path.endsWith('/resources'), false)
    assert.doesNotMatch(path, /\/resources\?/)
  }
  assert.equal(guideEmailUrl('', 'abc'), guideEmailUrl(FLAGSHIP_GUIDE, 'abc'))
})

test('the applicant guide email uses the requested slug ahead of an older stored one', () => {
  const doc = { id: 1, publicId: 'lead-1', email: 'ada@example.com', firstName: 'Ada', resourceSlug: 'older-note' }
  const scorecard = applicantEmail(doc, 'magnet', { slug: SCORECARD_SLUG, title: 'Closer readiness scorecard' })
  const guide = applicantEmail(doc, 'magnet', { slug: FLAGSHIP_GUIDE, title: 'Are you actually ready for closers?' })
  const note = applicantEmail(doc, 'magnet', { slug: 'show-rate-notes', title: 'Show rate notes' })
  const missing = applicantEmail({ ...doc, resourceSlug: '' }, 'magnet')
  assert.match(scorecard.html, /\/resources\/closer-readiness-scorecard\?id=lead-1/)
  assert.match(guide.html, /\/resources\/are-you-ready-for-closers\?id=lead-1/)
  assert.match(guide.text, /Are you actually ready for closers\? is linked below/)
  assert.match(guide.html, /Open the guide/)
  assert.match(note.html, /\/resources\/show-rate-notes\?id=lead-1/)
  assert.match(note.text, /Show rate notes is linked below/)
  assert.match(missing.html, /\/resources\/are-you-ready-for-closers\?id=lead-1/)
  assert.doesNotMatch(missing.html, /href="[^"]*\/resources"/)
})
