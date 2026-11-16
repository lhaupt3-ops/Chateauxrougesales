'use client'

import { fitGroups } from '@/lib/lead-desk'
import { useFormData } from './useFormData'

export default function FitAnswers() {
  const groups = fitGroups(useFormData())
  return (
    <div className="cr-dash">
      {groups.map((group) => (
        <article key={group.title} className="cr-dash-card">
          <h3>{group.title}</h3>
          <dl>
            {group.rows.map((row) => (
              <div key={row.question}>
                <dt>{row.question}</dt>
                <dd>{row.answer}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
      <p className="cr-dash-note">These labels are read-only. The stored keys sit in Raw stored answers if you need them.</p>
    </div>
  )
}
