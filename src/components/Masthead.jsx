import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

// Cabecera de sitio (masthead). 210px, imagen de fondo apagada + dos degradados
// para que el título respire, y el nombre del archivo. NO es sticky: scrollea.
export default function Masthead() {
  const img = (import.meta.env.BASE_URL || '/') + 'header.jpg'
  return (
    <div style={{ position: 'relative', height: 210, flex: 'none', overflow: 'hidden', borderBottom: '1px solid var(--color-divider)', background: '#171526' }}>
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center 42%',
          filter: 'saturate(.8) brightness(.92) contrast(1.05)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, #171526 0%, rgba(23,21,38,.9) 22%, rgba(23,21,38,.45) 44%, rgba(23,21,38,.05) 70%, rgba(23,21,38,0) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,21,38,.8) 0%, transparent 48%)' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6, padding: '0 var(--space-8)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', color: 'var(--color-text)' }}>
          <Icon name="crest" size={26} color="var(--color-accent-400)" />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 38, lineHeight: 1, letterSpacing: '-.03em', textShadow: '0 2px 12px rgba(0,0,0,.6)' }}>
            Observatorio Arcano
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 37 }}>
          <span style={{ width: 20, height: 1, background: 'var(--color-accent-400)' }} />
          <span style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--color-accent-400)' }}>
            Archivo de mesa · campañas y one-shots
          </span>
        </div>
      </div>
    </div>
  )
}
