import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { leadName, salesQueue, type QueueLead } from '@/lib/sales-queue'
import { SalesStatusForm } from './SalesStatusForm'

export async function SalesOverview({ previousLoginAt }: { previousLoginAt?: string | null }) {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'applications',
    sort: '-createdAt',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })
  const queue = salesQueue(found.docs as unknown as QueueLead[], { now: new Date(), previousLoginAt })
  return (
    <section className="cr-dash">
      <header className="cr-dash-head">
        <div>
          <p className="cr-dash-kicker">Pipeline</p>
          <h2>Who needs a next step.</h2>
        </div>
        <Link className="cr-dash-button" href="/admin/collections/applications">
          All applications
        </Link>
      </header>
      <LeadList title="New since you last signed in" leads={queue.fresh} empty="No applications since the previous sign-in." />
      <LeadList title="Qualified, not booked" leads={queue.unbooked} empty="No qualified lead is waiting on a time." />
      <article className="cr-dash-card">
        <h3>Booked calls</h3>
        {queue.booked.length === 0 ? (
          <p className="cr-dash-note">No call is on the calendar.</p>
        ) : (
          <ul>
            {queue.booked.map((lead) => (
              <li key={String(lead.id)}>
                <a href={`/admin/collections/applications/${lead.id}`}>{leadName(lead)}</a>
                <span> {lead.meetingStartAt ? new Date(lead.meetingStartAt).toLocaleString() : 'Time is in the Calendly email'}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
      <article className="cr-dash-card">
        <h3>Review and not yet</h3>
        {queue.nurture.length === 0 ? (
          <p className="cr-dash-note">Nobody is in nurture.</p>
        ) : (
          <ul>
            {queue.nurture.slice(0, 12).map((lead) => (
              <li key={String(lead.id)}>
                <a href={`/admin/collections/applications/${lead.id}`}>{leadName(lead)}</a>
                <span> {lead.tier || lead.status}</span>
                <SalesStatusForm id={String(lead.id)} status={String(lead.status || 'nurture')} />
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}

function LeadList({ title, leads, empty }: { title: string; leads: QueueLead[]; empty: string }) {
  return (
    <article className="cr-dash-card">
      <h3>{title}</h3>
      {leads.length === 0 ? (
        <p className="cr-dash-note">{empty}</p>
      ) : (
        <ul>
          {leads.slice(0, 8).map((lead) => (
            <li key={String(lead.id)}>
              <a href={`/admin/collections/applications/${lead.id}`}>{leadName(lead)}</a>
              <SalesStatusForm id={String(lead.id)} status={String(lead.status || 'nurture')} />
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
