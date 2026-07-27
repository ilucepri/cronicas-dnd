// Renderiza los bloques de markdown en el ORDEN del documento (REGLA CLAVE).
// Las imágenes van justo donde aparecen en la nota, en contenedor 16/9.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { parseBlocks, parseRuns } from '../lib/markdown.js'
import { assetUrl } from '../lib/data.js'
import Icon from './Icon.jsx'

function Runs({ runs, resolveLink, campaignId }) {
  return runs.map((r, i) => {
    if (r.type === 'bold')
      return (
        <strong key={i} style={{ color: 'var(--color-text)' }}>
          <Runs runs={r.children} resolveLink={resolveLink} campaignId={campaignId} />
        </strong>
      )
    if (r.type === 'italic')
      return (
        <em key={i}>
          <Runs runs={r.children} resolveLink={resolveLink} campaignId={campaignId} />
        </em>
      )
    if (r.type === 'code')
      return (
        <code key={i} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '.9em', background: 'var(--color-neutral-900)', padding: '1px 5px', borderRadius: 4 }}>
          {r.text}
        </code>
      )
    if (r.type === 'dialogue')
      return (
        <span key={i} className="dlg">
          {r.open}
          <Runs runs={r.children} resolveLink={resolveLink} campaignId={campaignId} />
          {r.close}
        </span>
      )
    if (r.type === 'wikilink') {
      const hit = resolveLink ? resolveLink(r.target) : null
      if (hit) {
        const to =
          hit.kind === 'char'
            ? `/${campaignId}/personajes/${hit.id}`
            : `/${campaignId}/mundo/${hit.id}`
        return (
          <Link key={i} to={to} className="lnk">
            {r.text}
          </Link>
        )
      }
      return (
        <span key={i} className="lnk-plain" title={r.target}>
          {r.text}
        </span>
      )
    }
    return <span key={i}>{r.text}</span>
  })
}

function SessionImage({ alt, src }) {
  const [failed, setFailed] = useState(false)
  const url = src ? assetUrl(src) : ''
  const showPlaceholder = !url || failed
  return (
    <div
      style={{
        aspectRatio: '16 / 9',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        margin: '0 0 18px',
        boxShadow: 'var(--shadow-sm)',
        background: 'var(--color-neutral-900)',
      }}
    >
      {showPlaceholder ? (
        <div
          style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center', padding: 16,
            color: 'var(--color-neutral-500)', fontSize: 13, fontStyle: 'italic',
          }}
        >
          {alt || 'Imagen de la sesión'}
        </div>
      ) : (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  )
}

function Callout({ block, resolveLink, campaignId }) {
  const isWarn = block.kind === 'WARNING'
  const accent = isWarn ? 'var(--color-accent-400)' : 'var(--color-neutral-400)'
  const bg = isWarn ? 'var(--color-accent-900)' : 'var(--color-neutral-900)'
  return (
    <div
      style={{
        border: `1px solid ${accent}`,
        background: bg,
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        margin: '0 0 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: block.lines.length ? 6 : 0, color: accent, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <Icon name={isWarn ? 'warning' : 'info'} size={15} color={accent} />
        <span>{block.title || block.label}</span>
      </div>
      {block.lines.map((line, i) => (
        <p key={i} style={{ margin: i === block.lines.length - 1 ? 0 : '0 0 8px', color: 'var(--color-neutral-200)' }}>
          <Runs runs={parseInline(line)} resolveLink={resolveLink} campaignId={campaignId} />
        </p>
      ))}
    </div>
  )
}

// parseInline reutiliza el parser de runs para líneas sueltas (callouts).
function parseInline(line) {
  return parseRuns(line)
}

export default function Markdown({ body, resolveLink, campaignId }) {
  const blocks = parseBlocks(body)
  return (
    <div style={{ fontSize: 16, lineHeight: 1.7 }}>
      {blocks.map((b, i) => {
        const rp = { resolveLink, campaignId }
        switch (b.type) {
          // Escala de encabezados: los cuatro niveles se distinguen claramente.
          case 'h1':
            return (
              <div key={i} style={{ margin: '44px 0 18px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 34, lineHeight: 1.15, letterSpacing: '-.02em', margin: '0 0 10px' }}>
                  <Runs runs={b.runs} {...rp} />
                </h2>
                <div style={{ height: 2, background: 'linear-gradient(to right, var(--color-accent-400), var(--color-accent-700) 55%, transparent)' }} />
              </div>
            )
          case 'h2':
            return (
              <h3 key={i} style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 27, lineHeight: 1.2, letterSpacing: '-.015em', margin: '38px 0 14px', paddingLeft: 16, borderLeft: '3px solid var(--color-accent-400)' }}>
                <Runs runs={b.runs} {...rp} />
              </h3>
            )
          case 'h3':
            return (
              <h4 key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 21, lineHeight: 1.25, margin: '30px 0 10px', color: 'var(--color-accent-300)' }}>
                <span style={{ flex: 'none', width: 7, height: 7, transform: 'rotate(45deg)', background: 'var(--color-accent-400)' }} />
                <span><Runs runs={b.runs} {...rp} /></span>
              </h4>
            )
          case 'h4':
            return (
              <h5 key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-accent-400)', margin: '26px 0 8px' }}>
                <span><Runs runs={b.runs} {...rp} /></span>
                <span style={{ flex: 1, height: 1, background: 'linear-gradient(to right, var(--color-accent-800), transparent)' }} />
              </h5>
            )
          case 'p':
            return <p key={i} style={{ marginBottom: 14, color: 'var(--color-neutral-200)' }}><Runs runs={b.runs} {...rp} /></p>
          case 'quote':
            // Diálogo del autor: párrafo normal en azul, entre comillas “…”.
            return (
              <p key={i} style={{ margin: '0 0 14px', color: 'var(--color-dialogue)' }}>
                {'“'}
                <Runs runs={b.runs} {...rp} />
                {'”'}
              </p>
            )
          case 'list':
            return (
              <ul key={i} style={{ margin: '0 0 16px', paddingLeft: 20, color: 'var(--color-neutral-200)' }}>
                {b.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 6 }}><Runs runs={item} {...rp} /></li>
                ))}
              </ul>
            )
          case 'callout':
            return <Callout key={i} block={b} {...rp} />
          case 'img':
            return <SessionImage key={i} alt={b.alt} src={b.src} />
          default:
            return null
        }
      })}
    </div>
  )
}
