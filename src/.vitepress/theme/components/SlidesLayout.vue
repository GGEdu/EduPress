<script setup lang="ts">

/**
 * SlidesLayout - Layout personalizado para páginas de diapositivas
 *
 * Uso en frontmatter:
 * ---
 * layout: slides
 * title: Mi Presentación
 * description: Subtítulo opcional
 * ---
 *
 * Luego escribir el contenido normal con --- entre diapositivas.
 * ¡No hace falta usar ninguna etiqueta Vue!
 */
import { ref, nextTick, onMounted } from 'vue'
import { useData, Content } from 'vitepress'
import SlideLightbox from './SlideLightbox.vue'
import { useSlideProcessor, useSlideInteractions } from '../composables'

const { frontmatter } = useData()

// Referencias del DOM
const containerRef = ref(null)
const contentRef = ref(null)

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
  delay: 500
})

const { setupAllSlides } = useSlideInteractions({
  enableHover: true,
  enableClick: true,
  hoverScale: 1.02
})

// Lightbox
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

onMounted(async () => {
  if (!contentRef.value || !containerRef.value) return

  // Wait for VitePress to finish rendering the content
  await new Promise(resolve => setTimeout(resolve, 800))

  // We look for where the `<hr>` tags actually are to find the true container of markdown blocks.
  let sourceEl = contentRef.value
  const hrs = sourceEl.querySelectorAll('hr')
  if (hrs.length > 0) {
    sourceEl = hrs[0].parentElement
  } else {
    sourceEl = contentRef.value.querySelector('.vp-doc') || contentRef.value.firstElementChild || contentRef.value
  }

  // Move all children from the source into the slides container
  // This flattens them so the HR-based processor can see them as direct children
  while (sourceEl.firstChild) {
    containerRef.value.appendChild(sourceEl.firstChild)
  }

  // Remove the temporary content wrapper div (and anything left inside it)
  if (contentRef.value && contentRef.value.parentNode) {
    contentRef.value.remove()
  }

  // Procesar slides usando el composable (split on <hr>)
  await processSlides(containerRef.value)

  // Obtener slides procesados
  allSlides.value = getSlides(containerRef.value)

  // Configurar interacciones (hover, click, lightbox)
  setupAllSlides(allSlides.value, openLightbox)
  ready.value = true
})

</script>

<template>

  <div class="slides-layout-page">
    <!-- Título del documento (frontmatter) -->
    <header v-if="frontmatter.title" class="slides-layout-header">
      <h1 class="slides-layout-title">{{ frontmatter.title }}</h1>
      <p v-if="frontmatter.description" class="slides-layout-description">
        {{ frontmatter.description }}
      </p>
    </header>

    <!-- Botón para el teclado (fuera del contenedor: el procesado reescribe sus hijos) -->
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

    <!-- Contenedor principal de slides -->
    <section
      class="slides-container"
      ref="containerRef"
      role="region"
      aria-label="Presentación de diapositivas">
      <!-- El contenido Markdown renderizado por VitePress -->
      <div ref="contentRef" class="slides-layout-content">
        <Content />
      </div>
    </section>

    <!-- Lightbox -->
    <SlideLightbox
      :is-open="isLightboxOpen"
      :slides="allSlides"
      :initial-index="lightboxIndex"
      @close="closeLightbox"
      @slide-change="handleSlideChange"
    />
  </div>

</template>

<style scoped>

.slides-layout-page {
  max-width: 100%;
  padding: 0;
}

.slides-toolbar {
  display: flex;
  justify-content: flex-end;
  margin: 0 var(--custom-space-4) var(--custom-space-3);
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

/* Cabecera del documento */
.slides-layout-header {
  text-align: center;
  padding: var(--custom-space-8) var(--custom-space-6) var(--custom-space-4);
  border-bottom: var(--custom-border-width-sm) solid var(--vp-c-divider);
  margin-bottom: var(--custom-space-6);
}

.slides-layout-title {
  font-size: var(--custom-font-size-4xl);
  font-weight: var(--custom-font-weight-bold);
  background: var(--custom-gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--custom-space-3) 0;
  line-height: var(--custom-line-height-tight);
}

.slides-layout-description {
  font-size: var(--custom-font-size-lg);
  color: var(--vp-c-text-2);
  margin: 0;
  font-style: italic;
}

/* Wrapper temporal — no ocupa espacio visual */
.slides-layout-content {
  display: contents;
}

/* Responsive */
@media (max-width: 768px) {
  .slides-layout-header {
    padding: var(--custom-space-6) var(--custom-space-4) var(--custom-space-4);
  }

  .slides-layout-title {
    font-size: var(--custom-font-size-2xl);
  }

  .slides-layout-description {
    font-size: var(--custom-font-size-base);
  }
}

</style>
