// Parser de markdown de las notas -> bloques, respetando el ORDEN del documento.
// Es la REGLA CLAVE del handoff: cada bloque (párrafo, encabezado, cita, lista,
// imagen) se emite en el mismo orden en que aparece en el archivo.

// --- inline: **negrita**, *cursiva*, `código`, [[wikilink|alias]] -----------
// Recursivo: la negrita y la cursiva pueden contener wikilinks u otro formato,
// así que su contenido se vuelve a parsear (children).
export function parseRuns(str) {
  const runs = []
  // Grupos: 1 negrita, 2 cursiva, 3 código, 4 wikilink, 5 diálogo entre comillas.
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[\[([^\]]+)\]\]|("[^"]+"|“[^”]+”|«[^»]+»)/g
  let last = 0
  let m
  while ((m = re.exec(str))) {
    if (m.index > last) runs.push({ type: 'text', text: str.slice(last, m.index) })
    if (m[1] != null) runs.push({ type: 'bold', children: parseRuns(m[1]) })
    else if (m[2] != null) runs.push({ type: 'italic', children: parseRuns(m[2]) })
    else if (m[3] != null) runs.push({ type: 'code', text: m[3] })
    else if (m[5] != null) {
      // El fragmento entrecomillado (comillas incluidas) va en azul; el énfasis
      // interior se reparsea y hereda el color.
      const frag = m[5]
      runs.push({
        type: 'dialogue',
        open: frag[0],
        close: frag[frag.length - 1],
        children: parseRuns(frag.slice(1, -1)),
      })
    } else if (m[4] != null) {
      const raw = m[4]
      const pipe = raw.indexOf('|')
      const targetFull = (pipe === -1 ? raw : raw.slice(0, pipe)).trim()
      const alias = pipe === -1 ? '' : raw.slice(pipe + 1).trim()
      const target = targetFull.split('#')[0].trim() // página, sin el #encabezado
      const heading = targetFull.includes('#') ? targetFull.split('#').slice(1).join('#').trim() : ''
      const text = alias || heading || target
      runs.push({ type: 'wikilink', text, target, heading })
    }
    last = re.lastIndex
  }
  if (last < str.length || runs.length === 0) runs.push({ type: 'text', text: str.slice(last) })
  return runs
}

// --- bloques ----------------------------------------------------------------
const CALLOUT_LABEL = {
  NOTE: 'Nota',
  WARNING: 'Aviso',
  DANGER: 'Peligro',
  TIP: 'Consejo',
  INFO: 'Info',
  IMPORTANT: 'Importante',
  QUOTE: 'Cita',
}

export function parseBlocks(md) {
  const blocks = []
  let list = null
  let quote = null
  let callout = null
  let para = null

  const flush = () => {
    if (list) { blocks.push(list); list = null }
    if (quote) { blocks.push({ type: 'quote', runs: parseRuns(quote.join(' ')) }); quote = null }
    if (callout) { blocks.push(callout); callout = null }
    if (para) { blocks.push({ type: 'p', runs: parseRuns(para.join(' ')) }); para = null }
  }

  const lines = (md || '').split('\n')
  let imgIdx = 0

  for (const rawLine of lines) {
    const t = rawLine.trim()

    if (!t) { flush(); continue }

    // Continuación de callout (línea que empieza por > estando dentro de uno).
    if (callout && t.startsWith('>')) {
      const inner = t.replace(/^>\s?/, '')
      if (inner) callout.lines.push(inner)
      continue
    }

    // Encabezados (# a ####)
    let hm
    if ((hm = t.match(/^(#{1,4})\s+(.*)$/))) {
      flush()
      const level = hm[1].length // 1,2,3,4
      blocks.push({ type: 'h' + level, runs: parseRuns(hm[2]) })
      continue
    }

    // Callout: > [!TIPO] título opcional
    let cm
    if ((cm = t.match(/^>\s*\[!(\w+)\]\s*(.*)$/))) {
      flush()
      const kind = cm[1].toUpperCase()
      callout = {
        type: 'callout',
        kind,
        label: CALLOUT_LABEL[kind] || cm[1],
        title: cm[2].trim(),
        lines: [],
      }
      continue
    }

    // Cita normal >
    if (t.startsWith('>')) {
      if (list || callout || para) flush()
      if (!quote) quote = []
      quote.push(t.replace(/^>\s?/, ''))
      continue
    }

    // Imagen sola: ![alt](url)
    let im
    if ((im = t.match(/^!\[([^\]]*)\]\(([^)]*)\)$/))) {
      flush()
      blocks.push({ type: 'img', alt: im[1] || '', src: im[2] || '', key: imgIdx++ })
      continue
    }

    // Lista - o *
    if (/^[-*]\s+/.test(t)) {
      if (quote || callout || para) flush()
      if (!list) list = { type: 'list', items: [] }
      list.items.push(parseRuns(t.replace(/^[-*]\s+/, '')))
      continue
    }

    // Párrafo (acumula líneas contiguas)
    if (list || quote || callout) flush()
    if (!para) para = []
    para.push(t)
  }

  flush()
  return blocks
}
