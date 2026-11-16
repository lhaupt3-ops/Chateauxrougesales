import type { Payload } from 'payload'
import { richText } from '@/lib/lexical'
import { defaultSettings } from '@/lib/settings'
import { refreshMethodologyCopy } from './methodology'

const PLACEHOLDER_BIO =
  'This is a placeholder byline so the journal template can be reviewed. It is not a person. Do not publish essays under this name. Add a real author, with a biography, headshot and profile links, then reassign the drafts.'

export async function seed(payload: Payload) {
  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0 && process.env.PAYLOAD_ADMIN_EMAIL && process.env.PAYLOAD_ADMIN_PASSWORD) {
    await payload.create({
      collection: 'users',
      data: {
        email: process.env.PAYLOAD_ADMIN_EMAIL,
        password: process.env.PAYLOAD_ADMIN_PASSWORD,
        name: 'Site admin',
        role: 'admin',
      },
    })
    payload.logger.info(`Created admin user ${process.env.PAYLOAD_ADMIN_EMAIL}`)
  }

  await refreshMethodologyCopy(payload)

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings.guaranteeText) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        ...defaultSettings,
        guaranteeIsPlaceholder: true,
        noticeIsPlaceholder: true,
        bandsArePlaceholder: true,
        notifyEmail: process.env.NOTIFY_EMAIL || undefined,
        calendlyStrategyUrl: process.env.CALENDLY_STRATEGY_URL || undefined,
        calendlyFitUrl: process.env.CALENDLY_FIT_URL || undefined,
      },
    })
  }

  const categoryCount = await payload.count({ collection: 'categories' })
  if (categoryCount.totalDocs > 0) return

  const salesTeam = await payload.create({
    collection: 'categories',
    data: {
      name: 'Sales team design',
      slug: 'sales-team-design',
      intro: richText([
        {
          kind: 'p',
          text: 'Essays on what a sales team as a service is, when it beats hiring, and how a founder keeps the voice of the brand while someone else runs the calls. This hub is for buyers, not for people looking for closer jobs.',
        },
        {
          kind: 'p',
          text: 'Each essay links back to the done-for-you sales team page. Read them before you apply if you want the model in plain language. Numbers on this site are either your own, once we have permission to publish them, or cited public research. We do not invent client results.',
        },
      ]),
      seo: {
        metaTitle: 'Sales team design essays',
        metaDescription: 'Plain-language essays on sales teams as a service, hiring, and when outsourcing the sales function is the better move.',
      },
    },
  })

  const hiring = await payload.create({
    collection: 'categories',
    data: {
      name: 'Hiring and commission',
      slug: 'hiring-and-commission',
      intro: richText([
        {
          kind: 'p',
          text: 'How high-ticket closer pay actually works: commission, base, agency models, and the questions to ask before you hand someone your calendar. Written for founders buying the work, not for candidates hunting a role.',
        },
        {
          kind: 'p',
          text: 'Use these pieces next to the pricing page. Where a figure is still a placeholder, the essay says so. Replace the drafts with a named author before you publish.',
        },
      ]),
      seo: {
        metaTitle: 'Hiring and commission guides',
        metaDescription: 'Guides on high-ticket closer pay, vetting, and the questions to ask a sales agency before you hand over your calls.',
      },
    },
  })

  const showRate = await payload.create({
    collection: 'categories',
    data: {
      name: 'Show rate and process',
      slug: 'show-rate-and-process',
      intro: richText([
        {
          kind: 'p',
          text: 'The unglamorous part of high-ticket sales: speed to lead, show rate, call structure, and the weekly numbers a founder should actually see. These essays support the appointment setting and how-it-works pages.',
        },
      ]),
      seo: {
        metaTitle: 'Show rate and sales process',
        metaDescription: 'Essays on speed to lead, sales-call show rate, and the weekly numbers a founder should watch.',
      },
    },
  })

  const author = await payload.create({
    collection: 'authors',
    data: {
      name: 'Editorial desk (placeholder)',
      slug: 'editorial-desk',
      role: 'Replace with a real author',
      bio: PLACEHOLDER_BIO,
      credentials: 'Not a person. Placeholder only, so the template can be checked.',
      sameAs: [],
      expertise: [{ topic: 'Do not publish under this byline' }],
    },
  })

  const posts = [
    {
      title: 'DRAFT: What is sales team as a service?',
      slug: 'what-is-sales-team-as-a-service',
      category: salesTeam.id,
      pillar: 'done-for-you-sales-team',
      excerpt: 'DRAFT EXAMPLE. Do not publish until a real author reviews it. A plain definition of the model, the costs, and when it beats hiring.',
      metaTitle: 'What is sales team as a service?',
      metaDescription: 'Draft example. A sales team as a service is setters, closers and a sales lead who run your pipeline. Not for publication yet.',
      keyword: 'sales team as a service',
      takeaways: [
        'It is a managed unit: setters, closers and a sales lead.',
        'You keep the offer, the CRM, the data and the recordings.',
        'It beats hiring when you already have an offer that sells and you are the bottleneck.',
      ],
      body: [
        { kind: 'p' as const, text: 'A sales team as a service is a setter, a closer and a sales lead who run your pipeline from the first reply to cash collected. You keep the offer, the clients and the data. The team does the selling, and a lead manages the people and the numbers.' },
        { kind: 'h2' as const, text: 'Which models are people actually buying?' },
        { kind: 'p' as const, text: 'There are three common shapes. A freelance closer, paid on commission, who you still have to manage. A placement, where an agency introduces someone and you employ them. And a managed team, where the agency staffs the roles and is accountable for the week. Chateaux Rouge sells the third shape. We are not a job board, and this draft is not a promise of results.' },
        { kind: 'h2' as const, text: 'When does it beat hiring?' },
        { kind: 'p' as const, text: 'Hiring wins if you want a long-term culture and you have a manager who can coach. A managed team wins if you are the one taking the calls, you have already sold the offer, and you would rather buy the function than build the management layer. If you are pre-revenue, neither is the next step. Validate the offer first.' },
        { kind: 'h2' as const, text: 'What should you expect to pay?' },
        { kind: 'p' as const, text: 'Serious teams combine a setup fee, a monthly management fee and a commission on cash collected. The bands on our pricing page are placeholders until the commercial model is locked. Treat any round number you see in a competitor ad as a claim, not a fact, unless they show the contract.' },
      ],
      faq: [
        { question: 'Is this the same as an outsourced SDR team?', answer: 'No. An SDR team books meetings and hands them back. A sales team as a service also closes, follows up, and has a lead who owns the number.' },
        { question: 'Do I still need to be on calls?', answer: 'You should be on the early calls while the scripts settle. The point of the model is that you stop being the only person who can sell.' },
      ],
    },
    {
      title: 'DRAFT: What does a high-ticket closer cost in 2026?',
      slug: 'cost-to-hire-a-high-ticket-closer',
      category: hiring.id,
      pillar: 'high-ticket-closers',
      excerpt: 'DRAFT EXAMPLE. Do not publish yet. Commission, base and agency models, with the figures marked as ranges to verify.',
      metaTitle: 'Cost to hire a high-ticket closer',
      metaDescription: 'Draft example. How closer pay is usually structured, and which costs sit with you versus with an agency.',
      keyword: 'cost to hire a high ticket closer',
      takeaways: [
        'Commission-only is rarely free. You still pay in ramp, management and missed calls.',
        'A base plus commission keeps better people and costs more cash up front.',
        'An agency fee is the price of not managing the hire yourself.',
      ],
      body: [
        { kind: 'p' as const, text: 'The cost to hire a high-ticket closer is not one number. It is the cash you pay them, the time you spend managing them, and the deals that die while they ramp. In 2026 the market still clusters around three models: commission only, base plus commission, and an agency that wraps both into a fee plus a share of cash collected.' },
        { kind: 'h2' as const, text: 'Commission only' },
        { kind: 'p' as const, text: 'A commission-only closer is paid when cash is collected, often somewhere between 8 and 15 percent on high-ticket offers. That range is a market observation, not our rate, and it moves by niche. The hidden cost is attention. If you are still writing the script and reviewing every call, you did not remove yourself from sales. You added a person you now have to coach.' },
        { kind: 'h2' as const, text: 'Base plus commission' },
        { kind: 'p' as const, text: 'A base keeps someone who will follow up on a quiet Tuesday. It also means you carry payroll before the first deal. This is usually the right shape once you have steady lead flow and a manager. It is a painful shape if lead flow is still a hope.' },
        { kind: 'h2' as const, text: 'Agency model' },
        { kind: 'p' as const, text: 'You pay a setup, a monthly management fee and a commission. In return the agency recruits, replaces and reviews. Ask who owns the CRM, the recordings and the data if you leave. If the answer is unclear, do not sign. Our own bands are still placeholders in Site settings. Use the application if you want them walked through against your numbers.' },
      ],
      faq: [
        { question: 'Should I hire commission only to reduce risk?', answer: 'It reduces payroll risk and increases management risk. If you cannot review calls, commission only does not protect you.' },
        { question: 'Where do I see Chateaux Rouge pricing?', answer: 'The model is on the pricing page. The exact bands are confirmed on a call and in the agreement, and the on-site figures stay marked as placeholders until they are real.' },
      ],
    },
    {
      title: 'DRAFT: How to hire a high-ticket closer',
      slug: 'how-to-hire-a-high-ticket-closer',
      category: hiring.id,
      pillar: 'high-ticket-closers',
      excerpt: 'DRAFT EXAMPLE. A seven-step vetting pass for founders. Not for publication until a real author owns it.',
      metaTitle: 'How to hire a high-ticket closer',
      metaDescription: 'Draft example. A seven-step way to vet a high-ticket closer, including a live role play on your own offer.',
      keyword: 'how to hire a high ticket closer',
      takeaways: [
        'Make them sell your offer, not a story from their last job.',
        'Listen to a real call, not a highlight reel.',
        'Decide who coaches them before you hire them.',
      ],
      body: [
        { kind: 'p' as const, text: 'Hiring a high-ticket closer is a buying process, not a vibe check. The useful test is simple: can this person run your call, on your offer, without inventing pressure that your brand will not stand behind? These seven steps are the pass we would want a founder to use, whether they hire in house or ask us to staff the seat.' },
        { kind: 'h2' as const, text: 'The seven steps' },
        { kind: 'p' as const, text: 'One, write the offer in a page: who it is for, the price, the promise and the refund rule. Two, ask for two recorded calls and one lost deal, not a montage. Three, run a live role play on your calendar, with you as the buyer who says they need to think about it. Four, score the role play on questions asked, not on charisma. Five, agree the follow-up rule in writing. Six, name the manager before day one. Seven, put the exit in the contract: how fast you can replace them, and who keeps the pipeline notes.' },
        { kind: 'h2' as const, text: 'What a role play should prove' },
        { kind: 'p' as const, text: 'A good closer diagnoses. They ask what has already been tried, what happens if nothing changes, and who else decides. A weak closer pitches the whole time and treats "I need to think about it" as an insult. You do not need a laboratory to hear the difference. You need one uncomfortable practice call.' },
        { kind: 'h2' as const, text: 'When to skip the hire' },
        { kind: 'p' as const, text: 'Skip it if the offer has never been sold, if the price is under the level that can pay for a professional, or if you want someone to invent demand from nothing. Those are product and marketing problems. A closer cannot fix them, and an honest agency will say so on the application.' },
      ],
      faq: [
        { question: 'Can I use this if I plan to outsource instead?', answer: 'Yes. Ask the agency to run the same role play with the closer they would assign, on your offer, before you start.' },
        { question: 'Where do job seekers go?', answer: 'Not this essay. Open roles, when they exist, live on the careers page so buyer pages stay about buying.' },
      ],
    },
  ]

  for (const post of posts) {
    await payload.create({
      collection: 'posts',
      draft: true,
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        _status: 'draft',
        authors: [author.id],
        category: post.category,
        pillar: post.pillar as
          | 'done-for-you-sales-team'
          | 'high-ticket-closers'
          | 'appointment-setting'
          | 'sales-audit'
          | 'coaches-and-consultants'
          | 'course-creators-and-info-products'
          | 'agencies-and-b2b-services'
          | 'how-it-works'
          | 'pricing',
        keyTakeaways: post.takeaways.map((text) => ({ text })),
        body: richText(post.body),
        faq: post.faq,
        sources: [
          {
            label: 'Harvard Business Review, The Short Life of Online Sales Leads',
            url: 'https://hbr.org/2011/03/the-short-life-of-online-sales-leads',
          },
        ],
        cta: {
          variant: 'inline-fit-check',
          heading: 'See if a managed team is a fit',
          body: 'The application takes about 90 seconds. You get a clear next step, not a pitch deck.',
        },
        seo: {
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          primaryKeyword: post.keyword,
          noindex: true,
        },
        readingTime: 4,
      },
    })
  }

  const resources = [
    {
      title: 'Sales Team Readiness Scorecard',
      slug: 'sales-team-readiness-scorecard',
      kind: 'scorecard' as const,
      description: 'The same questions as the application. A strong score routes you to a time on the calendar. A weak score tells you what to fix first.',
    },
    {
      title: 'Closer Hiring Kit',
      slug: 'closer-hiring-kit',
      kind: 'guide' as const,
      description: 'A short vetting pass and a role-play rubric you can use before you hire, or before you ask an agency to staff a seat.',
    },
    {
      title: 'Show-Rate Playbook',
      slug: 'show-rate-playbook',
      kind: 'guide' as const,
      description: 'What to put on the confirmation page, what to ask people to bring, and how reminders earn the right to a reply.',
    },
  ]

  for (const resource of resources) {
    await payload.create({
      collection: 'resources',
      data: {
        ...resource,
        _status: 'published',
        body: richText([
          { kind: 'p', text: 'This is a working draft of the guide, written so the page template can be reviewed. It is not a client case and it does not claim results.' },
          { kind: 'h2', text: 'What you can use today' },
          { kind: 'p', text: resource.description },
          { kind: 'h2', text: 'What is still missing' },
          { kind: 'p', text: 'A downloadable file, a named author and any proof you are willing to stand behind. Add those in the back office before you send traffic to this page.' },
        ]),
        seo: {
          metaTitle: resource.title,
          metaDescription: resource.description.slice(0, 155),
        },
      },
    })
  }

  payload.logger.info('Seeded draft journal, categories, placeholder author and resources.')
  void showRate
}
