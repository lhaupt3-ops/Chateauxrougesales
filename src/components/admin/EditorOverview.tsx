import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { contentDesk, type DeskPost } from '@/lib/content-health'
import { loadContentAttention } from '@/lib/posthog-funnel'

export async function EditorOverview() {
  const payload = await getPayloadClient()
  const found = await payload.find({
    collection: 'posts',
    draft: true,
    depth: 0,
    limit: 100,
    overrideAccess: true,
    sort: '-updatedAt',
  })
  const desk = contentDesk(found.docs as unknown as DeskPost[], new Date())
  const attention = await loadContentAttention()
  return (
    <section className="cr-dash">
      <header className="cr-dash-head">
        <div>
          <p className="cr-dash-kicker">Journal</p>
          <h2>What still needs a pass.</h2>
        </div>
      </header>
      <nav className="cr-dash-links" aria-label="Create">
        <Link href="/admin/collections/posts/create">New post</Link>
        <Link href="/admin/collections/media">Media</Link>
        <Link href="/admin/globals/email-sequences">Email sequences</Link>
      </nav>
      <div className="cr-dash-split">
        <List title="Drafts in progress" rows={desk.drafts.map((post) => post.title || 'Untitled')} empty="No drafts." />
        <List title="Scheduled" rows={desk.scheduled.map((post) => post.title || 'Untitled')} empty="Nothing scheduled." />
      </div>
      <List title="Published in the last 14 days" rows={desk.recent.map((post) => post.title || 'Untitled')} empty="No recent publishes." />
      <article className="cr-dash-card">
        <h3>Missing before publish</h3>
        {desk.missing.length === 0 ? (
          <p className="cr-dash-note">Meta title, description, cover, alt text, call to action, and an internal link are filled in on the posts loaded here.</p>
        ) : (
          <ul>
            {desk.missing.slice(0, 12).map((post) => (
              <li key={String(post.id)}>
                <a href={`/admin/collections/posts/${post.id}`}>{post.title}</a>
                <span> {post.gaps.join(', ')}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
      <article className="cr-dash-card">
        <h3>Last 30 days</h3>
        {attention.available ? (
          <>
            <p>Top journal pages</p>
            <ul>
              {attention.pages.length === 0 && <li>No journal pageviews yet.</li>}
              {attention.pages.map((page) => (
                <li key={page.path}>
                  {page.path} · {page.views}
                </li>
              ))}
            </ul>
            <p>Guide opt-ins</p>
            <ul>
              {attention.optins.length === 0 && <li>No guide opt-ins yet.</li>}
              {attention.optins.map((row) => (
                <li key={row.resource}>
                  {row.resource} · {row.count}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="cr-dash-note">PostHog is off ({attention.reason})</p>
        )}
      </article>
    </section>
  )
}

function List({ title, rows, empty }: { title: string; rows: string[]; empty: string }) {
  return (
    <article className="cr-dash-card">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="cr-dash-note">{empty}</p>
      ) : (
        <ul>
          {rows.slice(0, 8).map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      )}
    </article>
  )
}
