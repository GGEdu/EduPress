import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import container from 'markdown-it-container'
import { getActiveUnit, UNITS } from './units'
import { getNavbarForUnit, getSidebarForUnit } from './unitHelpers'

// Helper to create custom Vue component containers
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

// Get active unit configuration
const activeUnit = getActiveUnit()

// Base path configuration (can be customized per deployment)
const BASE_PATH = '/EduPress/'

// Generate navbar with unit prefix transformation
const navbar = getNavbarForUnit(activeUnit.navbar, activeUnit.code)

// Generate sidebar with unit prefix transformation
const sidebar = getSidebarForUnit(activeUnit.sidebar, activeUnit.code)

// Logo paths (scoped to base path)
const logoPath = `${BASE_PATH}img/logo.png`
const logoAutorPath = `${BASE_PATH}img/logo-autor.png`
const logoGvaPath = `${BASE_PATH}img/logo-gva.png`
const logoCentroPath = `${BASE_PATH}img/logo-centro.png`

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: BASE_PATH,
  outDir: '../docs',
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
      
      // Extensiones para bloques ricos en Markdown
      md.use(...createContainer('info-box', 'InfoBox', 'info'))
      md.use(...createContainer('warning-box', 'InfoBox', 'warning'))
      md.use(...createContainer('danger-box', 'InfoBox', 'danger'))
      md.use(...createContainer('tip-box', 'InfoBox', 'tip'))
      md.use(...createContainer('note-box', 'NoteBox'))
      md.use(...createContainer('accent-box', 'AccentBox'))
    }
  },
  head: [
    ['link', { rel: 'icon', href: logoPath }]
  ],
  // Metadatos por idioma (locales with unit configuration)
  locales: {
    root: {
      label: 'Español',
      lang: 'es-ES',
      link: '/',
      title: activeUnit.fullTitle,
      description: `${activeUnit.title} - EduPress Modular`,
      themeConfig: {
        siteTitle: activeUnit.siteTitle,
        outline: { label: 'En esta página' },
        docFooter: { prev: 'Anterior', next: 'Siguiente' },
        nav: navbar,
      }
    },
  },
  // Tema por idioma
  themeConfig: {
    logo: '/img/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GGEdu' }
    ],
    sidebar: {
      '/': sidebar.length > 0 ? [...sidebar, ...buildLogoFooter()] : buildLogoFooter(),
    },
    footer: {
      message: `<img src="${logoAutorPath}" alt="Autor" style="height:75px; margin: 0 auto; display:block;" />`,
      copyright: 'Copyright © 2025'
    }
  }
})

/**
 * Helper to build logo footer items.
 * Kept separate to maintain sidebar logic cleanly.
 */
function buildLogoFooter() {
  return [
    {
      items: [
        { text: `<img src="${logoAutorPath}" class="logo-anim" style="vertical-align:middle; height:165px; margin:0 auto;">`, link: '' },
        { text: `<img src="${logoGvaPath}" class="logo-anim" style="vertical-align:middle; height:60px; margin:0 auto;">`, link: '' },
        { text: `<img src="${logoCentroPath}" class="logo-anim" style="vertical-align:middle; height:90px; margin:0 auto;">`, link: '' }
      ]
    }
  ]
}
