// Ecuaciones en modo seguro (src/.vitepress/matematicas.ts).
//
// Cada fórmula pasa por lo mismo que en el build: la configuración real del sitio
// (config.mts, cargada por VitePress), su renderizador de Markdown y Vue pintando la
// página en el servidor. Lo que sale es lo que recibe el alumno.
import { before, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer, disposeMdItInstance, resolveConfig } from 'vitepress'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'

const RAIZ = fileURLToPath(new URL('../src', import.meta.url))

/** La configuración del sitio, su renderizador y uno como el de antes: los mismos paquetes, sin el filtro. */
let config
let sitio
let sinFiltro

before(async () => {
  config = await resolveConfig(RAIZ, 'build', 'production')
  sitio = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger)
  // VitePress guarda una sola instancia de markdown-it: sin esto, el segundo sería el primero.
  disposeMdItInstance()
  const paquetes = AllPackages.filter((p) => p !== 'html' && p !== 'action')
  sinFiltro = await createMarkdownRenderer(config.srcDir, { math: { tex: { packages: paquetes } } }, config.site.base, config.logger)
})

/** La página publicada con este Markdown: VitePress lo convierte y Vue lo pinta. */
async function publicar(markdown, renderizador = sitio) {
  const app = createSSRApp({ template: `<div>${renderizador.render(markdown)}</div>` })
  app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('mjx-')
  app.config.warnHandler = () => {}
  return renderToString(app)
}

/** Fórmula, y lo que no puede aparecer en la página publicada. */
const PELIGROSAS = [
  ['enlace javascript: con \\mmlToken', '$\\mmlToken{mi}[href="javascript:alert(1)"]{x}$', ['javascript:']],
  ['enlace con entidad HTML', '$\\mmlToken{mi}[href="java&#x73;cript:alert(2)"]{x}$', ['cript:', '&#x73;']],
  ['enlace con &colon;', '$\\mmlToken{mi}[href="javascript&colon;alert(3)"]{x}$', ['javascript', '&colon;']],
  ['comilla en un enlace', `$\\mmlToken{mi}[href='x" onmouseover="alert(4)']{x}$`, ['onmouseover']],
  ['comilla en un ancla', `$\\mmlToken{mi}[href='#a" onmouseover="alert(10)']{x}$`, ['onmouseover']],
  ['enlace a otra web', '$\\mmlToken{mi}[href="https://example.org/"]{x}$', ['example.org']],
  ['valor que no es texto delante de otro enlace', '$\\mmlToken{mi}[href="true"]{x}\\mmlToken{mi}[href="javascript:alert(5)"]{y}$', ['javascript:', 'href']],
  ['clase de la página', '$\\mmlToken{mi}[class="VPNav caso"]{x}$', ['VPNav', 'caso']],
  ['id de la página', '$\\mmlToken{mi}[id="app"]{x}$', ['id="app"']],
  ['estilo que tapa la página', '$\\mmlToken{mi}[style="position:fixed;inset:0;background:url(https://example.org/a.png)"]{x}$', ['url(', 'fixed', 'example.org']],
  ['comilla en un estilo', `$\\mmlToken{mi}[style='color:red" onmouseover="alert(6)']{x}$`, ['onmouseover']],
  ['\\bbox con imagen de fondo', '$\\bbox[background:url(https://example.org/b.png)]{x}$', ['url(', 'example.org']],
  ['\\bbox con cursor de fuera', '$\\bbox[cursor:url(https://example.org/c.cur),auto]{x}$', ['url(', 'cursor']],
  ['\\bbox con comilla', '$\\bbox[border:2px solid red" onmouseover="alert(7)]{x}$', ['onmouseover']],
  ['\\bbox con escape de CSS', '$\\bbox[border:1px solid \\75 rl(https://example.org/d.png)]{x}$', ['example.org', '\\75']],
  ['\\unicode con fuente que añade estilos', '$\\unicode[x;background:url(https://example.org/e.png)]{x41}$', ['url(', 'example.org']],
  ['\\unicode con comilla', '$\\unicode[a" onmouseover="alert(8)]{x42}$', ['onmouseover']],
  ['grosor de letra con estilos', '$\\mmlToken{mi}[fontfamily="serif", fontweight="bold;background:url(https://example.org/f.png)"]{x}$', ['url(', 'example.org']],
  ['\\fcolorbox con estilos', '$\\fcolorbox{red;background:url(https://example.org/g.png)}{yellow}{x}$', ['url(', 'example.org']],
  ['\\fcolorbox con comilla', '$\\fcolorbox{red" onmouseover="alert(11)}{yellow}{x}$', ['onmouseover']],
  ['\\bbox con comilla en el color', '$\\bbox[color:red" onmouseover="alert(12)]{x}$', ['onmouseover']],
  ['color con comilla', `$\\mmlToken{mi}[color='red" onmouseover="alert(9)']{x}$`, ['onmouseover']],
  ['imagen de fuera con mglyph', '$\\mmlToken{mglyph}[src="https://example.org/h.png"]{}$', ['example.org']],
]

describe('una fórmula no mete enlaces, atributos ni estilos en la web', () => {
  for (const [nombre, formula, prohibido] of PELIGROSAS) {
    test(nombre, async () => {
      const pagina = await publicar(formula)
      for (const texto of prohibido) assert.ok(!pagina.includes(texto), `«${texto}» ha llegado a la página:\n${pagina}`)
    })
  }

  test('las órdenes de html y action siguen sin existir', async () => {
    for (const orden of ['\\href{javascript:alert(1)}{x}', '\\class{VPNav}{x}', '\\style{background:url(https://example.org/s.png)}{x}', '\\cssId{app}{x}', '\\toggle{x}{y}\\endtoggle']) {
      const pagina = await publicar(`$${orden}$`)
      assert.ok(!/href=|VPNav|id="app"|url\(|maction/.test(pagina), pagina)
    }
  })
})

describe('Vue no ejecuta lo que lleva una fórmula', () => {
  test('{{ … }} dentro de \\text se queda como texto', async () => {
    // `return 7777777*3`, sin comillas (MathJax las cambia por tipográficas en \text).
    const codigo = 'String.fromCharCode(114,101,116,117,114,110,32,55,55,55,55,55,55,55,42,51)'
    const pagina = await publicar(`$\\text{\\{\\{ \\$emit.constructor(${codigo})() \\}\\}}$`)
    assert.ok(!pagina.includes('23333331'), 'Vue ha evaluado el código de la fórmula')
    assert.ok(pagina.includes('{{ $emit.constructor('), pagina)
  })

  test('cada fórmula sale con v-pre, en línea y en bloque', () => {
    assert.match(sitio.render('$x$'), /^<p><mjx-container v-pre /)
    assert.match(sitio.render('$$\nx\n$$'), /^<mjx-container v-pre tabindex="0" /)
  })
})

describe('una fórmula que no se puede limpiar sale como error, no rompe el build', () => {
  test('mglyph sin imagen', () => {
    const html = sitio.render('$\\mmlToken{mglyph}{}$')
    assert.match(html, /data-mjx-error="mglyph sin imagen"/)
  })
})

test('sin el filtro en markdown.math, el build se para', async () => {
  disposeMdItInstance()
  try {
    const opciones = { ...config.markdown, math: true }
    await assert.rejects(createMarkdownRenderer(config.srcDir, opciones, config.site.base, config.logger), /no están en modo seguro/)
  } finally {
    disposeMdItInstance()
  }
})

// Lo que escribe un docente: con el filtro y `v-pre`, la página publicada es la misma.
const NORMALES = [
  '$x^2 + y^2 = r^2$',
  '$\\frac{a}{b} + \\sqrt[3]{x} - \\sqrt{2}$',
  '$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$',
  '$\\int_0^\\infty e^{-x}\\,dx = 1$',
  '$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$',
  '$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$',
  '$f(x) = \\begin{cases} 1 & x \\ge 0 \\\\ 0 & x < 0 \\end{cases}$',
  '$\\color{red}{x} + \\textcolor{blue}{y} + \\colorbox{yellow}{z}$',
  '$\\fcolorbox{red}{yellow}{a+b}$',
  '$\\bbox[5px,border:2px solid red]{E = mc^2}$',
  '$\\bbox[yellow,5px]{x}$',
  '$\\bbox[lightblue,10px,border:1px dashed blue]{\\int_a^b f(x)\\,dx}$',
  '$\\boxed{x = 2}$',
  '$\\cancel{x} + \\bcancel{y} + \\xcancel{z}$',
  '$\\mathbb{R}, \\mathcal{L}, \\mathfrak{g}, \\mathbf{v}, \\mathrm{d}x$',
  '$\\text{área} = \\pi r^2 \\quad \\text{si } r > 0$',
  '$\\ce{H2O + CO2 -> H2CO3}$',
  '$\\pu{10 m/s}$',
  '$\\unicode{x2713}\\ \\unicode{9733}$',
  '$\\unicode[Times New Roman]{x43}$',
  '$a \\bmod b,\\ a \\equiv b \\pmod{n}$',
  '$\\overbrace{a+b}^{n}\\ \\underbrace{c+d}_{m}$',
  '$A \\xrightarrow{f} B$',
  '$\\enclose{circle}{x}\\ \\enclose{box}[mathcolor=red]{y}$',
  '$\\operatorname{mcd}(a, b)$',
  '$\\mmlToken{mi}[mathvariant="bold"]{x} + \\mmlToken{mo}[lspace="0.5em"]{+}$',
  '$\\mmlToken{mi}[fontfamily="serif", fontweight="bold", mathcolor="#c00"]{x}$',
  '$\\bra{\\psi}\\ket{\\phi}$',
  '$\\displaystyle\\binom{n}{k}$',
  '$$\n\\begin{aligned}\na &= b + c \\\\\nd &= e \\cdot f\n\\end{aligned}\n$$',
  '$$\n\\left[\\begin{array}{cc|c} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\end{array}\\right]\n$$',
  '$$\n\\color{green}{\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}}\n$$',
]

describe('las fórmulas de un curso se ven igual', () => {
  for (const formula of NORMALES) {
    test(formula, async () => {
      assert.equal(await publicar(formula), await publicar(formula, sinFiltro))
    })
  }

  test('\\eqref sigue enlazando con su ecuación', async () => {
    const markdown = '$$\nE = mc^2 \\tag{1} \\label{ecuación de Einstein}\n$$\n\nVer $\\eqref{ecuación de Einstein}$'
    const pagina = await publicar(markdown)
    assert.match(pagina, /id="mjx-eqn:ecuación_de_Einstein"/)
    assert.match(pagina, /href="#mjx-eqn%3Aecuaci%C3%B3n_de_Einstein"/)
    assert.equal(pagina, await publicar(markdown, sinFiltro))
  })
})
