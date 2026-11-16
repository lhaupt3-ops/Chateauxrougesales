import assert from 'node:assert/strict'
import test from 'node:test'
import { allGuides } from '@/content/guides'
import { brandTitle, SEO } from './seo-titles'
import { scorecardPdfBytes } from './scorecard-pdf'
import { INDEXNOW_KEY, indexNowKeyLocation } from './indexnow'
import { interpretYesCount, SCORECARD_QUESTIONS } from '@/content/scorecard'

test('public titles and descriptions stay unique and within the limits', () => {
  const titles = Object.values(SEO).map((entry) => entry.title)
  const descriptions = Object.values(SEO).map((entry) => entry.description)
  assert.equal(new Set(titles).size, titles.length)
  assert.equal(new Set(descriptions).size, descriptions.length)
  for (const title of titles) {
    assert.ok(title.length <= 60, title)
    assert.match(title, /founder|closer|sales|Chateaux Rouge/i)
    assert.doesNotMatch(title, /we're hiring|job opening|now hiring/i)
  }
  for (const description of descriptions) assert.ok(description.length <= 155, description)
  for (const guide of allGuides) {
    const title = brandTitle(guide.metaTitle)
    assert.ok(title.length <= 60, `${guide.slug} ${title}`)
    assert.ok(guide.metaDescription.length <= 155, guide.slug)
  }
})

test('the scorecard pdf is one document and the score follows the guide rule', () => {
  const pdf = new TextDecoder().decode(scorecardPdfBytes())
  assert.match(pdf, /^%PDF-1\.4/)
  assert.match(pdf, /Closer readiness scorecard/)
  assert.match(interpretYesCount(8).heading, /closer can be the next look/)
  assert.match(interpretYesCount(6).heading, /Fix the nos/)
  assert.equal(SCORECARD_QUESTIONS.length, 8)
})

test('the IndexNow key file name matches the key', () => {
  assert.equal(INDEXNOW_KEY.length, 32)
  assert.match(indexNowKeyLocation(), new RegExp(`${INDEXNOW_KEY}\\.txt$`))
})
