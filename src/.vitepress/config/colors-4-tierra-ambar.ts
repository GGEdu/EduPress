// ============================================================================
// CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA — Paleta 4: Tonos Tierra y Ámbar Cálido
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
// Color Primario: Piedra cálida — neutralidad orgánica, sofisticación terrosa.
const brand        = '#57534E'  // Stone 600 — gris cálido oscuro
const brandLight   = '#6B6560'  // Un poco más claro
const brandLighter = '#7D7673'  // Aún más claro
const brandDark    = '#44403C'  // Stone 700 — más oscuro
const brandDarker  = '#322F2C'  // Stone 800 — el más oscuro

// Acento vibrante: Ámbar cálido — calidez solar, contrasta perfectamente con la piedra.
const accent = '#D97706'

// Callouts — :::note-box (azul), :::tip-box (verde), :::warning-box (ámbar), :::danger-box (rojo)
const semanticNote    = '#3b82f6'
const semanticTip     = '#22c55e'
const semanticWarning = '#f59e0b'
const semanticCaution = '#ef4444'

// Superficies y texto (modo claro)
const bg      = '#FAFAF9'   // Stone 50 — blanco cálido
const bgSoft  = '#F5F5F4'   // Stone 100 — superficie levemente arena
const bgAlt   = '#EFEDEA'   // Stone 150 aprox. — alternas cálidas
const text1   = '#1C1917'   // Stone 900 — negro terroso, máxima legibilidad
const text2   = '#78716C'   // Stone 500 — subtítulos e iconos
const text3   = '#A8A29E'   // Stone 400 — metadata, timestamps
const divider = '#D6D3D1'   // Stone 300 — separadores
const codeBg  = '#E7E5E4'   // Stone 200 — bloques de código

// ── Texto semántico accesible (modo claro) ────────────────────────────────────
const noteText      = '#1e3a5f'
const tipText       = '#14532d'
const warningText   = '#78350f'
const cautionText   = '#7f1d1d'
const importantText = '#7f1d1d'

// ── Colores modo oscuro ──────────────────────────────────────────────────────
// En dark mode la piedra se aclara a un tono arena y el ámbar sube un paso de brillo.
const darkBrand        = '#A8A29E'  // Stone 400 — arena legible sobre fondo oscuro
const darkBrand1       = '#A8A29E'
const darkBrand2       = '#C2BDB9'  // Stone 300 — más luminoso
const darkBrand3       = '#57534E'  // Stone 600 — referencia directa al light
const darkBrandLight   = '#78716C'  // Stone 500
const darkBrandLighter = '#8A8580'  // Entre 400 y 500
const darkBrandDark    = '#A8A29E'
const darkBrandDarker  = '#C2BDB9'

const darkBg      = '#1C1917'   // Stone 900 — tierra oscura profunda
const darkBgSoft  = '#292524'   // Stone 800 — superficie oscura
const darkBgAlt   = '#342F2C'   // Intermedio para variedad
const darkText1   = '#F5F5F4'   // Stone 100 — blanco arena
const darkText2   = '#D6D3D1'   // Stone 300 — secundario cálido
const darkText3   = '#A8A29E'   // Stone 400 — terciario
const darkDivider = '#44403C'   // Stone 700 — separadores
const darkCodeBg  = '#100F0E'   // Casi negro cálido

const darkNoteText      = '#60a5fa'
const darkTipText       = '#4ade80'
const darkWarningText   = '#fbbf24'
const darkCautionText   = '#f87171'
const darkImportantText = '#f87171'

// ── Degradados ───────────────────────────────────────────────────────────────
// gradBrand: Ámbar cálido — calidez y energía solar.
// gradSlate: Piedra terrosa — estructura neutra y sofisticada.
const gradBrandStart   = hex2rgba('#D97706', 0.5);  const gradBrandEnd   = hex2rgba('#D97706', 0.8)
const gradSlateStart   = hex2rgba('#57534E', 0.5);  const gradSlateEnd   = hex2rgba('#57534E', 0.8)
const gradSuccessStart = hex2rgba('#22c55e', 0.6);  const gradSuccessEnd = hex2rgba('#22c55e', 0.8)
const gradWarningStart = hex2rgba('#f59e0b', 0.5);  const gradWarningEnd = hex2rgba('#f59e0b', 0.8)
const gradDangerStart  = hex2rgba('#ef4444', 0.6);  const gradDangerEnd  = hex2rgba('#ef4444', 0.8)
const gradInfoStart    = hex2rgba('#3b82f6', 0.5);  const gradInfoEnd    = hex2rgba('#3b82f6', 0.8)

// ── Superficies auxiliares ───────────────────────────────────────────────────
const bgTerminal         = '#78350F'   // Amber 900 oscuro — cajas de código/terminal
const colorDark          = '#57534E'   // Piedra — fondos oscuros de énfasis
const textOnGradient     = '#FFFFFF'
const textOnGradientDark = '#1C1917'

const darkBgTerminal         = '#451A03'   // Amber 950 — terminal oscuro cálido
const darkColorDark          = '#292524'   // Stone 800
const darkTextOnGradient     = '#FFFFFF'
const darkTextOnGradientDark = '#1C1917'

// ── Tipografía ───────────────────────────────────────────────────────────────
const fontBase = [
  "'Noto Sans'",
  "-apple-system",
  "BlinkMacSystemFont",
  "'Segoe UI'",
  "Lato",
  "Montserrat",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "'Helvetica Neue'",
  "sans-serif",
].join(', ')

const fontMono = [
  "'Cascadia Code'",
  "'Fira Code'",
  "Consolas",
  "Monaco",
  "'Andale Mono'",
  "'Ubuntu Mono'",
  "monospace",
].join(', ')

const fontImportUrl = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap'

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
    accentMint:   accent,
    accentTeal:   brandDark,
    accentPurple: gradSlateStart,
    accentIndigo: gradSlateStart,
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
    gradMintStart: gradBrandStart, gradMintEnd: gradBrandEnd,
    gradBlueStart: gradSlateStart, gradBlueEnd: gradSlateEnd,
    gradSuccessStart, gradSuccessEnd,
    gradWarningStart, gradWarningEnd,
    gradDangerStart, gradDangerEnd,
    gradInfoStart, gradInfoEnd,
    gradPurpleStart: gradSlateStart, gradPurpleEnd: gradSlateEnd,
    gradOrangeStart: gradBrandStart, gradOrangeEnd: gradBrandEnd,
    gradTealStart: gradBrandStart, gradTealEnd: gradBrandEnd,
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
