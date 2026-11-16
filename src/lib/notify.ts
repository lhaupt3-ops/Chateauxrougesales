import type { ApplicationDoc } from './apply-server'
import { applicantEmail, ownerEmail, type ApplicantKind, type OwnerKind } from './email-messages'
import type { RequestedGuide } from './guide-link'
import { sendEmail } from './email'
import { getSettings } from './settings'

export async function notifyApplication(doc: ApplicationDoc, kind: OwnerKind, guide?: RequestedGuide) {
  const settings = await getSettings()
  const to = process.env.NOTIFY_EMAIL || settings.notifyEmail
  const message = ownerEmail(doc, kind, guide)
  await sendEmail({
    to,
    from: settings.resendFrom,
    replyTo: message.replyTo || settings.contactEmail || settings.notifyEmail || settings.resendFrom,
    subject: message.subject,
    text: message.text,
    html: message.html,
  })
}

export async function notifyApplicant(doc: ApplicationDoc, kind: ApplicantKind, guide?: RequestedGuide) {
  const email = String(doc.email || '')
  if (!email) return
  const settings = await getSettings()
  const message = applicantEmail(doc, kind, guide)
  await sendEmail({
    to: email,
    from: settings.resendFrom,
    replyTo: settings.contactEmail || settings.notifyEmail || process.env.NOTIFY_EMAIL || settings.resendFrom,
    subject: message.subject,
    text: message.text,
    html: message.html,
  })
}
