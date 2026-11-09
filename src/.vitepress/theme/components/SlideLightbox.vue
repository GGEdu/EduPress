<script setup lang="ts">

import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'
import { attachLightboxListeners, createLightbox } from '../utils/lightboxManager'
import { stepSlide, type SlideStepDirection } from '../utils/slideSteps'
import { prepareSlide, releaseSlide, prefersReducedMotion, setStepLiveRegion } from '../utils/slideAnimations'

/**
 * Pantalla completa de las diapositivas.
 *
 * La diapositiva que se ve es la misma que la de la página: se MUEVE al escenario y,
 * en su sitio, queda un hueco del mismo alto. Así conserva sus componentes Vue, sus
 * listeners (pestañas, imágenes) y su estado, sin copiar HTML. Al cambiar de
 * diapositiva o cerrar, vuelve a su sitio.
 *
 * Espacio, → y ← muestran primero los pasos de la diapositiva (slideAnimations.ts)
 * y solo después cambian de diapositiva. La transición «fundido» (`transicion`, en el
 * lienzo o en la cabecera de la página) deja la anterior encima mientras entra la nueva.
 */

const { frontmatter } = useData()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  slides: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'slideChange'])

const FADE_MS = 300

// Referencias
const dialogRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const stepLiveRef = ref<HTMLElement | null>(null)
const currentIndex = ref(props.initialIndex)
// Sube cuando cambia un paso, para que los botones se actualicen.
const stepVersion = ref(0)

// Diapositiva que está ahora en el escenario, con el hueco que dejó en la página
interface Placed {
  slide: HTMLElement
  hole: HTMLElement
  timer?: ReturnType<typeof setTimeout>
}
let mounted: Placed | null = null
// La diapositiva que sale con fundido: sigue en el escenario hasta que acaba el fundido
let leaving: Placed | null = null
let lastDirection: SlideStepDirection = 'forward'
let returnFocus: HTMLElement | null = null

// Computed
const totalSlides = computed(() => props.slides.length)
const currentSlide = computed<HTMLElement | null>(() => (props.slides[currentIndex.value] as HTMLElement | undefined) ?? null)
const canGoPrevious = computed(() => {
  void stepVersion.value
  return currentIndex.value > 0 || stepSlide('back', currentSlide.value, true)
})
const canGoNext = computed(() => {
  void stepVersion.value
  return currentIndex.value < totalSlides.value - 1 || stepSlide('forward', currentSlide.value, true)
})

// Transición: la de la diapositiva que entra (su lienzo, o la de la página)
function transitionFor(slide: HTMLElement): 'fundido' | 'ninguna' {
  const own = slide.querySelector(':scope > .ep-lienzo')?.getAttribute('data-transicion')
  if (own === 'fundido' || own === 'ninguna') return own
  return frontmatter.value.transicion === 'fundido' ? 'fundido' : 'ninguna'
}

// Mover diapositivas al escenario y devolverlas
function settleLeaving(): void {
  if (!leaving) return
  const { slide, hole, timer } = leaving
  if (timer) clearTimeout(timer)
  leaving = null
  hole.parentNode?.replaceChild(slide, hole)
  slide.classList.remove('is-saliendo')
  releaseSlide(slide)
}

function restoreSlide(fade = false): void {
  settleLeaving()
  if (!mounted) return
  const { slide, hole } = mounted
  mounted = null
  slide.classList.remove('is-entrando')
  if (fade) {
    slide.classList.add('is-saliendo')
    leaving = { slide, hole, timer: setTimeout(settleLeaving, FADE_MS) }
    return
  }
  hole.parentNode?.replaceChild(slide, hole)
  releaseSlide(slide)
}

function mountSlide(slide: HTMLElement, fade: boolean): void {
  const stage = stageRef.value
  if (!stage || !slide.parentNode) return
  const hole = document.createElement('div')
  hole.className = 'slide-hole'
  hole.style.height = `${slide.offsetHeight}px`
  slide.parentNode.replaceChild(hole, slide)
  stage.appendChild(slide)
  mounted = { slide, hole }
  if (fade) slide.classList.add('is-entrando')
  prepareSlide(slide, lastDirection)
  // Las imágenes de la diapositiva pasan a ampliables (como antes, con el lightbox de imágenes).
  setTimeout(attachLightboxListeners, 100)
}

/** Deja en el escenario la diapositiva actual, y solo esa. */
function syncSlide(): void {
  const target = props.isOpen ? currentSlide.value : null
  if (mounted?.slide === target) return
  const fade = !!target && !!mounted && transitionFor(target) === 'fundido' && !prefersReducedMotion()
  restoreSlide(fade)
  if (target) mountSlide(target, fade)
  stepVersion.value++
}

// Navegación: primero los pasos de la diapositiva, luego cambiar de diapositiva
const handleNext = () => {
  if (canGoNext.value) {
    currentIndex.value++
    emit('slideChange', currentIndex.value)
  }
}

const handlePrevious = () => {
  if (canGoPrevious.value) {
    currentIndex.value--
    emit('slideChange', currentIndex.value)
  }
}

const advance = (direction: SlideStepDirection) => {
  lastDirection = direction
  if (stepSlide(direction, currentSlide.value)) {
    stepVersion.value++
    return
  }
  if (direction === 'forward') handleNext()
  else handlePrevious()
}

const goTo = (index: number) => {
  lastDirection = 'forward'
  currentIndex.value = index
  emit('slideChange', currentIndex.value)
}

const handleClose = () => {
  emit('close')
}

// Foco: se lleva al abrir y vuelve a donde estaba al cerrar
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

function trapTab(e: KeyboardEvent): void {
  const root = dialogRef.value
  if (!root) return
  const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null
  )
  if (items.length === 0) {
    e.preventDefault()
    root.focus()
    return
  }
  const first = items[0]
  const last = items[items.length - 1]
  const active = document.activeElement as HTMLElement | null
  const inside = !!active && root.contains(active)
  if (e.shiftKey) {
    if (!inside || active === first || active === root) {
      e.preventDefault()
      last.focus()
    }
  } else if (!inside || active === last) {
    e.preventDefault()
    first.focus()
  }
}

// Manejo de teclado
const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (e.key) {
    case 'Escape':
      handleClose()
      break
    case 'Tab':
      trapTab(e)
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      advance('back')
      break
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
      e.preventDefault()
      advance('forward')
      break
    case 'Home':
      goTo(0)
      break
    case 'End':
      goTo(totalSlides.value - 1)
      break
  }
}

// Clics en imágenes y diagramas: se amplían con el lightbox de imágenes, no cambian de diapositiva.
// Va en captura para ganar al listener de la propia diapositiva.
function onStageClick(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (target.closest?.('a')) return

  let targetEl: HTMLElement | null = null
  if (target.tagName === 'IMG') {
    targetEl = target
  } else {
    const mermaid = target.closest?.('.mermaid-container') as HTMLElement | null
    if (mermaid) targetEl = mermaid
  }
  if (!targetEl) return

  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
  if (!targetEl.getAttribute('data-lightbox-attached')) attachLightboxListeners()
  createLightbox(targetEl)
}

// Watchers
watch(() => props.isOpen, (open) => {
  if (open) {
    returnFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    lastDirection = 'forward'
    nextTick(() => {
      syncSlide()
      dialogRef.value?.focus()
    })
  } else {
    restoreSlide()
    document.body.style.overflow = ''
    returnFocus?.focus?.()
    returnFocus = null
  }
})

watch(currentIndex, () => {
  if (props.isOpen) nextTick(syncSlide)
})

watch(stepLiveRef, (el) => setStepLiveRegion(el), { flush: 'post' })

watch(stageRef, (el, old) => {
  old?.removeEventListener('click', onStageClick, true)
  el?.addEventListener('click', onStageClick, true)
}, { flush: 'post' })

watch(() => props.initialIndex, (newValue) => {
  currentIndex.value = newValue
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  restoreSlide()
  document.body.style.overflow = ''
})

</script>

<template>

  <Teleport to="body" v-if="isOpen">
    <div
      ref="dialogRef"
      class="slide-lightbox-overlay"
      :class="frontmatter.pageClass"
      role="dialog"
      aria-modal="true"
      aria-label="Presentación en pantalla completa"
      tabindex="-1"
      @click.self="handleClose"
    >
      <!-- Escenario: aquí se mueve la diapositiva viva -->
      <div
        ref="stageRef"
        class="slide-lightbox-content"
      />

      <!-- Anuncio de los pasos para lectores de pantalla (no se ve) -->
      <div ref="stepLiveRef" class="slide-lightbox-sr" aria-live="polite" aria-atomic="true" />

      <!-- Botón cerrar -->
      <button
        class="slide-lightbox-close"
        @click="handleClose"
        aria-label="Cerrar"
        :style="{ transition: 'var(--custom-transition-medium)' }"
      >
        ×
      </button>

      <!-- Navegación (solo si hay más de un slide) -->
      <template v-if="totalSlides > 1">
        <button
          class="slide-lightbox-prev"
          @click.stop="advance('back')"
          :disabled="!canGoPrevious"
          aria-label="Anterior"
          :style="{ transition: 'var(--custom-transition-medium)' }"
        >
          ‹
        </button>

        <button
          class="slide-lightbox-next"
          @click.stop="advance('forward')"
          :disabled="!canGoNext"
          aria-label="Siguiente"
          :style="{ transition: 'var(--custom-transition-medium)' }"
        >
          ›
        </button>

        <!-- Contador -->
        <div class="slide-lightbox-counter" aria-live="polite">
          {{ currentIndex + 1 }} / {{ totalSlides }}
        </div>
      </template>
    </div>
  </Teleport>

</template>

<style scoped>

/* ============================================================================
 * Overlay y Contenedor Principal
 * ============================================================================ */

.slide-lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--lightbox-backdrop-bg);
  backdrop-filter: blur(8px);
  z-index: var(--lightbox-z-index);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease forwards;
}

.slide-lightbox-overlay:focus {
  outline: none;
}

/* El escenario: 90 % de la ventana. Las diapositivas libres (lienzo) se encajan en
   16:9 dentro, y las bandas que sobran son del fondo. */
.slide-lightbox-content {
  position: relative;
  width: 90vw;
  height: 90vh;
  background: var(--vp-c-bg);
  border-radius: var(--custom-radius-xl);
  overflow-y: auto;
  box-shadow: var(--custom-shadow-2xl);
  animation: slideIn 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  container-type: size;
}

/* La diapositiva movida aquí: el estilo de la página no la alcanza, así que va
   con :deep. El cursor y los efectos al pasar el ratón no aplican en pantalla completa. */
.slide-lightbox-content :deep(.slide) {
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  background: var(--custom-gradient-bg-soft);
  padding: clamp(2rem, 5vh, 4rem) clamp(2rem, 5vw, 4rem);
  border-radius: var(--slide-border-radius);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  box-shadow: none !important;
  min-height: auto;
  position: relative;
  overflow: visible;
  cursor: auto !important;
  transform: none !important;
}

/* Borde superior decorativo */
.slide-lightbox-content :deep(.slide::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--slide-top-accent-height);
  background: var(--custom-gradient-brand);
  border-radius: var(--slide-border-radius) var(--slide-border-radius) 0 0;
}

.slide-lightbox-content :deep(.slide > *) {
  max-width: 100%;
}

/* Lienzo: 16:9 encajado en el escenario, sin marco ni padding de diapositiva. */
.slide-lightbox-content :deep(.slide.slide--lienzo) {
  display: block;
  width: min(100cqw, calc(100cqh * 16 / 9));
  height: auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
}

.slide-lightbox-content :deep(.slide--lienzo::before) {
  display: none;
}

/* Transición «fundido»: la que entra aparece y la que sale se desvanece encima de ella. */
.slide-lightbox-content :deep(.slide.is-entrando) {
  animation: ep-fundido-entrar 300ms ease both;
}

.slide-lightbox-content :deep(.slide.is-saliendo) {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  pointer-events: none;
  animation: ep-fundido-salir 300ms ease both;
}

/* ============================================================================
 * Controles de UI
 * ============================================================================ */

.slide-lightbox-close {
  position: absolute;
  top: var(--custom-space-5);
  right: var(--custom-space-5);
  width: 50px;
  height: 50px;
  background: var(--custom-overlay-white-heavy);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  border-radius: 50%;
  cursor: pointer;
  font-size: 36px;
  line-height: 1;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: calc(var(--lightbox-z-index) + 1);
  box-shadow: var(--custom-shadow-lg);
  transition: var(--custom-transition-base);
}

.slide-lightbox-close:hover {
  background: var(--vp-c-bg-soft);
  transform: scale(1.1) rotate(90deg);
}

.slide-lightbox-prev,
.slide-lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: var(--custom-overlay-white-heavy);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  border-radius: 50%;
  cursor: pointer;
  font-size: 48px;
  line-height: 1;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: calc(var(--lightbox-z-index) + 1);
  box-shadow: var(--custom-shadow-lg);
  font-weight: var(--custom-font-weight-light);
  font-family: Arial, sans-serif;
  transition: var(--custom-transition-base);
}

.slide-lightbox-prev {
  left: var(--custom-space-8);
}

.slide-lightbox-next {
  right: var(--custom-space-8);
}

.slide-lightbox-prev:hover:not(:disabled),
.slide-lightbox-next:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
  transform: translateY(-50%) scale(1.15);
}

.slide-lightbox-prev:disabled,
.slide-lightbox-next:disabled {
  opacity: var(--custom-opacity-disabled);
  cursor: not-allowed;
}

.slide-lightbox-counter {
  position: absolute;
  bottom: var(--custom-space-8);
  left: 50%;
  transform: translateX(-50%);
  background: var(--custom-overlay-white-heavy);
  color: var(--vp-c-text-1);
  padding: var(--custom-space-3) var(--custom-space-5);
  border-radius: var(--custom-radius-full);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  font-size: var(--custom-font-size-base);
  font-weight: var(--custom-font-weight-semibold);
  z-index: calc(var(--lightbox-z-index) + 1);
  box-shadow: var(--custom-shadow-lg);
  user-select: none;
}

/* ============================================================================
 * Contenido de la diapositiva en pantalla completa
 * ============================================================================ */

.slide-lightbox-content :deep(.slide:not(.slide--lienzo) img) {
  max-height: 90vh;
  max-width: 90%;
  cursor: zoom-in;
}

.slide-lightbox-content :deep(.slide:not(.slide--lienzo) p img[alt*="#center"]) {
  max-width: 80%;
  max-height: 45vh;
  display: block;
  margin: 0 auto 1.5rem auto;
  object-fit: contain;
}

.slide-lightbox-content :deep(.mermaid-container) {
  max-height: 70vh;
  cursor: zoom-in;
}

.slide-lightbox-content :deep(.mermaid-container svg) {
  max-height: 70vh !important;
}

/* ============================================================================
 * Animaciones
 * ============================================================================ */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes ep-fundido-entrar {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ep-fundido-salir {
  from { opacity: 1; }
  to { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .slide-lightbox-overlay,
  .slide-lightbox-content {
    animation: none;
  }

  .slide-lightbox-content :deep(.slide.is-entrando),
  .slide-lightbox-content :deep(.slide.is-saliendo) {
    animation: none;
  }

  .slide-lightbox-close,
  .slide-lightbox-prev,
  .slide-lightbox-next {
    transition: none !important;
  }
}

/* Solo para lectores de pantalla. */
.slide-lightbox-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Al imprimir, la pantalla completa se queda como una página normal: sin marco,
   sin fondo oscuro ni controles, y el escenario ocupa el ancho del papel. */
@media print {
  :global(body) {
    overflow: visible !important;
  }

  .slide-lightbox-overlay {
    position: static;
    display: block;
    background: none;
    backdrop-filter: none;
    animation: none;
  }

  .slide-lightbox-content {
    width: 100%;
    height: auto;
    display: block;
    overflow: visible;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    animation: none;
    container-type: normal;
  }

  .slide-lightbox-content :deep(.slide.slide--lienzo) {
    width: 100%;
  }

  .slide-lightbox-close,
  .slide-lightbox-prev,
  .slide-lightbox-next,
  .slide-lightbox-counter,
  .slide-lightbox-sr {
    display: none !important;
  }
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .slide-lightbox-content {
    width: 100vw;
    height: 100vh;
    padding: var(--custom-space-4);
    border-radius: 0;
  }

  .slide-lightbox-prev,
  .slide-lightbox-next {
    width: 40px;
    height: 40px;
    font-size: 28px;
  }

  .slide-lightbox-prev {
    left: var(--custom-space-2);
  }

  .slide-lightbox-next {
    right: var(--custom-space-2);
  }

  .slide-lightbox-close {
    width: 35px;
    height: 35px;
    font-size: 24px;
    top: var(--custom-space-2);
    right: var(--custom-space-2);
  }

  .slide-lightbox-counter {
    font-size: var(--custom-font-size-xs);
    padding: var(--custom-space-1) var(--custom-space-3);
    bottom: var(--custom-space-3);
  }

  .zoom-controls button {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .slide-lightbox-content {
    width: 95vw;
    height: 95vh;
    padding: var(--custom-space-6);
  }

  .slide-lightbox-prev,
  .slide-lightbox-next {
    width: 45px;
    height: 45px;
    font-size: 36px;
  }

  .slide-lightbox-prev {
    left: var(--custom-space-4);
  }

  .slide-lightbox-next {
    right: var(--custom-space-4);
  }

  .slide-lightbox-close {
    width: 40px;
    height: 40px;
    font-size: 28px;
    top: var(--custom-space-4);
    right: var(--custom-space-4);
  }

  .slide-lightbox-counter {
    font-size: var(--custom-font-size-sm);
    padding: var(--custom-space-2) var(--custom-space-4);
    bottom: var(--custom-space-5);
  }
}

</style>
