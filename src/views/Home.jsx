import { Link, useNavigate } from 'react-router-dom'
import { useCampaign } from '../App.jsx'
import { formatDate, sessionNum, arcName, assetUrl } from '../lib/data.js'
import Icon from '../components/Icon.jsx'

function HeroCover({ campaign }) {
  const src = campaign.cover ? assetUrl(campaign.cover) : ''
  return (
    <div style={{ aspectRatio: '4 / 5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', background: 'var(--color-neutral-900)' }}>
      {src ? (
        <img src={src} alt={campaign.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-heading)', fontSize: 20, letterSpacing: '.04em' }}>
          {campaign.name}
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const campaign = useCampaign()
  const navigate = useNavigate()
  const base = `/${campaign.id}`

  const sessions = campaign.sessions
  const last = sessions[sessions.length - 1]
  const recent = sessions.slice(-5).reverse()

  const arcs = campaign.arcs.map((a) => {
    const ss = sessions.filter((s) => s.n >= a.from && s.n <= a.to)
    return { ...a, count: ss.length }
  })

  const loreTop = campaign.lore.slice(0, 5)

  return (
    <section>
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 'var(--space-8)', alignItems: 'center', marginBottom: 'calc(var(--space-8) * 1.6)' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-accent-400)', marginBottom: 'var(--space-3)' }}>
            {campaign.heroKicker || campaign.party}
          </div>
          <h1 style={{ fontSize: 52, letterSpacing: '-.03em', marginBottom: 'var(--space-4)' }}>{campaign.name}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--color-neutral-300)', maxWidth: '52ch', marginBottom: 'var(--space-6)' }}>
            {campaign.intro}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {last && (
              <button onClick={() => navigate(`${base}/sesion/${last.n}`)} className="btn btn-primary" style={{ cursor: 'pointer' }}>
                Continuar por la última sesión
                <Icon name="arrowRight" size={14} />
              </button>
            )}
            <button onClick={() => navigate(`${base}/sesiones`)} className="btn btn-ghost" style={{ cursor: 'pointer' }}>
              Explorar sesiones
            </button>
          </div>
        </div>
        <HeroCover campaign={campaign} />
      </div>

      {arcs.length > 0 && (<>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <h3>Los arcos de la historia</h3>
        <button onClick={() => navigate(`${base}/linea-temporal`)} className="btn btn-ghost" style={{ cursor: 'pointer', fontSize: 13 }}>
          Ver línea temporal
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'calc(var(--space-8) * 1.4)' }}>
        {arcs.map((a) => (
          <Link key={a.id} to={`${base}/sesiones?arco=${a.id}`} className="card hoverlift" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'left', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'var(--color-accent-300)', border: '1px solid var(--color-accent-800)', borderRadius: 'var(--radius-sm)', padding: '1px 7px' }}>{a.roman}</span>
              <span style={{ fontSize: 11, color: 'var(--color-neutral-500)' }}>{a.count} sesiones</span>
            </div>
            <div className="card-title" style={{ marginBottom: 'var(--space-2)' }}>{a.name}</div>
            <p className="card-body" style={{ margin: 0 }}>{a.sub}</p>
          </Link>
        ))}
      </div>
      </>)}

      <div style={{ display: 'grid', gridTemplateColumns: loreTop.length ? '1.4fr 1fr' : '1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3>Sesiones recientes</h3>
            <button onClick={() => navigate(`${base}/sesiones`)} className="btn btn-ghost" style={{ cursor: 'pointer', fontSize: 13 }}>Ver todas</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {recent.map((s) => (
              <Link key={s.n} to={`${base}/sesion/${s.n}`} className="rowbtn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'var(--color-neutral-500)', flex: 'none', width: 38 }}>{sessionNum(s.n)}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
                  {arcName(campaign, s.n) && <span style={{ display: 'block', fontSize: 11, color: 'var(--color-neutral-500)' }}>{arcName(campaign, s.n)}</span>}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-neutral-500)', flex: 'none' }}>{formatDate(s.date)}</span>
              </Link>
            ))}
          </div>
        </div>
        {loreTop.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>El mundo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {loreTop.map((l) => (
              <Link key={l.id} to={`${base}/mundo/${l.id}`} className="rowbtn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)' }}>
                <span style={{ flex: 1 }}>{l.name}</span>
                <span className="tag tag-outline" style={{ fontSize: 10 }}>{l.type}</span>
              </Link>
            ))}
            <button onClick={() => navigate(`${base}/mundo`)} className="btn btn-ghost" style={{ cursor: 'pointer', marginTop: 'var(--space-2)' }}>Todo el mundo</button>
          </div>
        </div>
        )}
      </div>
    </section>
  )
}
