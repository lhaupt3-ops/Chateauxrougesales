import assert from 'node:assert/strict'
import test from 'node:test'
import { scopeClientHintHeaders } from './client-hint-headers'

test('color-scheme client hints move off the public catch-all and onto admin', () => {
  const rules = scopeClientHintHeaders([
    {
      source: '/:path*',
      headers: [
        { key: 'Accept-CH', value: 'Sec-CH-Prefers-Color-Scheme' },
        { key: 'Critical-CH', value: 'Sec-CH-Prefers-Color-Scheme' },
        { key: 'Vary', value: 'Sec-CH-Prefers-Color-Scheme' },
      ],
    },
  ])
  assert.deepEqual(rules, [
    {
      source: '/:path(admin|admin/.*)',
      headers: [
        { key: 'Accept-CH', value: 'Sec-CH-Prefers-Color-Scheme' },
        { key: 'Critical-CH', value: 'Sec-CH-Prefers-Color-Scheme' },
        { key: 'Vary', value: 'Sec-CH-Prefers-Color-Scheme' },
      ],
    },
  ])
})

test('a Vary token for the color scheme is split from other tokens', () => {
  const rules = scopeClientHintHeaders([
    {
      source: '/:path*',
      headers: [{ key: 'Vary', value: 'Accept-Encoding, Sec-CH-Prefers-Color-Scheme' }],
    },
  ])
  assert.deepEqual(rules, [
    { source: '/:path*', headers: [{ key: 'Vary', value: 'Accept-Encoding' }] },
    { source: '/:path(admin|admin/.*)', headers: [{ key: 'Vary', value: 'Sec-CH-Prefers-Color-Scheme' }] },
  ])
})

test('rules that do not hint at the color scheme stay put', () => {
  const rules = [
    { source: '/blog/:path*', headers: [{ key: 'Cache-Control', value: 'public' }] },
    { source: '/:path*', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] },
  ]
  assert.deepEqual(scopeClientHintHeaders(rules), rules)
})
