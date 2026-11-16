import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchCalendlyEventTimes } from './calendly'

const originalFetch = globalThis.fetch

test.afterEach(() => {
  globalThis.fetch = originalFetch
  delete process.env.CALENDLY_API_TOKEN
})

test('a missing Calendly token does not call the API', async () => {
  delete process.env.CALENDLY_API_TOKEN
  let called = false
  globalThis.fetch = (async () => {
    called = true
    return new Response('{}')
  }) as typeof fetch
  const result = await fetchCalendlyEventTimes('https://api.calendly.com/scheduled_events/abc')
  assert.equal(result, null)
  assert.equal(called, false)
})

test('scheduled event start and end are read from the API', async () => {
  process.env.CALENDLY_API_TOKEN = 'test-token'
  globalThis.fetch = (async (input) => {
    assert.equal(String(input), 'https://api.calendly.com/scheduled_events/abc')
    return Response.json({
      resource: { start_time: '2026-05-01T15:00:00.000000Z', end_time: '2026-05-01T15:45:00.000000Z' },
    })
  }) as typeof fetch
  const result = await fetchCalendlyEventTimes('https://api.calendly.com/scheduled_events/abc')
  assert.deepEqual(result, { start: '2026-05-01T15:00:00.000000Z', end: '2026-05-01T15:45:00.000000Z' })
})

test('an invitee URI is resolved to the scheduled event before the times are read', async () => {
  process.env.CALENDLY_API_TOKEN = 'test-token'
  const seen: string[] = []
  globalThis.fetch = (async (input) => {
    const url = String(input)
    seen.push(url)
    if (url.endsWith('/invitees/inv')) {
      return Response.json({ resource: { event: 'https://api.calendly.com/scheduled_events/evt' } })
    }
    return Response.json({ resource: { start_time: '2026-06-02T18:00:00.000000Z', end_time: '2026-06-02T18:30:00.000000Z' } })
  }) as typeof fetch
  const result = await fetchCalendlyEventTimes('', 'https://api.calendly.com/scheduled_events/evt/invitees/inv')
  assert.deepEqual(seen, [
    'https://api.calendly.com/scheduled_events/evt/invitees/inv',
    'https://api.calendly.com/scheduled_events/evt',
  ])
  assert.equal(result?.start, '2026-06-02T18:00:00.000000Z')
  assert.equal(result?.end, '2026-06-02T18:30:00.000000Z')
})

test('a non-Calendly URL is ignored', async () => {
  process.env.CALENDLY_API_TOKEN = 'test-token'
  let called = false
  globalThis.fetch = (async () => {
    called = true
    return Response.json({})
  }) as typeof fetch
  const result = await fetchCalendlyEventTimes('https://evil.example/scheduled_events/abc')
  assert.equal(result, null)
  assert.equal(called, false)
})
