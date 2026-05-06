import { defineConfig } from 'vitepress'
import type { HeadConfig } from 'vitepress'
import type Token from 'markdown-it/lib/token.mjs'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import container from 'markdown-it-container'

// ── Importar desde config/ ─────────────────────────────────────────────────
// 👤 Edita los archivos de config/ para personalizar el sitio.
// Este archivo (config.mts) no necesita modificarse habitualmente.
import { PROJECT } from './config/project'
import { COLORS }  from './config/colors'
import { LOGOS, getDarkLogoPath } from './config/logos'
import { UNITS, getAllUnitsArray, unitNavbars } from './config/units'
import { getNavbarForUnit, getSidebarForUnit } from './unitHelpers'

// ── Helper: contenedores Markdown → componentes Vue ────────────────────────
function createContainer(
  name: string,
  componentType: string,
  variant?: string,
): [typeof container, string, { render(tokens: Token[], idx: number): string }] {
  return [container, name, {
    render(tokens: Token[], idx: number) {
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
  --vp-c-bg:              ${l.bg};
  --vp-c-bg-soft:         ${l.bgSoft};
  --vp-c-bg-alt:          ${l.bgAlt};
  --vp-c-bg-mute:         ${l.codeBg};
  --vp-c-text-1:          ${l.text1};
  --vp-c-text-2:          ${l.text2};
  --vp-c-text-3:          ${l.text3};
  --vp-c-divider:         ${l.divider};
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
  --vp-c-important:       ${l.brandDark};
  --vp-c-note-text:       ${l.noteText};
  --vp-c-tip-text:        ${l.tipText};
  --vp-c-warning-text:    ${l.warningText};
  --vp-c-caution-text:    ${l.cautionText};
  --vp-c-important-text:  ${l.importantText};
  --custom-gradient-mint-start:    ${l.gradMintStart};
  --custom-gradient-mint-end:      ${l.gradMintEnd};
  --custom-gradient-blue-start:    ${l.gradBlueStart};
  --custom-gradient-blue-end:      ${l.gradBlueEnd};
  --custom-gradient-success-start: ${l.gradSuccessStart};
  --custom-gradient-success-end:   ${l.gradSuccessEnd};
  --custom-gradient-warning-start: ${l.gradWarningStart};
  --custom-gradient-warning-end:   ${l.gradWarningEnd};
  --custom-gradient-danger-start:  ${l.gradDangerStart};
  --custom-gradient-danger-end:    ${l.gradDangerEnd};
  --custom-gradient-info-start:    ${l.gradInfoStart};
  --custom-gradient-info-end:      ${l.gradInfoEnd};
  --custom-gradient-purple-start:  ${l.gradPurpleStart};
  --custom-gradient-purple-end:    ${l.gradPurpleEnd};
  --custom-gradient-orange-start:  ${l.gradOrangeStart};
  --custom-gradient-orange-end:    ${l.gradOrangeEnd};
  --custom-gradient-teal-start:    ${l.gradTealStart};
  --custom-gradient-teal-end:      ${l.gradTealEnd};
  --custom-bg-terminal:            ${l.bgTerminal};
  --custom-color-dark:             ${l.colorDark};
  --custom-text-on-gradient:       ${l.textOnGradient};
  --custom-text-on-gradient-dark:  ${l.textOnGradientDark};
  --custom-bg-brand-subtle:        ${l.bgBrandSubtle};
}
.dark {
  --vp-c-brand:           ${d.brand};
  --vp-c-brand-1:         ${d.brand1};
  --vp-c-brand-2:         ${d.brand2};
  --vp-c-brand-3:         ${d.brand3};
  --vp-c-brand-soft:      ${d.brandSoft};
  --vp-c-bg:              ${d.bg};
  --vp-c-bg-soft:         ${d.bgSoft};
  --vp-c-bg-alt:          ${d.bgAlt};
  --vp-c-bg-mute:         ${d.codeBg};
  --vp-c-text-1:          ${d.text1};
  --vp-c-text-2:          ${d.text2};
  --vp-c-text-3:          ${d.text3};
  --vp-c-divider:         ${d.divider};
  --custom-brand-light:   ${d.brandLight};
  --custom-brand-lighter: ${d.brandLighter};
  --custom-brand-dark:    ${d.brandDark};
  --custom-brand-darker:  ${d.brandDarker};
  --vp-c-important:       ${d.brandDark};
  --vp-c-note-text:       ${d.noteText};
  --vp-c-tip-text:        ${d.tipText};
  --vp-c-warning-text:    ${d.warningText};
  --vp-c-caution-text:    ${d.cautionText};
  --vp-c-important-text:  ${d.importantText};
  --custom-bg-terminal:   ${d.bgTerminal};
  --custom-color-dark:    ${d.colorDark};
  --custom-text-on-gradient:      ${d.textOnGradient};
  --custom-text-on-gradient-dark: ${d.textOnGradientDark};
  --custom-bg-brand-subtle:       ${d.bgBrandSubtle};
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

// ── Pre-extraer contenedores Markdown ────────────────────────────────────────
const infoBoxContainer    = createContainer('info-box',    'InfoBox', 'info')
const warningBoxContainer = createContainer('warning-box', 'InfoBox', 'warning')
const dangerBoxContainer  = createContainer('danger-box',  'InfoBox', 'danger')
const tipBoxContainer     = createContainer('tip-box',     'InfoBox', 'tip')
const noteBoxContainer    = createContainer('note-box',    'NoteBox')

// accent-box: parsea el gradiente del primer token (primary|success|warning|danger|info|purple|orange|teal)
const accentBoxContainer: [typeof container, string, { render(tokens: Token[], idx: number): string }] = [container, 'accent-box', {
  render(tokens: Token[], idx: number) {
    const token = tokens[idx]
    if (token.nesting === 1) {
      const validGradients = ['primary', 'success', 'warning', 'danger', 'info', 'purple', 'orange', 'teal']
      const info = token.info.trim().slice('accent-box'.length).trim()
      const firstWord = info.split(/\s/)[0]
      let gradient = 'primary'
      let title = info
      if (validGradients.includes(firstWord)) {
        gradient = firstWord
        title = info.slice(firstWord.length).trim()
      }
      const titleAttr = title ? ` title="${title}"` : ''
      return `<AccentBox gradient="${gradient}"${titleAttr}>\n`
    } else {
      return `</AccentBox>\n`
    }
  }
}]

// ── Exportar configuración VitePress ───────────────────────────────────────
export default defineConfig({
  base:   basePath,
  outDir: PROJECT.outDir,
  vite: {
    build: {
      // El proyecto incluye bundles grandes (Mermaid/slides); elevamos el umbral
      // para evitar ruido en CI sin alterar el resultado de compilación.
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        external: ['html2canvas', 'canvg', 'dompurify'],
      },
    },
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(...infoBoxContainer)
      md.use(...warningBoxContainer)
      md.use(...dangerBoxContainer)
      md.use(...tipBoxContainer)
      md.use(...noteBoxContainer)
      md.use(...accentBoxContainer)
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
        outline: { label: 'En esta página', level: [2, 3] },
        docFooter: { prev: 'Anterior', next: 'Siguiente' },
        nav: navbar,
      }
    },
  },
  themeConfig: {
    logo: navbarLogo,
    socialLinks: PROJECT.socialLinks,
    logoBranding,
    unitNavbars,
    sidebar: sidebar,
    footer: { copyright: PROJECT.copyright }
  } as any
})

// buildLogoFooter() eliminada: los logos se inyectan via SidebarLogos.vue (sidebar-nav-after)
// y FooterLogo.vue (layout-bottom) con soporte reactivo light/dark.
