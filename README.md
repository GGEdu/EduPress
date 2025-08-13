# Vitepress Template

Este proyecto utiliza [VitePress](https://vitepress.dev/) para documentación estática y está preparado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

## Demo de la plantilla preparada
https://ggedu.github.io/vitepress-template/

## Instalación

Instala las dependencias con:

```bash
npm install
```

## Uso

- Todo el contenido en formato Markdown debe estar en la carpeta `src/`.
- Los menús de navegación y la configuración general del sitio se gestionan en la carpeta [`src/.vitepress`](src/.vitepress/), especialmente en el archivo [`config.mts`](src/.vitepress/config.mts).
- Para desarrollo local:

  ```bash
  npm run dev
  ```

- Para construir la documentación para producción:

  ```bash
  npm run build
  ```

- Para previsualizar la build de producción:

  ```bash
  npm run preview
  ```

## Estructura recomendada

- `src/` — Contiene todo el contenido en Markdown.
- `src/.vitepress/config.mts` — Configuración de VitePress y menús de navegación.
- `src/index.md` — Página principal.

## Configuración esencial en `src/.vitepress/config.mts`

Antes de desplegar, revisa:

- base: establece el nombre del repositorio entre barras. Es imprescindible para rutas correctas en GitHub Pages.
  - Ejemplo: si tu repo es `MYUSER/MYREPO`, usa `base: '/MYREPO/'`.
  - Si publicas en una página de usuario/organización (usuario.github.io) o con dominio propio, usa `base: '/'`.
- outDir: por defecto genera en `../docs` (desde `src`). No es necesario comitear `docs/` si despliegas con GitHub Pages via artifact (recomendado).
- Idiomas: locales.root (ES) y locales.ca (Català). La navegación (nav) se define por-locale para traducir textos.
- Otros: siteTitle, logo, sidebar, footer.

## Despliegue a GitHub Pages (rama separada gestionada por Pages)

Este repo usa un workflow que construye el sitio y publica el resultado en GitHub Pages mediante artifacts (sin comitear `docs/` en `main`).

Archivo: `.github/workflows/deploy.yml`

- Build: `npx vitepress build src` genera `docs/`.
- Publicación: `actions/upload-pages-artifact` sube `docs/` como artifact y `actions/deploy-pages` publica la web.

Pasos para activar:

1. En GitHub > Settings > Pages → “Build and deployment” → selecciona “GitHub Actions”.
2. Haz push a `main`; el workflow construirá y desplegará.

## Docker

Arranca el proyecto dentro de contenedores sin instalar Node en tu máquina:

- Desarrollo (VitePress dev server):

  ```bash
  docker compose up vitepress
  ```

  Accede en <http://localhost:5173>

- Preview de producción (build + preview):

  ```bash
  docker compose --profile preview up preview
  ```

  Accede en <http://localhost:4173>

Notas:

- Los puertos 5173 (dev) y 24678 (HMR) deben estar libres.
- El contenedor ejecuta `npm ci` al iniciar para asegurar dependencias limpias.
- El volumen /app/node_modules evita que tu node_modules host sobrescriba el del contenedor.
