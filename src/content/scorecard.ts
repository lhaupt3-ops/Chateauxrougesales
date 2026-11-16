export const SCORECARD_SLUG = 'closer-readiness-scorecard'
export const SCORECARD_PATH = `/resources/${SCORECARD_SLUG}`
export const GUIDE_PATH = '/resources/are-you-ready-for-closers'

export const SCORECARD_QUESTIONS: [string, string][] = [
  ['The offer has a price you have already collected.', 'A slide that says “from” is not a price. If the last ten sales did not cluster around one number, the closer has nothing to hold.'],
  ['You can explain who it is not for.', 'A closer who cannot refuse the wrong buyer will fill the calendar with people who cannot pay or cannot be served.'],
  ['Someone other than you can describe the offer without performing you.', 'If the sale only works when you are in the room, a team will sell a thinner version. Write the version they are allowed to say.'],
  ['Conversations already start without a closer.', 'A closer does not invent demand. If the week has no booked conversations, the missing role is usually a setter, or the offer is not being put in front of anyone.'],
  ['You know where a maybe goes.', 'A maybe without a date and an owner is not a pipeline. Name the place those notes live before you hire.'],
  ['You can listen to a call you would let a new hire copy.', 'If you would not play one recording to a stranger, the process is still in your head. Hiring freezes that confusion into someone else’s week.'],
  ['Delivery can absorb more yeses.', 'A full calendar that you cannot fulfil is a worse problem than a quiet one. Count the seats, the calls, or the client hours you can actually take.'],
  ['A one-off setup fee is possible.', 'Commission on future cash does not pay for the weeks spent building the call, the handoff and the review. If the only acceptable model is “pay us when we close”, wait.'],
]

export function interpretYesCount(yesCount: number): { heading: string; body: string } {
  const nos = SCORECARD_QUESTIONS.length - yesCount
  if (nos <= 1) {
    return {
      heading: 'A closer can be the next look',
      body: 'One no, or none. The process is mostly in place. A closer is a reasonable next conversation if delivery can take the work and a setup fee is possible.',
    }
  }
  return {
    heading: 'Fix the nos first',
    body: 'Two or more nos means a closer will not fix the week. Write the price, the people it is not for, and where a maybe goes. Then look at a setter if the gap is conversations, or a closer if the gap is the decision.',
  }
}
