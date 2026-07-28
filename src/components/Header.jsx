import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { campaignsIndex } from '../lib/data.js'
import Icon from './Icon.jsx'

export default function Header({ campaignId, meta, arcCount }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const onAbout = location.pathname.endsWith('/sobre-mi')

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const choose = (id) => {
    setOpen(false)
    navigate(`/${id}`)
  }

  const metaText =
    meta && meta.populated
      ? `${meta.count} ${meta.count === 1 ? 'sesión' : 'sesiones'}` + (arcCount > 0 ? ` · ${arcCount} arcos` : '')
      : 'Sin notas todavía'

  return (
    <header
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-6)',
        padding: 'var(--space-3) var(--space-8)',
        borderBottom: '1px solid var(--color-divider)',
        position: 'sticky', top: 0, zIndex: 30,
        background: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ position: 'relative', flex: 'none' }}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="navbtn"
          aria-haspopup="listbox"
          aria-expanded={open}
          style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: 10, padding: '6px 12px 6px 10px', borderRadius: 'var(--radius-md)',
            boxShadow: 'inset 0 0 0 1px var(--color-divider)', background: 'var(--color-surface)',
          }}
        >
          <Icon name="crest" size={16} color="var(--color-accent-400)" />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16 }}>{meta ? meta.name : '—'}</span>
          <Icon name="chevronDown" size={14} color="var(--color-neutral-400)" />
        </button>

        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 35 }} />
            <div
              role="listbox"
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: 296, zIndex: 40,
                background: 'var(--color-surface)', borderRadius: 10, boxShadow: 'var(--shadow-lg)',
                padding: 8, display: 'flex', flexDirection: 'column', gap: 2,
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--color-neutral-400)', padding: '6px 10px 4px' }}>
                Cambiar de campaña
              </div>
              {campaignsIndex.map((c) => {
                const active = c.id === campaignId
                return (
                  <button
                    key={c.id}
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(c.id)}
                    className="rowbtn"
                    style={{
                      all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      gap: 10, padding: '8px 10px', borderRadius: 7, fontSize: 15,
                      background: active ? 'var(--color-accent-900)' : 'transparent',
                      fontFamily: active ? 'var(--font-heading)' : 'inherit',
                      color: active ? 'var(--color-text)' : 'var(--color-neutral-300)',
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 99, flex: 'none', background: active ? 'var(--color-accent-400)' : 'var(--color-divider)' }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-neutral-400)' }}>{c.populated ? c.count : '—'}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      <span style={{ fontSize: 12, color: 'var(--color-neutral-400)' }}>{metaText}</span>
      <span style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 'none' }}>
        <button
          onClick={() => navigate(`/${campaignId}/sobre-mi`)}
          className="navbtn"
          style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 11px', borderRadius: 'var(--radius-md)', fontSize: 13,
            ...(onAbout
              ? { background: 'var(--color-accent-900)', color: 'var(--color-accent-200)', boxShadow: 'inset 0 0 0 1px var(--color-accent-800)' }
              : { color: 'var(--color-neutral-300)' }),
          }}
        >
          <Icon name="user" size={15} />
          Sobre mí
        </button>
        <span style={{ width: 1, height: 18, background: 'var(--color-divider)' }} />
        <span style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--color-neutral-400)' }}>
          Mis crónicas
        </span>
      </div>
    </header>
  )
}
