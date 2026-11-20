import { Resend } from 'resend'
import { defaultSettings } from './settings'

type EmailInput = {
  to: string | string[]
  subject: string
  text: string
  html: string
  from?: string
  replyTo?: string
  headers?: Record<string, string>
}

export async function sendEmail(input: EmailInput): Promise<{ sent: boolean; skipped?: boolean }> {
  const recipients = (Array.isArray(input.to) ? input.to : [input.to]).filter(Boolean)
  if (!recipients.length) {
    console.info('[email] no recipient', input.subject)
    return { sent: false, skipped: true }
  }

  const key = process.env.RESEND_API_KEY
  const from = input.from || process.env.RESEND_FROM || defaultSettings.resendFrom
  if (!key) {
    console.info('[email] RESEND_API_KEY missing. Message not sent.', {
      to: recipients,
      subject: input.subject,
      text: input.text,
    })
    return { sent: false, skipped: true }
  }

  try {
    const resend = new Resend(key)
    const text = input.text?.trim() || input.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const { data, error } = await resend.emails.send({
      from,
      to: recipients,
      subject: input.subject,
      text,
      html: input.html,
      replyTo: input.replyTo || undefined,
      headers: input.headers,
    })
    if (error || !data?.id) {
      console.error('[email] send failed', error)
      return { sent: false }
    }
    console.info(`[email] sent ${data.id}`)
    return { sent: true }
  } catch (error) {
    console.error('[email] send failed', error)
    return { sent: false }
  }
}
