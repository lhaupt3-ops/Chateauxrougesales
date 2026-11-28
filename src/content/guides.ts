import type { Faq } from './faqs'

export type GuideSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type Guide = {
  slug: string
  path: string
  kind: 'service' | 'vertical' | 'compare'
  /** Services only. 'later' means planned, not available today. */
  status?: 'available' | 'later'
  metaTitle: string
  metaDescription: string
  eyebrow: string
  h1: string
  dek: string
  sections: GuideSection[]
  faqs: Faq[]
  related: { href: string; label: string; text: string }[]
}

export const services: Guide[] = [
  {
    slug: 'sales-audit',
    path: '/services/sales-audit',
    kind: 'service',
    status: 'available',
    metaTitle: 'Sales audit for founder-led sales',
    metaDescription: 'A paid sales audit of your offer, your calls and your follow-up, done by the founder. A smaller first step than outsourcing the calls.',
    eyebrow: 'Start here',
    h1: 'A sales audit before you hand over the calls.',
    dek: 'A sales audit is a structured read of your offer, your live calls and your follow-up. You get a short written brief on what to fix, and a plain answer on whether outsourced closing would pay for itself. I do it myself.',
    sections: [
      {
        heading: 'What I review',
        paragraphs: [
          'The offer page and the price. At least five real calls, including losses. How fast the first reply goes out. The show rate. The notes in your CRM. The step between a booking and the person who takes the call. I am looking for leaks you can verify, not a new slogan.',
        ],
      },
      {
        heading: 'What you get back',
        paragraphs: [
          'A short written brief: what is working, what is costing you deals, and whether the next step is a pilot, a different fix, or nothing yet. We then talk it through on a call. If the honest answer is “not yet”, I say that. The audit is not a way into a retainer, because there is no retainer.',
        ],
      },
      {
        heading: 'When to start here',
        paragraphs: [
          'Start with the audit if you are unsure the offer is ready, if a previous closer lost you trust or money, or if you want a second set of ears before changing anything. If you already know you want the calls taken, you can apply for a pilot directly.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What does the audit cost?',
        answer: 'The figure is on the pricing page once it is set. Until then it reads “To be confirmed”, and you will get the number in writing before you pay anything.',
      },
      {
        question: 'Do you need recordings?',
        answer: 'Yes, if they exist. An audit without calls is a guess. If you have never recorded a call, that is one of the findings.',
      },
      {
        question: 'Do I have to continue after the audit?',
        answer: 'No. The brief is yours to keep and use however you like, including with someone else.',
      },
    ],
    related: [
      { href: '/apply', label: "See if we're a fit", text: 'Say you want the audit first. The form has that option.' },
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'What a pilot looks like if the audit points that way.' },
      { href: '/pricing', label: 'How I charge', text: 'The shape of both steps, with numbers as soon as they are set.' },
    ],
  },
  {
    slug: 'high-ticket-closers',
    path: '/services/high-ticket-closers',
    kind: 'service',
    status: 'available',
    metaTitle: 'Founder-led closing for high-ticket offers',
    metaDescription: 'I install your sales call process and take your booked calls myself, on commission. For founders selling $2k to $15k offers on calls.',
    eyebrow: 'The pilot',
    h1: 'Founder-led closing: I set up the process, then take the calls.',
    dek: 'You have an offer that sells on a call and calls that are already booked. I write down how the call should run, put the follow-up into your CRM, and take the calls myself. You pay a one-off setup fee, then commission on cash collected.',
    sections: [
      {
        heading: 'What “closer for hire” means here',
        paragraphs: [
          'Most pages for this phrase are marketplaces or commission-only boards. You still interview, still manage, and still own the bad week. Here it is one person, and you know who: me. I have run businesses and teams and have owned client conversations, and I take your calls the same way.',
          'If you are looking for a remote closer job, the careers page is the only place that conversation belongs.',
        ],
      },
      {
        heading: 'How the pilot runs',
        paragraphs: ['Four steps, and you see each of them.'],
        bullets: [
          'Read: your offer and a set of real calls, including the losses.',
          'Install: the call shape, qualifying rules and follow-up, inside the CRM you already own.',
          'Run: I take your booked calls. You get the recording and a short note after each.',
          'Review: weekly numbers (calls held, close rate, cash collected) and the calls themselves.',
        ],
      },
      {
        heading: 'Commission only is not the same as free',
        paragraphs: [
          'A commission-only closer lowers payroll and raises the management load. Someone still has to write the script, check the calls and follow up the maybes. In this model the setup fee pays for that work, and commission pays for the selling. There is no monthly retainer. The amounts are on the pricing page once they are set.',
        ],
      },
      {
        heading: 'How I run a call',
        paragraphs: ['Charisma is a weak test. These are the things I hold myself to, and you can check them on the recordings.'],
        bullets: [
          'I ask questions before I present anything.',
          'I can sit with “I need to think about it” without getting sharp.',
          'I follow the written follow-up, not a private side process.',
          'I work inside your CRM, not a tool you cannot see.',
        ],
      },
      {
        heading: 'When this is the wrong step',
        paragraphs: [
          'If the offer has never sold, a closer cannot invent the proof. If the price is too small to pay for the work, the application says so. If there are no booked calls, you need lead flow before you need another person on the phone, and I do not offer that today. Those thresholds are working rules, not a published rate card.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is it just you on the calls?',
        answer: 'Yes. If I add closers later, I would talk to you first and you could say no.',
      },
      {
        question: 'Will buyers know I did not take the call?',
        answer: 'I tell buyers I work with you on sales. I do not impersonate you or invent a job title.',
      },
      {
        question: 'Can this work remotely, and in my time zone?',
        answer: 'The work is calls, notes and follow-up, so it is remote. Which hours I can cover is something we agree before the start.',
      },
      {
        question: 'What do I listen to before we start?',
        answer: 'Your own calls, if you have them. I would rather work from the real conversation than from a theory.',
      },
    ],
    related: [
      { href: '/pricing', label: 'How I charge', text: 'A one-off setup fee, then commission on cash collected.' },
      { href: '/services/sales-audit', label: 'Audit first', text: 'If you want a diagnosis before a pilot.' },
      { href: '/compare/agency-vs-freelance-closer', label: 'Agency vs freelance', text: 'Who actually manages the person on the call.' },
    ],
  },
  {
    slug: 'done-for-you-sales-team',
    path: '/services/done-for-you-sales-team',
    kind: 'service',
    status: 'later',
    metaTitle: 'A full sales team: planned, not available yet',
    metaDescription: 'A fuller sales team, with setters, closers and a lead, is where this could go. It is not available today. Right now it is one founder.',
    eyebrow: 'Later, not available yet',
    h1: 'A full sales team is where this could go. It is not what I offer today.',
    dek: 'Today it is me, installing the process and running the calls. If the pilot works and the volume is there, I may add closers, setters and someone to run them. This page exists so you know what is planned and what is not.',
    sections: [
      {
        heading: 'What exists today',
        paragraphs: [
          'One person: me. I set up the process and take the calls. There is no staffed team, no sales lead, and no setters. Anything on this site that suggests otherwise is out of date and I would like to know.',
        ],
      },
      {
        heading: 'What a team would add',
        paragraphs: [
          'More call capacity, cover when I am away, and setters who reply to new leads fast and book the calls. That is a different product with different pricing, and I am not selling it yet.',
        ],
      },
      {
        heading: 'What would have to be true first',
        paragraphs: [
          'The pilot has to work for real clients, with results I can show and are theirs to approve. The process has to be written down well enough that someone else can follow it. And a client has to want it, so I can build it around a real need and not a guess.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I join a waitlist?',
        answer: 'Say on the application that a team is what you are after. I note it, and I do not chase.',
      },
      {
        question: 'Can I keep my current closer?',
        answer: 'Sometimes. If you already have a closer who is good, the audit can show whether the process around them is the problem.',
      },
    ],
    related: [
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'What is available today.' },
      { href: '/services/sales-audit', label: 'Sales audit', text: 'A written read on your calls and follow-up.' },
      { href: '/pricing', label: 'How I charge', text: 'Setup fee, then commission. No retainer.' },
    ],
  },
  {
    slug: 'appointment-setting',
    path: '/services/appointment-setting',
    kind: 'service',
    status: 'later',
    metaTitle: 'Appointment setting: not offered yet',
    metaDescription: 'Appointment setting is not part of what Chateaux Rouge offers today. What it would involve, and what to do if your calendar is empty.',
    eyebrow: 'Later, not available yet',
    h1: 'Appointment setting is not part of what I offer today.',
    dek: 'Setting needs people replying and dialling every day. I am one person taking calls. I would rather say that than sell you something I cannot staff.',
    sections: [
      {
        heading: 'Why I am not offering it yet',
        paragraphs: [
          'A setter has to reply fast, qualify against your rules and book the right people. That is a daily job for someone, and it deserves its own person. A published study from Harvard Business Review links a reply inside the first hour with a much higher chance of qualifying a lead. I cite it as their finding, not a result of mine.',
        ],
      },
      {
        heading: 'If your calendar is empty',
        paragraphs: [
          'A closer cannot invent demand. Get a small, steady set of conversations going first, from referrals, content, ads or your own outreach. Take the calls yourself for a while. The objections, the price and the delivery load you learn are what any closer, including me, needs. The free guide on this site goes through it.',
        ],
      },
      {
        heading: 'What “qualified” should mean in writing',
        paragraphs: ['This is true whoever books your calls. Agree the rules before the first booking, or it will drift.'],
        bullets: [
          'The buyer matches the offer.',
          'The budget or the price has been named.',
          'The decision maker is on the call, or you know who is missing.',
          'There is a real reason to talk this month, not a vague interest.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this pay per appointment?',
        answer: 'No, and it is not offered. The model is a one-off setup fee, then commission on cash collected.',
      },
      {
        question: 'Can you set appointments if I have no leads?',
        answer: 'Not today. Say so on the application and I will tell you plainly what I think the next step is.',
      },
    ],
    related: [
      { href: '/resources/are-you-ready-for-closers', label: 'Free guide', text: 'Are you actually ready for closers?' },
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'If the calls already exist and you only need them run.' },
      { href: '/compare/setter-vs-closer', label: 'Setter vs closer', text: 'Which gap you actually have.' },
    ],
  },
]

export const verticals: Guide[] = [
  {
    slug: 'coaches-and-consultants',
    path: '/who-we-help/coaches-and-consultants',
    kind: 'vertical',
    metaTitle: 'Sales calls for coaches and consultants',
    metaDescription: 'Founder-led closing for coaches and consultants with high-ticket programs. Keep your voice. Stop taking every call yourself.',
    eyebrow: 'Who I help',
    h1: 'Sales calls for coaches and consultants.',
    dek: 'When I take the calls for a coaching or consulting business, I work from your stories and your standards. The goal is that a buyer does not feel the care go missing just because you left the chair.',
    sections: [
      {
        heading: 'Why coaches get stuck on the calendar',
        paragraphs: [
          'The person who is best at the work is often the only person the market trusts. That does not scale, and hiring a loud closer usually makes it worse. The fix is a written offer, recorded calls that someone else can study, and a standard that pulls anyone who starts performing instead of listening.',
        ],
      },
      {
        heading: 'How the voice stays yours',
        paragraphs: [
          'I start from your calls, not from a template. Phrases you would never say get struck. Claims you cannot prove get struck. My job on a call is to ask good questions and to offer a fit, including the fit that is a no.',
        ],
      },
      {
        heading: 'What has to be true first',
        paragraphs: [
          'You have sold the program yourself, and you can deliver if more people say yes. Whether the price can pay for the work is a question on the application, not a number I pretend is universal. If enrollment is still a theory, I will tell you to wait.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Will they pretend to be me?',
        answer: 'No. I tell buyers I work with you. Impersonating the founder is a short path to a refund and a complaint.',
      },
      {
        question: 'Can you sell a certification or a group program?',
        answer: 'Yes, if the call is how you sell it today and the economics work. The application asks for the price and the lead flow so I can tell.',
      },
    ],
    related: [
      { href: '/services/sales-audit', label: 'Sales audit', text: 'A paid read of your calls and follow-up, before anything else.' },
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'If the calls exist and you only need them run.' },
      { href: '/compare/outsourced-vs-in-house-sales-team', label: 'In-house or outsourced', text: 'A practical comparison for a small firm.' },
    ],
  },
  {
    slug: 'course-creators-and-info-products',
    path: '/who-we-help/course-creators-and-info-products',
    kind: 'vertical',
    metaTitle: 'Sales calls for course creators',
    metaDescription: 'Founder-led closing for course creators selling a high-ticket program. The call has to match the promise, and a no has to be allowed.',
    eyebrow: 'Who I help',
    h1: 'Sales calls for course creators and info products.',
    dek: 'Course creators lose deals between a warm lead and a clear conversation. My job on the call is to help the right buyer decide, and to let the wrong buyer leave, without theatre.',
    sections: [
      {
        heading: 'The call is the product’s front door',
        paragraphs: [
          'On a high-ticket program the sales call is the first experience of how you teach. If it is slippery, the program feels slippery. I build the call around the student’s actual situation, the outcome you can support, and the reasons it might not be a fit.',
        ],
      },
      {
        heading: 'Follow-up is where most revenue sits',
        paragraphs: [
          'People say they need to think about it because the decision is real. A good follow-up names the open question and the date. It does not send seven “just checking in” notes. One person owns that queue, so nobody assumes someone else did it.',
        ],
      },
      {
        heading: 'The handoff',
        paragraphs: [
          'The close is not the end. The notes have to reach delivery in a form the people doing the work can use. Write the note before celebrating the cash. A refund policy, once one exists, sits beside legal consumer rights. It does not replace them, and it is not stated here.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do you run ads too?',
        answer: 'No. I take the sales conversations. If the leads come from ads, content or partners, I can work them. I do not sell media buying or lead generation as part of this offer.',
      },
      {
        question: 'What if my course is under $1,000?',
        answer: 'The application treats a price under $1,000 as too small for outsourced closing and sends that answer to a plain next step, not a strategy call. That cutoff is a working rule, not a comment on your business.',
      },
    ],
    related: [
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'The step most course businesses ask for first.' },
      { href: '/services/appointment-setting', label: 'Setting', text: 'Not offered yet, and what to do in the meantime.' },
      { href: '/resources/show-rate-playbook', label: 'Show-rate playbook', text: 'Booked calls only count if people arrive.' },
    ],
  },
  {
    slug: 'agencies-and-b2b-services',
    path: '/who-we-help/agencies-and-b2b-services',
    kind: 'vertical',
    metaTitle: 'Sales calls for agencies and B2B',
    metaDescription: 'Founder-led closing for agencies and B2B service firms: a process for the sales call and someone to run it, so the founder is not the sales department.',
    eyebrow: 'Who I help',
    h1: 'Sales calls for agencies and B2B services.',
    dek: 'Agencies and B2B firms often have a real offer and a messy pipeline. I set up how the inbound is qualified, take the sales conversations, and give the founder a weekly view of calls held, close rate and cash collected.',
    sections: [
      {
        heading: 'The founder is usually the whole sales team',
        paragraphs: [
          'Proposals go out at midnight. Follow-up depends on memory. New business pauses every time delivery gets loud. The fix is not a motivational hire. It is a rhythm: who replies, who meets, who writes the next step, and which number gets read on Monday.',
        ],
      },
      {
        heading: 'B2B is slower, and that is fine',
        paragraphs: [
          'More than one person decides. Procurement may appear. The cycle is longer than a coaching enrollment. It takes patience and precision, and the CRM has to show the truth. I will not pretend a B2B services firm closes like a webinar.',
        ],
      },
      {
        heading: 'What I will not take',
        paragraphs: [
          'I am not an enterprise SDR factory, and I do not sell lists. If you need a hundred dials a day into cold accounts with a $15k product, say so. I will tell you if that is outside the work I do well.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can you work inside our CRM?',
        answer: 'Yes. That is the preference. Your pipeline should not live in a tool you lose access to.',
      },
      {
        question: 'Do you replace a sales manager?',
        answer: 'No. I take calls and follow-up. If you already have a sales manager, I work beside them and do not quietly take their job.',
      },
    ],
    related: [
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'How the pilot runs, step by step.' },
      { href: '/services/sales-audit', label: 'Audit first', text: 'A written read on the pipeline before you change it.' },
      { href: '/compare/outsourced-vs-in-house-sales-team', label: 'In-house comparison', text: 'What you still have to manage either way.' },
    ],
  },
]

export const comparisons: Guide[] = [
  {
    slug: 'outsourced-vs-in-house-sales-team',
    path: '/compare/outsourced-vs-in-house-sales-team',
    kind: 'compare',
    metaTitle: 'Outsourced closing vs in-house sales',
    metaDescription: 'Outsourced closing versus an in-house sales hire for high-ticket offers. Who manages, who owns the data, and when each one is the expensive mistake.',
    eyebrow: 'Comparison',
    h1: 'Outsourced closing vs an in-house sales hire.',
    dek: 'An in-house sales team is employees you manage. Outsourced closing, in my version, is one person who installs the process and takes the calls. The right one depends on whether you want to build a department or rent a function for now.',
    sections: [
      {
        heading: 'What actually changes',
        paragraphs: ['Ignore the slogans. These are the differences that show up in a Tuesday afternoon.'],
        bullets: [
          'In house, you recruit, coach, pay payroll and replace. You also own the culture.',
          'Outsourced, you buy the process and the calls. You still own the offer and the data.',
          'In house wins when sales is the core of the company and you have a leader.',
          'Outsourced wins when you are the bottleneck and you do not want a department yet.',
        ],
      },
      {
        heading: 'A year from now',
        paragraphs: [
          'An in-house hire that works is a compounding asset. An in-house hire that does not work is a quiet year. An outsourced arrangement can be ended on the notice in the agreement, which is also its limit: the skill walks unless you kept the recordings, the scripts and the CRM. That is why data ownership is not a footnote.',
          'I will not invent a savings figure. Run your own payroll, your own management hours and your own ramp against the fee. If the outsourced number is not obviously better, stay in house.',
        ],
      },
      {
        heading: 'Where Chateaux Rouge sits',
        paragraphs: [
          'I am the outsourced column, and only for high-ticket offers, and I am one person. That is a limit: I can work with a handful of clients at a time, and there is no cover if I am unavailable beyond what we agree up front. In return you get a process written down and someone accountable for the calls, without building a department.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can we switch from outsourced to in house later?',
        answer: 'Yes, if you own the CRM and the recordings. That option should be in the contract, not in a handshake.',
      },
      {
        question: 'Is outsourced just a way to hide headcount?',
        answer: 'It can be misused that way. Used properly, it is a management decision: buy the function until you are ready to employ it.',
      },
    ],
    related: [
      { href: '/services/high-ticket-closers', label: 'My version of outsourced', text: 'The actual offer, not the category.' },
      { href: '/compare/agency-vs-freelance-closer', label: 'Agency vs freelance', text: 'A narrower choice, if you only need one closer.' },
      { href: '/pricing', label: 'How the money works', text: 'So the comparison is not only about salary.' },
    ],
  },
  {
    slug: 'setter-vs-closer',
    path: '/compare/setter-vs-closer',
    kind: 'compare',
    metaTitle: 'Appointment setter vs closer',
    metaDescription: 'Setter versus closer, for buyers. Who books, who sells, and which role you need first if you are the one on every call.',
    eyebrow: 'Comparison',
    h1: 'Appointment setter vs closer: who you need first.',
    dek: 'A setter books the conversation. A closer runs it. If you are a founder drowning in calls, you need a closer. If the calendar is empty, you need a setter. If you are drowning and the follow-up is a mess, you need both, under one lead.',
    sections: [
      {
        heading: 'The work is different',
        paragraphs: [
          'Setters live in the first hour. They reply, they qualify, they confirm. Closers live in the conversation and the week after it. Judging a setter by close rate, or a closer by how many strangers they can book, is how both jobs get done badly.',
        ],
      },
      {
        heading: 'A buyer’s order of operations',
        paragraphs: ['Look at the last thirty days, not at your plan for the quarter.'],
        bullets: [
          'Plenty of qualified conversations, and you take them all: closer first.',
          'Leads arrive and go quiet before anyone replies: setter first.',
          'Both are true, and you are also the delivery team: you need both roles, and I only cover the closer side today.',
          'Neither is true, because nothing has sold: do not hire either yet.',
        ],
      },
      {
        heading: 'Why the handoff matters',
        paragraphs: [
          'The handoff is where show rate dies. A setter who never hears how the call went will keep booking the wrong people. A closer who never sees the first touch will walk into a cold room. One board and one weekly review help, whoever fills the roles. Today I cover the closer side only.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can one person do both?',
        answer: 'On a tiny volume, sometimes. Past a handful of real opportunities a week, the skills and the calendar fight each other.',
      },
      {
        question: 'Is this page for people who want the job?',
        answer: 'No. It is for founders deciding what to buy. If I ever have roles, they are on the careers page.',
      },
    ],
    related: [
      { href: '/services/appointment-setting', label: 'Appointment setting', text: 'Not offered yet.' },
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'What I offer today.' },
      { href: '/services/done-for-you-sales-team', label: 'A team, later', text: 'Where this could go.' },
    ],
  },
  {
    slug: 'agency-vs-freelance-closer',
    path: '/compare/agency-vs-freelance-closer',
    kind: 'compare',
    metaTitle: 'Founder-led closing vs freelance closer',
    metaDescription: 'A founder-led sales service versus a freelance closer. Who sets up the process, who is accountable, and who owns the pipeline if it goes quiet.',
    eyebrow: 'Comparison',
    h1: 'Founder-led closing vs a freelance closer.',
    dek: 'A freelance closer is a person you manage. Founder-led closing is also one person, but the process is written down first and there is a weekly review. Freelancers are right when you can coach. This is right when you want the process built and the calls taken.',
    sections: [
      {
        heading: 'The freelance promise',
        paragraphs: [
          'A good freelancer is fast to start and easy to end. You pay for outcomes, often on commission. You also inherit their process, their availability and their other clients. When they disappear for a week, your pipeline disappears with them unless the notes were in your CRM the whole time.',
        ],
      },
      {
        heading: 'What I am actually selling',
        paragraphs: [
          'Not a heroic closer. A written standard, the calls, and a Monday report. You pay more than a pure commission seat because the setup work is not free. There is no backup closer today. If I cannot take your calls for a stretch, that is covered in the agreement, not in a promise on this page.',
        ],
      },
      {
        heading: 'How to choose',
        paragraphs: [
          'If you enjoy sales management and you have the hours, hire the freelancer and keep the margin. If sales management is the thing you are trying to escape, a freelancer recreates the problem with a new face. That is the only honest dividing line.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Who is the closer?',
        answer: 'Me. Your agreement is with me, through Chateaux Rouge. There is no rotating cast, and also no bench behind me yet.',
      },
      {
        question: 'Can I meet you before we start?',
        answer: 'Yes. You should. The first call is with me, and I would be the one taking your calls.',
      },
    ],
    related: [
      { href: '/services/high-ticket-closers', label: 'Founder-led closing', text: 'What the pilot looks like.' },
      { href: '/pricing', label: 'How I charge', text: 'A one-off setup fee, then commission. The amounts are to be confirmed.' },
      { href: '/compare/outsourced-vs-in-house-sales-team', label: 'Versus in house', text: 'The wider comparison, if a freelancer is not the alternative.' },
    ],
  },
]

export const allGuides = [...services, ...verticals, ...comparisons]

export function guideBySlug(kind: Guide['kind'], slug: string): Guide | undefined {
  return allGuides.find((guide) => guide.kind === kind && guide.slug === slug)
}
