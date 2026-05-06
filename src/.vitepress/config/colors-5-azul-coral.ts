// ============================================================================
// CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA — Paleta 5: Monocromático Azul y Coral
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
// Color Primario: Azul cielo — apertura, claridad y confianza profesional.
const brand        = '#0284C7'  // Sky 600 — azul cielo vivo
const brandLight   = '#0EA5E9'  // Sky 500 — un poco más claro
const brandLighter = '#38BDF8'  // Sky 400 — aún más claro, casi eléctrico
const brandDark    = '#0369A1'  // Sky 700 — más oscuro
const brandDarker  = '#02577A'  // Sky 800 aprox. — el más oscuro

// Acento vibrante: Coral — calidez mediterránea que contrasta con el azul frío.
const accent = '#FF7F50'

// Callouts — :::note-box (azul), :::tip-box (verde), :::warning-box (ámbar), :::danger-box (rojo)
const semanticNote    = '#3b82f6'
const semanticTip     = '#22c55e'
const semanticWarning = '#f59e0b'
const semanticCaution = '#ef4444'

// Superficies y texto (modo claro)
const bg      = '#F0F9FF'   // Sky 50 — azul hielo muy suave
const bgSoft  = '#FFFFFF'   // Blanco puro para tarjetas/sidebar
const bgAlt   = '#E0F2FE'   // Sky 100 — superficies alternas
const text1   = '#075985'   // Sky 800 — azul oscuro como tinta de marca
const text2   = '#64748B'   // Slate 500 — subtítulos e iconos neutros
const text3   = '#94A3B8'   // Slate 400 — metadata, timestamps
const divider = '#BAE6FD'   // Sky 200 — separadores celestes
const codeBg  = '#DBEAFE'   // Blue 100 — bloques de código azul suave

// ── Texto semántico accesible (modo claro) ────────────────────────────────────
const noteText      = '#1e3a5f'
const tipText       = '#14532d'
const warningText   = '#78350f'
const cautionText   = '#7f1d1d'
const importantText = '#7f1d1d'

// ── Colores modo oscuro ──────────────────────────────────────────────────────
// En dark mode el azul se aclara a celeste luminoso y el coral sube en luminosidad.
const darkBrand        = '#38BDF8'  // Sky 400 — celeste brillante sobre oscuro
const darkBrand1       = '#38BDF8'
const darkBrand2       = '#7DD3FC'  // Sky 300 — más luminoso
const darkBrand3       = '#0284C7'  // Sky 600 — referencia al light
const darkBrandLight   = '#0EA5E9'  // Sky 500
const darkBrandLighter = '#38BDF8'  // Sky 400
const darkBrandDark    = '#38BDF8'
const darkBrandDarker  = '#7DD3FC'

const darkBg      = '#082F49'   // Sky 950 — noche oceánica profunda
const darkBgSoft  = '#0C4A6E'   // Sky 900 — superficie oscura azulada
const darkBgAlt   = '#0E3D5C'   // Intermedio para variedad
const darkText1   = '#E0F2FE'   // Sky 100 — casi blanco azulado
const darkText2   = '#BAE6FD'   // Sky 200 — secundario celeste
const darkText3   = '#7DD3FC'   // Sky 300 — terciario
const darkDivider = '#1E5F80'   // Azul oscuro medio para separadores
const darkCodeBg  = '#041C2E'   // Azul casi negro para código

const darkNoteText      = '#60a5fa'
const darkTipText       = '#4ade80'
const darkWarningText   = '#fbbf24'
const darkCautionText   = '#f87171'
const darkImportantText = '#f87171'

// ── Degradados ───────────────────────────────────────────────────────────────
// gradBrand: Coral — calidez y energía, contraste con el azul monocromático.
// gradSlate: Azul cielo — frío, profesional, monocromático de marca.
const gradBrandStart   = hex2rgba('#FF7F50', 0.5);  const gradBrandEnd   = hex2rgba('#FF7F50', 0.8)
const gradSlateStart   = hex2rgba('#0284C7', 0.5);  const gradSlateEnd   = hex2rgba('#0284C7', 0.8)
const gradSuccessStart = hex2rgba('#22c55e', 0.6);  const gradSuccessEnd = hex2rgba('#22c55e', 0.8)
const gradWarningStart = hex2rgba('#f59e0b', 0.5);  const gradWarningEnd = hex2rgba('#f59e0b', 0.8)
const gradDangerStart  = hex2rgba('#ef4444', 0.6);  const gradDangerEnd  = hex2rgba('#ef4444', 0.8)
const gradInfoStart    = hex2rgba('#3b82f6', 0.5);  const gradInfoEnd    = hex2rgba('#3b82f6', 0.8)

// ── Superficies auxiliares ───────────────────────────────────────────────────
const bgTerminal         = '#0284C7'   // Sky 600 — cajas de código/terminal
const colorDark          = '#0284C7'
const textOnGradient     = '#FFFFFF'
const textOnGradientDark = '#075985'

const darkBgTerminal         = '#082F49'   // Sky 950 — terminal oscuro oceánico
const darkColorDark          = '#0C4A6E'   // Sky 900
const darkTextOnGradient     = '#FFFFFF'
const darkTextOnGradientDark = '#082F49'

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
