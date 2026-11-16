'use client'

import { useFormFields } from '@payloadcms/ui'

export default function SeoPreview() {
  const title = useFormFields(([fields]) => {
    const meta = fields['seo.metaTitle']?.value
    const fallback = fields.title?.value
    return String(meta || fallback || '')
  })
  const description = useFormFields(([fields]) => {
    const meta = fields['seo.metaDescription']?.value
    const fallback = fields.excerpt?.value
    return String(meta || fallback || '')
  })

  return (
    <div
      style={{
        border: '1px solid #e7e1d8',
        borderRadius: 16,
        padding: 16,
        background: '#fff',
        maxWidth: 560,
      }}
    >
      <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5e0b1a' }}>
        Search snippet
      </p>
      <p style={{ margin: '10px 0 0', color: '#1a0dab', fontSize: 20, lineHeight: 1.3 }}>
        {title || 'Add a meta title'}
      </p>
      <p style={{ margin: '4px 0 0', color: '#0b6b3a', fontSize: 13 }}>chateauxrouge.com › page</p>
      <p style={{ margin: '6px 0 0', color: '#3c4043', fontSize: 14, lineHeight: 1.45 }}>
        {description || 'Add a meta description'}
      </p>
      <p style={{ margin: '10px 0 0', fontSize: 12, color: '#3a3936' }}>
        Title {title.length}/60 · Description {description.length}/155
      </p>
    </div>
  )
}
