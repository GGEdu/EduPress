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
const brandLight   = '#f07d62'  // Un poco más claro
const brandLighter = '#f59173'  // Aún más claro
const brandDark    = '#d4522e'  // Más oscuro (hovers intensos, degradados)
const brandDarker  = '#b33d1f'  // El más oscuro

// Callouts — :::note-box (azul), :::tip-box (verde), :::warning-box (ámbar), :::danger-box (rojo)
// REGLA: Solo para notificaciones de estado, nunca como fondo decorativo de diapositiva.
const semanticNote    = '#3b82f6'  // Azul   → información / notas
const semanticTip     = '#22c55e'  // Verde  → éxito / consejos
const semanticWarning = '#f59e0b'  // Ámbar  → advertencia
const semanticCaution = '#ef4444'  // Rojo   → error crítico / peligro

// Superficies y texto (modo claro) — Guía: Regla del 60%, fondo gris claro.
// #F5F5F5 previene fatiga ocular en sesiones largas al evitar blanco puro.
const bg      = '#F5F5F5'   // Guía: Gris Claro (#F5F5F5)
const bgSoft  = '#EDEDEE'   // Superficies secundarias (sidebar, cards)
const bgAlt   = '#E5E5E6'   // Fondos alternos
const text1   = '#222222'   // Guía: Carbón Oscuro — máxima legibilidad (>14:1 sobre bg)
const text2   = '#6F8197'   // Guía: Azul Acero — subtítulos, iconos inactivos
const text3   = '#7890A5'   // Terciario — metadata, timestamps (≥3:1 sobre bg)
const divider = '#D8D8DA'   // Separadores (visible sobre fondo gris)
const codeBg  = '#E9E9EA'   // Bloques de código

// ── Texto semántico accesible (modo claro) ────────────────────────────────────
// Colores oscuros para contraste AAA sobre fondos claros de callout.
const noteText      = '#1e3a5f'  // Azul 900   - >7:1 AAA sobre callout azul
const tipText       = '#14532d'  // Green 900  - >7:1 AAA sobre callout verde
const warningText   = '#78350f'  // Amber 900  - >7:1 AAA
const cautionText   = '#7f1d1d'  // Red 900    - >7:1 AAA
const importantText = '#7f1d1d'  // Red 900    - >7:1 AAA

// ── Colores modo oscuro — versión más clara/cálida para fondo oscuro ─────────

const darkBrand        = '#f48061'  // Brand principal en dark mode
const darkBrand1       = '#f48061'
const darkBrand2       = '#ffab93'
const darkBrand3       = '#953d26'
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

// Texto semántico dark: versiones más claras para contraste AAA sobre fondos oscuros.
const darkNoteText      = '#60a5fa'  // Azul claro
const darkTipText       = '#4ade80'  // Verde claro
const darkWarningText   = '#fbbf24'  // Ámbar claro
const darkCautionText   = '#f87171'  // Rojo claro
const darkImportantText = '#f87171'

// ── Degradados — dos únicos estilos visuales ─────────────────────────────────
// REGLA: Solo usar gradBrand (coral) y gradSlate (azul pizarra) para fondos de
//        diapositivas. Dos estilos aportan profundidad sin fragmentar el ritmo visual.
const gradBrandStart   = '#ed6e51';  const gradBrandEnd   = '#d4522e'  // Coral marca
const gradSlateStart   = '#6A5ACD';  const gradSlateEnd   = '#5B4FB5'  // Slate Blue estructural
// Degradados semánticos — solo para estados de UI (éxito, error, alerta, info)
const gradSuccessStart = '#22c55e';  const gradSuccessEnd = '#16a34a'
const gradWarningStart = '#f59e0b';  const gradWarningEnd = '#d97706'
const gradDangerStart  = '#ef4444';  const gradDangerEnd  = '#dc2626'
const gradInfoStart    = '#3b82f6';  const gradInfoEnd    = '#2563eb'

// ── Superficies auxiliares ───────────────────────────────────────────────────
// Slate Blue (#6A5ACD) en lugar de grises oscuros: combina la confianza del
// azul con un matiz violeta, aportando luz y energía con rigor profesional.
const bgTerminal         = '#6A5ACD'   // Slate Blue — cajas de código/terminal
const colorDark          = '#6A5ACD'   // Slate Blue — fondos oscuros de énfasis
const textOnGradient     = '#FFFFFF'   // Texto claro sobre degradados oscuros
const textOnGradientDark = '#222222'   // Carbón Oscuro sobre degradados claros/coral

const darkBgTerminal         = '#2a2452'   // Slate Blue muy oscuro (garantiza contraste con texto claro)
const darkColorDark          = '#352d66'   // Slate Blue oscuro para énfasis en dark mode
const darkTextOnGradient     = '#FFFFFF'
const darkTextOnGradientDark = '#1A1A1A'

// ── Tipografía — Guía: sans-serif (Noto Sans, Lato, Montserrat) ─────────────
// Fuentes sin remates: mayor velocidad de lectura y retención en aprendizaje.
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
    // Acentos unificados: coral de marca como acento principal, Slate Blue como complementario
    accentMint:   brand,
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
    // Degradados decorativos unificados en coral y Slate Blue
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
