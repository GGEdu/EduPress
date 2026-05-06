// ============================================================================
// CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA — Paleta 2: Púrpura Joya y Esmeralda
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
// Color Primario: Púrpura Joya — lujo, creatividad y profundidad visual.
const brand        = '#540991'  // Púrpura joya intenso
const brandLight   = '#6A12AE'  // Un poco más claro
const brandLighter = '#7E20C5'  // Aún más claro
const brandDark    = '#3D0770'  // Más oscuro
const brandDarker  = '#280450'  // El más oscuro

// Acento vibrante: Esmeralda — frescura y naturaleza, complementa el púrpura.
const accent = '#00A36C'

// Callouts — :::note-box (azul), :::tip-box (verde), :::warning-box (ámbar), :::danger-box (rojo)
const semanticNote    = '#3b82f6'
const semanticTip     = '#22c55e'
const semanticWarning = '#f59e0b'
const semanticCaution = '#ef4444'

// Superficies y texto (modo claro)
const bg      = '#FAF5FF'   // Lavanda muy suave — ambiente envolvente
const bgSoft  = '#FFFFFF'   // Blanco puro para tarjetas/sidebar
const bgAlt   = '#F2E8FF'   // Púrpura clarísimo para superficies alternas
const text1   = '#1E112A'   // Uva oscura — máxima legibilidad con calidez
const text2   = '#6B7280'   // Gris neutro — subtítulos e iconos
const text3   = '#9CA3AF'   // Terciario — metadata, timestamps
const divider = '#E0D0EF'   // Separadores lavanda
const codeBg  = '#EDE4F8'   // Bloques de código púrpura claro

// ── Texto semántico accesible (modo claro) ────────────────────────────────────
const noteText      = '#1e3a5f'
const tipText       = '#14532d'
const warningText   = '#78350f'
const cautionText   = '#7f1d1d'
const importantText = '#7f1d1d'

// ── Colores modo oscuro ──────────────────────────────────────────────────────
// En dark mode el primario vira a violeta luminoso, el acento sube a esmeralda brillante.
const darkBrand        = '#A78BFA'  // Violet 400 — etéreo sobre fondo oscuro
const darkBrand1       = '#A78BFA'
const darkBrand2       = '#C4B5FD'  // Violet 300 — más claro
const darkBrand3       = '#7C3AED'  // Violet 600 — énfasis fuerte
const darkBrandLight   = '#7C3AED'
const darkBrandLighter = '#A78BFA'
const darkBrandDark    = '#A78BFA'
const darkBrandDarker  = '#C4B5FD'

const darkBg      = '#1E112A'   // Uva profunda — ambiente oscuro envolvente
const darkBgSoft  = '#2D1A40'   // Superficie oscura levemente más clara
const darkBgAlt   = '#3A2150'   // Alternancia suave
const darkText1   = '#F3E8FF'   // Lavanda casi blanco — máxima legibilidad
const darkText2   = '#D8B4FE'   // Violet 300 — subtítulos
const darkText3   = '#A78BFA'   // Violet 400 — terciario
const darkDivider = '#4A2D60'   // Separadores púrpura oscuro
const darkCodeBg  = '#150C20'   // Casi negro violeta

const darkNoteText      = '#60a5fa'
const darkTipText       = '#4ade80'
const darkWarningText   = '#fbbf24'
const darkCautionText   = '#f87171'
const darkImportantText = '#f87171'

// ── Degradados ───────────────────────────────────────────────────────────────
// gradBrand: Esmeralda — acento vivo, llamada a la acción verde.
// gradSlate: Púrpura Joya — estructura y énfasis de marca.
const gradBrandStart   = hex2rgba('#00A36C', 0.5);  const gradBrandEnd   = hex2rgba('#00A36C', 0.8)
const gradSlateStart   = hex2rgba('#540991', 0.5);  const gradSlateEnd   = hex2rgba('#540991', 0.8)
const gradSuccessStart = hex2rgba('#22c55e', 0.6);  const gradSuccessEnd = hex2rgba('#22c55e', 0.8)
const gradWarningStart = hex2rgba('#f59e0b', 0.5);  const gradWarningEnd = hex2rgba('#f59e0b', 0.8)
const gradDangerStart  = hex2rgba('#ef4444', 0.6);  const gradDangerEnd  = hex2rgba('#ef4444', 0.8)
const gradInfoStart    = hex2rgba('#3b82f6', 0.5);  const gradInfoEnd    = hex2rgba('#3b82f6', 0.8)

// ── Superficies auxiliares ───────────────────────────────────────────────────
const bgTerminal         = '#540991'   // Púrpura Joya — cajas de código/terminal
const colorDark          = '#540991'
const textOnGradient     = '#FFFFFF'
const textOnGradientDark = '#1E112A'

const darkBgTerminal         = '#2D1A40'
const darkColorDark          = '#3A2150'
const darkTextOnGradient     = '#FFFFFF'
const darkTextOnGradientDark = '#1E112A'

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
