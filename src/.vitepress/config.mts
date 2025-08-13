import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vitepress-template/',
  outDir: '../docs',
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  },
  head: [
    // ['link', { rel: 'icon', type: 'image/png', href: '/img/logo.png' }],
    // ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    // ['link', { rel: 'stylesheet', href: '/UD1/.vitepress/theme/custom.css' }]
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
            { text: 'Inicio', link: '/' },
            {
              text: 'Ejemplos',
              items: [
                { text: 'Página de inicio', link: '/' },
                { text: 'Enlace externo', link: '/' }
              ]
            }
          ]
      }
    },
    ca: {
      label: 'Català',
      lang: 'ca-ES',
      link: '/ca/',
      title: 'Títol del lloc',
      description: 'Descripció breu del lloc',
      themeConfig: {
        siteTitle: 'Nom del lloc',
        outline: { label: 'En aquesta pàgina' },
          docFooter: { prev: 'Anterior', next: 'Següent' },
          nav: [
            { text: 'Inici', link: '/ca/' },
            {
              text: 'Exemples',
              items: [
                { text: "Pàgina d'inici", link: '/ca/' },
                { text: 'Enllaç extern', link: '/' }
              ]
            }
          ]
      }
    }
  },
  // Tema por idioma
  themeConfig: {
    logo: '/img/logo.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/usuario/repositorio' }
    ],
    // Sidebar global por prefijo
    sidebar: {
      '/': [
        {
          text: 'Contenidos',
          items: [
            { text: 'Introducción', link: '/' }
          ]
        }
      ],
      '/ca/': [
        {
          text: 'Continguts',
          items: [
            { text: 'Introducció', link: '/ca/' }
          ]
        }
      ]
    },
    footer: {
      message: '<img src="/UD1/img/logo-autor.png" alt="Autor" style="height:75px; margin: 0 auto; display:block;" />',
      copyright: 'Copyright © 2025'
    }
  }
})
