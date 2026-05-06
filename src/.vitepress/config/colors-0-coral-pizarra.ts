// ============================================================================
// CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA — Paleta 0: Coral y Slate Blue (original)
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
// ACCESIBILIDAD: #ed6e51 tiene ratio ~3:1 sobre blanco (falla WCAG AA para texto).
// Usa brandTextAccessible para textos, enlaces e iconos sobre fondos claros.
const brandTextAccessible = '#C2410C'  // Coral oscuro — ratio ≥4.5:1 sobre blanco/gris claro

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
// Material Design recomienda #121212 como base OLED: ahorra batería y evita halos.
const darkBg      = '#121212'   // Base OLED — máxima profundidad
const darkBgSoft  = '#1E1E1E'   // Tarjetas/sidebar — jerarquía de elevación natural
const darkBgAlt   = '#252525'   // Alternancia sutil
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
const gradBrandStart   = hex2rgba('#ed6e51', 0.5);  const gradBrandEnd   = hex2rgba('#ed6e51', 0.8);  // Coral marca
const gradSlateStart   = hex2rgba('#6A5ACD', 0.5);  const gradSlateEnd   = hex2rgba('#6A5ACD', 0.8);  // Slate Blue estructural
// Degradados semánticos — solo para estados de UI (éxito, error, alerta, info)
const gradSuccessStart = hex2rgba('#22c55e', 0.5);  const gradSuccessEnd = hex2rgba('#22c55e', 0.8)
const gradWarningStart = hex2rgba('#f59e0b', 0.5);  const gradWarningEnd = hex2rgba('#f59e0b', 0.8)
const gradDangerStart  = hex2rgba('#ef4444', 0.5);  const gradDangerEnd  = hex2rgba('#ef4444', 0.8)
const gradInfoStart    = hex2rgba('#3b82f6', 0.5);  const gradInfoEnd    = hex2rgba('#3b82f6', 0.8)

// ── Superficies auxiliares ───────────────────────────────────────────────────
// bgTerminal: gris azulado oscuro neutro para bloques de código grandes.
// Reserva el Slate Blue (#6A5ACD) solo para detalles funcionales (botones secundarios,
// enlaces, estados activos) mediante colorDark — así evita competir con el coral.
const bgTerminal         = '#1E293B'   // Slate 800 — fondo neutro para bloques de código/terminal
const colorDark          = '#6A5ACD'   // Slate Blue — detalles funcionales (botones, iconos activos)
// Texto sobre bloques de diapositivas con fondo de color (coral, slate blue):
// Estos fondos son opacos y oscuros → el texto debe ser BLANCO para contraste.
// textOnGradientDark se usa cuando el fondo es claro/translúcido → texto oscuro.
const textOnGradient     = '#FFFFFF'   // Blanco — para bloques con fondo opaco oscuro (coral, slate)
const textOnGradientDark = '#222222'   // Carbón — para fondos claros o translúcidos

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
    brandTextAccessible,
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
