import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import container from 'markdown-it-container'
import { getActiveUnit, UNITS } from './units'
import { getNavbarForUnit, getSidebarForUnit } from './unitHelpers'
import { LOGO_BRANDING, getDarkLogoPath } from './branding'

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
const logoPath      = `${BASE_PATH}img/logo.png`
const logoAutorPath = `${BASE_PATH}img/logo-autor.png`
const logoGvaPath   = `${BASE_PATH}img/logo-gva.png`
const logoCentroPath = `${BASE_PATH}img/logo-centro.png`

// Navbar logo: VitePress antepone BASE_PATH automáticamente, así que aquí
// usamos la ruta relativa al directorio public (sin BASE_PATH).
const navbarLogoSrc = '/img/logo.png'
const navbarLogo = LOGO_BRANDING.mode === 'separate'
  ? {
      light: navbarLogoSrc,
      dark:  getDarkLogoPath(navbarLogoSrc, LOGO_BRANDING.darkSuffix ?? '-dark'),
    }
  : navbarLogoSrc

// Objeto logoBranding: pasado a los componentes Vue via themeConfig
// Los componentes lo leen con:  useData().theme.value.logoBranding
const logoBranding = {
  mode:       LOGO_BRANDING.mode,
  darkSuffix: LOGO_BRANDING.darkSuffix ?? '-dark',
  logos: {
    autor:  { src: logoAutorPath,  height: '165px' },
    gva:    { src: logoGvaPath,    height: '60px'  },
    centro: { src: logoCentroPath, height: '90px'  },
    footer: { src: logoAutorPath,  height: '75px'  },
  },
}

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
    logo: navbarLogo,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GGEdu' }
    ],
    // Los logos institucionales (autor, GVA, centro) se inyectan en el sidebar
    // y footer mediante componentes Vue reactivos (SidebarLogos.vue / FooterLogo.vue).
    // Configurar el modo en src/.vitepress/branding.ts
    logoBranding,
    sidebar: {
      '/': sidebar.length > 0 ? sidebar : [],
    },
    footer: {
      copyright: 'Copyright © 2025'
    }
  } as any
})

// buildLogoFooter() eliminada: los logos se inyectan via SidebarLogos.vue (sidebar-nav-after)
// y FooterLogo.vue (layout-bottom) con soporte reactivo light/dark.
