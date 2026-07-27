# Puesta en marcha del despliegue

La web se aloja en **Firebase Hosting**: https://cronicas-dnd.web.app

## Cómo funciona

```
Obsidian --(Publicar / Digital Garden)--> GitHub: ilucepri/chaotic-garden
                                                    |
                                         (aviso de que hay cambios)
                                                    v
GitHub Actions en ilucepri/cronicas-dnd:  clona chaotic-garden -> importa (modo DG)
                                           -> build -> deploy a Firebase Hosting
```

- **Fuente de las notas**: el repo de tu Digital Garden (`ilucepri/chaotic-garden`),
  que ya se actualiza cada vez que le das a *Publicar* en Obsidian.
- **La web** (`ilucepri/cronicas-dnd`) construye desde ahí con `SOURCE=dg` y
  despliega en Firebase. No hay que subir nada a mano.

> Privacidad: `chaotic-garden` es **público** (así es tu jardín digital), así que
> las notas ya son públicas. El repo de la web también es público, pero no
> contiene las notas (se generan en el build). Firebase sirve solo el resultado.

## Desplegar a mano (lo más rápido, como tus otras apps)

Con la CLI de Firebase ya logueada:

```bash
npm run deploy    # import (desde tu vault) + build + firebase deploy
```

Esto sube al instante lo que tengas en el vault, incluidas las sesiones aún sin
publicar en Digital Garden. Útil para actualizar sin esperar al automático.

## Automático al publicar (una configuración inicial)

Para que se despliegue solo cuando publicas en Obsidian:

### 1. Subir el workflow
`.github/workflows/deploy.yml` está en tu carpeta local pero no se subió con el
resto (el token de `gh` necesita permiso `workflow`, y quedó con el nombre viejo
`Iluxsio` tras renombrarte a `ilucepri`).

**Fácil (web):** en `github.com/ilucepri/cronicas-dnd` → **Add file → Create new
file** → ruta `.github/workflows/deploy.yml` → pega el contenido del archivo
local → Commit.

**Por consola** (arregla también `gh`):
```bash
gh auth logout -h github.com
gh auth login -h github.com -s workflow -w   # entra como ilucepri
git add .github/workflows/deploy.yml && git commit -m "Añadir workflow" && git push
```

### 2. Dar acceso a Firebase al workflow (token)
```bash
firebase login:ci        # abre el navegador y te imprime un token
```
Copia el token y añádelo como secreto en el repo:
`github.com/ilucepri/cronicas-dnd` → **Settings → Secrets and variables →
Actions → New repository secret** → nombre `FIREBASE_TOKEN`, valor el token.

Con eso, cada push a `chaotic-garden` (al publicar) reconstruye y despliega. Si
no montas el aviso instantáneo del paso 3, igualmente se actualiza cada 3 horas.

### 3. (Opcional) Aviso instantáneo al publicar
Sin esto, el refresco automático es cada 3 horas. Para que sea **al instante**:

1. Crea un token fino en GitHub (*Settings → Developer settings → Fine-grained
   tokens*) con acceso solo a `cronicas-dnd` y permiso **Contents: Read and write**.
2. En `chaotic-garden` → *Settings → Secrets → Actions* → nuevo secreto
   `WEB_DISPATCH_TOKEN` con ese token.
3. Añade a `chaotic-garden` el archivo `.github/workflows/notify-cronicas.yml`:

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

## Desarrollo local

```bash
npm run import   # lee D:\ROL\...\Historias (tus notas más nuevas)
npm run dev
```
