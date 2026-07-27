import { Link } from 'react-router-dom'
import { useCampaign } from '../App.jsx'
import { formatDate, sessionNum } from '../lib/data.js'

function SessionChips({ sessions, base }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
      {sessions.map((s) => (
        <Link
          key={s.n}
          to={`${base}/sesion/${s.n}`}
          title={s.title}
          className="rowbtn"
          style={{ textDecoration: 'none', display: 'inline-block', fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--color-neutral-300)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-sm)', padding: '3px 8px' }}
        >
          {sessionNum(s.n)}
        </Link>
      ))}
    </div>
  )
}

export default function Timeline() {
  const campaign = useCampaign()
  const base = `/${campaign.id}`
  const hasArcs = campaign.arcs.length > 0

  let nodes
  if (hasArcs) {
    nodes = campaign.arcs.map((a) => {
      const ss = campaign.sessions.filter((s) => s.n >= a.from && s.n <= a.to)
      const first = ss[0]
      const last = ss[ss.length - 1]
      const range = first && last ? `${formatDate(first.date).slice(-4)}–${formatDate(last.date).slice(-4)}` : ''
      return { key: a.id, label: `Arco ${a.roman}`, title: a.name, sub: a.sub, meta: range, sessions: ss }
    })
  } else {
    // Sin arcos: agrupa por año.
    const byYear = new Map()
    for (const s of campaign.sessions) {
      const y = s.date.slice(0, 4)
      if (!byYear.has(y)) byYear.set(y, [])
      byYear.get(y).push(s)
    }
    nodes = [...byYear.entries()].map(([y, ss]) => ({
      key: y, label: y, title: '', sub: '', meta: `${ss.length} ${ss.length === 1 ? 'sesión' : 'sesiones'}`, sessions: ss,
    }))
  }

  return (
    <section style={{ maxWidth: 860 }}>
      <h2 style={{ marginBottom: 'var(--space-2)' }}>Línea temporal</h2>
      <p className="text-muted" style={{ marginBottom: 'var(--space-8)' }}>
        {hasArcs ? 'La campaña arco por arco, de la primera sesión a la última.' : 'La campaña año por año, de la primera sesión a la última.'}
      </p>
      <div style={{ position: 'relative', paddingLeft: 'var(--space-8)' }}>
        <div style={{ position: 'absolute', left: 7, top: 6, bottom: 6, width: 2, background: 'linear-gradient(var(--color-accent-700), var(--color-neutral-800))' }} />
        {nodes.map((n) => (
          <div key={n.key} style={{ position: 'relative', marginBottom: 'var(--space-8)' }}>
            <div style={{ position: 'absolute', left: -30, top: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--color-bg)', border: '2px solid var(--color-accent-400)' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'var(--color-accent-300)' }}>{n.label}</span>
              {n.meta && <span style={{ fontSize: 11, color: 'var(--color-neutral-500)' }}>{n.meta}</span>}
            </div>
            {n.title && <h4 style={{ marginBottom: 'var(--space-1)' }}>{n.title}</h4>}
            {n.sub && <p className="text-muted" style={{ fontSize: 13, marginBottom: 'var(--space-3)' }}>{n.sub}</p>}
            {!n.title && <div style={{ marginBottom: 'var(--space-2)' }} />}
            <SessionChips sessions={n.sessions} base={base} />
          </div>
        ))}
      </div>
    </section>
  )
}
