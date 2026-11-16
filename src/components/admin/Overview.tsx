import { getPayloadClient } from '@/lib/payload'
import { headers } from 'next/headers'
import { groupConversions, recentLeads, windowsFor, funnelFromCounts, funnelIsThin, type LeadDoc } from '@/lib/admin-metrics'
import { roleOf } from '@/access/roles'
import { getSettings } from '@/lib/settings'
import { EditorOverview } from './EditorOverview'
import { SalesOverview } from './SalesOverview'
import { loadPostHogFunnel } from '@/lib/posthog-funnel'
import { AdminBrand } from './Logo'

const LINKS = [
  ['/admin/collections/applications', 'Applications'],
  ['/admin/collections/posts', 'Journal'],
  ['/admin/collections/case-studies', 'Case studies'],
  ['/admin/collections/resources', 'Resources'],
  ['/admin/collections/faqs', 'FAQs'],
  ['/admin/collections/media', 'Media'],
  ['/admin/globals/site-settings', 'Site settings'],
]

export default async function Overview() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  const role = roleOf(user)
  if (role === 'editor') return <EditorOverview />
  if (role === 'sales') return <SalesOverview previousLoginAt={(user as { previousLoginAt?: string | null } | null)?.previousLoginAt} />
  return <AdminOverview />
}

async function AdminOverview() {
  const now = new Date()
  const since = new Date(now.getTime() - 60 * 86400000)
  let docs: LeadDoc[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'applications',
      where: {
        or: [{ createdAt: { greater_than: since.toISOString() } }, { bookedAt: { greater_than: since.toISOString() } }],
      },
      sort: '-createdAt',
      limit: 2000,
      depth: 0,
      overrideAccess: true,
    })
    docs = result.docs as unknown as LeadDoc[]
  } catch (error) {
    console.error('[admin] metrics', error)
  }

  const windows = windowsFor(docs, now)
  const monthStart = new Date(now.getTime() - 30 * 86400000)
  const sources = groupConversions(docs, 'utmSource', monthStart, now)
  const pages = groupConversions(docs, 'landingPage', monthStart, now)
  const leads = recentLeads(docs)
  const posthog = await loadPostHogFunnel()
  const funnel = funnelFromCounts(posthog.counts, posthog.steps)

  return (
    <section className="cr-dash">
      <header className="cr-dash-head">
        <div>
          <AdminBrand />
          <p className="cr-dash-kicker">Overview</p>
          <h2>The funnel, without opening another tab.</h2>
        </div>
        <a className="cr-dash-button" href="https://us.posthog.com/project/739809/dashboard/2361061">
          Open PostHog dashboard
        </a>
      </header>

      <div className="cr-dash-windows">
        {windows.map((window) => (
          <article key={window.label} className="cr-dash-card">
            <h3>{window.label}</h3>
            <dl>
              <Metric label="New leads" value={window.leads} delta={window.deltas.leads} />
              <Metric label="Partial" value={window.partial} />
              <Metric label="Completed" value={window.completed} delta={window.deltas.completed} />
              <Metric label="Qualified" value={window.qualified} />
              <Metric label="Review" value={window.review} />
              <Metric label="Not yet" value={window.notYet} />
              <Metric label="Calls booked" value={window.booked} delta={window.deltas.booked} />
              <Metric label="Booking rate" value={window.bookingRate == null ? '—' : pct(window.bookingRate)} delta={window.deltas.bookingRate} />
              <Metric label="Canceled" value={window.canceled || '—'} />
              <Metric label="No-show" value={window.noShow || '—'} />
              <Metric label="Median time to book" value={window.medianHoursToBook == null ? '—' : `${window.medianHoursToBook.toFixed(1)} h`} />
            </dl>
            {window.canceled === 0 && window.noShow === 0 && <p className="cr-dash-note">Show and cancel stay blank until a booking is marked canceled or no-show.</p>}
          </article>
        ))}
      </div>

      <article className="cr-dash-card">
        <h3>Visit to booked, last 30 days</h3>
        {!posthog.available ? (
          <p className="cr-dash-note">PostHog is off ({posthog.reason}) The cards above still come from the application database.</p>
        ) : funnelIsThin(funnel) ? (
          <p className="cr-dash-note">
            Not enough data yet. {funnel[0]?.people ?? 0} visits in the last 30 days. Drop-off shows once there are about 20.
          </p>
        ) : (
          <ol className="cr-funnel">
            {funnel.map((step) => (
              <li key={step.label}>
                <span>{step.label}</span>
                <strong>{step.people}</strong>
                <em>{step.dropOff == null || step.people === 0 ? '' : `${Math.round(step.dropOff * 100)}% drop`}</em>
                <i style={{ width: `${bar(step.people, funnel[0].people)}%` }} />
              </li>
            ))}
          </ol>
        )}
      </article>

      <div className="cr-dash-split">
        <Table title="By source, 30 days" rows={sources} />
        <Table title="By landing page, 30 days" rows={pages} />
      </div>

      <article className="cr-dash-card">
        <h3>Recent leads</h3>
        <table className="cr-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Status</th>
              <th>Tier</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={4}>No applications in the last 60 days.</td>
              </tr>
            )}
            {leads.map((lead) => (
              <tr key={String(lead.id)}>
                <td>{[lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.email || 'Untitled'}</td>
                <td>{lead.status || '—'}</td>
                <td>{lead.tier ? <span className={`cr-badge cr-badge-${lead.tier}`}>{labelTier(lead.tier)}</span> : '—'}</td>
                <td>
                  <a href={`/admin/collections/applications/${lead.id}`}>Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article className="cr-dash-card">
        <h3>Email</h3>
        <EmailHealth />
      </article>

      <nav className="cr-dash-links" aria-label="Collections">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </section>
  )
}

function Metric({ label, value, delta }: { label: string; value: number | string; delta?: number | null }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {value}
        {delta != null && <small className={delta < 0 ? 'is-down' : 'is-up'}>{delta === 0 ? ' 0%' : ` ${delta > 0 ? '+' : ''}${Math.round(delta * 100)}%`}</small>}
      </dd>
    </div>
  )
}

function Table({ title, rows }: { title: string; rows: { label: string; leads: number; completed: number; booked: number }[] }) {
  return (
    <article className="cr-dash-card">
      <h3>{title}</h3>
      <table className="cr-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Leads</th>
            <th>Completed</th>
            <th>Booked</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4}>Nothing recorded in this window.</td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.leads}</td>
              <td>{row.completed}</td>
              <td>{row.booked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}

function pct(value: number): string {
  return `${Math.round(value * 100)}%`
}

function bar(value: number, max: number): number {
  if (!max) return 0
  return Math.max(4, Math.round((value / max) * 100))
}

async function EmailHealth() {
  const settings = await getSettings()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'applications',
    where: { sequenceKind: { in: ['nurture', 'partial', 'qualified'] } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })
  let sent = 0
  let unsubscribed = 0
  for (const doc of result.docs) {
    if (doc.emailUnsubscribed) unsubscribed += 1
    if (Array.isArray(doc.sequenceLog)) sent += doc.sequenceLog.length
  }
  return (
    <p className="cr-dash-note">
      {settings.nurtureEnabled
        ? `Nurture is on. ${sent} sequence emails are logged, and ${unsubscribed} of these addresses are unsubscribed.`
        : `Nurture is off, so nothing is going to real leads. ${sent} earlier sends are logged. Turn it on in Site settings after you have read the copy.`}
    </p>
  )
}

function labelTier(tier: string): string {
  if (tier === 'not_yet') return 'Not yet'
  if (tier === 'qualified') return 'Qualified'
  if (tier === 'review') return 'Review'
  return tier
}
