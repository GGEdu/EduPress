import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/EduPress/',
  outDir: '../docs',
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
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
            { text: '2. Diapositivas', link: '/contenidos/diapositivas' },
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
