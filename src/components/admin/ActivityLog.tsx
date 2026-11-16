'use client'

import { sequenceActivity } from '@/lib/lead-desk'
import { useFormData } from './useFormData'

export default function ActivityLog() {
  const data = useFormData()
  const rows = sequenceActivity(data.sequenceLog).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  return (
    <section className="cr-dash-card">
      <h3>Emails sent</h3>
      {rows.length === 0 ? (
        <p className="cr-dash-note">No sequence email has been logged for this lead. Nurture stays off until an admin turns it on.</p>
      ) : (
        <ul>
          {rows.map((row) => (
            <li key={`${row.at}-${row.text}`}>
              {new Date(row.at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} — {row.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
