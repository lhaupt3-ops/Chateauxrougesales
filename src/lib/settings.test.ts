import assert from 'node:assert/strict'
import test from 'node:test'
import { confirmedOrPending, isOperatorPlaceholder, publishedSettingsText } from './settings'

test('placeholder Site settings text is treated as unset', () => {
  for (const value of [
    '',
    '   ',
    'To be confirmed',
    'to be confirmed.',
    'TO BE CONFIRMED',
    'To be confirmed. The term and the notice period are set in the written agreement.',
    'Placeholder: unconfirmed. Do not publish a guarantee until the agreement can keep it.',
  ]) {
    assert.equal(isOperatorPlaceholder(value), true, value)
    assert.equal(publishedSettingsText(value), '', value)
  }

  assert.equal(
    publishedSettingsText('  About 14 days to first covered calls, once a start date is agreed.  '),
    'About 14 days to first covered calls, once a start date is agreed.',
  )
  assert.equal(isOperatorPlaceholder('I do each step myself, then we look at the calls together each week.'), false)
  assert.equal(confirmedOrPending('To be confirmed.', true), '')
  assert.equal(confirmedOrPending('To be confirmed.', false), '')
  assert.equal(confirmedOrPending('10% of cash collected', false), '10% of cash collected')
  assert.equal(confirmedOrPending('Free', false), 'Free')
})
