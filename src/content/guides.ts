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
    slug: 'done-for-you-sales-team',
    path: '/services/done-for-you-sales-team',
    kind: 'service',
    metaTitle: 'Done-for-you sales team',
    metaDescription: 'A sales team as a service: setters, closers and a sales lead who run your high-ticket pipeline. You keep the offer, the data and the recordings.',
    eyebrow: 'Sales team as a service',
    h1: 'A done-for-you sales team, for founders who are still the closer.',
    dek: 'A setter, a closer and a sales lead run the pipeline from the first reply to cash collected. You keep the offer, the clients and the data. The calls look for an honest decision, including a no.',
    sections: [
      {
        heading: 'What is a sales team as a service?',
        paragraphs: [
          'It is not a freelancer you still have to manage, and it is not an SDR pod that books meetings and hands them back. It is one accountable unit. Setters qualify and book. Closers run the conversation. A sales lead coaches the calls and reports the week.',
          'Founders usually arrive here because they are the only person who can sell. Delivery waits while the calendar fills. Hiring a closer alone does not fix that, because someone still has to manage the closer.',
        ],
      },
      {
        heading: 'What you get, and what you keep',
        paragraphs: ['The split is the point of the model. We take the selling. You keep the company.'],
        bullets: [
          'You keep the offer, the delivery and the relationship with the buyer.',
          'You keep the CRM, the accounts, the notes and the recordings.',
          'We take first response, booking, the sales call, the follow-up and the weekly report.',
          'We work in English with founders in Australia, the UK and the US. We do not publish city pages.',
        ],
      },
      {
        heading: 'Who it is for',
        paragraphs: [
          'A working picture, not a confirmed client list: coaches, consultants, course creators and B2B firms who have already sold the offer, can deliver if more people say yes, and will share recordings. If nothing has sold, a team is the wrong next step. The application asks the price instead of pretending one number fits every firm.',
        ],
      },
      {
        heading: 'How the first weeks run',
        paragraphs: [
          'We read the offer and a handful of real calls. We put the call shape, the routing and the follow-up inside your CRM. Then we staff the seats and review calls in the open. Any start date on the site is a draft until operations confirms it.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this the same as outsourced SDRs?',
        answer: 'No. Outsourced SDRs book meetings. This team also closes and is managed as one function. If you only need meetings, start with appointment setting.',
      },
      {
        question: 'Can I keep my current closer?',
        answer: 'Sometimes. If they are good and they will work inside the review rhythm, the sales lead can manage them. If they will not, we staff the seat.',
      },
      {
        question: 'Do you promise a close rate?',
        answer: 'No. We publish the process. Named results appear only with the client’s permission, a metric, and a time window. A percentage on a homepage is not a plan.',
      },
    ],
    related: [
      { href: '/compare/outsourced-vs-in-house-sales-team', label: 'Outsourced vs in-house', text: 'The 12-month difference, without fake math.' },
      { href: '/pricing', label: 'How we charge', text: 'Setup, management and commission, in plain words.' },
      { href: '/who-we-help/coaches-and-consultants', label: 'For coaches', text: 'How the voice of the brand survives.' },
      { href: '/blog', label: 'Go deeper', text: 'Essays on the model, once they are published.' },
    ],
  },
  {
    slug: 'high-ticket-closers',
    path: '/services/high-ticket-closers',
    kind: 'service',
    metaTitle: 'High-ticket closers for hire',
    metaDescription: 'Outsourced high-ticket closers, managed inside your brand. For founders who need the calls run, not a marketplace of freelancers.',
    eyebrow: 'Outsourced closers',
    h1: 'High-ticket closers, hired and managed for you.',
    dek: 'High-ticket closers for hire, in this model, are not a list of freelancers. They are closers we staff, coach and replace, selling an offer you have already proved, at a price that can pay for the work.',
    sections: [
      {
        heading: 'What “closer for hire” should mean',
        paragraphs: [
          'Most pages that rank for this phrase are marketplaces or commission-only boards. You still interview, you still manage, and you still own the bad week. A managed closer is different. We choose them against your offer, we review the calls, and we replace them if the fit is wrong.',
          'The buyer intent matters. If you are looking for a remote closer job, the careers page is the only place that conversation belongs.',
        ],
      },
      {
        heading: 'Commission only is not the same as free',
        paragraphs: [
          'A commission-only closer lowers payroll and raises the management load. Someone still writes the script, still checks the calls, and still follows the maybes. If that someone is you, you did not buy back your calendar. Our model is a one-off setup fee, then commission, with no monthly retainer. The amounts stay unpublished until the agreement.',
        ],
      },
      {
        heading: 'How we judge a closer',
        paragraphs: ['Charisma is a weak test. The useful test is a live role play on your offer.'],
        bullets: [
          'They diagnose before they present.',
          'They can sit with “I need to think about it” without getting sharp.',
          'They follow the written follow-up, not a private side process.',
          'They will work inside your CRM, not a tool you cannot see.',
        ],
      },
      {
        heading: 'When a closer is the wrong hire',
        paragraphs: [
          'If the offer has never sold, a closer cannot invent the proof. If the price is too small to carry a professional, the application says so and does not book a strategy call. If there are no conversations, you need lead flow before you need another person on the phone. Those thresholds are working rules, confirmed in the product, not a published rate card.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do you place closers I then employ?',
        answer: 'No. We staff and manage them. Placement marketplaces are a different product, and a different kind of risk.',
      },
      {
        question: 'Can closers work remotely?',
        answer: 'Yes. The work is calls, notes and follow-up. Location matters less than the review rhythm and the CRM.',
      },
      {
        question: 'What do I listen to before we start?',
        answer: 'Your own calls, if you have them. We would rather coach from the real conversation than from a theory.',
      },
    ],
    related: [
      { href: '/pricing', label: 'Closer pay, in our model', text: 'How commission sits next to a management fee.' },
      { href: '/compare/agency-vs-freelance-closer', label: 'Agency vs freelance', text: 'Who actually manages the person.' },
      { href: '/services/appointment-setting', label: 'Setters', text: 'If the calendar is empty, start here.' },
      { href: '/blog', label: 'Hiring essays', text: 'Vetting and cost guides, published when they are ready.' },
    ],
  },
  {
    slug: 'appointment-setting',
    path: '/services/appointment-setting',
    kind: 'service',
    metaTitle: 'Appointment setting for high-ticket offers',
    metaDescription: 'Appointment setters who book and qualify high-ticket conversations, then hand them to closers on the same team. Speed to lead is the job.',
    eyebrow: 'Appointment setting',
    h1: 'Appointment setters for high-ticket offers.',
    dek: 'An appointment setting agency, in our version, books qualified conversations for offers that can support a real sales process. The setter and the closer sit on the same team, so the handoff does not go cold.',
    sections: [
      {
        heading: 'What an appointment setter does here',
        paragraphs: [
          'They reply fast, they qualify against your rules, and they book a conversation with the right person. They do not pitch the whole offer on the first touch, and they do not stuff the calendar with people who cannot buy.',
          'A public study from Harvard Business Review found that firms who contacted online leads within an hour were far more likely to qualify them. We treat that as a reason to staff the first reply, not as a statistic about us.',
        ],
      },
      {
        heading: 'Setters without closers is a half system',
        paragraphs: [
          'A booked call still has to be held, run and followed up. If you are the one taking every appointment, the setter just made you busier. The useful version is a setter who books and a closer who runs the call, with one lead watching show rate and close rate together.',
        ],
      },
      {
        heading: 'What “qualified” has to mean in writing',
        paragraphs: ['We agree the rules before the first dial or the first reply. If it is not written, it will drift.'],
        bullets: [
          'The buyer matches the offer.',
          'The budget or the price has been named.',
          'The decision maker is on the call, or we know who is missing.',
          'There is a real reason to talk this month, not a vague interest.',
        ],
      },
      {
        heading: 'Show rate is part of setting',
        paragraphs: [
          'A meeting that nobody attends was not set. Confirmation, a clear agenda and a reschedule path are part of the setter’s work. The journal will cover the playbook. Until those essays are published, the confirmation page on this site is the pattern we use ourselves.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this pay per appointment?',
        answer: 'Not by default. Setters sit inside the managed team, with a management fee and a commission on cash collected. A pure pay-per-meeting offer is a different contract.',
      },
      {
        question: 'Can you set appointments if I have no leads?',
        answer: 'Only if outbound is in scope and the offer can support it. Say so on the application. We tag those files so the call talks about lead flow, not just closing.',
      },
      {
        question: 'Do you work B2B and B2C?',
        answer: 'Both, when the offer is high ticket and the buyer can be reached. The vertical pages spell out the differences.',
      },
    ],
    related: [
      { href: '/compare/setter-vs-closer', label: 'Setter vs closer', text: 'Who you need first.' },
      { href: '/services/done-for-you-sales-team', label: 'The full team', text: 'When setting and closing should be one unit.' },
      { href: '/how-it-works', label: 'The weekly numbers', text: 'Show rate sits next to close rate.' },
      { href: '/resources/show-rate-playbook', label: 'Show-rate playbook', text: 'A short draft you can read after the application.' },
    ],
  },
  {
    slug: 'sales-audit',
    path: '/services/sales-audit',
    kind: 'service',
    metaTitle: 'Sales audit for high-ticket teams',
    metaDescription: 'A sales audit of your offer, your calls and your follow-up before you hire a team. A smaller first step than a full sales function.',
    eyebrow: 'Entry offer',
    h1: 'A sales audit before you hand over the calls.',
    dek: 'A sales audit is a structured review of the offer, the live calls and the follow-up. You leave with a written read on what to fix, and a clear yes or no on whether a team would pay for itself.',
    sections: [
      {
        heading: 'What we review',
        paragraphs: [
          'The offer page and the price. Five or more real calls, including losses. The speed of the first reply. The show rate. The notes in the CRM. The handoff between whoever books and whoever closes. We are looking for leaks you can verify, not a new slogan.',
        ],
      },
      {
        heading: 'What you get back',
        paragraphs: [
          'A short written brief: what is working, what is costing you deals, and whether the next step is a setter, a closer, a full team, or none of those. If the honest answer is “not yet”, we say that. The audit is not a trapdoor into a retainer.',
        ],
      },
      {
        heading: 'When to start here',
        paragraphs: [
          'Start with the audit if you are unsure the offer is ready, if a previous closer burned trust, or if you want a second set of ears before you change the team. If you already know you want the function run, skip ahead and apply for the team.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is the audit priced?',
        answer: 'The fee is set in Site settings once it is real. Until then the page will not invent one. Ask on the fit call and you will get the number in writing.',
      },
      {
        question: 'Do you need recordings?',
        answer: 'Yes, if they exist. An audit without calls is a guess. If you have never recorded a call, that itself is one of the findings.',
      },
    ],
    related: [
      { href: '/apply', label: 'Apply', text: 'Say you want the audit first. The form has that option.' },
      { href: '/how-it-works', label: 'How a team runs', text: 'So you can see what the audit is comparing you with.' },
      { href: '/pricing', label: 'The commercial model', text: 'What a full engagement costs, in shape if not yet in final numbers.' },
    ],
  },
]

export const verticals: Guide[] = [
  {
    slug: 'coaches-and-consultants',
    path: '/who-we-help/coaches-and-consultants',
    kind: 'vertical',
    metaTitle: 'Sales team for coaches and consultants',
    metaDescription: 'An outsourced sales team for coaches and consultants with high-ticket programs. Keep your voice. Stop taking every call yourself.',
    eyebrow: 'Who we help',
    h1: 'A sales team for coaches and consultants.',
    dek: 'An outsourced sales team for a coaching or consulting business sells the way you sell, from your stories and your standards. The goal is that a buyer cannot tell the care went missing just because you left the chair.',
    sections: [
      {
        heading: 'Why coaches get stuck on the calendar',
        paragraphs: [
          'The person who is best at the work is often the only person the market trusts. That does not scale, and hiring a loud closer usually makes it worse. The fix is a written offer, recorded calls the team can study, and a lead who will pull anyone who starts performing instead of listening.',
        ],
      },
      {
        heading: 'How the voice stays yours',
        paragraphs: [
          'We start from your calls, not from a template. Phrases you would never say get struck. Claims you cannot prove get struck. The closer’s job is to diagnose and to offer a fit, including the fit that is a no.',
        ],
      },
      {
        heading: 'What has to be true first',
        paragraphs: [
          'You have sold the program yourself, and you can deliver if more people say yes. Whether the price can carry a team is a question on the application, not a number we pretend is universal. If enrollment is still a theory, we will tell you to wait.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Will they pretend to be me?',
        answer: 'No. They represent the company and they say so. Impersonating the founder is a short path to a refund and a complaint.',
      },
      {
        question: 'Can you sell a certification or a group program?',
        answer: 'Yes, if the call is how you sell it today and the economics work. The application asks for the price and the lead flow so we can tell.',
      },
    ],
    related: [
      { href: '/services/done-for-you-sales-team', label: 'The team', text: 'Setters, closers and a sales lead.' },
      { href: '/services/high-ticket-closers', label: 'Closers', text: 'If the calls exist and you only need them run.' },
      { href: '/compare/outsourced-vs-in-house-sales-team', label: 'In-house or outsourced', text: 'A practical comparison for a small firm.' },
    ],
  },
  {
    slug: 'course-creators-and-info-products',
    path: '/who-we-help/course-creators-and-info-products',
    kind: 'vertical',
    metaTitle: 'Closers for course creators',
    metaDescription: 'Closers and setters for course creators selling a high-ticket program. The call has to match the promise, and a no has to be allowed.',
    eyebrow: 'Who we help',
    h1: 'Closers for course creators and info products.',
    dek: 'Course creators lose deals between a warm lead and a clear conversation. The closer’s job is to help the right buyer decide, and to let the wrong buyer leave, without theatre.',
    sections: [
      {
        heading: 'The call is the product’s front door',
        paragraphs: [
          'On a high-ticket program the sales call is the first experience of how you teach. If it is slippery, the program feels slippery. We build the call around the student’s actual situation, the outcome you can support, and the reasons it might not be a fit.',
        ],
      },
      {
        heading: 'Follow-up is where most revenue sits',
        paragraphs: [
          'People say they need to think about it because the decision is real. A good follow-up names the open question and the date. It does not send seven “just checking in” notes. Setters and closers share that queue so nobody assumes the other person did it.',
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
        answer: 'No. We run the sales conversations. If the leads come from ads, content or partners, we can work them. We do not sell media buying as part of this offer.',
      },
      {
        question: 'What if my course is under $1,000?',
        answer: 'The application treats a price under $1,000 as too small for this team and sends that answer to a plain next step, not a strategy call. That cutoff is a working rule, not a comment on your business.',
      },
    ],
    related: [
      { href: '/services/high-ticket-closers', label: 'High-ticket closers', text: 'The seat most course businesses ask for first.' },
      { href: '/services/appointment-setting', label: 'Setting', text: 'When the applications are coming in faster than you can reply.' },
      { href: '/resources/show-rate-playbook', label: 'Show-rate playbook', text: 'Booked calls only count if people arrive.' },
    ],
  },
  {
    slug: 'agencies-and-b2b-services',
    path: '/who-we-help/agencies-and-b2b-services',
    kind: 'vertical',
    metaTitle: 'Outsourced sales for agencies and B2B',
    metaDescription: 'A sales team for agencies and B2B service firms. Pipeline, qualification and closing, without turning the founder into the sales department.',
    eyebrow: 'Who we help',
    h1: 'Outsourced sales for agencies and B2B services.',
    dek: 'Agencies and B2B firms often have a real offer and a messy pipeline. A sales team as a service qualifies the inbound, runs the sales conversations, and gives the founder a weekly view of show rate, close rate and cash collected.',
    sections: [
      {
        heading: 'The founder is usually the sales team',
        paragraphs: [
          'Proposals go out at midnight. Follow-up depends on memory. New business pauses every time delivery gets loud. The fix is not a motivational hire. It is a rhythm: who replies, who meets, who writes the next step, and which number gets read on Monday.',
        ],
      },
      {
        heading: 'B2B is slower, and that is fine',
        paragraphs: [
          'More than one person decides. Procurement may appear. The cycle is longer than a coaching enrollment. The team has to be patient and precise, and the CRM has to show the truth. We will not pretend a B2B services firm closes like a webinar.',
        ],
      },
      {
        heading: 'What we will not take',
        paragraphs: [
          'We are not an enterprise SDR factory, and we do not sell lists. If you need a hundred dials a day into cold accounts with a $15k product, say so. We will tell you if that is outside the work we do well.',
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
        answer: 'The sales lead runs the people we staff. If you already have a manager, we can sit beside them. We do not quietly take their job.',
      },
    ],
    related: [
      { href: '/services/done-for-you-sales-team', label: 'Done-for-you team', text: 'The full function, not a single freelancer.' },
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
    metaTitle: 'Outsourced vs in-house sales team',
    metaDescription: 'Outsourced versus in-house sales teams for high-ticket offers. Who manages, who owns the data, and when each one is the expensive mistake.',
    eyebrow: 'Comparison',
    h1: 'Outsourced vs in-house sales team.',
    dek: 'An in-house sales team is employees you manage. An outsourced sales team is a unit you buy, with setters, closers and a lead. The right one depends on whether you want to build a department or rent a function.',
    sections: [
      {
        heading: 'What actually changes',
        paragraphs: ['Ignore the slogans. These are the differences that show up in a Tuesday afternoon.'],
        bullets: [
          'In house, you recruit, coach, pay payroll and replace. You also own the culture.',
          'Outsourced, you buy the management as well as the people. You still own the offer and the data.',
          'In house wins when sales is the core of the company and you have a leader.',
          'Outsourced wins when you are the bottleneck and you do not want a department yet.',
        ],
      },
      {
        heading: 'A year from now',
        paragraphs: [
          'An in-house hire that works is a compounding asset. An in-house hire that does not work is a quiet year. An outsourced team can be ended on the notice in the contract, which is also its limit: the skill walks unless you kept the recordings, the scripts and the CRM. That is why data ownership is not a footnote.',
          'We will not invent a savings figure. Run your own payroll, your own management hours and your own ramp against the fee. If the outsourced number is not obviously better, stay in house.',
        ],
      },
      {
        heading: 'Where Chateaux Rouge sits',
        paragraphs: [
          'We are the outsourced column, and only for high-ticket offers. We are not cheaper than a single commission-only freelancer, because we include the lead. We are usually simpler than building a three-person department from scratch.',
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
      { href: '/services/done-for-you-sales-team', label: 'Our version of outsourced', text: 'The actual offer, not the category.' },
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
          'Both are true, and you are also the delivery team: the full unit.',
          'Neither is true, because nothing has sold: do not hire either yet.',
        ],
      },
      {
        heading: 'Why we staff them together',
        paragraphs: [
          'The handoff is where show rate dies. A setter who never hears how the call went will keep booking the wrong people. A closer who never sees the first touch will walk into a cold room. One lead, one board, one weekly review.',
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
        answer: 'No. It is for founders deciding what to buy. Roles, when we have them, are on the careers page.',
      },
    ],
    related: [
      { href: '/services/appointment-setting', label: 'Appointment setting', text: 'The setter offer.' },
      { href: '/services/high-ticket-closers', label: 'Closers', text: 'The closer offer.' },
      { href: '/services/done-for-you-sales-team', label: 'Both', text: 'When the split should be our problem, not yours.' },
    ],
  },
  {
    slug: 'agency-vs-freelance-closer',
    path: '/compare/agency-vs-freelance-closer',
    kind: 'compare',
    metaTitle: 'Sales agency vs freelance closer',
    metaDescription: 'A managed sales agency versus a freelance closer. Who coaches, who replaces, and who owns the pipeline if it goes quiet.',
    eyebrow: 'Comparison',
    h1: 'Sales agency vs a freelance closer.',
    dek: 'A freelance closer is a person you manage. A sales agency is a system with a lead, a backup and a review rhythm. Freelancers are right when you can coach. An agency is right when you are done being the manager.',
    sections: [
      {
        heading: 'The freelance promise',
        paragraphs: [
          'A good freelancer is fast to start and easy to end. You pay for outcomes, often on commission. You also inherit their process, their availability and their other clients. When they disappear for a week, your pipeline disappears with them unless the notes were in your CRM the whole time.',
        ],
      },
      {
        heading: 'What the agency is actually selling',
        paragraphs: [
          'Not a heroic closer. A standard, and someone whose job is the Monday report. You pay more than a pure commission seat because management is not free. Who replaces a closer that does not fit belongs in the agreement. We will not advertise a promise we have not locked.',
        ],
      },
      {
        heading: 'How to choose',
        paragraphs: [
          'If you enjoy sales management and you have the hours, hire the freelancer and keep the margin. If sales management is the thing you are trying to escape, the freelancer recreates the problem with a new face. That is the only honest dividing line.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are your closers employees or freelancers?',
        answer: 'They are staffed and managed by us. Your contract is with Chateaux Rouge, not with a rotating cast you have to chase.',
      },
      {
        question: 'Can I meet the closer before we start?',
        answer: 'Yes. You should. A hidden team is not a premium service.',
      },
    ],
    related: [
      { href: '/services/high-ticket-closers', label: 'Managed closers', text: 'What the agency column looks like here.' },
      { href: '/pricing', label: 'Why there is a management fee', text: 'The part a freelance seat usually leaves on you.' },
      { href: '/compare/outsourced-vs-in-house-sales-team', label: 'Versus in house', text: 'The wider comparison, if a freelancer is not the alternative.' },
    ],
  },
]

export const allGuides = [...services, ...verticals, ...comparisons]

export function guideBySlug(kind: Guide['kind'], slug: string): Guide | undefined {
  return allGuides.find((guide) => guide.kind === kind && guide.slug === slug)
}
