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

import { ref, onMounted } from 'vue'
import SlideLightbox from './SlideLightbox.vue'
import { useSlideProcessor, useSlideInteractions } from '../composables'

// Referencias del DOM
const containerRef = ref(null)

// Estado del lightbox
const isLightboxOpen = ref(false)
const lightboxIndex = ref(0)
const allSlides = ref([])

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
  lightboxIndex.value = index
  isLightboxOpen.value = true
}

const closeLightbox = () => {
  isLightboxOpen.value = false
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
})

</script>

<template>

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
