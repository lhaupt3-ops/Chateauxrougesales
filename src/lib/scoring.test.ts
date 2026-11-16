import assert from 'node:assert/strict'
import test from 'node:test'
import { scoreApplication } from './scoring'

test('a strong offer scores qualified', () => {
  const result = scoreApplication({
    offerType: 'coaching',
    pricePoint: '10000_24999',
    monthlyRevenue: '100k_250k',
    monthlyConversations: '31_80',
    timeline: 'asap',
    investment: 'high',
    needs: ['closing'],
  })
  assert.equal(result.score, 20)
  assert.equal(result.tier, 'qualified')
})

test('a mid fit is review', () => {
  const result = scoreApplication({
    offerType: 'course',
    pricePoint: '3000_9999',
    monthlyRevenue: '10k_30k',
    monthlyConversations: '1_10',
    timeline: '1_3_months',
    investment: 'not_sure',
  })
  assert.equal(result.score, 10)
  assert.equal(result.tier, 'review')
})

test('a low score is not yet', () => {
  const result = scoreApplication({
    offerType: 'coaching',
    pricePoint: '1000_2999',
    monthlyRevenue: 'under_10k',
    monthlyConversations: '1_10',
    timeline: 'researching',
    investment: 'under_low',
  })
  assert.equal(result.score, 5)
  assert.equal(result.tier, 'not_yet')
})

test('price under $1,000 is not yet even with a high score elsewhere', () => {
  const result = scoreApplication({
    offerType: 'coaching',
    pricePoint: 'under_1000',
    monthlyRevenue: '100k_250k',
    monthlyConversations: '80_plus',
    timeline: 'asap',
    investment: 'high',
  })
  assert.equal(result.tier, 'not_yet')
  assert.ok(result.reasons.includes('hard:price_under_1000'))
})

test('B2B software under $1,000 is review, not an automatic no', () => {
  const result = scoreApplication({
    offerType: 'b2b',
    pricePoint: 'under_1000',
    monthlyRevenue: '30k_100k',
    monthlyConversations: '11_30',
    timeline: 'this_month',
    investment: 'mid',
  })
  assert.equal(result.tier, 'review')
  assert.ok(result.reasons.includes('hard:b2b_low_price_review'))
})

test('pre-revenue and no conversations is not yet', () => {
  const result = scoreApplication({
    offerType: 'course',
    pricePoint: '25000_plus',
    monthlyRevenue: 'pre_revenue',
    monthlyConversations: 'none',
    timeline: 'asap',
    investment: 'high',
  })
  assert.equal(result.tier, 'not_yet')
  assert.ok(result.reasons.includes('hard:pre_revenue_and_no_conversations'))
})

test('researching demotes an otherwise qualified score to review', () => {
  const result = scoreApplication({
    offerType: 'coaching',
    pricePoint: '25000_plus',
    monthlyRevenue: '250k_plus',
    monthlyConversations: '80_plus',
    timeline: 'researching',
    investment: 'high',
  })
  assert.equal(result.score, 17)
  assert.equal(result.tier, 'review')
  assert.ok(result.reasons.includes('modifier:researching_demoted'))
})

test('a flagged other offer is held for review', () => {
  const result = scoreApplication({
    offerType: 'other',
    offerOther: 'Guaranteed returns crypto desk',
    pricePoint: '25000_plus',
    monthlyRevenue: '100k_250k',
    monthlyConversations: '31_80',
    timeline: 'asap',
    investment: 'high',
  })
  assert.equal(result.tier, 'review')
  assert.ok(result.reasons.includes('hard:flagged_offer_review'))
})

test('a flagged offer that already fails stays not yet', () => {
  const result = scoreApplication({
    offerType: 'other',
    offerOther: 'MLM starter kit',
    pricePoint: 'under_1000',
    monthlyRevenue: 'under_10k',
    monthlyConversations: 'none',
    timeline: 'researching',
    investment: 'not_sure',
  })
  assert.equal(result.tier, 'not_yet')
})

test('setter need with no conversations is tagged and still follows the score', () => {
  const result = scoreApplication({
    offerType: 'agency',
    pricePoint: '10000_24999',
    monthlyRevenue: '30k_100k',
    monthlyConversations: 'none',
    timeline: 'asap',
    investment: 'high',
    needs: ['setting', 'closing'],
  })
  assert.equal(result.score, 15)
  assert.equal(result.tier, 'qualified')
  assert.deepEqual(result.tags, ['lead_gen_required'])
})

test('missing answers score zero and land in not yet', () => {
  const result = scoreApplication({})
  assert.equal(result.score, 0)
  assert.equal(result.tier, 'not_yet')
  assert.equal(result.scoringVersion, '1')
})
