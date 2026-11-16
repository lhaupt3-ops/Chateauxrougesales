const TTL_MS = 5 * 60 * 1000

type CacheEntry = { at: number; value: PostHogFunnel }

export type PostHogFunnel = {
  available: boolean
  reason?: string
  counts: Record<string, number>
  steps: Record<string, number>
}

const cache = new Map<string, CacheEntry>()

export function clearPostHogCache() {
  cache.clear()
}

export async function loadPostHogFunnel(now = Date.now(), fetcher: typeof fetch = fetch): Promise<PostHogFunnel> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY
  const project = process.env.POSTHOG_PROJECT_ID || '739809'
  const host = (process.env.POSTHOG_HOST || 'https://us.posthog.com').replace(/\/$/, '')
  if (!key) return { available: false, reason: 'POSTHOG_PERSONAL_API_KEY is not set.', counts: {}, steps: {} }

  const cached = cache.get(project)
  if (cached && now - cached.at < TTL_MS) return cached.value

  try {
    const [counts, steps] = await Promise.all([
      hogql(
        fetcher,
        host,
        project,
        key,
        `SELECT event, count(DISTINCT person_id) AS people
         FROM events
         WHERE timestamp >= now() - INTERVAL 30 DAY
           AND event IN ('$pageview', 'cta_clicked', 'apply_started', 'apply_email_submitted', 'application_submitted', 'call_booked_server', 'call_booking_confirmed')
         GROUP BY event`,
      ),
      hogql(
        fetcher,
        host,
        project,
        key,
        `SELECT properties.step_id AS step, count(DISTINCT person_id) AS people
         FROM events
         WHERE timestamp >= now() - INTERVAL 30 DAY
           AND event = 'apply_step_completed'
         GROUP BY step`,
      ),
    ])
    const value: PostHogFunnel = {
      available: true,
      counts: Object.fromEntries(counts.map((row) => [String(row[0] || ''), Number(row[1] || 0)])),
      steps: Object.fromEntries(steps.map((row) => [String(row[0] || ''), Number(row[1] || 0)])),
    }
    cache.set(project, { at: now, value })
    return value
  } catch (error) {
    return {
      available: false,
      reason: error instanceof Error ? error.message : 'PostHog query failed.',
      counts: {},
      steps: {},
    }
  }
}

async function hogql(fetcher: typeof fetch, host: string, project: string, key: string, query: string): Promise<unknown[][]> {
  const response = await fetcher(`${host}/api/projects/${project}/query/`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`PostHog returned ${response.status}`)
  const body = (await response.json()) as { results?: unknown[][] }
  return Array.isArray(body.results) ? body.results : []
}
