import { Resend } from 'resend'
import { defaultSettings } from './settings'

type EmailInput = {
  to: string | string[]
  subject: string
  text: string
  html: string
  from?: string
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
    await resend.emails.send({
      from,
      to: recipients,
      subject: input.subject,
      text: input.text,
      html: input.html,
    })
    return { sent: true }
  } catch (error) {
    console.error('[email] send failed', error)
    return { sent: false }
  }
}

export function emailShell(body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f7f3ee;color:#111114;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="letter-spacing:0.14em;text-transform:uppercase;font-size:12px;font-family:Arial,sans-serif;color:#b3122e;">Chateaux Rouge</p>
    ${body}
  </div></body></html>`
}
