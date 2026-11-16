import assert from 'node:assert/strict'
import test from 'node:test'
import { plainTextFromHtml, renderEmail } from './email-layout'
import { applicantEmail, ownerEmail } from './email-messages'
import { explainReason } from './reason-labels'

test('the shared layout uses the site palette, logo, serif heading, and a text part', () => {
  const { html, text } = renderEmail({
    preheader: 'Your result is ready.',
    eyebrow: 'Application',
    heading: 'Your result is ready, Ada.',
    paragraphs: ['Open the result when you have a minute.'],
    cta: { label: 'See my result', href: 'https://chateaux.example/apply/book?id=1' },
  })
  assert.match(html, /#f7f3ee/)
  assert.match(html, /#b3122e/)
  assert.match(html, /#111114/)
  assert.match(html, /Georgia/)
  assert.match(html, /Arial/)
  assert.match(html, /border-radius:24px/)
  assert.match(html, /logo-mark\.png/)
  assert.match(html, /prefers-color-scheme: dark/)
  assert.match(html, /Chateaux Rouge/)
  assert.match(html, /See my result/)
  assert.match(html, /https:\/\/chateaux\.example\/apply\/book\?id=1/)
  assert.match(text, /Your result is ready, Ada\./)
  assert.match(text, /https:\/\/chateaux\.example\/apply\/book\?id=1/)
  assert.equal(text.includes('<'), false)
  const stripped = plainTextFromHtml(html)
  assert.match(stripped, /See my result \(https:\/\/chateaux\.example\/apply\/book\?id=1\)/)
})

test('client-facing subjects do not lead with a bracket tag', () => {
  const doc = { id: 1, publicId: 'abc', email: 'ada@example.com', firstName: 'Ada', tier: 'qualified' }
  for (const kind of ['complete', 'booked', 'partial', 'unbooked', 'waitlist', 'magnet'] as const) {
    const message = applicantEmail(doc, kind)
    assert.equal(message.subject.startsWith('['), false, message.subject)
    assert.match(message.html, /logo-mark\.png/)
    assert.match(message.text, /Chateaux Rouge/)
  }
})

test('the owner note names the score in words and links to admin', () => {
  const message = ownerEmail(
    {
      id: 42,
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      tier: 'qualified',
      score: 19,
      pricePoint: '3000_9999',
      reasons: ['price:3000_9999:+4', 'hard:investment_under_3000'],
    },
    'complete',
  )
  assert.equal(message.subject.startsWith('['), false)
  assert.match(message.html, /Open in admin/)
  assert.match(message.html, /Price: \$3,000–\$9,999 \(\+4\)/)
  assert.match(message.text, /Hard rule: an older application was under \$3,000 a month/)
  assert.match(message.html, /\/admin\/collections\/applications\/42/)
  assert.equal(message.replyTo, 'ada@example.com')
  assert.equal(explainReason('price:3000_9999:+4'), 'Price: $3,000–$9,999 (+4)')
})
