# Puesta en marcha del despliegue automático

La web se reconstruye sola a partir de tus notas **publicadas** en Obsidian.

## Cómo funciona

```
Obsidian  --(Publicar / Digital Garden)-->  GitHub: ilucepri/chaotic-garden
                                                     |
                                          (aviso de que hay cambios)
                                                     v
GitHub Actions en ilucepri/cronicas-dnd:  clona chaotic-garden -> importa (modo DG)
                                          -> build -> despliega en GitHub Pages
```

- **Fuente de las notas**: el repo de tu Digital Garden (`ilucepri/chaotic-garden`),
  que ya se actualiza cada vez que le das a *Publicar* en Obsidian.
- **La web** (`ilucepri/cronicas-dnd`) construye desde ahí con `SOURCE=dg` y publica
  en GitHub Pages. No hay que subir nada a mano.

> Nota de privacidad: `chaotic-garden` es **público** (así es tu jardín digital),
> así que las notas ya son públicas. Reusarlo no expone nada nuevo. Si prefieres
> notas privadas, habría que montar un repo privado aparte + Obsidian Git; dímelo
> y lo cambiamos.

## Lo que tienes que hacer una vez

### 0. Subir el workflow de despliegue
El archivo `.github/workflows/deploy.yml` está en tu carpeta local pero no se
pudo subir automáticamente (el token necesita el permiso `workflow`). Sube el
workflow con:

```bash
gh auth refresh -h github.com -s workflow
git add .github/workflows/deploy.yml && git commit -m "Añadir workflow de despliegue" && git push
```

(Alternativa sin consola: en el repo, botón **Add file → Create new file**, ruta
`.github/workflows/deploy.yml`, y pega el contenido del archivo local.)

### 1. Activar GitHub Pages
En `github.com/ilucepri/cronicas-dnd` → **Settings → Pages** →
**Source: GitHub Actions**. Con eso, el workflow ya despliega.

La web quedará en: **https://ilucepri.github.io/cronicas-dnd/**

El primer despliegue se lanza solo al subir el repo (o desde la pestaña
**Actions → Construir y desplegar → Run workflow**).

### 2. (Opcional) Actualización instantánea al publicar
Sin esto, la web se refresca igualmente cada 3 horas (red de seguridad). Para que
se actualice **al instante** cuando publicas:

1. Crea un token fino en GitHub → *Settings → Developer settings → Fine-grained
   tokens*, con acceso solo al repo `cronicas-dnd` y permiso **Contents: Read and write**.
2. En `chaotic-garden` → *Settings → Secrets and variables → Actions* → **New secret**:
   nombre `WEB_DISPATCH_TOKEN`, valor el token.
3. Añade este archivo a `chaotic-garden` en `.github/workflows/notify-cronicas.yml`:

```yaml
name: Avisar a Cronicas
on:
  push:
    branches: [main]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -sf -X POST \
            -H "Authorization: token ${{ secrets.WEB_DISPATCH_TOKEN }}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/ilucepri/cronicas-dnd/dispatches \
            -d '{"event_type":"notes-updated"}'
```

## Publicar en un dominio propio (opcional)
Si más adelante quieres un dominio bonito (como el de tu Foundry) en vez de
`ilucepri.github.io/cronicas-dnd/`, lo más cómodo es **Cloudflare Pages** o
**Netlify** conectados a `cronicas-dnd`, con:
- Build command: `git clone --depth 1 https://github.com/ilucepri/chaotic-garden.git chaotic-garden && SOURCE=dg VAULT_DIR=chaotic-garden npm run import && npm run build`
- Publish dir: `dist`  ·  y quita `VITE_BASE` (o ponlo a `/`).
- El fallback SPA ya está resuelto con `public/_redirects`.

Dímelo y lo dejamos montado.

## Desarrollo local
Sigues pudiendo trabajar en local contra tu vault (con las sesiones más nuevas,
aún sin publicar):

```bash
npm run import   # lee D:\ROL\...\Historias
npm run dev
```
