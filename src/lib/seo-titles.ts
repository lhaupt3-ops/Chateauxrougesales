export type SeoEntry = { title: string; description: string }

export const SEO = {
  home: {
    title: 'Outsourced high-ticket closing for founders | Chateaux Rouge',
    description: 'A managed sales team for founders who still take the sales calls. Setters, closers and a lead. You keep the offer, the data and the recordings.',
  },
  services: {
    title: 'Sales teams for founders who still close | Chateaux Rouge',
    description: 'Done-for-you sales teams, high-ticket closers, appointment setting and a sales audit. One unit for founders outsourcing the calls.',
  },
  who: {
    title: 'Founders we install a sales team for | Chateaux Rouge',
    description: 'Outsourced closing for coaches, course creators, and agencies or B2B firms who already sell a high-ticket offer and want off the calls.',
  },
  how: {
    title: 'How founders hand the calls to a team | Chateaux Rouge',
    description: 'How a managed sales team is installed for a founder, and how the closers run a buyer call: listen, qualify, then decide.',
  },
  pricing: {
    title: 'What founders pay to outsource closing | Chateaux Rouge',
    description: 'A one-off setup fee, then commission on cash collected. For founders hiring a team. The amounts are confirmed in the written agreement.',
  },
  results: {
    title: 'Results for founders who outsource sales | Chateaux Rouge',
    description: 'Named client results for founders who hired an outsourced sales team. Published only with permission, a metric, and a time window.',
  },
  about: {
    title: 'How we sell for founders who hire us | Chateaux Rouge',
    description: 'The standard on our calls and on the calls we run for founders. No fake urgency, no invented results, and a no is an acceptable answer.',
  },
  compare: {
    title: 'Outsourced or in-house sales, for founders | Chateaux Rouge',
    description: 'Outsourced versus in-house, setter versus closer, and a managed team versus a freelance closer. Written for founders deciding who should sell.',
  },
  blog: {
    title: 'Notes for founders hiring closers | Chateaux Rouge',
    description: 'Essays for founders outsourcing sales: closer pay, hiring, show rate, and when a team is too early. Not written for job seekers.',
  },
  resources: {
    title: 'Read before you outsource your sales | Chateaux Rouge',
    description: 'A free guide for founders deciding whether to hire closers, plus a one-page scorecard you can print after leaving an email.',
  },
  guide: {
    title: 'Ready for closers? A founder self-audit | Chateaux Rouge',
    description: 'A free guide for founders thinking about setters and closers. Two conversations, eight yes or no checks, and the red flags that mean you should wait.',
  },
  careers: {
    title: 'We staff sales teams. Not a job board | Chateaux Rouge',
    description: 'This page is not a listing for people looking for closer jobs. Founders who want a team start with the application, not a careers form.',
  },
  privacy: {
    title: 'Privacy for founders using this site | Chateaux Rouge',
    description: 'How personal information from founders is handled on this site, under the Australian Privacy Principles. Commercial terms live in the agreement.',
  },
  terms: {
    title: 'Terms for founders using this site | Chateaux Rouge',
    description: 'Terms for founders using the Chateaux Rouge website. The price of a sales team is confirmed only in a written agreement, not on these pages.',
  },
  apply: {
    title: 'See if a sales team fits your offer | Chateaux Rouge',
    description: 'A short application for founders outsourcing sales. We look for an honest fit. A no is a useful answer, and a call opens only if the fit is there.',
  },
  search: {
    title: 'Search notes on hiring a sales team | Chateaux Rouge',
    description: 'Search essays and service pages written for founders who are hiring closers or outsourcing a high-ticket sales team.',
  },
  book: {
    title: 'Book a fit call about your sales team | Chateaux Rouge',
    description: 'Pick a time to talk about whether an outsourced sales team fits. For founders. A no is a fine outcome.',
  },
  confirmed: {
    title: 'Your sales-team call is booked | Chateaux Rouge',
    description: 'The call is booked. Add it to your calendar and come ready to decide whether an outsourced team is a fit.',
  },
  next: {
    title: 'Your next step before hiring closers | Chateaux Rouge',
    description: 'A plain next step for founders. The free guide is open to read, and you can reapply when the offer and the conversations are real.',
  },
  scorecard: {
    title: 'Closer readiness scorecard for founders | Chateaux Rouge',
    description: 'A one-page scorecard for founders. Eight yes or no checks from the free guide, a score, and what that score means before you hire a closer.',
  },
} as const satisfies Record<string, SeoEntry>

export function brandTitle(phrase: string): string {
  const titled = phrase.includes('|') ? phrase : `${phrase} | Chateaux Rouge`
  return titled.length <= 60 ? titled : titled.slice(0, 60).trim()
}
