// ============================================================================
// CONFIGURACIÓN DE LOGOS
// ============================================================================
// 👤 Edita este archivo para ajustar el modo claro/oscuro y alturas de logos.
//    Archivos de logo en: src/public/img/
// ============================================================================

// Tipo exportado: usado por el componente ThemedImage.vue
export type LogoMode = 'same' | 'invert' | 'separate'

// Función exportada: usada por ThemedImage.vue para calcular la ruta oscura
// Ejemplo: 'logo.png' + suffix '-dark' → 'logo-dark.png'
export function getDarkLogoPath(src: string, suffix = '-dark'): string {
  return src.replace(/(\.[^.]+)$/, `${suffix}$1`)
}

export const LOGOS = {

  // --------------------------------------------------------------------------
  // MODO DE LOGO PARA MODO OSCURO
  // --------------------------------------------------------------------------
  // Define cómo se muestra el logo cuando el usuario activa el tema oscuro:
  //
  //   'same'     — Se usa el mismo archivo en claro y oscuro (sin cambios)
  //   'invert'   — Se invierte el logo con CSS (útil para logos en negro)
  //   'separate' — Se usa un archivo diferente (logo.png → logo-dark.png)
  //
  mode: 'separate' as LogoMode,

  // Sufijo añadido al nombre del archivo para la versión oscura.
  // Solo se usa cuando mode = 'separate'.
  // Ejemplo: 'logo.png' → 'logo-dark.png'
  darkSuffix: '-dark',

  // --------------------------------------------------------------------------
  // ALTURAS DE LOS LOGOS INSTITUCIONALES
  // --------------------------------------------------------------------------
  // Estos logos aparecen en el sidebar (debajo del menú) y en el footer.
  // Ajusta las alturas según el tamaño y proporción de tus imágenes.
  // Usa unidades CSS: 'px', 'rem', '%', etc.
  heights: {
    autor:  '165px',  // Logo del autor / profesor  (sidebar y footer)
    gva:    '60px',   // Logo de la Generalitat Valenciana / institución
    centro: '90px',   // Logo del centro educativo
    footer: '75px',   // Logo del pie de página (versión compacta del autor)
  },

}
