import { Link } from 'react-router-dom'
import { useCampaign } from '../App.jsx'

export default function Lore() {
  const campaign = useCampaign()
  const base = `/${campaign.id}`
  return (
    <section>
      <h2 style={{ marginBottom: 'var(--space-2)' }}>El mundo</h2>
      <p className="text-muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '60ch' }}>
        Lugares, entidades y saberes de Faerûn que enmarcan la campaña.
      </p>
      {campaign.lore.length === 0 && (
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p className="text-muted" style={{ margin: 0 }}>Aún no hay entradas de mundo para esta campaña.</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
        {campaign.lore.map((l) => (
          <Link key={l.id} to={`${base}/mundo/${l.id}`} className="card hoverlift" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'left', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
              <div className="card-title" style={{ margin: 0 }}>{l.name}</div>
              {l.type && <span className="tag tag-outline" style={{ fontSize: 10, flex: 'none' }}>{l.type}</span>}
            </div>
            <p className="card-body" style={{ margin: 0 }}>{l.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
