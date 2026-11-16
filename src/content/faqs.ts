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
        'Pressure that your buyers would resent is a failed call, not a style. Call review is part of the management, and the replacement promise exists so a bad fit does not stay on your calendar.',
    },
    {
      question: 'Who owns the data and the recordings?',
      answer:
        'You do. The CRM stays yours, the notes stay yours, and the recordings stay yours if you leave. The exact wording lives in Site settings and then in the agreement.',
    },
    {
      question: 'How fast can this be live?',
      answer:
        'The working target is the timeline in Site settings, currently written as about 14 days to first covered calls. We will not print a number we have not confirmed with operations.',
    },
    {
      question: 'What does it cost?',
      answer:
        'A setup fee, a monthly management fee, and a commission on cash collected. Management starts at $3,000 a month. The pricing page lists the bands.',
    },
    {
      question: 'What do I need in place?',
      answer:
        'An offer you have already sold, a price that can carry a professional team, and a way to deliver if sales pick up. Lead flow helps. If you do not have it, say so. We would rather add setters than pretend the calls exist.',
    },
    {
      question: 'Do you only close, or do you book the calls too?',
      answer:
        'Both, under one sales lead. Setters book and qualify. Closers run the conversations. Follow-up on no-shows and maybes is part of the same system.',
    },
    {
      question: 'What if a closer is a bad fit?',
      answer:
        'We replace a closer who is not a fit. That is a replacement promise, not a revenue promise. The wording you can rely on is the agreement.',
    },
    {
      question: 'Is this a long contract?',
      answer:
        'The working shape is an initial term, then month to month. The notice period is the one written into the agreement.',
    },
    {
      question: 'Who is this not for?',
      answer:
        'Offers under $1,000, pre-revenue businesses with no sales conversations, and anyone looking for a closer job. Careers has its own page so this one can stay about buying.',
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
        'Commission is part of the model. It is not the whole model. Management, call review and replacement have a cost even in a quiet month.',
    },
    {
      question: 'What is the sales audit?',
      answer:
        'A paid review of the offer, the calls and the follow-up, for founders who want a diagnosis before a team. It is the smaller door in, not a trick into a retainer.',
    },
  ],
}

export const homeFaqs = fallbackFaqs.home
export const pricingFaqs = fallbackFaqs.pricing
