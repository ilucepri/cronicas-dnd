import { useNavigate } from 'react-router-dom'

export default function EmptyCampaign({ name }) {
  const navigate = useNavigate()
  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
      <div className="card" style={{ maxWidth: 460, textAlign: 'center', padding: 'calc(var(--space-8) * 1.5)' }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-accent-400)', marginBottom: 'var(--space-3)' }}>
          Campaña de D&amp;D
        </div>
        <h2 style={{ marginBottom: 'var(--space-3)' }}>{name}</h2>
        <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>
          Aún no has volcado las notas de esta campaña aquí. Cuando las traigas de Obsidian, tendrán la misma estructura: sesiones, personajes, mundo y línea temporal.
        </p>
        <button onClick={() => navigate('/oro-sobre-plata')} className="btn btn-ghost" style={{ cursor: 'pointer' }}>
          Ir a Oro sobre Plata
        </button>
      </div>
    </main>
  )
}
