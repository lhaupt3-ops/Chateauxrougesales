'use client'

import { useState } from 'react'
import { SALES_STATUSES } from '@/lib/sales-queue'

const LABELS: Record<string, string> = {
  booked: 'Booked',
  no_show: 'No-show',
  won: 'Won',
  lost: 'Lost',
  nurture: 'Nurture',
}

export function SalesStatusForm({ id, status }: { id: string; status: string }) {
  const [message, setMessage] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = String(new FormData(event.currentTarget).get('status') || '')
    const response = await fetch('/api/admin/lead-status', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status: next }),
    })
    const data = (await response.json().catch(() => ({}))) as { error?: string }
    if (!response.ok) {
      setMessage(data.error || 'Not saved.')
      return
    }
    setMessage('Saved.')
  }

  return (
    <form onSubmit={onSubmit}>
      <select name="status" defaultValue={SALES_STATUSES.includes(status as (typeof SALES_STATUSES)[number]) ? status : 'nurture'}>
        {SALES_STATUSES.map((value) => (
          <option key={value} value={value}>
            {LABELS[value]}
          </option>
        ))}
      </select>
      <button type="submit">Update</button>
      {message && <span>{message}</span>}
    </form>
  )
}
