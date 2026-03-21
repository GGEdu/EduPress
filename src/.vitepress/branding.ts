/**
 * ============================================================================
 * branding.ts — Configuración de logos con soporte Light / Dark
 * ============================================================================
 *
 * ✏️  ÚNICO ARCHIVO QUE NECESITAS EDITAR para configurar cómo se comportan
 *     los logos (autor, GVA, centro) al cambiar entre modo claro y oscuro.
 *
 * ┌─────────────┬────────────────────────────────────────────────────────────┐
 * │ mode        │ Comportamiento                                              │
 * ├─────────────┼────────────────────────────────────────────────────────────┤
 * │ 'same'      │ El mismo archivo PNG en claro y oscuro. Sin cambios.       │
 * │             │ Usa esto si el logo ya se ve bien en ambos fondos.         │
 * ├─────────────┼────────────────────────────────────────────────────────────┤
 * │ 'invert'    │ En modo oscuro aplica: filter: brightness(0) invert(1).   │
 * │             │ Ideal para logos negros sobre PNG transparente: se          │
 * │             │ convierten en blanco automáticamente.                       │
 * ├─────────────┼────────────────────────────────────────────────────────────┤
 * │ 'separate'  │ Usa un archivo distinto en modo oscuro. La versión oscura  │
 * │             │ se detecta añadiendo `darkSuffix` antes de la extensión:   │
 * │             │   logo-autor.png  →  logo-autor-dark.png                   │
 * │             │ Si el archivo oscuro no existe, se muestra el claro.        │
 * └─────────────┴────────────────────────────────────────────────────────────┘
 *
 * Affecta a estos logos:
 *   • Navbar:  logo.png (soporte nativo de VitePress)
 *   • Sidebar: logo-autor.png (165px), logo-gva.png (60px), logo-centro.png (90px)
 *   • Footer:  logo-autor.png (75px)
 *
 * ============================================================================
 */

export type LogoMode = 'same' | 'invert' | 'separate'

export interface LogoBrandingConfig {
  /**
   * Modo de adaptación de todos los logos al cambiar de tema.
   * @default 'same'
   */
  mode: LogoMode

  /**
   * Sufijo que se añade antes de la extensión para localizar la versión oscura.
   * Solo se usa cuando mode === 'separate'.
   * @default '-dark'
   * @example  '-dark'  →  logo-autor.png  →  logo-autor-dark.png
   */
  darkSuffix?: string
}

// ─── ✏️ EDITA AQUÍ ──────────────────────────────────────────────────────────

export const LOGO_BRANDING: LogoBrandingConfig = {
  mode: 'separate',      // 'same' | 'invert' | 'separate'
  darkSuffix: '-dark',
}

// ────────────────────────────────────────────────────────────────────────────

/**
 * Calcula la ruta de la versión oscura de un logo dado su ruta clara.
 * @example getDarkLogoPath('/img/logo-autor.png', '-dark')
 *          → '/img/logo-autor-dark.png'
 */
export function getDarkLogoPath(src: string, suffix = '-dark'): string {
  return src.replace(/(\.[^.]+)$/, `${suffix}$1`)
}
