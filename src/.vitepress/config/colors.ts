// ============================================================================
// CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA
// ============================================================================
// 👤 Edita este archivo para cambiar la paleta de colores y fuentes del sitio.
//    Normalmente solo necesitas cambiar `brand` (claro) y `darkBrand` (oscuro).
//    Herramientas: https://coolors.co  https://colorhunt.co  https://paletton.com
// ============================================================================

function hex2rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// ── Colores modo claro ───────────────────────────────────────────────────────
// El color corporativo del sitio. Elige un HEX con buen contraste sobre blanco.
const brand = '#ed6e51'

// Variaciones — del más claro al más oscuro, para hovers y gradientes
const brandLight   = '#ff7f5f'  // Un poco más claro
const brandLighter = '#ff9173'  // Aún más claro
const brandDark    = '#ed3728'  // Más oscuro (hovers intensos, degradados)
const brandDarker  = '#d62d1f'  // El más oscuro

// Acento — gradientes y elementos decorativos de slides
const accentMint   = '#63d1c1'  // Verde menta / celeste
const accentTeal   = '#41b8a5'  // Verde azulado profundo
const accentPurple = '#a836f4'  // Púrpura
const accentIndigo = '#4e8af1'  // Índigo / azul

// Callouts — :::note-box (azul), :::tip-box (verde), :::warning-box (amarillo), :::danger-box (púrpura)
const semanticNote    = '#4e8af1'  // Azul    → :::note-box  (notas)
const semanticTip     = '#26a69a'  // Verde   → :::tip-box   (consejos)
const semanticWarning = '#ffc107'  // Amarillo → :::warning-box (avisos)
const semanticCaution = '#a836f4'  // Púrpura  → :::danger-box (peligros)

// ── Colores modo oscuro — versión más clara/cálida para fondo oscuro ─────────

const darkBrand        = '#f48061'  // Brand principal en dark mode
const darkBrand1       = '#fc9578'  // Hover más claro
const darkBrand2       = '#ffab93'  // Texto en hover
const darkBrand3       = '#953d26'  // Fondos invertidos
const darkBrandLight   = '#c0482d'
const darkBrandLighter = '#d95a3d'
const darkBrandDark    = '#f48061'
const darkBrandDarker  = '#fca087'

// ── Tipografía ───────────────────────────────────────────────────────────────
const fontBase = [
  "'Roboto'",
  "-apple-system",
  "BlinkMacSystemFont",
  "'Segoe UI'",
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "'Fira Sans'",
  "'Droid Sans'",
  "'Helvetica Neue'",
  "sans-serif",
].join(', ')

// Monoespaciada para bloques de código
const fontMono = [
  "'Cascadia Code'",
  "'Fira Code'",
  "Consolas",
  "Monaco",
  "'Andale Mono'",
  "'Ubuntu Mono'",
  "monospace",
].join(', ')

// URL Google Fonts. Generador: https://fonts.google.com — Escribe '' para desactivar.
const fontImportUrl = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'

// ── Objeto exportado — no modificar la estructura ────────────────────────────
export const COLORS = {
  light: {
    brand,
    brand1: brand,
    brand2: brandLight,
    brand3: brandLighter,
    brandSoft: hex2rgba(brand, 0.14),
    brandLight,
    brandLighter,
    brandDark,
    brandDarker,
    accentMint,
    accentTeal,
    accentPurple,
    accentIndigo,
    semanticNote,
    semanticTip,
    semanticWarning,
    semanticCaution,
  },
  dark: {
    brand: darkBrand,
    brand1: darkBrand1,
    brand2: darkBrand2,
    brand3: darkBrand3,
    brandSoft: hex2rgba(darkBrand, 0.16),
    brandLight: darkBrandLight,
    brandLighter: darkBrandLighter,
    brandDark: darkBrandDark,
    brandDarker: darkBrandDarker,
  },
  typography: {
    fontBase,
    fontMono,
    fontImportUrl,
  },
}
