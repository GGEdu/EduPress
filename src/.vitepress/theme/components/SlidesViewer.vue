<script setup lang="ts">

/**
 * SlidesViewer - Componente refactorizado para visualizar slides
 * 
 * CHANGELOG:
 * - Extraído Lightbox a componente SlideLightbox
 * - Usa useSlideProcessor para procesar slides
 * - Usa useSlideInteractions para efectos hover y clics
 * - Código reducido de 686 líneas a ~100 líneas
 * - Lógica más clara y mantenible
 */

import { ref, nextTick, onMounted } from 'vue'
import SlideLightbox from './SlideLightbox.vue'
import { useSlideProcessor, useSlideInteractions } from '../composables'

// Referencias del DOM
const containerRef = ref(null)

// Estado del lightbox
const isLightboxOpen = ref(false)
const lightboxIndex = ref(0)
const allSlides = ref([])
// Botón para el teclado: abre la presentación y, al cerrar, el foco vuelve a él.
const openButtonRef = ref(null)
const openedFromButton = ref(false)
const ready = ref(false)

// Composables
const { processSlides, getSlides } = useSlideProcessor({
  slideClass: 'slide',
  preserveTabs: true,
  delay: 2000
})

const { setupAllSlides } = useSlideInteractions({
  enableHover: true,
  enableClick: true,
  hoverScale: 1.02
})

// Métodos del lightbox
const openLightbox = (index) => {
  // Los clics dentro de la pantalla completa llegan aquí por el listener de cada diapositiva:
  // con la pantalla abierta no deben saltar a la diapositiva en la que se hizo clic al principio.
  if (isLightboxOpen.value) return
  lightboxIndex.value = index
  isLightboxOpen.value = true
}

const openFromButton = () => {
  openedFromButton.value = true
  openLightbox(0)
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  if (openedFromButton.value) {
    openedFromButton.value = false
    nextTick(() => openButtonRef.value?.focus())
  }
}

const handleSlideChange = (newIndex) => {
  lightboxIndex.value = newIndex
}

// Inicialización
onMounted(async () => {
  if (!containerRef.value) return
  
  // Procesar slides usando el composable
  await processSlides(containerRef.value)
  
  // Obtener slides procesados
  allSlides.value = getSlides(containerRef.value)
  
  // Configurar interacciones (hover, click, etc.)
  setupAllSlides(allSlides.value, openLightbox)
  ready.value = true
})

</script>

<template>

  <div class="slides-toolbar">
    <button
      ref="openButtonRef"
      type="button"
      class="slides-open-button"
      :disabled="!ready"
      @click="openFromButton">
      Ver en pantalla completa
    </button>
  </div>

  <section 
    class="slides-container" 
    ref="containerRef"
    role="region"
    aria-label="Presentación de diapositivas"
    aria-roledescription="Carrusel">
    <slot></slot>
  </section>
  
  <!-- Lightbox usando componente separado -->
  <SlideLightbox
    :is-open="isLightboxOpen"
    :slides="allSlides"
    :initial-index="lightboxIndex"
    @close="closeLightbox"
    @slide-change="handleSlideChange"
  />

</template>

<style scoped>

/* ============================================================================
 * SlidesViewer - Estilos simplificados (refactorizado)
 * ============================================================================
 * 
 * La mayoría de estilos se han movido a SlideLightbox.vue
 * Aquí solo mantenemos los estilos del contenedor principal
 */

.slides-container {
  width: 100%;
}

.slides-toolbar {
  display: flex;
  justify-content: flex-end;
  margin: 0 0 var(--custom-space-3);
}

.slides-open-button {
  padding: var(--custom-space-2) var(--custom-space-4);
  border: var(--custom-border-width-thin) solid var(--vp-c-brand-1);
  border-radius: var(--custom-radius-md);
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font: inherit;
  font-weight: var(--custom-font-weight-semibold);
  cursor: pointer;
}

.slides-open-button:hover:not(:disabled) {
  background: var(--vp-c-brand-soft);
}

.slides-open-button:focus-visible {
  outline: 3px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.slides-open-button:disabled {
  opacity: var(--custom-opacity-disabled);
  cursor: not-allowed;
}

/* Ajustar encabezados dentro del contenedor de slides */
.slides-container :deep(h1),
.slides-container :deep(h2),
.slides-container :deep(h3),
.slides-container :deep(h4),
.slides-container :deep(h5),
.slides-container :deep(h6) {
  margin-top: 0;
  padding-top: 0;
}

</style>
