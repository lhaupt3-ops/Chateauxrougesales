import assert from 'node:assert/strict'
import test from 'node:test'
import { authorIsIndexable, careersIsIndexable, pricingIsIndexable, publicCopy } from './indexing'

const priced = {
  setupFeeIsPlaceholder: false,
  commissionIsPlaceholder: false,
  setupFeeLabel: '$4,000',
  commissionLabel: '10%',
}

test('pricing is indexable once the offer numbers are confirmed, even if Site settings flags are still on', () => {
  assert.equal(pricingIsIndexable({ ...priced, setupFeeIsPlaceholder: true }), true)
  assert.equal(pricingIsIndexable({ ...priced, setupFeeLabel: '' }), true)
  assert.equal(pricingIsIndexable({ ...priced, commissionLabel: 'Placeholder: later', commissionIsPlaceholder: true }), true)
  assert.equal(pricingIsIndexable(priced), true)
})

test('careers and authors become indexable only when the page is real', () => {
  assert.equal(careersIsIndexable({ careersIsPlaceholder: true }), false)
  assert.equal(careersIsIndexable({ careersIsPlaceholder: false }), true)
  assert.equal(authorIsIndexable({ name: 'Ada', bio: 'Sells.', credentials: 'Not a person. Placeholder only' }, 2), false)
  assert.equal(authorIsIndexable({ name: 'Ada', bio: 'Sells.', credentials: 'Founder' }, 0), false)
  assert.equal(authorIsIndexable({ name: 'Ada', bio: 'Sells.', credentials: 'Founder' }, 1), true)
})

test('public copy drops internal notes', () => {
  assert.equal(publicCopy('This sentence is a draft.'), 'To be confirmed.')
  assert.equal(publicCopy('Lawyer review is still pending.'), 'To be confirmed.')
  assert.match(publicCopy('The wording lives in Site settings.'), /the agreement/)
  assert.doesNotMatch(publicCopy('Lawyer review pending in Site settings. This sentence is a draft.'), /Site settings|draft|Lawyer review/i)
})
