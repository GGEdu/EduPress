// ============================================================================
// CONFIGURACIÓN DEL PROYECTO — Identidad y metadatos
// ============================================================================
// 👤 Edita este archivo para configurar URL base, idioma, redes sociales
//    y copyright del sitio.
// ============================================================================

import type { DefaultTheme } from 'vitepress'

export const PROJECT = {

  // --------------------------------------------------------------------------
  // URL BASE
  // --------------------------------------------------------------------------
  // La ruta base del sitio. Debe coincidir con el subdirectorio de despliegue.
  //
  // Ejemplos:
  //   '/mi-curso/'          → https://usuario.github.io/mi-curso/
  //   '/2025-26-Laravel/'   → https://usuario.github.io/2025-26-Laravel/
  //   '/'                   → dominio raíz (https://midominio.com/)
  //
  // ⚠️ Siempre con barras al inicio Y al final.
  basePath: '/EduPress/',

  // --------------------------------------------------------------------------
  // IDIOMA
  // --------------------------------------------------------------------------
  lang: 'es-ES',

  // --------------------------------------------------------------------------
  // DESCRIPCIÓN DEL SITIO
  // --------------------------------------------------------------------------
  // Aparece en los metadatos SEO y como subtítulo en buscadores.
  description: 'EduPress — Plantilla modular para VitePress',

  // --------------------------------------------------------------------------
  // COPYRIGHT (pie de página)
  // --------------------------------------------------------------------------
  copyright: 'Copyright © 2025',

  // --------------------------------------------------------------------------
  // ENLACES SOCIALES
  // --------------------------------------------------------------------------
  // Aparecen como iconos en la esquina superior derecha del navbar.
  //
  // Iconos disponibles: 'github', 'twitter', 'gitlab', 'discord', 'youtube', etc.
  // Deja el array vacío [] si no quieres mostrar ningún enlace social.
  socialLinks: [
    { icon: 'github', link: 'https://github.com/GGEdu' },
  ] as DefaultTheme.SocialLink[],

  // --------------------------------------------------------------------------
  // DIRECTORIO DE SALIDA DEL BUILD
  // --------------------------------------------------------------------------
  // Relativo a la carpeta src/. No suele necesitar cambios.
  outDir: '../docs',

  // --------------------------------------------------------------------------
  // MODO DE EXPORTACIÓN A PDF
  // --------------------------------------------------------------------------
  // 'image': El PDF se genera client-side rasterizando la página (visualización exacta, texto no seleccionable).
  // 'text': Se abre el diálogo de impresión del navegador para exportar con texto seleccionable.
  pdfExportMode: 'image' as 'image' | 'text',

}
