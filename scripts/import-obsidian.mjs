// -----------------------------------------------------------------------------
// Importador del vault de Obsidian -> datos de la web.
//
// Lee las notas de sesión de cada campaña con `vault`, las limpia de la
// fontanería de Obsidian (frontmatter, tags, backlinks, navegación), resuelve
// las imágenes ![[...]] contra la carpeta del vault y las copia a
// public/campaigns/<id>/img, y escribe src/data/<id>.json + src/data/index.json.
//
// Uso:  npm run import
//   VAULT_DIR=... npm run import   (para apuntar a otra ruta del vault)
// -----------------------------------------------------------------------------

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { campaigns, arcs, party, lore } from '../data/campaigns.config.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Dos fuentes de notas:
//   local (por defecto): la carpeta Historias del vault en tu disco.
//   dg:  un checkout del repo de Digital Garden (Iluxsio/chaotic-garden), donde
//        las notas viven en src/site/notes/2.- DnD/Historias y las imágenes en
//        src/site/img/user. Es lo que usa el despliegue automático.
const SOURCE = (process.env.SOURCE || 'local').toLowerCase()

const VAULT_DIR =
  process.env.VAULT_DIR ||
  (SOURCE === 'dg' ? 'chaotic-garden' : 'D:/ROL/Obsidian/Rol/2.- DnD/Historias')

// Dentro del repo DG, las notas cuelgan de aquí (la publicación es desde la
// carpeta "Rol", así que "2.- DnD/Historias" es la raíz de las campañas).
const DG_NOTES_BASE = 'src/site/notes/2.- DnD/Historias'
const DG_IMG_ROOT = 'src/site/img/user'

const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'])

// Digital Garden reescribe los wikilinks a ruta completa con el pipe escapado:
//   [[2.- DnD/.../Lunargentea#La Hoja\|La Hoja]]
// Los devolvemos a la forma simple [[Lunargentea#La Hoja|La Hoja]] para que el
// parser del navegador y el resolvedor de enlaces los entiendan igual que en local.
function normalizeDgLinks(text) {
  return text.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    const unesc = inner.replace(/\\\|/g, '|')
    const pipe = unesc.indexOf('|')
    const targetFull = pipe === -1 ? unesc : unesc.slice(0, pipe)
    const alias = pipe === -1 ? '' : unesc.slice(pipe + 1)
    const hash = targetFull.indexOf('#')
    const pagePart = hash === -1 ? targetFull : targetFull.slice(0, hash)
    const heading = hash === -1 ? '' : targetFull.slice(hash + 1)
    const base = pagePart.split('/').pop()
    let out = base
    if (heading) out += '#' + heading
    if (alias) out += '|' + alias
    return '[[' + out + ']]'
  })
}

// ---- utilidades ------------------------------------------------------------

function walk(dir, filter, out = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, filter, out)
    else if (filter(full)) out.push(full)
  }
  return out
}

function sanitizeFilename(name) {
  const ext = path.extname(name)
  const stem = path.basename(name, ext)
  const safe = stem
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return (safe || 'img') + ext.toLowerCase()
}

// EP090 - 20260623 - Título   /   EP035 - 20241126   /   EP026 - 20240709 Título
function parseSessionName(basename) {
  const m = basename.match(/EP0*?(\d+)\D+?(\d{8})(.*)$/)
  if (!m) return null
  const n = parseInt(m[1], 10)
  const date = m[2]
  let title = (m[3] || '').replace(/^\s*[-–—]?\s*/, '').trim()
  if (!title) title = 'Sesión ' + String(n).padStart(3, '0')
  return { n, date, title }
}

function arcIdOf(campaignId, n) {
  const list = arcs[campaignId] || []
  const arc = list.find((a) => n >= a.from && n <= a.to)
  return arc ? arc.id : ''
}

// ---- limpieza del cuerpo de una sesión -------------------------------------

function cleanBody(raw) {
  let text = raw.replace(/\r\n/g, '\n')

  // 1. Frontmatter (--- ... ---) al principio.
  if (text.startsWith('---')) {
    const end = text.indexOf('\n---', 3)
    if (end !== -1) {
      const after = text.indexOf('\n', end + 1)
      text = after !== -1 ? text.slice(after + 1) : ''
    }
  }

  const lines = text.split('\n')
  const kept = []
  for (const line of lines) {
    const t = line.trim()
    // Línea de tags: #rol #dnd ... (almohadilla pegada a letra, no es encabezado).
    if (/^#[^\s#]/.test(t)) continue
    // Encabezado H1 de Obsidian (# EPxxx ...) -> lo pinta ya nuestra cabecera.
    if (/^#\s/.test(t)) continue
    // Backlink al índice.
    if (/\[\[Index[^\]]*\]\]/.test(t)) continue
    // Navegación anterior/siguiente.
    if (/(<-\s*Anterior|Siguiente\s*->)/.test(t)) continue
    // Regla horizontal.
    if (/^-{3,}$/.test(t) || /^\*{3,}$/.test(t)) continue
    kept.push(line)
  }

  // Colapsa líneas en blanco repetidas y recorta extremos.
  return kept
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ---- resolución de imágenes ------------------------------------------------

function buildImageIndex(vaultPath) {
  const index = new Map() // basename (lower) -> full path
  for (const file of walk(vaultPath, (f) => IMG_EXT.has(path.extname(f).toLowerCase()))) {
    const base = path.basename(file).toLowerCase()
    if (!index.has(base)) index.set(base, file)
  }
  return index
}

// Reescribe ![[img]] y ![alt](path) a ![alt](campaigns/<id>/img/<safe>) y copia
// los ficheros. Devuelve el cuerpo reescrito.
function resolveImages(body, { campaignId, imgIndex, outDir }) {
  const stats = { resolved: 0, missing: [] }

  const copy = (rawRef, altHint) => {
    const base = path.basename(decodeURIComponent(rawRef.trim()))
    const hit = imgIndex.get(base.toLowerCase())
    const alt = (altHint && altHint.trim()) || path.basename(base, path.extname(base))
    if (!hit) {
      stats.missing.push(base)
      return `![${alt}]()` // sin resolver: el render pinta el placeholder con el alt
    }
    const safe = sanitizeFilename(base)
    const dest = path.join(outDir, safe)
    if (!fs.existsSync(dest)) fs.copyFileSync(hit, dest)
    stats.resolved++
    return `![${alt}](campaigns/${campaignId}/img/${safe})`
  }

  let out = body
  // Wikilink de imagen: ![[archivo.png]] o ![[archivo.png|320]]
  out = out.replace(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (_, ref) => copy(ref, ''))
  // Markdown clásico: ![alt](ruta)
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, ref) => {
    if (ref.startsWith('campaigns/')) return m // ya reescrito
    return copy(ref, alt)
  })

  return { body: out, stats }
}

// ---- importación de una campaña --------------------------------------------

function importCampaign(cfg) {
  let vaultPath, sessionsDir, imgSearchRoot
  if (SOURCE === 'dg') {
    vaultPath = path.join(VAULT_DIR, DG_NOTES_BASE, cfg.vault)
    sessionsDir = path.join(vaultPath, 'Sesiones')
    imgSearchRoot = path.join(VAULT_DIR, DG_IMG_ROOT) // índice global de imágenes DG
  } else {
    vaultPath = path.join(VAULT_DIR, cfg.vault)
    sessionsDir = path.join(vaultPath, 'Sesiones')
    imgSearchRoot = vaultPath
  }
  if (!fs.existsSync(sessionsDir)) {
    console.warn(`  ! No encuentro Sesiones en ${sessionsDir}`)
    return { id: cfg.id, count: 0 }
  }

  // Solo regeneramos las imágenes de sesión (subcarpeta img/). Los retratos y
  // portadas que añadas a mano en otras subcarpetas (p.ej. portraits/) se
  // conservan entre importaciones.
  const outImgDir = path.join(ROOT, 'public', 'campaigns', cfg.id, 'img')
  fs.rmSync(outImgDir, { recursive: true, force: true })
  fs.mkdirSync(outImgDir, { recursive: true })

  const imgIndex = buildImageIndex(imgSearchRoot)

  const files = walk(sessionsDir, (f) => f.toLowerCase().endsWith('.md'))
  const sessions = []
  const usedNums = new Set()
  let totalImgs = 0
  const allMissing = []

  for (const file of files) {
    const meta = parseSessionName(path.basename(file, '.md'))
    if (!meta) {
      console.warn(`  ! Nombre no reconocido: ${path.basename(file)}`)
      continue
    }
    // Número de episodio duplicado (error de numeración en el vault): se
    // reasigna al siguiente libre para no romper el ruteo, y se avisa.
    if (usedNums.has(meta.n)) {
      let next = meta.n
      while (usedNums.has(next)) next++
      console.warn(`  ! EP duplicado en ${path.basename(file)}: EP${meta.n} ya existe, lo trato como EP${next}. Renombra el archivo en Obsidian para arreglarlo.`)
      meta.n = next
    }
    usedNums.add(meta.n)
    const raw = fs.readFileSync(file, 'utf8')
    const pre = SOURCE === 'dg' ? normalizeDgLinks(raw) : raw
    const cleaned = cleanBody(pre)
    const { body, stats } = resolveImages(cleaned, {
      campaignId: cfg.id,
      imgIndex,
      outDir: outImgDir,
    })
    totalImgs += stats.resolved
    allMissing.push(...stats.missing)

    sessions.push({
      n: meta.n,
      date: meta.date,
      title: meta.title,
      arcId: arcIdOf(cfg.id, meta.n),
      hasBody: body.trim().length > 0,
      body,
    })
  }

  sessions.sort((a, b) => a.n - b.n)

  // Portada: detecta public/campaigns/<id>/cover.(png|jpg|jpeg|webp) si existe.
  let cover = null
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = path.join(ROOT, 'public', 'campaigns', cfg.id, `cover.${ext}`)
    if (fs.existsSync(p)) { cover = `campaigns/${cfg.id}/cover.${ext}`; break }
  }

  const data = {
    id: cfg.id,
    name: cfg.name,
    cover,
    kicker: cfg.kicker,
    subtitle: cfg.subtitle,
    party: cfg.party,
    hashtag: cfg.hashtag || null,
    intro: cfg.intro,
    heroKicker: cfg.heroKicker,
    footer: cfg.footer || null,
    arcs: arcs[cfg.id] || [],
    sessions,
    partyMembers: party[cfg.id] || [],
    lore: lore[cfg.id] || [],
  }

  fs.writeFileSync(
    path.join(ROOT, 'src', 'data', `${cfg.id}.json`),
    JSON.stringify(data, null, 2),
  )

  const missCount = allMissing.length
  console.log(
    `  ✓ ${cfg.name}: ${sessions.length} sesiones, ${totalImgs} imágenes copiadas` +
      (missCount ? `, ${missCount} sin resolver (${[...new Set(allMissing)].slice(0, 4).join(', ')}…)` : ''),
  )
  return { id: cfg.id, count: sessions.length }
}

// ---- main ------------------------------------------------------------------

function main() {
  console.log(`Vault: ${VAULT_DIR}\n`)
  fs.mkdirSync(path.join(ROOT, 'src', 'data'), { recursive: true })

  const counts = {}
  for (const cfg of campaigns) {
    if (!cfg.vault) {
      counts[cfg.id] = 0
      continue
    }
    const r = importCampaign(cfg)
    counts[r.id] = r.count
  }

  const index = {
    campaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      populated: !!c.vault && counts[c.id] > 0,
      count: counts[c.id] || 0,
    })),
  }
  fs.writeFileSync(
    path.join(ROOT, 'src', 'data', 'index.json'),
    JSON.stringify(index, null, 2),
  )
  console.log('\nListo. src/data/index.json actualizado.')
}

main()
