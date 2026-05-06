// ============================================================================
// CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA — Paleta 3: Gris Pizarra y Verde Azulado
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
// Color Primario: Teal profundo — equilibrio entre naturaleza y tecnología.
const brand        = '#0D9488'  // Teal 600 — verde azulado intenso
const brandLight   = '#0FA89A'  // Un poco más claro
const brandLighter = '#14B8A4'  // Teal 500 — aún más claro
const brandDark    = '#0A7269'  // Más oscuro
const brandDarker  = '#085F58'  // El más oscuro

// Acento vibrante: Azul eléctrico — complemento frío con punch digital.
const accent = '#2563EB'

// Callouts — :::note-box (azul), :::tip-box (verde), :::warning-box (ámbar), :::danger-box (rojo)
const semanticNote    = '#3b82f6'
const semanticTip     = '#22c55e'
const semanticWarning = '#f59e0b'
const semanticCaution = '#ef4444'

// Superficies y texto (modo claro)
const bg      = '#F9FAFB'   // Gris neutro casi blanco — limpio y sin distracción
const bgSoft  = '#FFFFFF'   // Blanco puro para tarjetas/sidebar
const bgAlt   = '#F3F4F6'   // Gris suave para superficies alternas
const text1   = '#111827'   // Gris 900 — CUERPO DE LECTURA (usa este, no text2/text3)
const text2   = '#4B5563'   // Gris 600 — subtítulos e iconos (NO para párrafos largos)
const text3   = '#6B7280'   // Gris 500 — metadata, timestamps (NO para cuerpo)
const divider = '#D1D5DB'   // Gris 300 — separadores suaves
const codeBg  = '#E5E7EB'   // Gris 200 — bloques de código

// ── Texto semántico accesible (modo claro) ────────────────────────────────────
const noteText      = '#1e3a5f'
const tipText       = '#14532d'
const warningText   = '#78350f'
const cautionText   = '#7f1d1d'
const importantText = '#7f1d1d'

// ── Colores modo oscuro ──────────────────────────────────────────────────────
// En dark mode el teal sube a una versión brillante, el azul complementario se aclara.
const darkBrand        = '#2DD4BF'  // Teal 300 — vibrante sobre fondo oscuro
const darkBrand1       = '#2DD4BF'
const darkBrand2       = '#5EEAD4'  // Teal 200 — más luminoso
const darkBrand3       = '#134E4A'  // Teal 900 — énfasis profundo
const darkBrandLight   = '#14B8A4'  // Teal 500
const darkBrandLighter = '#0D9488'  // Teal 600
const darkBrandDark    = '#2DD4BF'
const darkBrandDarker  = '#5EEAD4'

const darkBg      = '#121212'   // Negro pizarra — máxima profundidad
const darkBgSoft  = '#1E1E1E'   // Gris carbón para superficies
const darkBgAlt   = '#252525'   // Alternancia sutil
const darkText1   = '#E5E7EB'   // Gris 200 — legibilidad alta
const darkText2   = '#9CA3AF'   // Gris 400 — secundario
const darkText3   = '#6B7280'   // Gris 500 — terciario
const darkDivider = '#374151'   // Gris 700 — separadores
const darkCodeBg  = '#0A0A0A'   // Negro casi puro para código

const darkNoteText      = '#60a5fa'
const darkTipText       = '#4ade80'
const darkWarningText   = '#fbbf24'
const darkCautionText   = '#f87171'
const darkImportantText = '#f87171'

// ── Degradados ───────────────────────────────────────────────────────────────
// gradBrand: Teal — naturaleza y tecnología, estabilidad visual.
// gradSlate: Azul eléctrico — acento digital complementario.
const gradBrandStart   = hex2rgba('#0D9488', 0.5);  const gradBrandEnd   = hex2rgba('#0D9488', 0.8)
const gradSlateStart   = hex2rgba('#2563EB', 0.5);  const gradSlateEnd   = hex2rgba('#2563EB', 0.8)
const gradSuccessStart = hex2rgba('#22c55e', 0.6);  const gradSuccessEnd = hex2rgba('#22c55e', 0.8)
const gradWarningStart = hex2rgba('#f59e0b', 0.5);  const gradWarningEnd = hex2rgba('#f59e0b', 0.8)
const gradDangerStart  = hex2rgba('#ef4444', 0.6);  const gradDangerEnd  = hex2rgba('#ef4444', 0.8)
const gradInfoStart    = hex2rgba('#3b82f6', 0.5);  const gradInfoEnd    = hex2rgba('#3b82f6', 0.8)

// ── Superficies auxiliares ───────────────────────────────────────────────────
const bgTerminal         = '#0D9488'   // Teal — cajas de código/terminal
const colorDark          = '#2563EB'   // Azul eléctrico — fondos oscuros de énfasis
const textOnGradient     = '#FFFFFF'
const textOnGradientDark = '#111827'

const darkBgTerminal         = '#134E4A'   // Teal muy oscuro
const darkColorDark          = '#1E3A8A'   // Azul 900 oscuro
const darkTextOnGradient     = '#FFFFFF'
const darkTextOnGradientDark = '#111827'

// ── Tipografía ───────────────────────────────────────────────────────────────
// REGLA LECTURA LARGA: Plataformas educativas con bloques extensos de texto.
//   • fontWeightBody  → 400 (Regular). Si el trazo sigue pareciendo fino a
//     pantalla brillante, sube a 500 (Medium) sobreescribiendo aquí.
//   • Para el cuerpo de lectura usa siempre text1 (#111827), nunca text2/text3.
//   • La URL de Google Fonts ya incluye los pesos 300, 400, 500 y 700.
const fontWeightBody    = '400'   // Regular — mínimo recomendado para lectura larga
const fontWeightMedium  = '500'   // Medium  — alternativa si 400 resulta fino en pantalla
const fontWeightBold    = '700'   // Bold    — encabezados y énfasis
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
    fontWeightBody,
    fontWeightMedium,
    fontWeightBold,
  },
}
