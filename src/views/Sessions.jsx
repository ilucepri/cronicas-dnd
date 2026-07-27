import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCampaign } from '../App.jsx'
import { formatDate, sessionNum, arcName, normalize } from '../lib/data.js'
import Icon from '../components/Icon.jsx'

export default function Sessions() {
  const campaign = useCampaign()
  const base = `/${campaign.id}`
  const [params, setParams] = useSearchParams()
  const arc = params.get('arco') || 'all'
  const [query, setQuery] = useState('')

  const setArc = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('arco')
    else next.set('arco', id)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    const list = campaign.sessions.filter((s) => {
      if (arc !== 'all' && s.arcId !== arc) return false
      if (!q) return true
      return (
        normalize(s.title).includes(q) ||
        String(s.n).includes(q) ||
        sessionNum(s.n).toLowerCase().includes(q) ||
        normalize(s.body).includes(q)
      )
    })
    return list.slice().reverse()
  }, [campaign, arc, query])

  const segBase = {
    all: 'unset', cursor: 'pointer', fontSize: 12, padding: '5px 11px',
    borderRadius: 999, border: '1px solid var(--color-divider)',
  }
  const seg = [{ id: 'all', label: 'Todos' }].concat(campaign.arcs.map((a) => ({ id: a.id, label: `${a.roman} · ${a.name}` })))

  return (
    <section>
      <h2 style={{ marginBottom: 'var(--space-2)' }}>Sesiones</h2>
      <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>{filtered.length} de {campaign.sessions.length} sesiones</p>

      <div className="field" style={{ marginBottom: 'var(--space-4)', maxWidth: 420 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutral-500)', display: 'flex' }}>
            <Icon name="search" size={16} />
          </span>
          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, número o texto…"
            style={{ paddingLeft: 36, width: '100%' }}
          />
        </div>
      </div>

      {campaign.arcs.length > 0 && (
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        {seg.map((a) => {
          const on = arc === a.id
          return (
            <button
              key={a.id}
              onClick={() => setArc(a.id)}
              style={{
                ...segBase,
                ...(on
                  ? { background: 'var(--color-accent-900)', color: 'var(--color-accent-200)', borderColor: 'var(--color-accent-700)' }
                  : { color: 'var(--color-neutral-300)' }),
              }}
            >
              {a.label}
            </button>
          )
        })}
      </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {filtered.map((s) => (
          <Link
            key={s.n}
            to={`${base}/sesion/${s.n}`}
            className="rowbtn"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)' }}
          >
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'var(--color-accent-300)', flex: 'none', width: 44 }}>{sessionNum(s.n)}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
              {arcName(campaign, s.n) && <span style={{ display: 'block', fontSize: 11, color: 'var(--color-neutral-500)' }}>{arcName(campaign, s.n)}</span>}
            </span>
            <span className="tag tag-neutral" style={{ fontSize: 10, flex: 'none' }}>{s.hasBody ? 'resumen' : '—'}</span>
            <span style={{ fontSize: 12, color: 'var(--color-neutral-500)', flex: 'none', width: 96, textAlign: 'right' }}>{formatDate(s.date)}</span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>No hay sesiones que coincidan con la búsqueda.</p>
        )}
      </div>
    </section>
  )
}
