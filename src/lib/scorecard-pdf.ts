import { SCORECARD_QUESTIONS, interpretYesCount } from '@/content/scorecard'

function escapePdf(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > width && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

export function scorecardPdfBytes(): Uint8Array {
  const ready = interpretYesCount(SCORECARD_QUESTIONS.length)
  const wait = interpretYesCount(0)
  const lines: { text: string; size: number; gap: number }[] = [
    { text: 'Closer readiness scorecard', size: 16, gap: 18 },
    { text: 'Chateaux Rouge. For founders thinking about a closer. Not a quote.', size: 9, gap: 16 },
    { text: 'Mark yes or no. Two or more nos means fix those before you hire.', size: 10, gap: 14 },
  ]
  SCORECARD_QUESTIONS.forEach(([title], index) => {
    lines.push({ text: `${index + 1}. ${title}`, size: 10, gap: 12 })
    lines.push({ text: 'Yes [  ]    No [  ]', size: 10, gap: 8 })
  })
  lines.push({ text: 'Yes count: ______ of 8', size: 11, gap: 16 })
  lines.push({ text: `7 or 8 yes. ${ready.heading}. ${ready.body}`, size: 9, gap: 4 })
  for (const row of wrap(`0 to 6 yes. ${wait.heading}. ${wait.body}`, 95)) {
    lines.push({ text: row, size: 9, gap: 11 })
  }

  let y = 760
  const commands = ['BT', '/F1 16 Tf']
  for (const line of lines) {
    y -= line.gap
    commands.push(`/F1 ${line.size} Tf`)
    commands.push(`1 0 0 1 48 ${y} Tm (${escapePdf(line.text)}) Tj`)
  }
  commands.push('ET')
  const stream = commands.join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Count 1 /Kids [3 0 R] >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets: number[] = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new TextEncoder().encode(pdf)
}
