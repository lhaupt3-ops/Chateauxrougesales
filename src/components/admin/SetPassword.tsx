'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetPassword() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const password = String(new FormData(event.currentTarget).get('password') || '')
    const response = await fetch('/api/admin/set-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = (await response.json().catch(() => ({}))) as { error?: string }
    setPending(false)
    if (!response.ok) {
      setError(data.error || 'That password was not saved.')
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  return (
    <section className="cr-dash">
      <p className="cr-dash-kicker">First sign-in</p>
      <h1>Set your password</h1>
      <p className="cr-dash-note">Choose a new password of at least 12 characters. It has to be different from the one you were given. Nothing else in the back office opens until this is done.</p>
      <form onSubmit={onSubmit} className="cr-dash-card">
        <label>
          New password
          <input name="password" type="password" autoComplete="new-password" required minLength={12} />
        </label>
        <button className="cr-dash-button" type="submit" disabled={pending}>
          {pending ? 'Saving' : 'Save password'}
        </button>
        {error && <p className="cr-dash-note">{error}</p>}
      </form>
    </section>
  )
}
