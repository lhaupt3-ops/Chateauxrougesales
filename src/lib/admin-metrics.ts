export type LeadDoc = {
  id: number | string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  status?: string | null
  tier?: string | null
  bookingStatus?: string | null
  createdAt?: string | null
  completedAt?: string | null
  bookedAt?: string | null
  utmSource?: string | null
  landingPage?: string | null
}

export type WindowKey = 'today' | '7d' | '30d'

export type WindowStats = {
  label: string
  leads: number
  partial: number
  completed: number
  qualified: number
  review: number
  notYet: number
  booked: number
  bookingRate: number | null
  canceled: number
  noShow: number
  medianHoursToBook: number | null
  deltas: {
    leads: number | null
    completed: number | null
    booked: number | null
    bookingRate: number | null
  }
}

export type SourceRow = { label: string; leads: number; completed: number; booked: number }

const WINDOWS: { key: WindowKey; label: string; days: number }[] = [
  { key: 'today', label: 'Today', days: 1 },
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
]

export function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

export function inRange(value: string | null | undefined, start: Date, end: Date): boolean {
  if (!value) return false
  const time = new Date(value).getTime()
  return !Number.isNaN(time) && time >= start.getTime() && time < end.getTime()
}

export function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return (current - previous) / previous
}

export function median(values: number[]): number | null {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function hoursBetween(later: string | null | undefined, earlier: string | null | undefined): number | null {
  if (!later || !earlier) return null
  const diff = new Date(later).getTime() - new Date(earlier).getTime()
  if (!Number.isFinite(diff) || diff < 0) return null
  return diff / 36e5
}

function sliceStats(docs: LeadDoc[], start: Date, end: Date) {
  const created = docs.filter((doc) => inRange(doc.createdAt, start, end))
  const partial = created.filter((doc) => doc.status === 'partial').length
  const completed = created.filter((doc) => doc.status && doc.status !== 'partial').length
  const qualified = created.filter((doc) => doc.tier === 'qualified').length
  const review = created.filter((doc) => doc.tier === 'review').length
  const notYet = created.filter((doc) => doc.tier === 'not_yet').length
  const bookedDocs = docs.filter((doc) => doc.status === 'booked' || doc.bookingStatus === 'scheduled').filter((doc) => inRange(doc.bookedAt, start, end))
  const canceled = docs.filter((doc) => doc.bookingStatus === 'canceled' && inRange(doc.bookedAt || doc.createdAt, start, end)).length
  const noShow = docs.filter((doc) => doc.status === 'no_show' && inRange(doc.createdAt, start, end)).length
  const hours = bookedDocs
    .map((doc) => hoursBetween(doc.bookedAt, doc.completedAt || doc.createdAt))
    .filter((value): value is number => value != null)
  return {
    leads: created.length,
    partial,
    completed,
    qualified,
    review,
    notYet,
    booked: bookedDocs.length,
    bookingRate: completed === 0 ? null : bookedDocs.length / completed,
    canceled,
    noShow,
    medianHoursToBook: median(hours),
  }
}

export function windowsFor(docs: LeadDoc[], now = new Date()): WindowStats[] {
  const todayStart = startOfUtcDay(now)
  return WINDOWS.map((window) => {
    const end = now
    const start = window.days === 1 ? todayStart : new Date(now.getTime() - window.days * 86400000)
    const length = end.getTime() - start.getTime()
    const previousEnd = start
    const previousStart = new Date(start.getTime() - length)
    const current = sliceStats(docs, start, end)
    const previous = sliceStats(docs, previousStart, previousEnd)
    return {
      label: window.label,
      ...current,
      deltas: {
        leads: percentDelta(current.leads, previous.leads),
        completed: percentDelta(current.completed, previous.completed),
        booked: percentDelta(current.booked, previous.booked),
        bookingRate:
          current.bookingRate == null || previous.bookingRate == null
            ? null
            : percentDelta(current.bookingRate, previous.bookingRate),
      },
    }
  })
}

export function groupConversions(docs: LeadDoc[], key: 'utmSource' | 'landingPage', since: Date, until: Date): SourceRow[] {
  const rows = new Map<string, SourceRow>()
  for (const doc of docs) {
    if (!inRange(doc.createdAt, since, until)) continue
    const label = (doc[key] || '').trim() || (key === 'utmSource' ? 'Direct or unknown' : 'Unknown page')
    const row = rows.get(label) || { label, leads: 0, completed: 0, booked: 0 }
    row.leads += 1
    if (doc.status && doc.status !== 'partial') row.completed += 1
    if (doc.status === 'booked' || doc.bookingStatus === 'scheduled') row.booked += 1
    rows.set(label, row)
  }
  return [...rows.values()].sort((a, b) => b.leads - a.leads).slice(0, 8)
}

export function recentLeads(docs: LeadDoc[], limit = 8): LeadDoc[] {
  return [...docs]
    .filter((doc) => doc.createdAt)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, limit)
}

export const FUNNEL_STEPS = [
  'email',
  'offer',
  'price',
  'revenue',
  'conversations',
  'setup',
  'needs',
  'timeline',
  'setupFee',
  'contact',
] as const

export type FunnelStep = { label: string; people: number; dropOff: number | null }

export function funnelFromCounts(counts: Record<string, number>, steps: Record<string, number>): FunnelStep[] {
  const sequence: { label: string; people: number }[] = [
    { label: 'Visits', people: counts.$pageview || 0 },
    { label: 'CTA', people: counts.cta_clicked || 0 },
    { label: 'Apply opened', people: counts.apply_started || 0 },
    { label: 'Email saved', people: counts.apply_email_submitted || 0 },
    ...FUNNEL_STEPS.map((step) => ({ label: step, people: steps[step] || 0 })),
    { label: 'Submitted', people: counts.application_submitted || 0 },
    { label: 'Booked', people: counts.call_booking_confirmed || counts.call_booked_server || 0 },
  ]
  return sequence.map((step, index) => {
    if (index === 0) return { ...step, dropOff: null }
    const previous = sequence[index - 1].people
    return { ...step, dropOff: previous > 0 ? Math.max(0, previous - step.people) / previous : null }
  })
}
