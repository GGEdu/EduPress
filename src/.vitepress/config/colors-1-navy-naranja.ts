// ============================================================================
// CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA — Paleta 1: Navy Profundo y Naranja Eléctrico
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
// Color Primario: Navy Profundo — máxima autoridad y confianza sobre blanco.
const brand        = '#003366'  // Navy profundo
const brandLight   = '#0A4A8A'  // Un poco más claro
const brandLighter = '#1A5FA0'  // Aún más claro
const brandDark    = '#002244'  // Más oscuro
const brandDarker  = '#001133'  // El más oscuro

// Acento vibrante: Naranja Eléctrico — energía y llamada a la acción.
const accent = '#FF5F01'

// Callouts — :::note-box (azul), :::tip-box (verde), :::warning-box (ámbar), :::danger-box (rojo)
const semanticNote    = '#3b82f6'
const semanticTip     = '#22c55e'
const semanticWarning = '#f59e0b'
const semanticCaution = '#ef4444'

// Superficies y texto (modo claro)
const bg      = '#F8FAFC'   // Azul muy claro — fresco y limpio
const bgSoft  = '#FFFFFF'   // Blanco puro para tarjetas/sidebar
const bgAlt   = '#EFF4FA'   // Superficies alternas con leve tono azulado
const text1   = '#0F172A'   // Carbón casi negro — máxima legibilidad
const text2   = '#475569'   // Slate — subtítulos e iconos
const text3   = '#64748B'   // Terciario — metadata, timestamps
const divider = '#CBD5E1'   // Separadores slate claro
const codeBg  = '#E2E8F0'   // Bloques de código

// ── Texto semántico accesible (modo claro) ────────────────────────────────────
const noteText      = '#1e3a5f'
const tipText       = '#14532d'
const warningText   = '#78350f'
const cautionText   = '#7f1d1d'
const importantText = '#7f1d1d'

// ── Colores modo oscuro ──────────────────────────────────────────────────────
// En dark mode el primario vira a azul eléctrico luminoso, el acento sube a naranja brillante.
const darkBrand        = '#3B82F6'  // Azul eléctrico — visible sobre fondo oscuro
const darkBrand1       = '#3B82F6'
const darkBrand2       = '#60A5FA'
const darkBrand3       = '#1D4ED8'
const darkBrandLight   = '#2563EB'
const darkBrandLighter = '#3B82F6'
const darkBrandDark    = '#3B82F6'
const darkBrandDarker  = '#93C5FD'

const darkBg      = '#0F172A'   // Slate 900 — profundidad navy total
const darkBgSoft  = '#1E293B'   // Slate 800
const darkBgAlt   = '#162035'   // Intermedio para variedad
const darkText1   = '#F1F5F9'   // Slate 100 — alta legibilidad
const darkText2   = '#94A3B8'   // Slate 400 — secundario
const darkText3   = '#64748B'   // Slate 500 — terciario
const darkDivider = '#334155'   // Slate 700
const darkCodeBg  = '#0A1020'   // Casi negro azulado

const darkNoteText      = '#60a5fa'
const darkTipText       = '#4ade80'
const darkWarningText   = '#fbbf24'
const darkCautionText   = '#f87171'
const darkImportantText = '#f87171'

// ── Degradados ───────────────────────────────────────────────────────────────
// gradBrand: Naranja Eléctrico — llamada a la acción, énfasis cálido.
// gradSlate: Navy Profundo — estructura, rigor técnico.
const gradBrandStart   = hex2rgba('#FF5F01', 0.5);  const gradBrandEnd   = hex2rgba('#FF5F01', 0.8)
const gradSlateStart   = hex2rgba('#003366', 0.5);  const gradSlateEnd   = hex2rgba('#003366', 0.8)
const gradSuccessStart = hex2rgba('#22c55e', 0.6);  const gradSuccessEnd = hex2rgba('#22c55e', 0.8)
const gradWarningStart = hex2rgba('#f59e0b', 0.5);  const gradWarningEnd = hex2rgba('#f59e0b', 0.8)
const gradDangerStart  = hex2rgba('#ef4444', 0.6);  const gradDangerEnd  = hex2rgba('#ef4444', 0.8)
const gradInfoStart    = hex2rgba('#3b82f6', 0.5);  const gradInfoEnd    = hex2rgba('#3b82f6', 0.8)

// ── Superficies auxiliares ───────────────────────────────────────────────────
const bgTerminal         = '#003366'   // Navy — cajas de código/terminal
const colorDark          = '#003366'
const textOnGradient     = '#FFFFFF'
const textOnGradientDark = '#0F172A'

const darkBgTerminal         = '#0A1F44'
const darkColorDark          = '#162035'
const darkTextOnGradient     = '#FFFFFF'
const darkTextOnGradientDark = '#0F172A'

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
