import { useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCampaign } from '../App.jsx'
import { formatDate, sessionNum, arcName, buildLinkResolver } from '../lib/data.js'
import Markdown from '../components/Markdown.jsx'
import Icon from '../components/Icon.jsx'

export default function Session() {
  const campaign = useCampaign()
  const navigate = useNavigate()
  const { n } = useParams()
  const base = `/${campaign.id}`
  const num = parseInt(n, 10)

  const resolveLink = useMemo(() => buildLinkResolver(campaign), [campaign])

  const idx = campaign.sessions.findIndex((s) => s.n === num)
  const cur = idx >= 0 ? campaign.sessions[idx] : null
  const prev = idx > 0 ? campaign.sessions[idx - 1] : null
  const next = idx >= 0 && idx < campaign.sessions.length - 1 ? campaign.sessions[idx + 1] : null

  if (!cur) {
    return (
      <section style={{ maxWidth: 760 }}>
        <p className="text-muted">No existe esa sesión.</p>
        <Link to={`${base}/sesiones`} className="btn btn-ghost">Volver a sesiones</Link>
      </section>
    )
  }

  return (
    <section style={{ maxWidth: 760 }}>
      <button onClick={() => navigate(`${base}/sesiones`)} className="btn btn-ghost" style={{ cursor: 'pointer', marginBottom: 'var(--space-6)' }}>
        <Icon name="arrowLeft" size={14} />
        Volver a sesiones
      </button>

      {arcName(campaign, cur.n) && (
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-accent-400)', marginBottom: 'var(--space-2)' }}>
          {arcName(campaign, cur.n)}
        </div>
      )}
      <h1 style={{ marginBottom: 'var(--space-3)' }}>{cur.title}</h1>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-6)', color: 'var(--color-neutral-500)', fontSize: 13 }}>
        <span style={{ fontFamily: 'var(--font-heading)' }}>{sessionNum(cur.n)}</span><span>·</span>
        <span>{formatDate(cur.date)}</span><span>·</span>
        {campaign.hashtag && <span className="tag tag-accent" style={{ fontSize: 10 }}>#{campaign.hashtag}</span>}
        <span className="tag tag-outline" style={{ fontSize: 10 }}>#dnd/session</span>
      </div>

      {cur.hasBody ? (
        <Markdown body={cur.body} resolveLink={resolveLink} campaignId={campaign.id} />
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p style={{ marginBottom: 'var(--space-2)', color: 'var(--color-neutral-300)' }}>Aún no hay resumen para esta sesión.</p>
          <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>Cuando pases tus notas de Obsidian, el texto irá aquí con el mismo formato que las demás.</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', marginTop: 'calc(var(--space-8) * 1.4)', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-6)' }}>
        <NavBtn dir="prev" session={prev} base={base} />
        <NavBtn dir="next" session={next} base={base} />
      </div>
    </section>
  )
}

function NavBtn({ dir, session, base }) {
  const isPrev = dir === 'prev'
  const content = (
    <>
      {isPrev && <Icon name="arrowLeft" size={15} />}
      <span style={{ textAlign: isPrev ? 'left' : 'right' }}>
        <span style={{ display: 'block', fontSize: 11, color: 'var(--color-neutral-500)' }}>{isPrev ? 'Anterior' : 'Siguiente'}</span>
        <span style={{ fontSize: 13 }}>{session ? sessionNum(session.n) : '—'}</span>
      </span>
      {!isPrev && <Icon name="arrowRight" size={15} />}
    </>
  )
  const style = {
    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
    textDecoration: 'none', color: 'inherit',
  }
  if (!session) return <span style={{ ...style, opacity: 0.35 }}>{content}</span>
  return (
    <Link to={`${base}/sesion/${session.n}`} className="rowbtn" style={style}>
      {content}
    </Link>
  )
}
