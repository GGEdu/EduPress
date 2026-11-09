// Página de notas del orador: con `?notas` en la dirección de una página con diapositivas,
// pide la frase del curso, descifra en el navegador cada `::: notas` y muestra el texto
// debajo de su diapositiva. Sin «Recordar»: la frase se pide cada vez y nada se guarda.
// El formato del cifrado está en notasCrypto.ts.
import {
  descifrarNota,
  desenvolverLlave,
  FraseIncorrecta,
  leerNotasCurso,
  type NotasCurso,
} from './notasCrypto'

const PANEL_ID = 'notas-orador'
const NOTAS_PENDIENTES = '.slides-container .slide .ep-notas[data-notas]:not([data-descifrada])'

// Estado solo en memoria. Se borra al cambiar de página y al bloquear.
let curso: NotasCurso | null = null
/** notas.json de esta página (una lectura). Sin él, no hay panel: el curso no tiene notas. */
let disponible: Promise<NotasCurso | null> | null = null
let llave: CryptoKey | null = null
/** Sube al bloquear: un descifrado en vuelo que termina después no pinta nada. */
let generacion = 0
let ocupado = false
let instalado = false

const pideNotas = (): boolean => new URLSearchParams(window.location.search).has('notas')

/** Instala el observador una sola vez: las diapositivas aparecen tras el procesado de SlidesViewer. */
export function initNotasOrador(): void {
  if (instalado || typeof window === 'undefined') return
  instalado = true
  new MutationObserver(sincronizar).observe(document.body, { childList: true, subtree: true })
  window.addEventListener('vitepress:afterRouteChanged', () => {
    bloquear(false)
    sincronizar()
  })
  sincronizar()
}

function sincronizar(): void {
  const contenedor = document.querySelector('.slides-container')
  const hayNotas = document.querySelector('.slides-container .slide .ep-notas[data-notas]') !== null
  if (!pideNotas() || !contenedor || !hayNotas) {
    quitarPanel()
    return
  }
  if (!disponible) disponible = cargarCurso().catch(() => null)
  if (!document.getElementById(PANEL_ID)) void mostrarPanelSiHay()
  if (llave) descifrarPendientes()
}

async function mostrarPanelSiHay(): Promise<void> {
  const datos = await disponible
  // La comprobación y la inserción van juntas (sin await entre ambas): no hay paneles duplicados.
  const contenedor = document.querySelector('.slides-container')
  if (!datos || !contenedor || !pideNotas() || document.getElementById(PANEL_ID)) return
  contenedor.before(crearPanel())
}

function quitarPanel(): void {
  document.getElementById(PANEL_ID)?.remove()
}

// ── Panel de la frase ────────────────────────────────────────────────────────

function crearPanel(): HTMLElement {
  const panel = document.createElement('section')
  panel.id = PANEL_ID
  panel.className = 'notas-orador'
  panel.setAttribute('aria-labelledby', 'notas-orador-titulo')

  const titulo = document.createElement('h2')
  titulo.id = 'notas-orador-titulo'
  titulo.className = 'notas-orador__titulo'
  titulo.tabIndex = -1
  titulo.textContent = 'Notas del orador'

  const intro = document.createElement('p')
  intro.className = 'notas-orador__intro'
  intro.textContent = 'Escribe la frase que te dio EduPress Studio para ver las notas. La página la pide cada vez: no se guarda en el navegador.'

  const formulario = crearFormulario()
  const desbloqueado = crearDesbloqueado()
  const estado = document.createElement('p')
  estado.id = 'notas-orador-estado'
  estado.className = 'notas-orador__estado'
  estado.setAttribute('role', 'status')
  estado.setAttribute('aria-live', 'polite')

  panel.append(titulo, intro, formulario, desbloqueado, estado)
  return panel
}

function crearFormulario(): HTMLFormElement {
  const form = document.createElement('form')
  form.className = 'notas-orador__form'
  form.noValidate = true

  const etiqueta = document.createElement('label')
  etiqueta.htmlFor = 'notas-orador-frase'
  etiqueta.textContent = 'Frase del curso'

  const campo = document.createElement('div')
  campo.className = 'notas-orador__campo'

  const input = document.createElement('input')
  input.id = 'notas-orador-frase'
  input.type = 'password'
  input.autocomplete = 'off'
  input.autocapitalize = 'off'
  input.spellcheck = false
  input.required = true
  input.setAttribute('aria-describedby', 'notas-orador-estado')

  const boton = document.createElement('button')
  boton.type = 'submit'
  boton.textContent = 'Ver notas'

  campo.append(input, boton)
  form.append(etiqueta, campo)
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    void desbloquear(input, boton)
  })
  return form
}

function crearDesbloqueado(): HTMLElement {
  const bloque = document.createElement('div')
  bloque.className = 'notas-orador__desbloqueado'
  bloque.hidden = true

  const texto = document.createElement('p')
  texto.textContent = 'Notas visibles en esta página. Se borran al bloquearlas o al cambiar de página.'

  const boton = document.createElement('button')
  boton.type = 'button'
  boton.textContent = 'Bloquear notas'
  boton.addEventListener('click', () => bloquear(true))

  bloque.append(texto, boton)
  return bloque
}

function estadoPanel(): HTMLElement | null {
  return document.getElementById('notas-orador-estado')
}

function mensaje(texto: string, error = false): void {
  const estado = estadoPanel()
  if (!estado) return
  estado.textContent = texto
  estado.classList.toggle('notas-orador__estado--error', error)
}

function mostrarFormulario(desbloqueadas: boolean): void {
  const panel = document.getElementById(PANEL_ID)
  if (!panel) return
  const form = panel.querySelector<HTMLFormElement>('.notas-orador__form')
  const bloque = panel.querySelector<HTMLElement>('.notas-orador__desbloqueado')
  if (form) form.hidden = desbloqueadas
  panel.querySelector<HTMLElement>('.notas-orador__intro')?.toggleAttribute('hidden', desbloqueadas)
  if (bloque) bloque.hidden = !desbloqueadas
}

async function cargarCurso(): Promise<NotasCurso> {
  const respuesta = await fetch(`${import.meta.env.BASE_URL}notas.json`, { cache: 'no-store' })
  if (!respuesta.ok) throw new Error('notas.json no disponible')
  return leerNotasCurso(await respuesta.json())
}

async function desbloquear(input: HTMLInputElement, boton: HTMLButtonElement): Promise<void> {
  if (ocupado) return
  // La frase se toma y se borra del campo en el mismo instante: no queda escrita.
  const frase = input.value
  input.value = ''
  input.removeAttribute('aria-invalid')
  if (frase.trim() === '') {
    input.setAttribute('aria-invalid', 'true')
    mensaje('Escribe la frase del curso.', true)
    input.focus()
    return
  }

  ocupado = true
  boton.disabled = true
  input.disabled = true
  mensaje('Comprobando la frase…')
  const generacionInicial = generacion
  let fallo = false
  try {
    const datos = await disponible
    if (!datos) throw new Error('sin notas')
    const nueva = await desenvolverLlave(frase, datos)
    if (generacionInicial !== generacion) return
    curso = datos
    llave = nueva
    const cuantas = document.querySelectorAll(NOTAS_PENDIENTES).length
    mostrarFormulario(true)
    descifrarPendientes()
    mensaje(`Notas visibles en ${cuantas} ${cuantas === 1 ? 'diapositiva' : 'diapositivas'}.`)
    document.getElementById('notas-orador-titulo')?.focus()
  } catch (error) {
    if (generacionInicial !== generacion) return
    fallo = true
    input.setAttribute('aria-invalid', 'true')
    mensaje(
      error instanceof FraseIncorrecta
        ? 'La frase no es correcta. Revisa que la hayas copiado completa.'
        : 'No se pueden cargar las notas de este curso. Vuelve a compilar la web o avisa a quien la publica.',
      true,
    )
  } finally {
    ocupado = false
    boton.disabled = false
    input.disabled = false
    // Con el campo ya reactivado (un campo deshabilitado no recibe el foco).
    if (fallo) input.focus()
  }
}

// ── Notas ────────────────────────────────────────────────────────────────────

/** Vuelve a dejar el panel en su estado inicial y quita las notas de la página. */
function bloquear(conMensaje: boolean): void {
  generacion++
  curso = null
  llave = null
  if (!conMensaje) disponible = null
  document.querySelectorAll('.ep-notas__texto').forEach((el) => el.remove())
  document.querySelectorAll<HTMLElement>('.ep-notas[data-descifrada]').forEach((el) => delete el.dataset.descifrada)
  if (conMensaje) {
    const input = document.getElementById('notas-orador-frase') as HTMLInputElement | null
    mostrarFormulario(false)
    mensaje('Notas bloqueadas.')
    input?.focus()
  } else {
    quitarPanel()
  }
}

function descifrarPendientes(): void {
  document.querySelectorAll<HTMLElement>(NOTAS_PENDIENTES).forEach((el) => {
    el.dataset.descifrada = 'pendiente'
    void mostrarNota(el, generacion)
  })
}

async function mostrarNota(el: HTMLElement, generacionInicial: number): Promise<void> {
  const clave = llave
  const datos = curso
  if (!clave || !datos) return
  let texto: string | null = null
  try {
    texto = await descifrarNota(el.dataset.notas ?? '', clave, datos.curso)
  } catch {
    texto = null
  }
  if (generacionInicial !== generacion || !el.isConnected) return
  el.dataset.descifrada = texto === null ? 'error' : 'si'
  el.after(crearNota(texto, numeroDeDiapositiva(el)))
}

function numeroDeDiapositiva(el: HTMLElement): number {
  const diapositivas = Array.from(document.querySelectorAll('.slides-container .slide'))
  return diapositivas.indexOf(el.closest('.slide') as Element) + 1
}

function crearNota(texto: string | null, numero: number): HTMLElement {
  const bloque = document.createElement('section')
  bloque.className = 'ep-notas__texto'
  bloque.tabIndex = 0
  bloque.setAttribute('aria-label', `Notas del orador de la diapositiva ${numero}`)
  // Un clic en las notas no debe abrir la diapositiva en pantalla completa.
  bloque.addEventListener('click', (event) => event.stopPropagation())

  const etiqueta = document.createElement('p')
  etiqueta.className = 'ep-notas__etiqueta'
  etiqueta.textContent = 'Notas del orador'

  const parrafo = document.createElement('p')
  parrafo.className = 'ep-notas__contenido'
  parrafo.textContent = texto ?? 'No se pudo descifrar esta nota.'

  bloque.append(etiqueta, parrafo)
  return bloque
}
