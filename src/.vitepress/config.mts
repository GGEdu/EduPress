import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import container from 'markdown-it-container'

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

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/EduPress/',
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
    ['link', { rel: 'icon', href: '/EduPress/img/logo.png' }]
  ],
  // Metadatos por idioma (guía i18n)
  locales: {
    root: {
      label: 'Español',
      lang: 'es-ES',
      link: '/',
      title: 'Título del sitio',
      description: 'Descripción breve del sitio',
      themeConfig: {
        siteTitle: 'Nombre del sitio',
        outline: { label: 'En esta página' },
          docFooter: { prev: 'Anterior', next: 'Siguiente' },
          nav: [
            { text: '🏠 Inicio', link: '/' },
            { 
              text: '📚 Contenidos', 
              items: [
                { text: '1. Introducción', link: '/contenidos/1-introduccion' },
                { text: '2. Diapositivas', link: '/contenidos/diapositivas' },
                { text: '3. Ejemplo Simple', link: '/contenidos/ejemplo-diapositivas-simple' },
              ]
            },            
          ],
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
      '/': [
        {
          text: '📚 Contenidos',
          collapsed: true,
          items: [
            { text: '1. Introducción', link: '/contenidos/1-introduccion' },
            { text: '2. Diapositivas', link: '/contenidos/2-diapositivas' },
            { text: '3. Ejemplos Diapositivas', link: '/contenidos/3-diapositivas-demo' },
          ]
        },
        {
              text: '🗂️ Ejercicios',
              collapsed: true,
              items: [
                { text: 'Inicio', link: '/ejercicios/' },
                { text: 'Ejercicio', link: '/ejercicios/ejercicio' },
                { text: 'Final', link: '/ejercicios/final' }
              ]
            },
        {
          items: [
            { text: '<img src="/EduPress/img/logo-autor.png" class="logo-anim" style="vertical-align:middle; height:165px; margin:0 auto;">', link: '' },
            { text: '<img src="/EduPress/img/logo-gva.png" class="logo-anim" style="vertical-align:middle; height:60px; margin:0 auto;">', link: '' },
            { text: '<img src="/EduPress/img/logo-centro.png" class="logo-anim" style="vertical-align:middle; height:90px; margin:0 auto;">', link: '' }
          ]
        }
      ],
    },
    footer: {
      message: '<img src="/EduPress/img/logo-autor.png" alt="Autor" style="height:75px; margin: 0 auto; display:block;" />',
      copyright: 'Copyright © 2025'
    }
  }
})
