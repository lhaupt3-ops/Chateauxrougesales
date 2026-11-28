import { BRAND_LOCKUP_DARK_URL, BRAND_LOCKUP_LIGHT_URL, CHARCOAL, IVORY, ROUGE } from './brand'
import { absoluteUrl, SITE_NAME } from './site'

const INK = CHARCOAL
const STONE = '#e7e1d8'
const MUTED = '#5c5852'
const WHITE = '#ffffff'
const SERIF = "Inter, 'Helvetica Neue', Arial, sans-serif"
const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif"

export type EmailLink = { label: string; href: string }
export type EmailRow = { label: string; value: string }

export type BrandedEmail = {
  preheader: string
  eyebrow?: string
  heading: string
  paragraphs?: string[]
  rows?: EmailRow[]
  bullets?: string[]
  cta?: EmailLink
}

const FOOTER_LINKS: EmailLink[] = [
  { label: 'Home', href: absoluteUrl('/') },
  { label: 'How I charge', href: absoluteUrl('/pricing') },
  { label: 'Privacy', href: absoluteUrl('/privacy') },
  { label: 'Terms', href: absoluteUrl('/terms') },
]

export function renderEmail(email: BrandedEmail): { html: string; text: string } {
  return { html: renderHtml(email), text: renderText(email) }
}

export function plainTextFromHtml(html: string): string {
  return decode(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<head[\s\S]*?<\/head>/gi, '')
      .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_match, href: string, label: string) => {
        const text = stripTags(label).trim()
        return text && text !== href ? `${text} (${href})` : href
      })
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>|<\/h1>|<\/h2>|<\/li>|<\/tr>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function renderHtml(email: BrandedEmail): string {
  const logo = BRAND_LOCKUP_LIGHT_URL
  const footerLogo = BRAND_LOCKUP_DARK_URL
  const paragraphs = (email.paragraphs || [])
    .map(
      (paragraph) =>
        `<p class="email-muted" style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.6;color:${MUTED};">${escapeHtml(paragraph)}</p>`,
    )
    .join('')
  const rows = email.rows?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border-collapse:collapse;">${email.rows
        .map(
          (row) => `<tr>
            <td class="email-muted" style="padding:8px 12px 8px 0;font-family:${SANS};font-size:13px;line-height:1.4;color:${MUTED};vertical-align:top;width:38%;">${escapeHtml(row.label)}</td>
            <td class="email-ink" style="padding:8px 0;font-family:${SANS};font-size:14px;line-height:1.4;color:${INK};vertical-align:top;">${escapeHtml(row.value)}</td>
          </tr>`,
        )
        .join('')}</table>`
    : ''
  const bullets = email.bullets?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${email.bullets
        .map(
          (item) =>
            `<tr><td valign="top" style="padding:0 8px 8px 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${ROUGE};">•</td><td class="email-muted" style="padding:0 0 8px;font-family:${SANS};font-size:14px;line-height:1.5;color:${MUTED};">${escapeHtml(item)}</td></tr>`,
        )
        .join('')}</table>`
    : ''
  const cta = email.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 8px;"><tr><td bgcolor="${ROUGE}" style="border-radius:999px;background:${ROUGE};">
        <a href="${escapeAttr(email.cta.href)}" style="display:inline-block;padding:14px 22px;font-family:${SANS};font-size:14px;font-weight:700;line-height:1;color:${WHITE};text-decoration:none;border-radius:999px;">${escapeHtml(email.cta.label)}</a>
      </td></tr></table>`
    : ''
  const footerLinks = FOOTER_LINKS.map(
    (link) =>
      `<a href="${escapeAttr(link.href)}" style="color:${IVORY};text-decoration:underline;">${escapeHtml(link.label)}</a>`,
  ).join('<span style="color:#8a8178;"> &nbsp;·&nbsp; </span>')

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(email.heading)}</title>
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  @media (prefers-color-scheme: dark) {
    .email-bg { background-color: #1a1412 !important; }
    .email-card { background-color: #2a211e !important; border-color: #3d312c !important; }
    .email-ink { color: #F6F3EE !important; }
    .email-muted { color: #d9cfc4 !important; }
    .email-footer { background-color: #1C1C1C !important; }
    .email-logo-light { background-color: #F6F3EE !important; }
    .email-logo-dark { background-color: #1C1C1C !important; }
  }
  [data-ogsc] .email-bg { background-color: #1a1412 !important; }
  [data-ogsc] .email-card { background-color: #2a211e !important; }
  [data-ogsc] .email-ink { color: #F6F3EE !important; }
  [data-ogsc] .email-muted { color: #d9cfc4 !important; }
  [data-ogsc] .email-logo-light { background-color: #F6F3EE !important; }
  [data-ogsc] .email-logo-dark { background-color: #1C1C1C !important; }
</style>
</head>
<body class="email-bg" style="margin:0;padding:0;background:${IVORY};color:${INK};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(email.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-bg" bgcolor="${IVORY}" style="background:${IVORY};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" class="email-card" bgcolor="${WHITE}" style="width:560px;max-width:560px;background:${WHITE};border:1px solid ${STONE};border-radius:24px;">
        <tr>
          <td class="email-logo-light" bgcolor="${IVORY}" style="padding:28px 32px 4px;background:${IVORY};">
            <img src="${escapeAttr(logo)}" width="240" height="56" alt="Chateaux Rouge" style="display:block;border:0;width:240px;height:56px;background:${IVORY};">
          </td>
        </tr>
        ${
          email.eyebrow
            ? `<tr><td style="padding:18px 32px 0;font-family:${SANS};font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${ROUGE};">${escapeHtml(email.eyebrow)}</td></tr>`
            : ''
        }
        <tr>
          <td class="email-ink" style="padding:8px 32px 0;font-family:${SERIF};font-size:32px;font-weight:800;letter-spacing:-0.025em;line-height:1.15;color:${INK};">${escapeHtml(email.heading)}</td>
        </tr>
        <tr>
          <td style="padding:16px 32px 8px;">
            ${paragraphs}
            ${rows}
            ${bullets}
            ${cta}
          </td>
        </tr>
        <tr>
          <td class="email-footer email-logo-dark" bgcolor="${INK}" style="padding:22px 32px;background:${INK};border-radius:0 0 24px 24px;">
            <img src="${escapeAttr(footerLogo)}" width="192" height="45" alt="Chateaux Rouge" style="display:block;border:0;width:192px;height:45px;background:${INK};margin:0 0 12px;">
            <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${IVORY};">${footerLinks}</p>
          </td>
        </tr>
      </table>
      <p class="email-muted" style="margin:16px 0 0;font-family:${SANS};font-size:11px;line-height:1.5;color:${MUTED};">You are receiving this because of an application or account at ${escapeHtml(SITE_NAME)}.</p>
    </td>
  </tr>
</table>
</body>
</html>`
}

function renderText(email: BrandedEmail): string {
  const lines = [SITE_NAME, '', email.heading, '']
  for (const paragraph of email.paragraphs || []) lines.push(paragraph, '')
  for (const row of email.rows || []) lines.push(`${row.label}: ${row.value}`)
  if (email.rows?.length) lines.push('')
  for (const item of email.bullets || []) lines.push(`- ${item}`)
  if (email.bullets?.length) lines.push('')
  if (email.cta) lines.push(email.cta.label, email.cta.href, '')
  lines.push(SITE_NAME)
  for (const link of FOOTER_LINKS) lines.push(`${link.label}: ${link.href}`)
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(value: string): string {
  return escapeHtml(value)
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, '')
}

function decode(value: string): string {
  return value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
}
