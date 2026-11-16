export type Faq = { question: string; answer: string }

export const fallbackFaqs: Record<string, Faq[]> = {
  home: [
    {
      question: 'Will the closers sound like my brand?',
      answer:
        'They sell from your offer document, your call recordings and your rules. You hear real calls in the first weeks and you can pull a closer who does not fit. We do not use a generic script and hope you like it.',
    },
    {
      question: 'What if they are pushy?',
      answer:
        'Pressure is a failed call, not a style. Call review is part of the management. What happens to a closer who does not fit is written in the agreement, not invented on this page.',
    },
    {
      question: 'Who owns the data and the recordings?',
      answer:
        'You do. The CRM stays yours, the notes stay yours, and the recordings stay yours if you leave. The exact wording is in the written agreement.',
    },
    {
      question: 'How fast can this be live?',
      answer:
        'To be confirmed. We will not print a start date until it is a date we can keep.',
    },
    {
      question: 'What does it cost?',
      answer:
        'A one-off setup fee, then commission on cash collected. There is no monthly retainer. The setup amount and the commission percentage are to be confirmed in the written agreement.',
    },
    {
      question: 'What do I need in place?',
      answer:
        'An offer you have already sold, a price that can carry a team, and a way to deliver if more people say yes. If the conversations are not there yet, say so. We would rather add setters than pretend the calls exist.',
    },
    {
      question: 'Do you only close, or do you book the calls too?',
      answer:
        'Both, under one sales lead. Setters book and qualify. Closers run the conversations. Follow-up on no-shows and maybes is part of the same system.',
    },
    {
      question: 'What if a closer is a bad fit?',
      answer:
        'The agreement is the place for that promise. We will not print a replacement guarantee here until it is wording we can keep. We do not promise revenue.',
    },
    {
      question: 'Is this a long contract?',
      answer:
        'The term and the notice period are in the written agreement. Until that agreement exists, both are to be confirmed.',
    },
    {
      question: 'Who is this not for?',
      answer:
        'Offers that have never sold, prices too small to carry a team, and anyone who wants a promised close rate. Job seekers use Careers, so this page can stay about buying.',
    },
  ],
  pricing: [
    {
      question: 'Why not publish one price?',
      answer:
        'The fee moves with the offer, the lead flow and how much of the function we take. We publish the model now. A starting figure appears here only after it is a number we will honour.',
    },
    {
      question: 'Do you work commission only?',
      answer:
        'Commission on cash collected is part of the model, after a one-off setup fee. The amounts are to be confirmed in the written agreement.',
    },
    {
      question: 'What is the sales audit?',
      answer:
        'A paid review of the offer, the calls and the follow-up, for founders who want a diagnosis before a team.',
    },
  ],
}

export const homeFaqs = fallbackFaqs.home
export const pricingFaqs = fallbackFaqs.pricing
