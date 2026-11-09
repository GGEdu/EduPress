/**
 * Animaciones por pasos de las cajas de un lienzo (`anim` y `paso`, plan §11).
 *
 * Solo existen en la pantalla completa: SlideLightbox llama a `prepareSlide` al
 * mostrar una diapositiva y a `releaseSlide` al quitarla. En la página todo se ve
 * desde el principio. Con `prefers-reduced-motion` no se oculta nada.
 *
 * Una caja con `anim` aparece en su `paso` (1 si no lo tiene); las del mismo paso
 * salen a la vez. Espacio y → muestran el siguiente paso; ← oculta el último.
 * Al entrar en una diapositiva hacia atrás, todos sus pasos ya están mostrados.
 */

import { setSlideStepper } from './slideSteps'

interface StepState {
  boxes: HTMLElement[]
  /** Pasos distintos, de menor a mayor. */
  steps: number[]
  /** Cuántos de `steps` están mostrados. */
  shown: number
}

const states = new WeakMap<HTMLElement, StepState>()

// Región aria-live (oculta a la vista) de la pantalla completa: anuncia «Paso N de M».
let liveRegion: HTMLElement | null = null

/** La pone SlideLightbox al abrirse y la quita (`null`) al cerrarse. */
export function setStepLiveRegion(el: HTMLElement | null): void {
  liveRegion = el
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

const animatedBoxes = (slide: HTMLElement): HTMLElement[] =>
  Array.from(slide.querySelectorAll<HTMLElement>('.ep-caja[data-anim]'))

const stepOf = (box: HTMLElement): number => {
  const step = Number(box.dataset.paso)
  return Number.isInteger(step) && step >= 1 ? step : 1
}

function paint(state: StepState): void {
  for (const box of state.boxes) {
    const rank = state.steps.indexOf(stepOf(box))
    box.classList.toggle('is-visible', rank < state.shown)
  }
  if (liveRegion) liveRegion.textContent = `Paso ${state.shown} de ${state.steps.length}`
}

/** Antes de mostrar la diapositiva en pantalla completa. `entering` dice de dónde viene. */
export function prepareSlide(slide: HTMLElement, entering: 'forward' | 'back'): void {
  const boxes = animatedBoxes(slide)
  if (boxes.length === 0 || prefersReducedMotion()) return
  const steps = [...new Set(boxes.map(stepOf))].sort((a, b) => a - b)
  const state: StepState = { boxes, steps, shown: entering === 'back' ? steps.length : 0 }
  states.set(slide, state)
  slide.classList.add('is-presentando')
  paint(state)
}

/** Al volver a la página: sin pasos, todo visible. */
export function releaseSlide(slide: HTMLElement): void {
  states.delete(slide)
  if (liveRegion) liveRegion.textContent = ''
  slide.classList.remove('is-presentando')
  animatedBoxes(slide).forEach((box) => box.classList.remove('is-visible'))
}

setSlideStepper((direction, slide, dry) => {
  const state = states.get(slide)
  if (!state) return false
  if (direction === 'forward') {
    if (state.shown >= state.steps.length) return false
    if (!dry) {
      state.shown++
      paint(state)
    }
    return true
  }
  if (state.shown === 0) return false
  if (!dry) {
    state.shown--
    paint(state)
  }
  return true
})
