/**
 * Pasos dentro de una diapositiva (las cajas con «anim» o «paso», de e5-animaciones).
 *
 * En la pantalla completa, Espacio, → y ← preguntan primero al paso registrado. Si
 * ese paso ha consumido la tecla (ha mostrado la siguiente caja), la diapositiva
 * no cambia. Sin nadie registrado, las teclas cambian de diapositiva como siempre.
 */

export type SlideStepDirection = 'forward' | 'back'

/**
 * Devuelve `true` si ha dado un paso (o, con `dry`, si lo daría) y la tecla no debe
 * cambiar de diapositiva. Con `dry` no cambia nada: sirve para saber si un botón
 * debe estar activo.
 */
export type SlideStepper = (direction: SlideStepDirection, slide: HTMLElement, dry: boolean) => boolean

let stepper: SlideStepper | null = null

/** Registra (o quita, con `null`) el que decide los pasos de la diapositiva. */
export function setSlideStepper(fn: SlideStepper | null): void {
  stepper = fn
}

/** Pregunta al paso registrado; `false` si no hay ninguno o no hay diapositiva. */
export function stepSlide(direction: SlideStepDirection, slide: HTMLElement | null, dry = false): boolean {
  if (!stepper || !slide) return false
  return stepper(direction, slide, dry)
}
