import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCampaign } from '../App.jsx'
import { assetUrl } from '../lib/data.js'
import Icon from '../components/Icon.jsx'

export default function LoreItem() {
  const campaign = useCampaign()
  const navigate = useNavigate()
  const { id } = useParams()
  const base = `/${campaign.id}`
  const item = campaign.lore.find((l) => l.id === id)

  if (!item) {
    return (
      <section style={{ maxWidth: 720 }}>
        <p className="text-muted">No existe esa entrada.</p>
        <Link to={`${base}/mundo`} className="btn btn-ghost">El mundo</Link>
      </section>
    )
  }

  const src = item.img ? assetUrl(item.img) : ''

  return (
    <section style={{ maxWidth: 720 }}>
      <button onClick={() => navigate(`${base}/mundo`)} className="btn btn-ghost" style={{ cursor: 'pointer', marginBottom: 'var(--space-6)' }}>
        <Icon name="arrowLeft" size={14} />
        El mundo
      </button>
      <span className="tag tag-outline" style={{ fontSize: 10, marginBottom: 'var(--space-3)', display: 'inline-block' }}>{item.type}</span>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>{item.name}</h1>
      <div style={{ aspectRatio: '16 / 8', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-8)', boxShadow: 'var(--shadow-sm)', background: 'var(--color-neutral-900)' }}>
        {src ? (
          <img src={src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-heading)', fontSize: 18 }}>
            {item.name}
          </div>
        )}
      </div>
      <div style={{ fontSize: 16, lineHeight: 1.7 }}>
        {item.paras.map((para, i) => (
          <p key={i} style={{ marginBottom: 'var(--space-4)', color: 'var(--color-neutral-200)' }}>{para}</p>
        ))}
      </div>
    </section>
  )
}
