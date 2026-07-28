import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCampaign } from '../App.jsx'
import { assetUrl } from '../lib/data.js'
import Icon from '../components/Icon.jsx'

export default function Character() {
  const campaign = useCampaign()
  const navigate = useNavigate()
  const { id } = useParams()
  const base = `/${campaign.id}`
  const char = campaign.partyMembers.find((p) => p.id === id)

  if (!char) {
    return (
      <section style={{ maxWidth: 820 }}>
        <p className="text-muted">No existe ese personaje.</p>
        <Link to={`${base}/personajes`} className="btn btn-ghost">{campaign.party}</Link>
      </section>
    )
  }

  const src = char.img ? assetUrl(char.img) : ''

  return (
    <section style={{ maxWidth: 820 }}>
      <button onClick={() => navigate(`${base}/personajes`)} className="btn btn-ghost" style={{ cursor: 'pointer', marginBottom: 'var(--space-6)' }}>
        <Icon name="arrowLeft" size={14} />
        {campaign.party}
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div style={{ aspectRatio: '3 / 4', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', background: 'var(--color-neutral-900)' }}>
          {src ? (
            <img src={src} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutral-500)', fontFamily: 'var(--font-heading)', fontSize: 18, textAlign: 'center', padding: 12 }}>
              {char.name}
            </div>
          )}
        </div>
        <div>
          <h1 style={{ marginBottom: 'var(--space-2)' }}>{char.name}</h1>
          <div style={{ fontSize: 15, color: 'var(--color-accent-300)', marginBottom: 'var(--space-6)' }}>{char.tagline}</div>
          <div style={{ fontSize: 16, lineHeight: 1.7 }}>
            {char.blurb.map((para, i) => (
              <p key={i} style={{ marginBottom: 'var(--space-4)', color: 'var(--color-neutral-200)' }}>{para}</p>
            ))}
          </div>
          {char.facts && char.facts.length > 0 && (
            <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              {char.facts.map((f, i) => (
                <div key={i} style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', marginBottom: 2 }}>{f.label}</div>
                  <div style={{ fontSize: 14 }}>{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
