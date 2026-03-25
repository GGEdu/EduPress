<script setup lang="ts">

/**
 * SlideMedia - Componente para manejar imágenes y media en slides
 * 
 * Responsabilidad única: Renderizar y estilizar el contenido multimedia
 * de un slide (imágenes, terminales, etc.)
 * 
 * @component
 */

import { computed } from 'vue'
import { DEFAULT_SLIDE_MEDIA } from '../config/slideMedia'

const props = defineProps({
  /** URL de la imagen a mostrar */
  imageSrc: {
    type: String,
    default: ''
  },
  
  /** Texto alternativo para la imagen */
  imageAlt: {
    type: String,
    default: 'Slide image'
  },
  
  /** Ancho de la imagen */
  imageWidth: {
    type: String,
    default: '100%'
  },
  
  /** Alto de la imagen */
  imageHeight: {
    type: String,
    default: 'auto'
  },
  
  /** Border radius de la imagen */
  imageBorderRadius: {
    type: String,
    default: 'var(--custom-radius-lg)'
  },
  
  /** Sombra de la imagen */
  imageShadow: {
    type: String,
    default: 'var(--custom-shadow-lg)'
  },
  
  /** Comportamiento de object-fit */
  imageObjectFit: {
    type: String,
    default: 'cover',
    validator: (value) => ['contain', 'cover', 'fill', 'none', 'scale-down'].includes(value)
  },
  
  /** Padding del contenedor */
  mediaPadding: {
    type: String,
    default: 'var(--custom-space-4)'
  },

  /** Ancho máximo del contenedor de media */
  mediaMaxWidth: {
    type: String,
    default: () => DEFAULT_SLIDE_MEDIA.maxWidth
  },

  /** Relación de aspecto del contenedor de media */
  mediaAspectRatio: {
    type: String,
    default: () => DEFAULT_SLIDE_MEDIA.aspectRatio
  }
})

// Estilos del contenedor
const containerStyle = computed(() => ({
  padding: props.mediaPadding,
  textAlign: 'center',
  maxWidth: props.mediaMaxWidth,
  aspectRatio: props.mediaAspectRatio,
  margin: '0 auto',
  overflow: 'hidden',
}))

// Estilos de la imagen (solo props personalizables)
const imageStyle = computed(() => ({
  borderRadius: props.imageBorderRadius,
  boxShadow: props.imageShadow,
  objectFit: props.imageObjectFit,
  width: '100%',
  height: '100%',
  objectPosition: DEFAULT_SLIDE_MEDIA.objectPosition,
}))

</script>

<template>

  <div 
    v-if="imageSrc"
    class="media-container"
    :style="containerStyle">
    <img 
      :src="imageSrc" 
      :alt="imageAlt" 
      class="media-image"
      :style="imageStyle" />
  </div>

</template>

<style scoped>

/* ============================================================================
 * SlideMedia - Estilos con Design Tokens
 * ============================================================================ */

.media-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.media-image {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  display: block;
  margin: 0 auto;
  transition: var(--custom-transition-base);
}

/* Efecto hover para imágenes */
.media-image:hover {
  transform: scale(1.02);
  box-shadow: var(--custom-shadow-xl);
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

@media (max-width: 768px) {
  .media-container {
    padding: var(--custom-space-3);
  }
  
  .media-image {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .media-container {
    padding: var(--custom-space-2);
  }
}

</style>
