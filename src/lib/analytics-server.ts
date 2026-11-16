import { PostHog } from 'posthog-node'
import { applicationEventProperties } from '@/lib/funnel-analytics'

let client: PostHog | null = null

function getClient(): PostHog | null {
  const key = process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null
  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    })
  }
  return client
}

export async function captureServer(
  distinctId: string,
  event: string,
  properties: Record<string, unknown>,
  consent: boolean,
) {
  if (!consent) return
  const posthog = getClient()
  if (!posthog) return
  posthog.capture({ distinctId, event, properties })
  await posthog.flush()
}

export function withApplicationContext(doc: object, properties: Record<string, unknown>): Record<string, unknown> {
  return { ...properties, ...applicationEventProperties(doc) }
}
