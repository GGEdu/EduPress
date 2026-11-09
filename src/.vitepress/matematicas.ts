import { readFileSync } from 'node:fs'

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
