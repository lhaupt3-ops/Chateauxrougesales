type LexicalNode = {
  type?: string
  text?: string
  tag?: string
  children?: LexicalNode[]
  fields?: Record<string, unknown>
  listType?: string
  url?: string
  [key: string]: unknown
}

export function richText(blocks: Array<{ kind: 'p' | 'h2' | 'h3'; text: string }>) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: blocks.map((block) => {
        const text = {
          type: 'text',
          text: block.text,
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          version: 1,
        }
        if (block.kind === 'p') {
          return {
            type: 'paragraph',
            format: '' as const,
            indent: 0,
            version: 1,
            direction: 'ltr' as const,
            textFormat: 0,
            textStyle: '',
            children: [text],
          }
        }
        return {
          type: 'heading',
          tag: block.kind,
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [text],
        }
      }),
    },
  }
}

export function lexicalToText(data: unknown): string {
  const chunks: string[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const record = node as LexicalNode
    if (typeof record.text === 'string') chunks.push(record.text)
    if (Array.isArray(record.children)) record.children.forEach(walk)
    if (record.fields && typeof record.fields === 'object') {
      Object.values(record.fields).forEach(walk)
    }
  }
  walk((data as { root?: unknown } | null)?.root)
  return chunks.join(' ')
}

export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (!words) return 1
  return Math.max(1, Math.round(words / 200))
}

export function headingList(data: unknown): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const record = node as LexicalNode
    if (record.type === 'heading' && record.tag === 'h2') {
      const text = lexicalToText({ root: record })
      if (text) headings.push({ id: slugifyHeading(text), text })
    }
    if (Array.isArray(record.children) && record.type !== 'heading') record.children.forEach(walk)
  }
  walk((data as { root?: unknown } | null)?.root)
  return headings
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
