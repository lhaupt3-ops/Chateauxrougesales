/**
 * The v1 offer, in one place.
 *
 * Founder-led: one person installs the process and runs the calls. A team is a later step,
 * and the site says so. Numbers stay empty until the founder picks them. An empty value
 * renders as "To be confirmed" and the sentences that depend on it are left out.
 *
 * The setup fee and the commission percentage live in Site settings (setupFeeLabel,
 * commissionLabel and their placeholder flags). Only the audit fee and the two terms
 * below are kept here, so no database change is needed to publish them.
 */
export const OFFER = {
  /** Example once chosen: '$750'. */
  auditFee: '',
  /** Days after the audit in which its fee counts toward the setup fee. null = no credit stated. */
  auditCreditDays: null as number | null,
  /** Example once chosen: '60 days'. */
  pilotLength: '',
}

export function auditFeeLabel(): string {
  return OFFER.auditFee.trim() || 'To be confirmed'
}

export function auditCreditSentence(): string {
  return OFFER.auditCreditDays
    ? `If you go on to a pilot within ${OFFER.auditCreditDays} days, the audit fee counts toward the setup fee.`
    : ''
}

export function pilotLengthLabel(): string {
  return OFFER.pilotLength.trim() || 'To be confirmed'
}
