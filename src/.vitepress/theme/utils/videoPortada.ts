// Vídeo de YouTube de una diapositiva libre (`::: video`, ver .vitepress/lienzo.ts).
//
// Al compilar sale una portada neutra (un botón con el título, sin imagen de YouTube).
// Al pulsarla, el botón se cambia por el reproductor de youtube-nocookie.com. Un único
// listener en el documento atiende a todas las portadas: así también funciona en la
// vista de pantalla completa, que copia el HTML de la diapositiva y pierde los
// listeners de cada elemento.

const PORTADA = '.ep-video__portada'
const ID = /^[A-Za-z0-9_-]{11}$/
const PERMISOS = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

let instalado = false

/** Crea el reproductor para un identificador ya validado. Solo se usa el identificador, nunca una URL de la página. */
function reproductorYouTube(id: string, titulo: string): HTMLIFrameElement {
  const iframe = document.createElement('iframe')
  // Preferir subtítulos en español cuando el vídeo los tenga (accesibilidad).
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&hl=es&cc_lang_pref=es&rel=0`
  iframe.title = titulo
  iframe.allow = PERMISOS
  iframe.allowFullscreen = true
  iframe.referrerPolicy = 'strict-origin-when-cross-origin'
  iframe.className = 'ep-video__reproductor'
  return iframe
}

/**
 * Instala el listener una sola vez por carga de página. Va en fase de captura y corta la
 * propagación: así el clic de la portada no llega a la diapositiva (que abriría la
 * pantalla completa) y solo se crea un reproductor.
 */
export function initVideoPortadas(): void {
  if (instalado || typeof document === 'undefined') return
  instalado = true
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>(PORTADA) : null
    if (!target) return
    event.stopPropagation()
    const id = target.dataset.videoId ?? ''
    if (!ID.test(id) || !target.isConnected) return
    const iframe = reproductorYouTube(id, target.dataset.titulo || 'Vídeo de YouTube')
    target.replaceWith(iframe)
    iframe.focus()
  }, true)
}
