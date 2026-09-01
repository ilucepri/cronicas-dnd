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
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { campaigns, arcs, party, about } from '../data/campaigns.config.mjs'

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

// Acepta EP y fecha en cualquier orden y con/sin título:
//   EP090 - 20260623 - Título   ·   EP035 - 20241126   ·   20260712 - EP01 - Título
function parseSessionName(basename) {
  const ep = basename.match(/EP0*(\d+)/i)
  const date = basename.match(/(\d{8})/)
  if (!ep || !date) return null
  const n = parseInt(ep[1], 10)
  let title = basename
    .replace(/EP0*\d+/i, '')
    .replace(/\d{8}/, '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s\-–—]+/, '')
    .replace(/[\s\-–—]+$/, '')
    .trim()
  if (!title) title = 'Sesión ' + String(n).padStart(3, '0')
  return { n, date: date[1], title }
}

function arcIdOf(campaignId, n) {
  const list = arcs[campaignId] || []
  const arc = list.find((a) => n >= a.from && n <= a.to)
  return arc ? arc.id : ''
}

// ---- lore (El Mundo): lugares, NPCs y entidades ----------------------------

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Tipo (etiqueta) deducido de la carpeta contenedora. '' si no está claro.
function deriveLoreType(file, vaultPath) {
  const rel = path.relative(vaultPath, file).replace(/\\/g, '/').toLowerCase()
  if (rel.includes('colegio')) return 'Colegio'
  if (rel.includes('dragon')) return 'Dragón'
  if (rel.includes('mision')) return 'Misión'
  if (rel.includes('lugar')) return 'Lugar'
  if (rel.includes('/npc')) return 'NPC'
  return ''
}

// Primer párrafo real como resumen para la tarjeta (sin markdown, recortado).
function blurbFrom(body) {
  for (const line of body.split('\n')) {
    const t = line.trim()
    // Salta encabezados, citas/callouts, imágenes y listas — pero NO los
    // párrafos en cursiva (que empiezan por *texto*, no por "* " de lista).
    if (!t || /^#/.test(t) || /^>/.test(t) || /^!\[/.test(t) || /^[-*]\s/.test(t)) continue
    let s = t
      .replace(/\*\*|\*|`/g, '')
      .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_, tgt, alias) => (alias || tgt.split('#').pop() || tgt).trim())
      .replace(/\s+/g, ' ')
      .trim()
    if (s.length > 160) s = s.slice(0, 157).replace(/\s+\S*$/, '') + '…'
    return s
  }
  return ''
}

let _cwebp = null
function hasCwebp() {
  if (_cwebp === null) {
    try { execSync('cwebp -version', { stdio: 'ignore' }); _cwebp = true } catch { _cwebp = false }
  }
  return _cwebp
}

// Convierte a webp las imágenes de mundo que dejes en
// public/campaigns/<id>/lore/ y que no sean ya webp (necesita cwebp; en CI no
// hace nada porque ahí ya están commiteadas en webp).
function convertLoreImagesToWebp(campaignId) {
  const dir = path.join(ROOT, 'public', 'campaigns', campaignId, 'lore')
  if (!fs.existsSync(dir) || !hasCwebp()) return
  for (const f of fs.readdirSync(dir)) {
    const ext = path.extname(f).toLowerCase()
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue
    const src = path.join(dir, f)
    const dest = path.join(dir, path.basename(f, ext) + '.webp')
    try {
      execSync(`cwebp -quiet -q 82 "${src}" -o "${dest}"`)
      fs.rmSync(src)
      console.log(`  · webp: ${f} → ${path.basename(dest)}`)
    } catch {}
  }
}

function detectLoreImage(campaignId, slug) {
  for (const ext of ['webp', 'png', 'jpg', 'jpeg']) {
    const rel = `campaigns/${campaignId}/lore/${slug}.${ext}`
    if (fs.existsSync(path.join(ROOT, 'public', rel))) return rel
  }
  return null
}

// Construye las entradas de "El Mundo" desde las notas con tag #dnd/lore.
function buildLore(cfg, vaultPath, imgIndex, outImgDir) {
  convertLoreImagesToWebp(cfg.id)
  const partyName = (cfg.party || '').toLowerCase()
  const files = walk(vaultPath, (f) => f.toLowerCase().endsWith('.md')).filter((f) => {
    if (/[\\/](sesiones|sessions)[\\/]/i.test(f)) return false
    return /#dnd\/lore\b/.test(fs.readFileSync(f, 'utf8'))
  })

  const entries = []
  for (const file of files) {
    const name = path.basename(file, '.md')
    if (name.toLowerCase() === partyName) continue // el grupo va en Personajes
    const raw = fs.readFileSync(file, 'utf8')
    const pre = SOURCE === 'dg' ? normalizeDgLinks(raw) : raw
    const cleaned = cleanBody(pre)
    const { body } = resolveImages(cleaned, { campaignId: cfg.id, imgIndex, outDir: outImgDir })
    const slug = slugify(name)
    entries.push({
      id: slug,
      name,
      type: deriveLoreType(file, vaultPath),
      blurb: blurbFrom(body),
      img: detectLoreImage(cfg.id, slug),
      body,
    })
  }
  // Los más desarrollados primero (buen orden para el top de la portada).
  entries.sort((a, b) => b.body.length - a.body.length)
  return entries
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
  let vaultPath, imgSearchRoot
  if (SOURCE === 'dg') {
    vaultPath = path.join(VAULT_DIR, DG_NOTES_BASE, cfg.vault)
    imgSearchRoot = path.join(VAULT_DIR, DG_IMG_ROOT) // índice global de imágenes DG
  } else {
    vaultPath = path.join(VAULT_DIR, cfg.vault)
    // Los one-shots comparten un Docs en la carpeta padre (Oneshots/Docs).
    imgSearchRoot = cfg.group === 'oneshot' ? path.dirname(vaultPath) : vaultPath
  }
  // Las sesiones pueden estar en <vault>/Sesiones, <vault>/Sessions (así las
  // deja Digital Garden en algunos one-shots) o directamente en <vault>.
  let sessionsDir = vaultPath
  for (const sub of ['Sesiones', 'Sessions']) {
    if (fs.existsSync(path.join(vaultPath, sub))) { sessionsDir = path.join(vaultPath, sub); break }
  }
  if (!fs.existsSync(sessionsDir)) {
    console.warn(`  ! No encuentro sesiones en ${vaultPath}`)
    return { id: cfg.id, count: 0, lore: 0 }
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
    const base = path.basename(file, '.md')
    const meta = parseSessionName(base)
    if (!meta) {
      // Solo avisa si el archivo parecía una sesión (evita ruido con notas de
      // ambientación que viven en la raíz de un setting).
      if (/ep\s*\d/i.test(base)) console.warn(`  ! Nombre no reconocido: ${base}`)
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
    // Si el nombre de archivo no trae título, intenta sacarlo del encabezado H1
    // (los one-shots lo llevan ahí: "# EP1 - 20260712 - La caída a Verdia").
    if (/^Sesión \d/.test(meta.title)) {
      const h1 = (raw.match(/^#\s+(.+)$/m) || [])[1]
      const hMeta = h1 && parseSessionName(h1)
      if (hMeta && !/^Sesión \d/.test(hMeta.title)) meta.title = hMeta.title
    }
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

  const loreEntries = buildLore(cfg, vaultPath, imgIndex, outImgDir)

  // Portada: detecta public/campaigns/<id>/cover.(png|jpg|jpeg|webp) si existe.
  let cover = null
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = path.join(ROOT, 'public', 'campaigns', cfg.id, `cover.${ext}`)
    if (fs.existsSync(p)) { cover = `campaigns/${cfg.id}/cover.${ext}`; break }
  }

  const data = {
    id: cfg.id,
    name: cfg.name,
    group: cfg.group || 'campaña',
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
    lore: loreEntries,
  }

  fs.writeFileSync(
    path.join(ROOT, 'src', 'data', `${cfg.id}.json`),
    JSON.stringify(data, null, 2),
  )

  const missCount = allMissing.length
  console.log(
    `  ✓ ${cfg.name}: ${sessions.length} sesiones, ${loreEntries.length} entradas de mundo, ${totalImgs} imágenes copiadas` +
      (missCount ? `, ${missCount} sin resolver (${[...new Set(allMissing)].slice(0, 4).join(', ')}…)` : ''),
  )
  return { id: cfg.id, count: sessions.length, lore: loreEntries.length }
}

// ---- main ------------------------------------------------------------------

function main() {
  console.log(`Vault: ${VAULT_DIR}\n`)
  fs.mkdirSync(path.join(ROOT, 'src', 'data'), { recursive: true })

  const counts = {}
  const lores = {}
  for (const cfg of campaigns) {
    if (!cfg.vault) {
      counts[cfg.id] = 0
      lores[cfg.id] = 0
      continue
    }
    const r = importCampaign(cfg)
    counts[r.id] = r.count
    lores[r.id] = r.lore
  }

  const index = {
    about,
    campaigns: campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      group: c.group || 'campaña',
      // "Poblada" = tiene contenido de cualquier tipo (sesiones o mundo), para
      // que las ambientaciones (solo mundo, sin sesiones) no salgan como vacías.
      populated: !!c.vault && (counts[c.id] > 0 || lores[c.id] > 0),
      count: counts[c.id] || 0,
      lore: lores[c.id] || 0,
    })),
  }
  fs.writeFileSync(
    path.join(ROOT, 'src', 'data', 'index.json'),
    JSON.stringify(index, null, 2),
  )
  console.log('\nListo. src/data/index.json actualizado.')
}

main()
