// ── Diapositivas libres: contenedores `lienzo`, `caja`, `forma`, `video` y `notas` ──
//
//   ::::: lienzo fondo=#F5EFE9
//   :::: caja x=6 y=8 w=56 h=auto tam=32
//   ## ¿Qué es un framework?
//   ::::
//   :::::
//
// Se pintan al compilar, con HTML y CSS (theme/css/lienzo.css): las cajas van en
// posición absoluta, en % del lienzo, y la letra en unidades del ancho del lienzo
// (cqw). Por debajo de 560 px de ancho se apilan en el orden del fichero.
//
// Los valores pasan por lista blanca (la misma que valida EduPress Studio en
// freeSlide.ts) y todo lo que se escribe en el HTML va escapado. Un atributo
// desconocido o un valor fuera de la lista se ignora: no rompe la página.
import type Token from 'markdown-it/lib/token.mjs'
import container from 'markdown-it-container'

type ContainerPlugin = [typeof container, string, { render(tokens: Token[], idx: number, options?: unknown, env?: { relativePath?: string }): string }]

interface Attr {
  key: string
  /** `true` para las banderas sueltas (`fija`, `decorativa`). */
  value: string | true
}

/** Colores con nombre: variables CSS de lienzo.css, que siguen la paleta del curso. */
export const PALETTE_COLORS = ['marca', 'texto', 'fondo', 'exito', 'aviso', 'peligro', 'info', 'purpura', 'naranja', 'verdeazulado'] as const

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
const IMG_PATH = /^\/img\/[\w\-./]+$/
const FONT_NAME = /^[A-Za-z0-9][A-Za-z0-9 -]{0,59}$/
const NUMBER = /^-?\d+(?:\.\d+)?$/
const ATTR_TOKEN = /([A-Za-z][\w-]*)=("(?:[^"\\]|\\.)*"|\S+)|(\S+)/g

/** `alinea` de la caja: solo estos cuatro valores; cualquier otro se ignora. */
const TEXT_ALIGN = new Map([
  ['izquierda', 'left'],
  ['centro', 'center'],
  ['derecha', 'right'],
  ['justificar', 'justify'],
])

const SHADOWS: Record<string, string> = {
  suave: '0 0.4cqw 1.2cqw rgb(0 0 0 / 0.15)',
  fuerte: '0 0.8cqw 2.4cqw rgb(0 0 0 / 0.3)',
}
const ANIMATIONS = ['aparecer', 'desvanecer', 'deslizar-arriba', 'deslizar-izquierda', 'zoom']
// `deslizar` y `zoom` llegan después (plan §11): hasta entonces, un valor desconocido se ignora.
const TRANSITIONS = ['fundido', 'ninguna']

/** Escapa para un atributo HTML entre comillas dobles (valores que genera EduPress). */
export function escapeAttr(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/**
 * El título de una caja de color, que escribe el autor, a un atributo. Solo se
 * escapa lo que lo rompe: unas comillas hacían fallar la compilación de Vue. Un `&`
 * se deja, para que las entidades que ya llevan los títulos (`&lt;`, `&#123;`) se
 * sigan viendo igual.
 */
export function escapeTitle(text: string): string {
  return text.replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/** Lo que va tras el nombre del bloque: `clave=valor`, `clave="con espacios"` o banderas. */
export function parseAttrs(rest: string): Attr[] {
  const attrs: Attr[] = []
  for (const [, key, raw, bare] of rest.matchAll(ATTR_TOKEN)) {
    if (key !== undefined) {
      const quoted = raw.length >= 2 && raw.startsWith('"') && raw.endsWith('"')
      attrs.push({ key, value: quoted ? raw.slice(1, -1).replace(/\\(.)/g, '$1') : raw })
    } else {
      attrs.push({ key: bare, value: true })
    }
  }
  return attrs
}

/** El primer valor de cada clave. Uno repetido se ignora: así no se salta la lista blanca. */
function attrMap(attrs: Attr[]): Map<string, string | true> {
  const map = new Map<string, string | true>()
  for (const { key, value } of attrs) if (!map.has(key)) map.set(key, value)
  return map
}

function num(value: string | true | undefined, min: number, max: number, integer = false): number | null {
  if (typeof value !== 'string' || !NUMBER.test(value)) return null
  const n = Number(value)
  return n >= min && n <= max && (!integer || Number.isInteger(n)) ? n : null
}

const isImage = (v: string): boolean => IMG_PATH.test(v) && !v.split('/').includes('..')

function cssColor(value: string | true | undefined): string | null {
  if (typeof value !== 'string') return null
  if (HEX.test(value)) return value
  return (PALETTE_COLORS as readonly string[]).includes(value) ? `var(--ep-${value})` : null
}

/** `/img/…` con la base del sitio delante: en un `style` VitePress no la añade. */
function imageUrl(base: string, path: string): string {
  const prefix = base.endsWith('/') ? base.slice(0, -1) : base
  return `url('${prefix}${path}')`
}

/** `fondo`: color, imagen `/img/…` o, en el lienzo, `degradado:color,color`. */
function background(value: string | true | undefined, base: string, allowGradient: boolean, fit = 'cover'): string[] {
  if (typeof value !== 'string') return []
  const color = cssColor(value)
  if (color) return [`background:${color}`]
  if (isImage(value)) return [`background:${imageUrl(base, value)} center / ${fit} no-repeat`]
  const gradient = value.match(/^degradado:([^,\s]+),([^,\s]+)$/)
  if (allowGradient && gradient) {
    const [from, to] = [cssColor(gradient[1]), cssColor(gradient[2])]
    if (from && to) return [`background:linear-gradient(135deg, ${from}, ${to})`]
  }
  return []
}

/**
 * Un color de letra que se lea sobre un fondo `#hex` fijo. Con el tema oscuro, el
 * texto del tema (casi blanco) no se leería sobre un fondo claro que no cambia.
 */
const DARK_TEXT = '#1F2937'
const LIGHT_TEXT = '#FFFFFF'

/** Luminosidad relativa de un `#hex` (WCAG 2). */
function luminance(value: string): number {
  const hex = value.length === 4 ? value.slice(1).split('').map((c) => c + c).join('') : value.slice(1)
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

const contrast = (a: number, b: number): number => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

/** La letra (oscura o blanca) que más contrasta con el fondo. */
export function textFor(value: string | true | undefined): string | null {
  if (typeof value !== 'string' || !HEX.test(value)) return null
  const bg = luminance(value)
  return contrast(bg, luminance(DARK_TEXT)) >= contrast(bg, 1) ? DARK_TEXT : LIGHT_TEXT
}

/** Tamaños pensados sobre un lienzo de 1280 px de ancho, pasados a unidades del lienzo. */
const scaled = (px: number): string => `calc(${px} / 1280 * 100cqw)`

export function lienzoOpening(info: string, base: string): string {
  const attrs = attrMap(parseAttrs(info.trim().replace(/^lienzo\b/, '')))
  const style = background(attrs.get('fondo'), base, true)
  const text = textFor(attrs.get('fondo'))
  if (text) style.push(`color:${text}`)
  const transition = attrs.get('transicion')
  const data = typeof transition === 'string' && TRANSITIONS.includes(transition) ? ` data-transicion="${transition}"` : ''
  const styleAttr = style.length > 0 ? ` style="${escapeAttr(style.join(';'))}"` : ''
  // Dos capas: el lienzo es el contenedor (cqw y @container) y el área lleva el 16:9.
  // Un elemento no puede cambiar su propio aspecto con una consulta a sí mismo.
  return `<div class="ep-lienzo"${data}><div class="ep-lienzo__area"${styleAttr}>\n`
}

/** Parte del lienzo (en %) que cubre una caja que puede salirse por los bordes. */
const COVER_MIN = 90
function coveredArea(x: number, y: number, w: number, h: number): number {
  const overlap = (start: number, size: number) => Math.max(0, Math.min(start + size, 100) - Math.max(start, 0))
  return (overlap(x, w) * overlap(y, h)) / 100
}

export interface BoxContext {
  base: string
  /** Solo hay una imagen dentro (se decide al compilar, mirando los tokens). */
  onlyImage: boolean
}

interface BoxParts {
  style: string[]
  classes: string[]
  data: string[]
  w: number | null
  h: number | null
}

/** Lo común a una caja y a una forma: posición, tamaño, giro, capa, aspecto y animación. */
function boxParts(attrs: Map<string, string | true>, ctx: BoxContext): BoxParts {
  const style: string[] = []
  const classes = ['ep-caja']
  const data: string[] = []

  const x = num(attrs.get('x'), 0, 100)
  const y = num(attrs.get('y'), 0, 100)
  const w = num(attrs.get('w'), 0, 100)
  const hRaw = attrs.get('h')
  const h = hRaw === 'auto' ? null : num(hRaw, 0, 100)
  style.push(`left:${x ?? 0}%`, `top:${y ?? 0}%`, `width:${w ?? 50}%`)
  if (h !== null) style.push(`height:${h}%`)

  const tam = num(attrs.get('tam'), 4, 400)
  if (tam !== null) style.push(`--tam:${tam}`)

  const transforms: string[] = []
  const r = num(attrs.get('r'), -360, 360)
  if (r) transforms.push(`rotate(${r}deg)`)
  const flip = attrs.get('voltear')
  if (flip === 'h' || flip === 'hv') transforms.push('scaleX(-1)')
  if (flip === 'v' || flip === 'hv') transforms.push('scaleY(-1)')
  if (transforms.length > 0) style.push(`transform:${transforms.join(' ')}`)
  const flips = transforms.filter((t) => t.startsWith('scale'))
  if (flips.length > 0) style.push(`--volteo:${flips.join(' ')}`)

  const z = num(attrs.get('z'), 0, 999, true)
  if (z !== null) style.push(`z-index:${z}`)

  const font = attrs.get('fuente')
  if (typeof font === 'string' && FONT_NAME.test(font)) style.push(`font-family:'${font}', var(--vp-font-family-base)`)
  const color = cssColor(attrs.get('color')) ?? textFor(attrs.get('fondo'))
  if (color) style.push(`color:${color}`)
  const align = attrs.get('alinea')
  const textAlign = typeof align === 'string' ? TEXT_ALIGN.get(align) : undefined
  if (textAlign) style.push(`text-align:${textAlign}`)
  const fit = attrs.get('ajuste') === 'contener' ? 'contain' : 'cover'
  style.push(...background(attrs.get('fondo'), ctx.base, false, fit))
  if (attrs.get('ajuste') === 'contener') style.push('--ajuste:contain')

  const border = attrs.get('borde')
  if (typeof border === 'string') {
    const [width, borderColor] = border.split(':')
    const px = num(width, 0, 20)
    const bc = borderColor === undefined ? 'currentColor' : cssColor(borderColor)
    if (px !== null && bc && border.split(':').length <= 2) style.push(`border:${scaled(px)} solid ${bc}`)
  }
  const radius = num(attrs.get('radio'), 0, 100)
  if (radius !== null) style.push(`border-radius:${radius}%`)
  const shadow = attrs.get('sombra')
  if (shadow === true || shadow === 'suave' || shadow === 'fuerte') style.push(`box-shadow:${SHADOWS[shadow === true ? 'suave' : shadow]}`)
  const opacity = num(attrs.get('opacidad'), 0, 100)
  if (opacity !== null) style.push(`opacity:${opacity / 100}`)

  const anim = attrs.get('anim')
  if (typeof anim === 'string' && ANIMATIONS.includes(anim)) data.push(`data-anim="${anim}"`)
  const step = num(attrs.get('paso'), 1, 99, true)
  if (step !== null) data.push(`data-paso="${step}"`)
  const group = num(attrs.get('g'), 1, 999, true)
  if (group !== null) data.push(`data-g="${group}"`)

  if (attrs.get('decorativa') === true) {
    classes.push('decorativa')
    data.push('aria-hidden="true"')
  }
  if (ctx.onlyImage) {
    classes.push('ep-caja--imagen')
    // Una imagen que cubre casi todo el lienzo: al apilar pasa a ser su fondo.
    if (w !== null && h !== null && coveredArea(x ?? 0, y ?? 0, w, h) >= COVER_MIN) classes.push('es-fondo')
  }

  return { style, classes, data, w, h }
}

function boxOpening({ style, classes, data }: BoxParts, inner = ''): string {
  const dataAttrs = data.length > 0 ? ` ${data.join(' ')}` : ''
  return `<div class="${classes.join(' ')}" style="${escapeAttr(style.join(';'))}"${dataAttrs}>${inner}\n`
}

export function cajaOpening(info: string, ctx: BoxContext): string {
  return boxOpening(boxParts(attrMap(parseAttrs(info.trim().replace(/^caja\b/, ''))), ctx))
}

/** Tipos de `forma`: la primera palabra tras el nombre. */
export const FORMA_VARIANTS = ['flecha', 'linea', 'flecha-doble'] as const
type FormaVariant = (typeof FORMA_VARIANTS)[number]

const round = (n: number): number => Math.round(n * 100) / 100

/** Lo que se lee de una forma que no es decorativa. `texto=` lo cambia. */
const FORMA_LABELS: Record<FormaVariant, string> = { flecha: 'Flecha', linea: 'Línea', 'flecha-doble': 'Flecha doble' }

/** Proporciones del hueco de una forma en el lienzo de 16:9 (ancho y alto, en las mismas unidades). */
export function formaSize(w: number, h: number | null): { width: number; height: number } {
  const width = Math.max(1, w * 16)
  return { width, height: Math.max(1, h === null ? width * 0.12 : h * 9) }
}

/**
 * El SVG de una flecha o una línea, en unidades del propio hueco: un lienzo de 16:9
 * hace que `w` valga 16 unidades por punto y `h`, 9. Así la punta no se deforma.
 */
export function formaSvg(variant: FormaVariant, w: number, h: number | null, label: string | null = null): string {
  const { width, height } = formaSize(w, h)
  const mid = height / 2
  const stroke = Math.max(1, Math.min(height * 0.3, width * 0.08))
  const head = Math.min(height, width / 3)
  // La línea entra un poco en la punta: sin hueco entre las dos piezas al suavizar los bordes.
  const start = variant === 'flecha-doble' ? head * 0.6 : 0
  const end = variant === 'linea' ? width : width - head * 0.6
  const parts = [`<line x1="${round(start)}" y1="${round(mid)}" x2="${round(end)}" y2="${round(mid)}" stroke="currentColor" stroke-width="${round(stroke)}"/>`]
  if (variant !== 'linea') parts.push(`<polygon points="${round(width - head)},0 ${round(width)},${round(mid)} ${round(width - head)},${round(height)}" fill="currentColor"/>`)
  if (variant === 'flecha-doble') parts.push(`<polygon points="${round(head)},0 0,${round(mid)} ${round(head)},${round(height)}" fill="currentColor"/>`)
  const a11y = label === null ? 'aria-hidden="true"' : `role="img" aria-label="${escapeAttr(label)}"`
  return `<svg class="ep-forma__svg" viewBox="0 0 ${round(width)} ${round(height)}" preserveAspectRatio="none" ${a11y} focusable="false">${parts.join('')}</svg>`
}

/** `forma flecha x= y= w= h= relleno=marca decorativa`: dibujada en SVG al compilar. */
export function formaOpening(info: string, ctx: BoxContext): string {
  const tokens = parseAttrs(info.trim().replace(/^forma\b/, ''))
  const first = tokens[0]
  const variant: FormaVariant =
    first && first.value === true && (FORMA_VARIANTS as readonly string[]).includes(first.key) ? (first.key as FormaVariant) : 'flecha'
  const attrs = attrMap(tokens)
  const parts = boxParts(attrs, { ...ctx, onlyImage: false })
  parts.classes.push('ep-forma')
  parts.style.push(`color:${cssColor(attrs.get('relleno')) ?? 'var(--ep-marca)'}`)
  // Al apilar, la forma conserva sus proporciones: si no, la punta se aplasta.
  const { width, height } = formaSize(parts.w ?? 50, parts.h)
  parts.style.push(`--proporcion:${round(width)} / ${round(height)}`)
  const text = attrs.get('texto')
  const label = attrs.get('decorativa') === true ? null : typeof text === 'string' && text.trim() !== '' ? text.trim().slice(0, 200) : FORMA_LABELS[variant]
  return boxOpening(parts, formaSvg(variant, parts.w ?? 50, parts.h, label))
}

/**
 * Las notas solo se publican cifradas (`v1:<iv>:<texto cifrado>`, en base64url). Unas
 * notas escritas a mano en claro no salen: se avisa al compilar.
 */
export const NOTAS_FORMAT = /^v1:[A-Za-z0-9_-]+:[A-Za-z0-9_-]+$/

/**
 * Los bloques cuyo contenido es texto crudo, no Markdown: `notas` (el texto cifrado) y
 * `video` (la URL). Su texto va a `meta.texto` y sale de los tokens: nunca llega a la
 * página ni a la búsqueda como párrafos.
 */
const TEXT_BLOCKS = ['container_notas_open', 'container_video_open']

function collectBlockTexts(state: { tokens: Token[] }): void {
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
    if (!TEXT_BLOCKS.includes(tokens[i].type)) continue
    let depth = 0
    let close = i + 1
    for (; close < tokens.length; close++) {
      depth += tokens[close].nesting
      if (depth < 0) break
    }
    const inner = tokens.slice(i + 1, close)
    const text = inner
      .filter((t) => t.type === 'inline' || t.type === 'fence' || t.type === 'code_block')
      .map((t) => t.content)
      .join('\n')
      .trim()
    tokens[i].meta = { ...(tokens[i].meta ?? {}), texto: text }
    tokens.splice(i + 1, inner.length)
  }
}

/** ¿Lo que hay entre la apertura `idx` y su cierre es solo una imagen? */
function containsOnlyImage(tokens: Token[], idx: number): boolean {
  const inner: Token[] = []
  let depth = 0
  for (let i = idx + 1; i < tokens.length; i++) {
    const t = tokens[i]
    depth += t.nesting
    if (depth < 0) break
    inner.push(t)
  }
  if (inner.length !== 3) return false
  const [open, inline, close] = inner
  const children = (inline.children ?? []).filter((c) => !(c.type === 'text' && c.content.trim() === '') && c.type !== 'softbreak')
  return open.type === 'paragraph_open' && close.type === 'paragraph_close' && children.length === 1 && children[0].type === 'image'
}

/** Quita el texto de `notas` y de `video` del árbol de tokens (ver `collectBlockTexts`). */
export function notasPlugin(md: { core: { ruler: { push(name: string, fn: (state: { tokens: Token[] }) => void): void } } }): void {
  md.core.ruler.push('ep_bloques', collectBlockTexts)
}

/** Identificador de un vídeo de YouTube: 11 caracteres de `[A-Za-z0-9_-]`. */
export const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/
const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com']
const YOUTUBE_PATHS = ['embed', 'shorts', 'live']

/**
 * El identificador de un enlace de YouTube (`watch?v=`, `youtu.be/`, `embed/`, `shorts/`,
 * `live/`) o el identificador solo. Cualquier otra cosa, incluido un `javascript:` o
 * un dominio ajeno, da `null`: la página nunca usa la URL, solo el identificador.
 */
export function youtubeId(raw: string): string | null {
  const text = raw.trim().replace(/^<|>$/g, '').trim()
  if (YOUTUBE_ID.test(text)) return text
  let url: URL
  try {
    url = new URL(text)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' || !YOUTUBE_HOSTS.includes(url.hostname)) return null
  const parts = url.pathname.split('/').filter(Boolean)
  let id: string | null = null
  if (url.hostname === 'youtu.be') id = parts[0] ?? null
  else if (url.pathname === '/watch') id = url.searchParams.get('v')
  else if (YOUTUBE_PATHS.includes(parts[0])) id = parts[1] ?? null
  return id !== null && YOUTUBE_ID.test(id) ? id : null
}

const VIDEO_TITLE = 'Vídeo de YouTube'

/**
 * `video x= y= w= h= titulo="…"` con la URL dentro. Se pinta una portada neutra (sin
 * pedir nada a YouTube). Al pulsarla, `theme/utils/videoPortada.ts` cambia la portada
 * por el reproductor de `youtube-nocookie.com`.
 */
export function videoOpening(info: string, ctx: BoxContext, texto: string): string {
  const attrs = attrMap(parseAttrs(info.trim().replace(/^video\b/, '')))
  const parts = boxParts(attrs, { ...ctx, onlyImage: false })
  parts.classes.push('ep-video')
  const titleAttr = attrs.get('titulo')
  const title = (typeof titleAttr === 'string' && titleAttr.trim() !== '' ? titleAttr.trim() : VIDEO_TITLE).slice(0, 120)
  const id = youtubeId(texto)
  if (id === null) {
    console.warn(`[EduPress] Un bloque \`video\` no tiene un enlace de YouTube válido: no se muestra.`)
    parts.classes.push('ep-video--no-valido')
    return boxOpening(parts, '<p class="ep-video__aviso">Vídeo no disponible.</p>')
  }
  const label = escapeAttr(`Reproducir vídeo: ${title}. Se carga YouTube al pulsar.`)
  const portada = `<button type="button" class="ep-video__portada" data-video-id="${id}" data-titulo="${escapeAttr(title)}" aria-label="${label}">`
    + '<span class="ep-video__play" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>'
    + `<span class="ep-video__titulo">${escapeAttr(title)}</span></button>`
  return boxOpening(parts, portada)
}

/** Tipos de `grafico`: la primera palabra tras el nombre. Solo cambia la clase; el dibujo es el SVG. */
export const GRAFICO_VARIANTS = ['barras', 'lineas', 'sectores'] as const

/**
 * `grafico barras x= y= w= h=auto` con la imagen SVG que genera EduPress Studio y, debajo,
 * la tabla de datos (la fuente de verdad). Se ve la imagen; la tabla queda para el lector
 * de pantalla (oculta a la vista, no al lector). El SVG lo sanea Studio: aquí es una imagen.
 */
export function graficoOpening(info: string, ctx: BoxContext): string {
  const tokens = parseAttrs(info.trim().replace(/^grafico\b/, ''))
  const first = tokens[0]
  const variant = first && first.value === true && (GRAFICO_VARIANTS as readonly string[]).includes(first.key) ? first.key : null
  const parts = boxParts(attrMap(tokens), { ...ctx, onlyImage: false })
  parts.classes.push('ep-grafico')
  if (variant) parts.classes.push(`ep-grafico--${variant}`)
  return boxOpening(parts)
}

/**
 * La tabla del gráfico toma por nombre su título (el `alt` de la imagen): así el lector de
 * pantalla la anuncia con él. Se hace al pintar la apertura, antes de pintar la tabla. La regla
 * de VitePress para `table_open` no pinta atributos, así que la apertura pasa a HTML hecho.
 */
export function nameGraficoTable(tokens: Token[], idx: number): void {
  let title = ''
  let depth = 0
  for (let i = idx + 1; i < tokens.length; i++) {
    const t = tokens[i]
    depth += t.nesting
    if (depth < 0) return
    const image = t.type === 'inline' ? t.children?.find((c) => c.type === 'image') : undefined
    if (!title && image) title = image.content.trim()
    if (t.type === 'table_open') {
      if (title) {
        t.type = 'html_block'
        t.content = `<table tabindex="0" aria-label="${escapeAttr(title)}">\n`
      }
      return
    }
  }
}

/** Los contenedores para `md.use(...)`. `base` es la base del sitio (`PROJECT.basePath`). */
export function lienzoContainers(base: string): ContainerPlugin[] {
  return [
    [container, 'lienzo', {
      render(tokens: Token[], idx: number) {
        return tokens[idx].nesting === 1 ? lienzoOpening(tokens[idx].info, base) : '</div></div>\n'
      },
    }],
    [container, 'caja', {
      render(tokens: Token[], idx: number) {
        if (tokens[idx].nesting !== 1) return '</div>\n'
        return cajaOpening(tokens[idx].info, { base, onlyImage: containsOnlyImage(tokens, idx) })
      },
    }],
    [container, 'forma', {
      render(tokens: Token[], idx: number) {
        return tokens[idx].nesting === 1 ? formaOpening(tokens[idx].info, { base, onlyImage: false }) : '</div>\n'
      },
    }],
    // Gráfico de datos: la imagen se ve; la tabla, para el lector de pantalla.
    [container, 'grafico', {
      render(tokens: Token[], idx: number) {
        if (tokens[idx].nesting !== 1) return '</div>\n'
        nameGraficoTable(tokens, idx)
        return graficoOpening(tokens[idx].info, { base, onlyImage: false })
      },
    }],
    // Vídeo de YouTube: la URL va dentro del bloque y no sale en la página (ver notasPlugin).
    [container, 'video', {
      render(tokens: Token[], idx: number) {
        if (tokens[idx].nesting !== 1) return '</div>\n'
        return videoOpening(tokens[idx].info, { base, onlyImage: false }, String(tokens[idx].meta?.texto ?? ''))
      },
    }],
    // Notas del orador cifradas: ocultas, con el texto cifrado en un atributo (lo lee ?notas).
    [container, 'notas', {
      render(tokens: Token[], idx: number, _options?: unknown, env?: { relativePath?: string }) {
        if (tokens[idx].nesting !== 1) return ''
        const text = String(tokens[idx].meta?.texto ?? '')
        if (text !== '' && !NOTAS_FORMAT.test(text)) {
          const where = env?.relativePath ? ` (${env.relativePath})` : ''
          console.warn(`[EduPress] Unas notas del orador no están cifradas: no se publican${where}. Escríbelas desde EduPress Studio.`)
          return '<div class="ep-notas" hidden data-notas=""></div>\n'
        }
        return `<div class="ep-notas" hidden data-notas="${escapeAttr(text)}"></div>\n`
      },
    }],
  ]
}
