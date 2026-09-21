import { Link } from 'react-router-dom'
import { campaignsIndex, getCampaign, assetUrl } from '../lib/data.js'
import Icon from '../components/Icon.jsx'

const HEADER = (import.meta.env.BASE_URL || '/') + 'header.jpg'

const GROUPS = [
  { key: 'campaña', label: 'Campañas', sub: 'Las crónicas largas que juego, sesión a sesión.' },
  { key: 'oneshot', label: 'One-shots', sub: 'Aventuras cortas, de una tarde o unas pocas sesiones.' },
  { key: 'master', label: 'Que mastereo', sub: 'Las ambientaciones que preparo como máster.' },
]

function cardMeta(c, data) {
  if (c.group === 'master') return `${c.lore} ${c.lore === 1 ? 'entrada' : 'entradas'} de mundo`
  const arcs = (data.arcs || []).length
  const s = `${c.count} ${c.count === 1 ? 'sesión' : 'sesiones'}`
  if (c.group === 'oneshot') return `One-shot · ${s}`
  return arcs > 0 ? `${s} · ${arcs} arcos` : s
}

function Cover({ data }) {
  const src = data.cover ? assetUrl(data.cover) : ''
  if (src) {
    return <img src={src} alt={data.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
  }
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, textAlign: 'center', background: 'linear-gradient(135deg, var(--color-neutral-800), var(--color-neutral-900))' }}>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, letterSpacing: '-.02em', color: 'var(--color-neutral-400)' }}>{data.name}</span>
    </div>
  )
}

function CampaignCard({ c }) {
  const data = getCampaign(c.id)
  if (!data) return null
  return (
    <Link
      to={`/${c.id}`}
      className="card hoverlift"
      style={{ textDecoration: 'none', color: 'inherit', border: 'none', padding: 0, overflow: 'hidden', height: '100%' }}
    >
      <div style={{ aspectRatio: '3 / 2', flex: '0 0 auto', background: 'var(--color-neutral-900)', overflow: 'hidden' }}>
        <Cover data={data} />
      </div>
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          <div className="card-title" style={{ margin: 0, fontSize: 20 }}>{data.name}</div>
        </div>
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-accent-300)' }}>{cardMeta(c, data)}</div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--color-neutral-300)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {data.intro}
        </p>
      </div>
    </Link>
  )
}

export default function Landing() {
  const totalSessions = campaignsIndex.reduce((n, c) => n + (c.count || 0), 0)
  const totalCronicas = campaignsIndex.length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Hero */}
      <header style={{ position: 'relative', minHeight: 380, overflow: 'hidden', borderBottom: '1px solid var(--color-divider)', background: '#171526' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${HEADER}')`, backgroundSize: 'cover', backgroundPosition: 'center 38%', filter: 'saturate(.8) brightness(.9) contrast(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, #171526 0%, rgba(23,21,38,.92) 30%, rgba(23,21,38,.55) 52%, rgba(23,21,38,.15) 78%, rgba(23,21,38,0) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,21,38,.9) 0%, transparent 45%)' }} />
        <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto', minHeight: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--space-4)', padding: 'var(--space-8) var(--space-8) calc(var(--space-8) * 1.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="crest" size={30} color="var(--color-accent-400)" />
            <span style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>Archivo de mesa de rol</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 62, lineHeight: 1, letterSpacing: '-.03em', textShadow: '0 2px 16px rgba(0,0,0,.6)' }}>
            Observatorio Arcano
          </h1>
          <p style={{ margin: 0, maxWidth: '52ch', fontSize: 18, lineHeight: 1.6, color: 'var(--color-neutral-200)', textShadow: '0 1px 8px rgba(0,0,0,.5)' }}>
            El rincón donde guardo y ordeno las notas de mis partidas de rol: campañas de años, one-shots de una tarde y las ambientaciones que preparo como máster.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: 'var(--color-accent-200)' }}>
              {totalCronicas} crónicas · {totalSessions}+ sesiones
            </span>
            <Link to="/oro-sobre-plata/sobre-mi" className="btn btn-primary" style={{ background: 'color-mix(in srgb, var(--color-bg) 55%, transparent)' }}>
              <Icon name="user" size={14} /> Sobre mí
            </Link>
          </div>
        </div>
      </header>

      {/* Escaparate */}
      <main style={{ maxWidth: 1120, margin: '0 auto', padding: 'calc(var(--space-8) * 1.4) var(--space-8) 64px', display: 'flex', flexDirection: 'column', gap: 'calc(var(--space-8) * 1.6)' }}>
        {GROUPS.map((g) => {
          const items = campaignsIndex.filter((c) => (c.group || 'campaña') === g.key)
          if (items.length === 0) return null
          return (
            <section key={g.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-2)' }}>
                <span style={{ width: 22, height: 1, background: 'var(--color-accent-400)' }} />
                <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>{g.label}</span>
              </div>
              <p className="text-muted" style={{ margin: '0 0 var(--space-6)', fontSize: 14 }}>{g.sub}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gridAutoRows: '1fr', gap: 'var(--space-4)' }}>
                {items.map((c) => <CampaignCard key={c.id} c={c} />)}
              </div>
            </section>
          )
        })}
      </main>

      <footer style={{ borderTop: '1px solid var(--color-divider)', padding: 'var(--space-6) var(--space-8)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap', color: 'var(--color-neutral-500)', fontSize: 12 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: 'var(--color-neutral-300)' }}>Observatorio Arcano</span>
          <Link to="/oro-sobre-plata/sobre-mi" style={{ color: 'var(--color-accent-300)', textDecoration: 'none' }}>Sobre mí</Link>
        </div>
      </footer>
    </div>
  )
}
