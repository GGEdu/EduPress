import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import container from 'markdown-it-container'

// ── Importar desde config/ ─────────────────────────────────────────────────
// 👤 Edita los archivos de config/ para personalizar el sitio.
// Este archivo (config.mts) no necesita modificarse habitualmente.
import { PROJECT } from './config/project'
import { COLORS }  from './config/colors'
import { LOGOS, getDarkLogoPath } from './config/logos'
import { UNITS, getAllUnitsArray } from './config/units'
import { getNavbarForUnit, getSidebarForUnit } from './unitHelpers'

// ── Helper: contenedores Markdown → componentes Vue ────────────────────────
function createContainer(name: string, componentType: string, variant?: string) {
  return [container, name, {
    render(tokens: any[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const title = token.info.trim().slice(name.length).trim()
        const titleAttr = title ? ` title="${title}"` : ''
        const variantAttr = variant ? ` variant="${variant}"` : ''
        return `<${componentType}${variantAttr}${titleAttr}>\n`
      } else {
        return `</${componentType}>\n`
      }
    }
  }]
}

// ── Genera el bloque <style> con las variables CSS de colores ───────────────
// Las variables generadas aquí sobreescriben las de design-tokens.css porque
// están fuera de cualquier @layer CSS (las unlayered siempre ganan).
function buildCssVars(): string {
  const l = COLORS.light
  const d = COLORS.dark
  const t = COLORS.typography
  return `
:root {
  --vp-c-brand:           ${l.brand};
  --vp-c-brand-1:         ${l.brand1};
  --vp-c-brand-2:         ${l.brand2};
  --vp-c-brand-3:         ${l.brand3};
  --vp-c-brand-soft:      ${l.brandSoft};
  --custom-brand-light:   ${l.brandLight};
  --custom-brand-lighter: ${l.brandLighter};
  --custom-brand-dark:    ${l.brandDark};
  --custom-brand-darker:  ${l.brandDarker};
  --custom-accent-mint:   ${l.accentMint};
  --custom-accent-teal:   ${l.accentTeal};
  --custom-accent-purple: ${l.accentPurple};
  --custom-accent-indigo: ${l.accentIndigo};
  --vp-c-note:            ${l.semanticNote};
  --vp-c-tip:             ${l.semanticTip};
  --vp-c-warning:         ${l.semanticWarning};
  --vp-c-caution:         ${l.semanticCaution};
  --vp-font-family-base:  ${t.fontBase};
  --vp-font-family-mono:  ${t.fontMono};
}
.dark {
  --vp-c-brand:           ${d.brand};
  --vp-c-brand-1:         ${d.brand1};
  --vp-c-brand-2:         ${d.brand2};
  --vp-c-brand-3:         ${d.brand3};
  --vp-c-brand-soft:      ${d.brandSoft};
  --custom-brand-light:   ${d.brandLight};
  --custom-brand-lighter: ${d.brandLighter};
  --custom-brand-dark:    ${d.brandDark};
  --custom-brand-darker:  ${d.brandDarker};
}`
}

// ── Genera las CSS vars para las imágenes de ejercicios ────────────────────
// Convierte las URLs hardcodeadas en ejer_imgs.css en variables dinámicas
// que se actualizan automáticamente al cambiar basePath en config/project.ts
function buildExerciseImageVars(basePath: string): string {
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  return `
:root {
  --ejer-img-initial:     url(${base}img/ejercicios/1.00.jpeg);
  --ejer-img-zero:        url(${base}img/ejercicios/1.01.jpeg);
  --ejer-img-first:       url(${base}img/ejercicios/1.02.jpeg);
  --ejer-img-second:      url(${base}img/ejercicios/1.03.jpeg);
  --ejer-img-third:       url(${base}img/ejercicios/1.04.jpeg);
  --ejer-img-fourth:      url(${base}img/ejercicios/1.05.jpeg);
  --ejer-img-img-first:   url(${base}img/ejercicios/1.10.jpeg);
  --ejer-img-img-first-1: url(${base}img/ejercicios/1.11.jpeg);
  --ejer-img-img-first-2: url(${base}img/ejercicios/1.12.jpeg);
}`
}

// ── Construir configuración ─────────────────────────────────────────────────
const basePath     = PROJECT.basePath
const nonRootUnits = getAllUnitsArray().filter(u => u.id !== 'root')
// Unidad de referencia para título/siteTitle: la única unidad si hay una sola,
// o la entrada root si hay varias (en cursos multi-módulo).
const primaryUnit  = nonRootUnits.length === 1 ? nonRootUnits[0] : UNITS.root

// Logo del navbar (VitePress antepone basePath, por eso usamos ruta sin base)
const navbarLogoSrc = '/img/logo.png'
const navbarLogo = LOGOS.mode === 'separate'
  ? { light: navbarLogoSrc, dark: getDarkLogoPath(navbarLogoSrc, LOGOS.darkSuffix) }
  : navbarLogoSrc

// logoBranding: leído por los componentes Vue (SidebarLogos.vue, FooterLogo.vue)
// via:  useData().theme.value.logoBranding
const logoBranding = {
  mode:       LOGOS.mode,
  darkSuffix: LOGOS.darkSuffix,
  logos: {
    autor:  { src: `${basePath}img/logo-autor.png`,  height: LOGOS.heights.autor  },
    gva:    { src: `${basePath}img/logo-gva.png`,    height: LOGOS.heights.gva    },
    centro: { src: `${basePath}img/logo-centro.png`, height: LOGOS.heights.centro },
    footer: { src: `${basePath}img/logo-autor.png`,  height: LOGOS.heights.footer },
  },
}

// ── Navbar global ─────────────────────────────────────────────────────────────
// Curso de una sola unidad: usa el navbar de esa unidad tal cual (con prefijos).
// Curso multi-unidad: Home + cada unidad como dropdown con sus ítems de nav.
const navbar = nonRootUnits.length === 1
  ? getNavbarForUnit(nonRootUnits[0].navbar, nonRootUnits[0].code)
  : [
      { text: '🏠 Inicio', link: '/' },
      ...nonRootUnits.map(u => ({
        text: `${u.icon} ${u.title}`,
        items: getNavbarForUnit(u.navbar, u.code).filter((item: any) => item.link !== '/'),
      }))
    ]

// ── Sidebar multi-prefijo ─────────────────────────────────────────────────────
// VitePress sirve el sidebar de cada unidad según el prefijo de URL:
//   /EduPress/         → sin sidebar (raíz, página de inicio)
//   /EduPress/general/ → sidebar de MODULO
//   /EduPress/ud2/     → sidebar de UD2  (si existe)
const sidebar: Record<string, any> = {}
nonRootUnits.forEach(u => {
  sidebar[`/${u.code}/`] = getSidebarForUnit(u.sidebar, u.code)
})

// Tags del <head>
const headTags: HeadConfig[] = [
  ['link', { rel: 'icon', href: `${basePath}img/logo.png` }],
  ['style', {}, buildCssVars()],
  ['style', {}, buildExerciseImageVars(basePath)],
]
if (COLORS.typography.fontImportUrl) {
  headTags.push(['link', { rel: 'stylesheet', href: COLORS.typography.fontImportUrl }])
}

// ── Exportar configuración VitePress ───────────────────────────────────────
export default defineConfig({
  base:   basePath,
  outDir: PROJECT.outDir,
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(...createContainer('info-box',    'InfoBox', 'info'))
      md.use(...createContainer('warning-box', 'InfoBox', 'warning'))
      md.use(...createContainer('danger-box',  'InfoBox', 'danger'))
      md.use(...createContainer('tip-box',     'InfoBox', 'tip'))
      md.use(...createContainer('note-box',    'NoteBox'))
      md.use(...createContainer('accent-box',  'AccentBox'))
    }
  },
  head: headTags,
  locales: {
    root: {
      label: 'Español',
      lang: PROJECT.lang,
      link: '/',
      title: primaryUnit.fullTitle,
      description: PROJECT.description,
      themeConfig: {
        siteTitle: primaryUnit.siteTitle,
        outline: { label: 'En esta página' },
        docFooter: { prev: 'Anterior', next: 'Siguiente' },
        nav: navbar,
      }
    },
  },
  themeConfig: {
    logo: navbarLogo,
    socialLinks: PROJECT.socialLinks,
    logoBranding,
    sidebar: sidebar,
    footer: { copyright: PROJECT.copyright }
  } as any
})

// buildLogoFooter() eliminada: los logos se inyectan via SidebarLogos.vue (sidebar-nav-after)
// y FooterLogo.vue (layout-bottom) con soporte reactivo light/dark.
