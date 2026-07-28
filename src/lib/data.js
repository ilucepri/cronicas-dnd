// Carga de datos generados por `npm run import` y utilidades derivadas.

import indexData from '../data/index.json'

// Carga estática de todos los JSON de campaña generados.
const modules = import.meta.glob('../data/*.json', { eager: true })
const byId = {}
for (const [path, mod] of Object.entries(modules)) {
  const file = path.split('/').pop()
  if (file === 'index.json') continue
  const data = mod.default || mod
  if (data && data.id) byId[data.id] = data
}

export const campaignsIndex = indexData.campaigns

export function getAbout() {
  return indexData.about || null
}

export function getCampaignMeta(id) {
  return campaignsIndex.find((c) => c.id === id) || null
}

export function getCampaign(id) {
  return byId[id] || null
}

// Base pública (respeta vite base) para las imágenes copiadas.
export function assetUrl(rel) {
  if (!rel) return ''
  const base = import.meta.env.BASE_URL || '/'
  return base.replace(/\/$/, '') + '/' + rel.replace(/^\//, '')
}

// --- helpers de campaña -----------------------------------------------------

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function formatDate(d) {
  if (!d || d.length < 8) return ''
  const day = parseInt(d.slice(6, 8), 10)
  const mon = MONTHS[parseInt(d.slice(4, 6), 10) - 1] || ''
  return `${day} ${mon} ${d.slice(0, 4)}`
}

export function sessionNum(n) {
  return 'EP' + String(n).padStart(3, '0')
}

export function arcOf(campaign, n) {
  return (campaign.arcs || []).find((a) => n >= a.from && n <= a.to) || { id: '', name: '', roman: '' }
}

export function arcName(campaign, n) {
  const a = arcOf(campaign, n)
  return a.roman ? `Arco ${a.roman} · ${a.name}` : ''
}

// Normaliza para búsqueda insensible a mayúsculas y acentos.
export function normalize(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// Índice de resolución de wikilinks -> ruta interna (personajes y mundo).
export function buildLinkResolver(campaign) {
  const map = new Map()
  for (const p of campaign.partyMembers || []) map.set(normalize(p.name), { kind: 'char', id: p.id })
  for (const l of campaign.lore || []) map.set(normalize(l.name), { kind: 'lore', id: l.id })
  return (target) => map.get(normalize(target)) || null
}
