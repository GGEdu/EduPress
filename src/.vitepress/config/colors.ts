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

// Superficies y texto (modo claro): evitar blanco/negro puros para reducir fatiga.
const bg      = '#FFFFFF'
const bgSoft  = '#F6F6F7'
const bgAlt   = '#EEEEEF'
const text1   = '#213547'
const text2   = '#476582'
const text3   = '#90A4B7'
const divider = '#E2E2E3'
const codeBg  = '#F1F1F1'

// ── Texto semántico accesible (modo claro) ────────────────────────────────────
// Colores oscuros para contraste AAA sobre fondos claros de callout.
const noteText      = '#064e3b'  // Emerald 900 - >7:1 AAA
const tipText       = '#064e3b'  // Emerald 900 - >7:1 AAA
const warningText   = '#78350f'  // Amber 900   - >7:1 AAA
const cautionText   = '#4c1d95'  // Violet 900  - >7:1 AAA
const importantText = '#7f1d1d'  // Red 900     - >7:1 AAA

// ── Colores modo oscuro — versión más clara/cálida para fondo oscuro ─────────

const darkBrand        = '#f48061'  // Brand principal en dark mode
const darkBrand1       = '#fc9578'  // Hover más claro
const darkBrand2       = '#ffab93'  // Texto en hover
const darkBrand3       = '#953d26'  // Fondos invertidos
const darkBrandLight   = '#c0482d'
const darkBrandLighter = '#d95a3d'
const darkBrandDark    = '#f48061'
const darkBrandDarker  = '#fca087'

// Superficies y texto (modo oscuro): carbón neutro profundo y grises atenuados.
const darkBg      = '#1b1b1f'
const darkBgSoft  = '#232329'
const darkBgAlt   = '#2a2a2f'
const darkText1   = '#e5e5e5'
const darkText2   = '#aaaaaa'
const darkText3   = '#757575'
const darkDivider = '#3c3c44'
const darkCodeBg  = '#161618'

// Texto semántico dark: los propios semánticos dan buen contraste sobre fondos oscuros.
const darkNoteText      = semanticNote
const darkTipText       = semanticTip
const darkWarningText   = semanticWarning
const darkCautionText   = semanticCaution
const darkImportantText = semanticCaution

// ── Degradados — endpoints de AccentBox y slides ─────────────────────────────
const gradMintStart    = '#4EBDAE';  const gradMintEnd    = '#2CA390'
const gradBlueStart    = '#3182CE';  const gradBlueEnd    = '#2B6CB0'
const gradSuccessStart = '#059669';  const gradSuccessEnd = '#047857'
const gradWarningStart = '#D97706';  const gradWarningEnd = '#B45309'
const gradDangerStart  = '#DC2626';  const gradDangerEnd  = '#B91C1C'
const gradInfoStart    = '#2563EB';  const gradInfoEnd    = '#1D4ED8'
const gradPurpleStart  = '#5B72E0';  const gradPurpleEnd  = '#683BA2'
const gradOrangeStart  = '#E07CEB';  const gradOrangeEnd  = '#D64558'
const gradTealStart    = '#3AA0E0';  const gradTealEnd    = '#00B4C5'

// ── Superficies auxiliares ───────────────────────────────────────────────────
const bgTerminal         = '#1A202C'
const colorDark          = '#333333'
const textOnGradient     = '#FFFFFF'
const textOnGradientDark = '#222222'

const darkBgTerminal         = '#2D3748'
const darkColorDark          = '#E5E5E5'
const darkTextOnGradient     = '#FFFFFF'
const darkTextOnGradientDark = '#1A1A1A'

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
    bg,
    bgSoft,
    bgAlt,
    text1,
    text2,
    text3,
    divider,
    codeBg,
    noteText,
    tipText,
    warningText,
    cautionText,
    importantText,
    gradMintStart, gradMintEnd,
    gradBlueStart, gradBlueEnd,
    gradSuccessStart, gradSuccessEnd,
    gradWarningStart, gradWarningEnd,
    gradDangerStart, gradDangerEnd,
    gradInfoStart, gradInfoEnd,
    gradPurpleStart, gradPurpleEnd,
    gradOrangeStart, gradOrangeEnd,
    gradTealStart, gradTealEnd,
    bgTerminal,
    colorDark,
    textOnGradient,
    textOnGradientDark,
    bgBrandSubtle: hex2rgba(brand, 0.1),
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
    bg: darkBg,
    bgSoft: darkBgSoft,
    bgAlt: darkBgAlt,
    text1: darkText1,
    text2: darkText2,
    text3: darkText3,
    divider: darkDivider,
    codeBg: darkCodeBg,
    noteText: darkNoteText,
    tipText: darkTipText,
    warningText: darkWarningText,
    cautionText: darkCautionText,
    importantText: darkImportantText,
    bgTerminal: darkBgTerminal,
    colorDark: darkColorDark,
    textOnGradient: darkTextOnGradient,
    textOnGradientDark: darkTextOnGradientDark,
    bgBrandSubtle: hex2rgba(darkBrand, 0.15),
  },
  typography: {
    fontBase,
    fontMono,
    fontImportUrl,
  },
}
