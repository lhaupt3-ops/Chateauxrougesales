export type Faq = { question: string; answer: string }

export const fallbackFaqs: Record<string, Faq[]> = {
  home: [
    {
      question: 'Is it just you?',
      answer:
        'Yes, for now. I install the process and take the calls myself. If the work grows I may add closers or setters, and I would tell you before anyone else joined your calls.',
    },
    {
      question: 'Will you sound like my brand?',
      answer:
        'I work from your offer document and your own call recordings, not a generic script. You hear the early calls, and you can change what I say or stop at any point. I tell buyers I am working with you. I do not pretend to be an employee or invent a title.',
    },
    {
      question: 'What if you come across as pushy?',
      answer:
        'Pressure is a failed call. You get the recordings, so you can hear for yourself. I would rather lose a sale than win one the buyer regrets.',
    },
    {
      question: 'Who owns the data and the recordings?',
      answer:
        'You do. The CRM stays yours, the notes stay yours, and the recordings stay yours if we stop. The exact wording is in the written agreement.',
    },
    {
      question: 'How fast can this be live?',
      answer:
        'After I have seen your offer and a few calls I will give you a date in writing, and only one I can keep.',
    },
    {
      question: 'What does it cost?',
      answer:
        'There is no upfront fee. The sales audit is free if you want a diagnosis first. On a pilot I am paid 10% of the cash I help collect. There is no monthly retainer. Pilot length and notice are confirmed in the written agreement.',
    },
    {
      question: 'What do I need in place?',
      answer:
        'An offer you have already sold, a price that can pay for the work, calls that are already booked or about to be, and a way to deliver if more people say yes. If the conversations are not there yet, I will say so instead of starting a pilot.',
    },
    {
      question: 'Do you book the calls as well as run them?',
      answer:
        'No. I take the calls that are booked. Appointment setting and lead generation are not part of what I offer today. They may come later, with other people.',
    },
    {
      question: 'What if it is not working?',
      answer:
        'The pilot has a defined length, and either of us can stop on the notice in the written agreement. I do not promise revenue. If the first calls show the offer or the lead flow is the problem, I will tell you that plainly.',
    },
    {
      question: 'Is this a long contract?',
      answer:
        'The pilot length and the notice period are in the written agreement.',
    },
    {
      question: 'Who is this not for?',
      answer:
        'Offers that have never sold, prices too small to pay for the work, and anyone who wants a promised close rate. Job seekers use Careers, so this page can stay about buying.',
    },
  ],
  pricing: [
    {
      question: 'Is the audit really free?',
      answer:
        'Yes. You get a written brief and a call to talk it through. You do not have to continue after it, and I do not charge a setup fee if you do.',
    },
    {
      question: 'Why is there no setup fee?',
      answer:
        'I am paid 10% of the cash I help collect. The install work is part of the pilot. If that ever changes, this page will change first.',
    },
    {
      question: 'Is there a monthly retainer?',
      answer:
        'No. There is no upfront fee and no retainer. If that changes, this page changes first.',
    },
    {
      question: 'What is the sales audit?',
      answer:
        'A free review of your offer, at least five real calls and your follow-up, with a short written brief and a call to talk it through. It is for founders who want a diagnosis before they decide anything else. It is not a way into a retainer, because there is no retainer.',
    },
    {
      question: 'What happens to commission on a refund?',
      answer:
        'It is written in the agreement before we start, alongside how payment plans are handled. A change-of-mind policy does not replace anyone’s legal consumer rights.',
    },
  ],
}

export const homeFaqs = fallbackFaqs.home
export const pricingFaqs = fallbackFaqs.pricing
