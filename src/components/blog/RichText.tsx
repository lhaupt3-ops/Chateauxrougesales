import Link from 'next/link'
import { ApplyLink } from '@/components/site/ApplyLink'
import { EmailCapture } from '@/components/site/EmailCapture'
import { headingList, lexicalToText, slugifyHeading } from '@/lib/lexical'

type Node = {
  type?: string
  tag?: string
  text?: string
  children?: Node[]
  listType?: string
  url?: string
  fields?: Record<string, unknown>
  format?: number | string
  value?: { url?: string; alt?: string; width?: number; height?: number }
}

export function RichText({ data }: { data: unknown }) {
  const root = (data as { root?: Node } | null)?.root
  if (!root?.children) return null
  return <div className="rich">{root.children.map((node, index) => renderNode(node, index))}</div>
}

export function TableOfContents({ data }: { data: unknown }) {
  const headings = headingList(data)
  if (headings.length < 2) return null
  return (
    <nav aria-label="On this page" className="rounded-2xl border border-stone p-4 text-sm">
      <p className="text-xs uppercase tracking-[0.14em] text-wine">On this page</p>
      <ol className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className="hover:underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function renderNode(node: Node, key: number): React.ReactNode {
  if (node.type === 'text') {
    const format = typeof node.format === 'number' ? node.format : 0
    let child: React.ReactNode = node.text
    if (format & 1) child = <strong>{child}</strong>
    if (format & 2) child = <em>{child}</em>
    return <span key={key}>{child}</span>
  }
  const children = (node.children || []).map((child, index) => renderNode(child, index))
  if (node.type === 'paragraph') return <p key={key}>{children}</p>
  if (node.type === 'heading') {
    const text = lexicalToText({ root: node })
    const id = slugifyHeading(text)
    if (node.tag === 'h3') return <h3 key={key} id={id}>{children}</h3>
    return <h2 key={key} id={id}>{children}</h2>
  }
  if (node.type === 'list') {
    return node.listType === 'number' ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>
  }
  if (node.type === 'listitem') return <li key={key}>{children}</li>
  if (node.type === 'link' || node.type === 'autolink') {
    const href = node.fields && typeof node.fields.url === 'string' ? node.fields.url : node.url || '#'
    return (
      <a key={key} href={href}>
        {children}
      </a>
    )
  }
  if (node.type === 'quote') return <blockquote key={key}>{children}</blockquote>
  if (node.type === 'horizontalrule') return <hr key={key} className="my-8 border-stone" />
  if (node.type === 'upload' && node.value?.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={key} src={node.value.url} alt={node.value.alt || ''} width={node.value.width} height={node.value.height} className="mt-4 rounded-2xl" />
    )
  }
  if (node.type === 'block') return <BlockView key={key} fields={node.fields || {}} />
  return <div key={key}>{children}</div>
}

function BlockView({ fields }: { fields: Record<string, unknown> }) {
  const type = String(fields.blockType || '')
  if (type === 'callout') {
    return <aside className="mt-4 rounded-2xl border border-gold/70 bg-white p-4 text-sm leading-6">{String(fields.text || '')}</aside>
  }
  if (type === 'takeaways') {
    const items = Array.isArray(fields.items) ? (fields.items as { text?: string }[]) : []
    return (
      <div className="mt-4 rounded-2xl bg-ink p-5 text-ivory">
        <p className="text-xs uppercase tracking-[0.14em] text-gold">Key takeaways</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {items.map((item) => (
            <li key={item.text}>{item.text}</li>
          ))}
        </ul>
      </div>
    )
  }
  if (type === 'cta') return <Cta fields={fields} />
  if (type === 'quote') {
    return (
      <blockquote>
        {String(fields.quote || '')}
        {fields.attribution ? <footer className="mt-2 text-sm text-muted">— {String(fields.attribution)}</footer> : null}
      </blockquote>
    )
  }
  if (type === 'stat') {
    return (
      <p className="mt-4">
        <strong>{String(fields.value || '')}</strong> {String(fields.label || '')}{' '}
        {fields.sourceUrl ? (
          <a href={String(fields.sourceUrl)}>Source</a>
        ) : null}
      </p>
    )
  }
  if (type === 'video') {
    return <VideoFacade url={String(fields.url || '')} caption={String(fields.caption || '')} />
  }
  if (type === 'table') {
    const headers = Array.isArray(fields.headers) ? (fields.headers as { label?: string }[]) : []
    const rows = Array.isArray(fields.rows) ? (fields.rows as { cells?: { value?: string }[] }[]) : []
    return (
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.label}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {(row.cells || []).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell.value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  return null
}

function Cta({ fields }: { fields: Record<string, unknown> }) {
  const variant = String(fields.variant || 'card')
  if (variant === 'inline-fit-check') {
    return (
      <div className="mt-6 rounded-2xl border border-stone bg-white p-5">
        <h3 className="font-serif text-2xl">{String(fields.heading || 'See if you qualify')}</h3>
        {fields.body ? <p>{String(fields.body)}</p> : null}
        <div className="mt-4">
          <EmailCapture location="blog_inline" entry="blog" compact />
        </div>
      </div>
    )
  }
  const resource = fields.resource as { slug?: string } | string | undefined
  const slug = resource && typeof resource === 'object' ? resource.slug : undefined
  return (
    <div className="mt-6 rounded-2xl bg-wine p-5 text-ivory">
      <h3 className="font-serif text-2xl">{String(fields.heading || 'Apply for a sales team')}</h3>
      {fields.body ? <p className="mt-2 text-ivory/80">{String(fields.body)}</p> : null}
      {slug ? (
        <Link href={`/resources/${slug}`} className="mt-4 inline-block rounded-full bg-ivory px-4 py-2 text-sm text-ink">
          Get the guide
        </Link>
      ) : (
        <ApplyLink location="post_inline" className="mt-4 inline-block rounded-full bg-ivory px-4 py-2 text-sm text-ink">
          Apply
        </ApplyLink>
      )}
    </div>
  )
}

function VideoFacade({ url, caption }: { url: string; caption: string }) {
  return (
    <details className="mt-4 rounded-2xl border border-stone p-4">
      <summary className="cursor-pointer">Play video{caption ? `: ${caption}` : ''}</summary>
      <div className="mt-3 aspect-video">
        <iframe title={caption || 'Video'} src={url} className="h-full w-full rounded-xl" />
      </div>
    </details>
  )
}
