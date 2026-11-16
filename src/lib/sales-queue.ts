export type QueueLead = {
  id: number | string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  status?: string | null
  tier?: string | null
  createdAt?: string | null
  bookingStatus?: string | null
  meetingStartAt?: string | null
  sequenceKind?: string | null
}

export const SALES_STATUSES = ['booked', 'no_show', 'won', 'lost', 'nurture'] as const

export function salesQueue(leads: QueueLead[], input: { now: Date; previousLoginAt?: string | null }) {
  const since = input.previousLoginAt ? new Date(input.previousLoginAt).getTime() : null
  const fresh = since
    ? leads.filter((lead) => lead.createdAt && new Date(lead.createdAt).getTime() > since)
    : []
  const unbooked = leads.filter((lead) => lead.status === 'complete' && lead.tier === 'qualified')
  const booked = leads
    .filter((lead) => lead.status === 'booked' || lead.bookingStatus === 'scheduled')
    .sort((a, b) => new Date(a.meetingStartAt || 0).getTime() - new Date(b.meetingStartAt || 0).getTime())
  const nurture = leads.filter((lead) => lead.status === 'nurture' || lead.tier === 'review' || lead.tier === 'not_yet')
  return { fresh, unbooked, booked, nurture }
}

export function leadName(lead: { firstName?: string | null; lastName?: string | null; email?: string | null }): string {
  return [lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.email || 'Untitled'
}
