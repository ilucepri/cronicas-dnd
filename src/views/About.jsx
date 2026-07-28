import { getAbout, assetUrl } from '../lib/data.js'

// Página "Sobre mí" — de sitio, la misma en cualquier campaña.
export default function About() {
  const about = getAbout()
  if (!about) return null
  const src = about.img ? assetUrl(about.img) : ''

  return (
    <section style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-6)' }}>
        <span style={{ width: 24, height: 1, background: 'var(--color-accent-400)' }} />
        <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>
          {about.kicker || 'Sobre mí'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', background: 'var(--color-neutral-900)' }}>
          {src ? (
            <img src={src} alt={about.heading} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-500)', fontSize: 13, fontStyle: 'italic', textAlign: 'center', padding: 12 }}>
              Tu foto o avatar
            </div>
          )}
        </div>

        <div>
          <h2 style={{ fontSize: 30, letterSpacing: '-.02em', margin: '0 0 var(--space-3)' }}>{about.heading}</h2>
          {about.paras.map((p, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-neutral-300)', maxWidth: '62ch', margin: `0 0 ${i === about.paras.length - 1 ? 'var(--space-6)' : 'var(--space-4)'}`, textWrap: 'pretty' }}>
              {p}
            </p>
          ))}

          {about.facts && about.facts.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 190px))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {about.facts.map((f, i) => (
                <div key={i} style={{ borderLeft: '2px solid var(--color-accent-800)', paddingLeft: 'var(--space-3)' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', marginBottom: 3 }}>{f.label}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>{f.value}</div>
                </div>
              ))}
            </div>
          )}

          {about.tags && about.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {about.tags.map((t, i) => (
                <span key={i} className="tag tag-outline">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
