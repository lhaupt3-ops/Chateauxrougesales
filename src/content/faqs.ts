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
        'To be confirmed. After I have seen your offer and a few calls I will give you a date in writing, and only one I can keep.',
    },
    {
      question: 'What does it cost?',
      answer:
        'A paid sales audit if you want a diagnosis first. A pilot is a one-off setup fee, then commission on cash collected. There is no monthly retainer. The amounts are confirmed in writing before you pay anything.',
    },
    {
      question: 'What do I need in place?',
      answer:
        'An offer you have already sold, a price that can pay for the work, calls that are already booked or about to be, and a way to deliver if more people say yes. If the conversations are not there yet, I will say so instead of taking your money.',
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
        'The pilot length and the notice period are in the written agreement. Until that agreement exists, both are to be confirmed.',
    },
    {
      question: 'Who is this not for?',
      answer:
        'Offers that have never sold, prices too small to pay for the work, and anyone who wants a promised close rate. Job seekers use Careers, so this page can stay about buying.',
    },
  ],
  pricing: [
    {
      question: 'Why not publish one price?',
      answer:
        'I have not set the figures yet, and I would rather say so than guess. They will appear here once they are numbers I will honour, and you will see them in writing before you pay.',
    },
    {
      question: 'Why a setup fee as well as commission?',
      answer:
        'The first weeks are spent reading your offer and calls, writing the call shape and setting up follow-up. That work happens before any sale. Commission alone would mean doing it for nothing, and it would also push me to take only easy offers.',
    },
    {
      question: 'Is there a monthly retainer?',
      answer:
        'No. After the one-off setup fee, I am paid commission on cash you have collected. If that changes, this page changes first.',
    },
    {
      question: 'What is the sales audit?',
      answer:
        'A paid review of your offer, at least five real calls and your follow-up, with a short written brief and a call to talk it through. It is for founders who want a diagnosis before they decide anything else. It is not a way into a retainer.',
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
