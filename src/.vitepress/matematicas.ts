import { readFileSync } from 'node:fs'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'
import { Configuration } from 'mathjax-full/js/input/tex/Configuration.js'
import { Safe } from 'mathjax-full/js/ui/safe/safe.js'
import type { MathDocument } from 'mathjax-full/js/core/MathDocument.js'
import type { MathItem } from 'mathjax-full/js/core/MathItem.js'
import type { MmlNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js'

// ── Ecuaciones: aviso de `$$` sin cerrar ───────────────────────────────────
//
// Un `$$` que no se cierra no da error: markdown-it-mathjax3 se come el resto de la
// página como si fuera una fórmula. Este plugin cuenta los `$$` de cada página, sin
// contar el frontmatter, los bloques de código, los spans de código ni las filas de
// tabla, y avisa en la consola del build con el fichero y la línea si quedan impares.
// Las líneas son las del fichero original: VitePress quita el frontmatter antes de
// renderizar, así que el plugin lee el fichero (env.realPath) y no state.src. No
// rompe el build: la validación que bloquea la publicación la hace EduPress Studio.

interface CoreState {
  src: string
  env?: { path?: string; realPath?: string; relativePath?: string }
}

/** Lo que cuenta como un `$$` de verdad: no el `\$` escapado. */
const ESCAPED_DOLLAR = /\\\$/g
const DOUBLE_DOLLAR = /\$\$/g
const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/

/**
 * Vacía el frontmatter, los bloques de código, los spans de código y las filas de
 * tabla, para que no cuenten. Las líneas se conservan: el número de línea del aviso
 * es el del fichero.
 */
export function sinCodigo(src: string): string {
  const out: string[] = []
  let fence: string | null = null
  let frontmatter = src.startsWith('---\n')
  for (const line of src.split('\n')) {
    if (frontmatter) {
      // El frontmatter no es contenido: se vacía hasta su cierre `---`.
      if (out.length > 0 && line === '---') frontmatter = false
      out.push('')
      continue
    }
    if (fence !== null) {
      const close = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}\\s*$`)
      if (close.test(line)) fence = null
      out.push('')
      continue
    }
    // Una fila de tabla no cuenta: un `$$` suelto en una celda no es un bloque.
    if (/^\s*\|/.test(line)) {
      out.push('')
      continue
    }
    const open = line.match(FENCE_OPEN)
    if (open) {
      fence = open[1]
      out.push('')
      continue
    }
    out.push(line.replace(/(`+)[^`\n]*?\1/g, (span) => ' '.repeat(span.length)))
  }
  return out.join('\n')
}

/** Los números de línea (desde 1) de cada `$$` que cuenta, en orden. */
export function lineasDeDobleDolar(src: string): number[] {
  const lineas: number[] = []
  sinCodigo(src).split('\n').forEach((line, i) => {
    const visible = line.replace(ESCAPED_DOLLAR, '  ')
    for (let n = (visible.match(DOUBLE_DOLLAR) ?? []).length; n > 0; n--) lineas.push(i + 1)
  })
  return lineas
}

/** Avisa si una página tiene un número impar de `$$`: el último suele ser el que sobra. */
export function avisarDobleDolar(src: string, relativePath = 'página desconocida'): void {
  const lineas = lineasDeDobleDolar(src)
  if (lineas.length % 2 === 0) return
  const linea = lineas[lineas.length - 1]
  console.warn(
    `[EduPress] Un \`$$\` sin cerrar en ${relativePath}, línea ${linea}: el resto de la página se toma como fórmula. Ciérralo con otro \`$$\`.`,
  )
}

/** El texto original de la página, con su frontmatter. Si no se puede leer, el que recibe el render. */
function textoOriginal(state: CoreState): string {
  const file = state.env?.realPath ?? state.env?.path
  if (!file) return state.src
  try {
    return readFileSync(file, 'utf-8')
  } catch {
    return state.src
  }
}

/** Plugin de markdown-it: se ejecuta sobre cada página al compilarla. */
export function avisoDobleDolarPlugin(md: { core: { ruler: { push(name: string, fn: (state: CoreState) => void): void } } }): void {
  md.core.ruler.push('ep_aviso_doble_dolar', (state) => avisarDobleDolar(textoOriginal(state), state.env?.relativePath))
}

// ── Ecuaciones: modo seguro ─────────────────────────────────────────────────
//
// Cada fórmula se convierte en SVG al compilar y ese SVG entra tal cual en la página.
// MathJax 3.2.1 escribe `style` y `href` sin escapar nada, así que una fórmula como
// `\mmlToken{mi}[href="javascript:…"]{x}` deja un enlace que ejecuta código, y
// `\bbox[color:red" onmouseover="…]{x}` cierra el atributo y añade otro. Quitar los
// paquetes `html` y `action` no basta: `\mmlToken`, `\bbox`, `\unicode` o `\fcolorbox`
// también ponen enlaces, clases, ids y estilos.
//
// El arreglo es el filtro de la extensión `safe` de MathJax (ui/safe), aplicado al árbol
// de cada fórmula antes de pintarla, sea cual sea la orden que puso el atributo, y algo
// más estricto que el de serie:
//  - ni enlaces ni recursos (`href`, `src`, `altimg`), salvo los de `\eqref` y `\ref` a
//    una ecuación de la página (`#mjx-eqn%3A…`);
//  - clases e ids, solo los de MathJax (`mjx-…`, los ids de `\label` y la clase de `\eqref`);
//  - estilos, solo los de su lista sin `cursor`, y sin comillas, `\`, `&`, `;`, `<`, `>`,
//    llaves, `@` ni funciones salvo rgb() y hsl(): nada de `url(…)`;
//  - lo mismo para la fuente, el grosor, la cursiva y los colores, que MathJax acaba
//    llevando a `style` y la extensión no mira.
// No sirve el `SafeHandler` de MathJax: markdown-it-mathjax3 crea un documento por cada
// fórmula sobre la misma entrada TeX, y el SafeHandler le añadiría un filtro más en cada
// una. Por eso el filtro es un paquete TeX (`edupress-seguro`), que se instala una vez.
// Y el árbol se recorre aquí, no con `Safe.sanitize`: un valor que no es texto
// (`\mmlToken{mi}[href="true"]` da un booleano) hace fallar su filtro, MathJax se traga
// el error y el resto de la fórmula sale sin filtrar. Aquí los valores pasan a texto y,
// si algo falla, la fórmula sale como error, nunca sin filtrar.
//
// Además, Vue evaluaba como código el `{{ … }}` de una fórmula (`\text{\{\{ … \}\}}`) al
// cargar la página: cada fórmula sale con `v-pre`, como VitePress hace con el código.

/** El nombre del paquete TeX que filtra los atributos de cada fórmula. */
const PAQUETE_SEGURO = 'edupress-seguro'

/** Paquetes TeX de las ecuaciones: todos menos `html` y `action` (`\href`, `\class`, `\style`, `\cssId`, `\toggle`…), más el filtro. */
const PAQUETES_TEX: string[] = [
  ...AllPackages.filter((p: string) => p !== 'html' && p !== 'action'),
  PAQUETE_SEGURO,
]

/** Las opciones de `markdown.math` en config.mts. */
export const OPCIONES_MATEMATICAS = { tex: { packages: PAQUETES_TEX } }

/** Un carácter que cerraría el atributo, abriría otra declaración o metería un escape. */
const CARACTER_PELIGROSO = /["\\&<>;{}@]/
/** Las únicas funciones de CSS que se admiten en un valor: colores. */
const FUNCION_DE_COLOR = /\b(?:rgba?|hsla?)\([\d\s.,%+-]*\)/gi

/** Si un valor puede ir en el `style` de una fórmula: sin `url(…)` ni nada que se salga del valor. */
function valorCssSeguro(valor: unknown): boolean {
  const texto = String(valor)
  return !CARACTER_PELIGROSO.test(texto) && !texto.replace(FUNCION_DE_COLOR, '').includes('(')
}

/** Atributos de MathML que MathJax lleva a `style` (o a `fill`) y la extensión `safe` no filtra. */
const ATRIBUTOS_DE_ESTILO = ['fontfamily', 'fontweight', 'fontstyle', 'mathcolor', 'mathbackground', 'color', 'background']

/** Un enlace a un ancla de la página, como los de `\eqref`: `#` y la etiqueta con `encodeURIComponent`. */
const ANCLA = /^#[\w%.~!*'()-]*$/

/** Las opciones de la extensión `safe`: ver el comentario de la sección. */
const OPCIONES_SEGURAS = {
  ...Safe.OPTIONS,
  allow: { URLs: 'safe', classes: 'safe', cssIDs: 'safe', styles: 'safe' },
  // `\eqref` y `\ref` ponen la clase `MathJax_ref`.
  classPattern: /^(?:mjx-[-a-zA-Z0-9_.]+|MathJax_ref)$/,
  // Los ids de `\label` son `mjx-eqn:` y la etiqueta, que puede llevar casi de todo.
  idPattern: /^mjx-[^\s"<>&\\]+$/,
  safeStyles: {
    color: true,
    backgroundColor: true,
    border: true,
    margin: true,
    padding: true,
    textShadow: true,
    fontFamily: true,
    fontSize: true,
    fontStyle: true,
    fontWeight: true,
    opacity: true,
    outline: true,
  },
}

type Filtro = Safe<unknown, unknown, unknown>

/** El filtro de la extensión `safe` con las reglas de EduPress. */
function filtroSeguro(document: MathDocument<unknown, unknown, unknown>): Filtro {
  const filtro: Filtro = new Safe(document, OPCIONES_SEGURAS)
  const metodos = filtro.filterMethods
  const filtrarEstilo = metodos.filterStyle
  // `filterStyles` llama a `this.filterStyle` con cada propiedad de la lista.
  metodos.filterStyle = function (this: typeof metodos, safe: Filtro, nombre: string, div: unknown) {
    return valorCssSeguro(safe.adaptor.getStyle(div, nombre)) ? filtrarEstilo.call(this, safe, nombre, div) : null
  }
  metodos.filterURL = (_safe: Filtro, url: unknown) => (ANCLA.test(String(url)) ? (url as string) : null)
  metodos.filtrarValorCss = (_safe: Filtro, valor: unknown) => (valorCssSeguro(valor) ? (valor as string) : null)
  for (const atributo of ATRIBUTOS_DE_ESTILO) filtro.filterAttributes.set(atributo, 'filtrarValorCss')
  return filtro
}

interface DatosDelFiltro {
  math: MathItem<unknown, unknown, unknown>
  document: MathDocument<unknown, unknown, unknown>
  data: { root: MmlNode }
}

/** El código de carácter más alto que existe: un `mglyph` sin imagen pinta su `index`. */
const MAX_CODIGO = 0x10ffff

/** Limpia los atributos de un nodo como `Safe.sanitizeNode`, pero con los valores pasados a texto. */
function limpiarNodo(filtro: Filtro, nodo: MmlNode): void {
  const atributos = nodo.attributes.getAllAttributes()
  for (const nombre of Object.keys(atributos)) {
    const metodo = filtro.filterAttributes.get(nombre)
    if (!metodo) continue
    const texto = String(atributos[nombre])
    const valor = filtro.filterMethods[metodo](filtro, texto)
    if (!valor) delete atributos[nombre]
    else atributos[nombre] = valor === (typeof valor === 'number' ? parseFloat(texto) : texto) ? texto : valor
  }
  // Sin imagen (ya no hay `src`), MathJax pinta el carácter `index`; si no es uno válido, el build se cae.
  if (nodo.isKind('mglyph') && !atributos.src) {
    const codigo = parseInt(String(atributos.index))
    if (!(codigo >= 0 && codigo <= MAX_CODIGO)) throw new Error('mglyph sin imagen')
  }
}

/** Limpia el árbol MathML de una fórmula (con la prioridad del `SafeHandler` de MathJax). Si falla, la fórmula sale como error. */
function sanear({ math, document, data }: DatosDelFiltro): void {
  const filtro = filtroSeguro(document)
  try {
    data.root.walkTree((nodo: MmlNode) => limpiarNodo(filtro, nodo))
  } catch (error) {
    document.options.compileError(document, math, error)
    data.root = math.root
  }
}

Configuration.create(PAQUETE_SEGURO, { postprocessors: [[sanear, -5.5]] })

type ReglaDeFormula = (tokens: { content: string }[], idx: number, ...resto: unknown[]) => string

interface MarkdownConFormulas {
  options: unknown
  renderer: { rules: Record<string, ReglaDeFormula | undefined> }
}

/** Una fórmula que el modo seguro tiene que dejar sin enlace y con `v-pre`. */
const FORMULA_DE_PRUEBA = '\\mmlToken{mi}[href="javascript:void(0)"]{x}'

/**
 * Plugin de markdown-it: cada fórmula sale con `v-pre`, y se comprueba que el filtro está
 * activo. Si no lo está (otra configuración de `markdown.math`, otra copia de mathjax-full),
 * el build se para: es mejor que publicar una web que ejecute lo que traiga una fórmula.
 */
export function formulasSeguras(md: MarkdownConFormulas): void {
  const reglas = md.renderer.rules
  for (const nombre of ['math_inline', 'math_block']) {
    const pintar = reglas[nombre]
    if (!pintar) continue
    reglas[nombre] = (...args) => pintar(...args).replace(/^<mjx-container /, '<mjx-container v-pre ')
  }
  const pintar = reglas.math_inline
  if (!pintar) return
  const prueba = pintar([{ content: FORMULA_DE_PRUEBA }], 0, md.options, {}, md.renderer)
  if (prueba.includes('javascript:') || !prueba.startsWith('<mjx-container v-pre ')) {
    throw new Error(
      `[EduPress] Las ecuaciones no están en modo seguro: falta el paquete TeX «${PAQUETE_SEGURO}» en markdown.math (usa OPCIONES_MATEMATICAS de matematicas.ts).`,
    )
  }
}
