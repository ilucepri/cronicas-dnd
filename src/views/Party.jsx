import { Link } from 'react-router-dom'
import { useCampaign } from '../App.jsx'
import { assetUrl } from '../lib/data.js'

function Portrait({ member, ratio }) {
  const src = member.img ? assetUrl(member.img) : ''
  return (
    <div style={{ aspectRatio: ratio, background: 'var(--color-neutral-900)' }}>
      {src ? (
        <img src={src} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-heading)', fontSize: 15 }}>
          {member.short}
        </div>
      )}
    </div>
  )
}

export default function Party() {
  const campaign = useCampaign()
  const base = `/${campaign.id}`
  return (
    <section>
      <h2 style={{ marginBottom: 'var(--space-2)' }}>{campaign.party || 'El grupo'}</h2>
      <p className="text-muted" style={{ marginBottom: 'var(--space-6)', maxWidth: '60ch' }}>
        {campaign.intro}
      </p>
      {campaign.partyMembers.length === 0 && (
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <p className="text-muted" style={{ margin: 0 }}>Aún no hay fichas de personaje para esta campaña.</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        {campaign.partyMembers.map((p) => (
          <Link key={p.id} to={`${base}/personajes/${p.id}`} className="card hoverlift" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'left', border: 'none', padding: 0, overflow: 'hidden' }}>
            <Portrait member={p} ratio="3 / 2" />
            <div style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.dot }} />
                <div className="card-title" style={{ margin: 0, fontSize: 18 }}>{p.name}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-neutral-500)' }}>{p.tagline}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
