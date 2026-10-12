import DOMPurify from 'dompurify'
import { mediaUrl } from '../api/client'

function escapeText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function resolveUploadSrcs(html: string): string {
  return html.replace(
    /(src=["'])(\/uploads\/[^"']+)(["'])/gi,
    (_match, start: string, path: string, end: string) =>
      `${start}${mediaUrl(path)}${end}`,
  )
}

function allowSafeTextAlignStyles() {
  DOMPurify.removeAllHooks()
  DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName !== 'style') return
    const match = /text-align\s*:\s*(left|right|center|justify)\s*;?/i.exec(
      data.attrValue,
    )
    if (match) {
      data.attrValue = `text-align: ${match[1].toLowerCase()}`
      return
    }
    data.keepAttr = false
  })
}

/** Converte texto legado em HTML simples; sanitiza HTML do editor. */
export function sanitizeArticleHtml(body: string): string {
  const trimmed = body?.trim() || ''
  if (!trimmed) return ''

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(trimmed)
  const source = looksLikeHtml
    ? trimmed
    : `<p>${escapeText(trimmed).replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>')}</p>`

  allowSafeTextAlignStyles()

  const clean = DOMPurify.sanitize(source, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe'],
    ADD_ATTR: [
      'allow',
      'allowfullscreen',
      'frameborder',
      'src',
      'target',
      'rel',
      'class',
      'alt',
      'width',
      'height',
      'style',
    ],
  })

  DOMPurify.removeAllHooks()
  return resolveUploadSrcs(clean)
}
