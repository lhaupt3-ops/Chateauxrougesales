/**
 * The confirmed v1 offer, in one place.
 *
 * Founder-led: one person installs the process and runs the calls. A team is a later step,
 * and the site says so. Audit and setup are free. Commission is 10% of cash collected.
 * There is no retainer and no audit credit, because there is nothing to credit.
 *
 * Site settings can still override the setup fee and commission labels when their
 * placeholder flags are off and a real label is saved. Until then, and on a preview
 * that shares the production database, these values are what the site shows.
 * Pilot length and notice stay empty until they are chosen.
 */
export const OFFER = {
  /** Shown on the audit step. */
  auditFee: 'Free',
  /** Shown as the setup fee when Site settings are still a placeholder. */
  setupFee: 'Free',
  /** Shown as the commission when Site settings are still a placeholder. */
  commission: '10% of cash collected',
  /** Example once chosen: '60 days'. */
  pilotLength: '',
}

export function isUnsetLabel(value: string | null | undefined): boolean {
  if (!value || !value.trim()) return true
  return /^\s*placeholder\b/i.test(value) || /^\s*to be confirmed\b/i.test(value)
}

export function publishedLabel(stored: string, isPlaceholder: boolean, fallback: string): string {
  const trimmed = stored.trim()
  if (!isPlaceholder && trimmed && !isUnsetLabel(trimmed)) return trimmed
  return fallback.trim()
}

export function labelIsPublished(stored: string, isPlaceholder: boolean, fallback: string): boolean {
  return !isUnsetLabel(publishedLabel(stored, isPlaceholder, fallback))
}

export function auditFeeLabel(): string {
  return OFFER.auditFee
}

export function pilotLengthLabel(): string {
  return OFFER.pilotLength.trim() || 'Set in the agreement'
}
