import assert from 'node:assert/strict'
import test from 'node:test'
import { applicationEventProperties, leadTimeHours, sanitizeStepAnswer } from './funnel-analytics'

test('sanitizeStepAnswer keeps option values and drops contact fields', () => {
  assert.deepEqual(
    sanitizeStepAnswer({
      email: 'founder@acme.com',
      phone: '+15551212',
      firstName: 'Ada',
      lastName: 'Lovelace',
      website: 'https://acme.com',
      notes: 'call me',
      offerOther: 'custom coaching',
      company: 'Acme',
      offerType: 'coaching',
      needs: ['setting', 'closing'],
      pricePoint: '',
    }),
    { offerType: 'coaching', needs: ['setting', 'closing'] },
  )
})

test('applicationEventProperties copies stored attribution and sets first touch once', () => {
  const properties = applicationEventProperties({
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'brand',
    landingPage: '/blog/post',
    referrer: 'https://google.com',
    lastBlogPost: 'post',
    device: 'desktop',
    entry: 'blog',
  })
  assert.equal(properties.utm_source, 'google')
  assert.equal(properties.utm_medium, 'cpc')
  assert.equal(properties.utm_campaign, 'brand')
  assert.equal(properties.landing_page, '/blog/post')
  assert.equal(properties.referrer, 'https://google.com')
  assert.equal(properties.last_blog_post, 'post')
  assert.equal(properties.device, 'desktop')
  assert.equal(properties.entry, 'blog')
  assert.deepEqual(properties.$set_once, {
    initial_utm_source: 'google',
    initial_utm_medium: 'cpc',
    initial_utm_campaign: 'brand',
    initial_landing_page: '/blog/post',
    initial_referrer: 'https://google.com',
  })
})

test('applicationEventProperties skips empty first-touch person properties', () => {
  const properties = applicationEventProperties({})
  assert.equal(properties.utm_source, '')
  assert.equal(properties.entry, '')
  assert.equal('$set_once' in properties, false)
})

test('leadTimeHours measures hours until the meeting', () => {
  const start = new Date(Date.now() + 2 * 36e5).toISOString()
  const hours = leadTimeHours(start)
  assert.ok(hours !== undefined && hours > 1.9 && hours < 2.1)
  assert.equal(leadTimeHours(undefined), undefined)
  assert.equal(leadTimeHours('not-a-date'), undefined)
})
