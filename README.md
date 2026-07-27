# Crónicas de D&D

Web personal para leer y navegar las notas de tus campañas de D&D exportadas
desde Obsidian. Portada de campaña, sesiones (con búsqueda y filtro por arco),
personajes, entradas de mundo y línea temporal. Sustituye la publicación de
Obsidian con Secret Garden por una lectura estructurada y con tu propio diseño.

Ahora mismo está cargada **Oro sobre Plata** (91 sesiones, 9 arcos). Las demás
campañas aparecen en el selector con un estado vacío hasta que las importes.

## Cómo funciona

- **`data/campaigns.config.mjs`** — lo editorial: qué campañas existen, cómo se
  agrupan las sesiones en arcos, y las fichas de personajes y de mundo.
- **`scripts/import-obsidian.mjs`** — lee el vault de Obsidian, limpia cada nota
  de sesión (frontmatter, tags, backlinks, navegación), resuelve las imágenes
  `![[...]]` contra la carpeta del vault y las copia a `public/`, y genera los
  JSON en `src/data/`.
- **App React (Vite)** — 100% estática. Renderiza el markdown **en el orden del
  documento**, con las imágenes justo donde están en la nota (regla clave del
  diseño).

## Puesta en marcha

```bash
npm install
npm run import   # lee el vault y genera datos + imágenes
npm run dev      # http://localhost:5173
```

Por defecto el vault se lee de
`D:/ROL/Obsidian/Rol/2.- DnD/Historias`. Para apuntar a otra ruta:

```bash
VAULT_DIR="ruta/al/vault" npm run import
```

## Publicar

Alojada en **Firebase Hosting**: https://cronicas-dnd.web.app (URLs limpias sin
`#`, con el rewrite SPA de `firebase.json`).

```bash
npm run deploy    # import + build + firebase deploy --only hosting
```

Y automáticamente en cada publicación de Obsidian vía GitHub Actions. Ver
[SETUP.md](SETUP.md) para el despliegue automático.

## Añadir cosas

- **Otra campaña**: en `data/campaigns.config.mjs`, pon el nombre de su carpeta
  del vault en el campo `vault` de esa campaña (y, si quieres, sus arcos,
  personajes y mundo). Vuelve a lanzar `npm run import`.
- **Retratos de personajes / portada**: deja las imágenes en
  `public/campaigns/oro/portraits/` y añade `img: 'campaigns/oro/portraits/venti.png'`
  al personaje (o `cover: '...'` a la campaña) en el config. La carpeta `img/`
  la regenera el import; las demás subcarpetas se conservan.
- **Título de una sesión**: sale del nombre del archivo en Obsidian
  (`EP090 - 20260623 - Mi título.md`). Sin título, se muestra «Sesión 090».

## Pendiente / ideas

- Retratos e imágenes de portada reales (ahora hay placeholders).
- Enlazar más wikilinks a personajes y lugares (ya enlazan los que coinciden por
  nombre; los demás salen como texto resaltado).
- Importar las otras cinco campañas.
