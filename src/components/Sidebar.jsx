import { NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

const NAV = [
  { to: '', label: 'Inicio', icon: 'home', end: true },
  { to: 'sesiones', label: 'Sesiones', icon: 'list', countKey: 'sessions' },
  { to: 'personajes', label: 'Personajes', icon: 'users', countKey: 'party' },
  { to: 'mundo', label: 'El mundo', icon: 'compass', countKey: 'lore' },
  { to: 'linea-temporal', label: 'Línea temporal', icon: 'clock' },
]

// Plural del tipo de entrada para las cabeceras de grupo del índice.
const TYPE_GROUP = { Colegio: 'Colegios', Lugar: 'Lugares', NPC: 'NPCs', Dragón: 'Dragones', Misión: 'Misiones' }

const ASIDE_STYLE = {
  width: 266, flex: 'none', borderRight: '1px solid var(--color-divider)',
  padding: 'var(--space-6) var(--space-4)', display: 'flex', flexDirection: 'column',
  gap: 'var(--space-6)', position: 'sticky', top: 53, height: 'calc(100vh - 53px)', overflow: 'auto',
}

function TitleBlock({ campaign, base }) {
  return (
    <NavLink to={base} end className="navbtn" style={{ all: 'unset', cursor: 'pointer', display: 'block', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
      <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-accent-400)', marginBottom: 2 }}>
        {campaign.kicker || 'Crónica de campaña'}
      </div>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 21, lineHeight: 1.05, letterSpacing: '-.02em' }}>{campaign.name}</div>
      <div style={{ fontSize: 12, color: 'var(--color-neutral-500)', marginTop: 3 }}>{campaign.subtitle}</div>
    </NavLink>
  )
}

// --- Ambientaciones (grupo master): el menú ES el índice del setting --------
function SettingSidebar({ campaign }) {
  const base = `/${campaign.id}`
  const location = useLocation()
  const m = location.pathname.match(/\/mundo\/([^/]+)/)
  const activeId = m ? m[1] : null

  const byName = (a, b) => a.name.localeCompare(b.name, 'es')
  const topLevel = campaign.lore.filter((l) => !l.type).sort(byName)
  const groups = {}
  for (const l of campaign.lore.filter((l) => l.type)) (groups[l.type] ||= []).push(l)

  const row = (l) => (
    <NavLink
      key={l.id}
      to={`${base}/mundo/${l.id}`}
      className="navbtn"
      style={{
        all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 11px', borderRadius: 'var(--radius-md)', fontSize: 14,
        ...(activeId === l.id
          ? { background: 'var(--color-accent-900)', color: 'var(--color-accent-200)', boxShadow: 'inset 0 0 0 1px var(--color-accent-800)' }
          : { color: 'var(--color-neutral-300)' }),
      }}
    >
      <span style={{ flex: 'none', width: 6, height: 6, transform: 'rotate(45deg)', background: activeId === l.id ? 'var(--color-accent-400)' : 'var(--color-neutral-600)' }} />
      <span style={{ flex: 1, textAlign: 'left' }}>{l.name}</span>
    </NavLink>
  )

  return (
    <aside style={ASIDE_STYLE}>
      <TitleBlock campaign={campaign} base={base} />

      {topLevel.length > 0 && (
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{topLevel.map(row)}</nav>
      )}

      {Object.keys(groups).sort().map((type) => (
        <div key={type}>
          <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', margin: '0 var(--space-3) var(--space-2)' }}>
            {TYPE_GROUP[type] || type}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {groups[type].sort(byName).map((l) => (
              <NavLink
                key={l.id}
                to={`${base}/mundo/${l.id}`}
                className="rowbtn"
                style={{
                  all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                  padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 13,
                  ...(activeId === l.id ? { background: 'var(--color-accent-900)', color: 'var(--color-accent-200)' } : { color: 'var(--color-neutral-300)' }),
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', flex: 'none', background: 'var(--color-accent-400)' }} />
                <span style={{ flex: 1 }}>{l.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}

// --- Campañas y one-shots (menú estándar) -----------------------------------
function CampaignSidebar({ campaign }) {
  const base = `/${campaign.id}`
  const location = useLocation()
  const counts = {
    sessions: campaign.sessions.length,
    party: campaign.partyMembers.length,
    lore: campaign.lore.length,
  }

  const section = location.pathname.replace(base, '').split('/').filter(Boolean)[0] || ''
  const activeMap = { sesion: 'sesiones', personajes: 'personajes', mundo: 'mundo' }
  const activeSection = activeMap[section] || section

  return (
    <aside style={ASIDE_STYLE}>
      <TitleBlock campaign={campaign} base={base} />

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map((item) => {
          const target = item.to ? `${base}/${item.to}` : base
          const isActive = item.to ? activeSection === item.to : activeSection === ''
          return (
            <NavLink
              key={item.label}
              to={target}
              end={item.end}
              className="navbtn"
              style={{
                all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 11px', borderRadius: 'var(--radius-md)', fontSize: 14,
                ...(isActive
                  ? { background: 'var(--color-accent-900)', color: 'var(--color-accent-200)', boxShadow: 'inset 0 0 0 1px var(--color-accent-800)' }
                  : { color: 'var(--color-neutral-300)' }),
              }}
            >
              <Icon name={item.icon} size={17} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.countKey && <span style={{ fontSize: 11, opacity: 0.7 }}>{counts[item.countKey]}</span>}
            </NavLink>
          )
        })}
      </nav>

      {campaign.partyMembers.length > 0 && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-neutral-500)', margin: '0 var(--space-3) var(--space-2)' }}>
            {campaign.party || 'El grupo'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {campaign.partyMembers.map((p) => (
              <NavLink
                key={p.id}
                to={`${base}/personajes/${p.id}`}
                className="rowbtn"
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)' }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', flex: 'none', background: p.dot }} />
                <span style={{ flex: 1, fontSize: 13 }}>{p.name}</span>
                <span style={{ fontSize: 11, color: 'var(--color-neutral-500)' }}>{p.short}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {campaign.footer && (
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-divider)', fontSize: 12, color: 'var(--color-neutral-500)', lineHeight: 1.5 }}>
          <div style={{ color: 'var(--color-neutral-300)' }}>
            Última sesión · {campaign.sessions.length ? 'EP' + String(campaign.sessions[campaign.sessions.length - 1].n).padStart(3, '0') : '—'}
          </div>
          {campaign.footer.line1 && <div>{campaign.footer.line1}</div>}
        </div>
      )}
    </aside>
  )
}

export default function Sidebar({ campaign }) {
  return campaign.group === 'master'
    ? <SettingSidebar campaign={campaign} />
    : <CampaignSidebar campaign={campaign} />
}
