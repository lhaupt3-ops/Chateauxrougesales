'use client'

import { DECISION_OPTIONS, labelFor } from '@/lib/options'
import { explainReasons } from '@/lib/reason-labels'
import { nextAction, scoreBandLabel } from '@/lib/lead-desk'
import { AdminBrand } from './Logo'
import { useFormData } from './useFormData'

export default function LeadSummary() {
  const data = useFormData()
  const first = text(data.firstName)
  const last = text(data.lastName)
  const email = text(data.email)
  const phone = text(data.phone)
  const name = [first, last].filter(Boolean).join(' ') || email || 'Untitled'
  const band = scoreBandLabel(text(data.tier)) || 'Not scored'
  const score = data.score == null || data.score === '' ? '—' : String(data.score)
  const when = localWhen(data.meetingStartAt, 'not booked')
  const booked = when !== 'not booked' || data.status === 'booked'
  const calendly = text(data.calendlyEventUri)
  const reasons = explainReasons(data.reasons).slice(0, 4)
  const action = nextAction({
    status: text(data.status),
    tier: text(data.tier),
    meetingStartAt: text(data.meetingStartAt),
    nextFollowUpAt: text(data.nextFollowUpAt),
    outcome: text(data.outcome),
  })

  return (
    <section className="cr-dash">
      <header className="cr-dash-head">
        <div>
          <AdminBrand />
          <p className="cr-dash-kicker">Lead summary</p>
          <h2>{name}</h2>
          <p className="cr-dash-note">{text(data.company) || 'No company'}</p>
          <p className="cr-dash-note">Who decides: {data.decisionMakers ? labelFor(DECISION_OPTIONS, text(data.decisionMakers)) : 'Not answered'}</p>
          <p className="cr-dash-note">Why now: {text(data.notes) || 'Not answered'}</p>
        </div>
        <p>
          {band} · score {score}
        </p>
      </header>
      <div className="cr-dash-split">
        <article className="cr-dash-card">
          <h3>Contact</h3>
          <p>{email ? <a href={`mailto:${email}`}>{email}</a> : 'No email'}</p>
          <p>{phone ? <a href={`tel:${phone}`}>{phone}</a> : 'No phone'}</p>
        </article>
        <article className="cr-dash-card">
          <h3>Booking</h3>
          <p>{booked ? when : 'not booked'}</p>
          {calendly.startsWith('http') ? (
            <p>
              <a href={calendly}>Calendly event</a>
            </p>
          ) : null}
        </article>
      </div>
      <article className="cr-dash-card">
        <h3>Next action</h3>
        <p>{action}</p>
        {reasons.length > 0 && (
          <ul>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}
        <p className="cr-dash-note">
          Status: {labelStatus(text(data.status))}. Submitted {localWhen(data.createdAt)}. Last activity {localWhen(data.updatedAt)}.
        </p>
      </article>
    </section>
  )
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function localWhen(value: unknown, empty = '—'): string {
  if (typeof value !== 'string' || !value) return empty
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return empty
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function labelStatus(status: string): string {
  const labels: Record<string, string> = {
    partial: 'Partial',
    complete: 'Complete',
    booked: 'Booked',
    no_show: 'No-show',
    won: 'Won',
    lost: 'Lost',
    nurture: 'Nurture',
  }
  return labels[status] || status || '—'
}
