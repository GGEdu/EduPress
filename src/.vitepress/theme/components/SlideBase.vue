<script setup lang="ts">

/**
 * SlideBase - Componente orquestador para slides
 * 
 * Este componente actúa como orquestador, delegando responsabilidades
 * a componentes más pequeños y especializados.
 * 
 * REFACTORIZACIÓN FASE 3:
 * - Dividido en SlideMedia y SlideContent (componentes pequeños)
 * - SlideBase ahora solo orquesta el layout y la composición
 * - Reducción de complejidad siguiendo Single Responsibility Principle
 * 
 * CHANGELOG ANTERIOR:
 * - Extraída lógica de estilos a useSlideStyles
 * - Extraída lógica de layout a useSlideLayout
 * - Props simplificadas usando slideBaseProps
 * - Valores por defecto ahora usan variables CSS tokens
 */

import { computed } from 'vue'
import SlideMedia from './SlideMedia.vue'
import SlideContent from './SlideContent.vue'
import { slideBaseProps } from '../composables/useSlideProps'
import { useSlideStyles } from '../composables/useSlideStyles'
import { useSlideLayout } from '../composables/useSlideLayout'

// Props usando la definición centralizada
const props = defineProps(slideBaseProps)

// Usar composables para manejar la lógica del contenedor y grid
const {
  containerStyle,
  hasGradient
} = useSlideStyles(props)

const {
  gridStyle
} = useSlideLayout(props)

// Estilos del subtitle (ahora en SlideBase en lugar de SlideContent)
const subtitleStyle = computed(() => {
  const baseStyles = {
    fontSize: props.subtitleFontSize,
    fontWeight: props.subtitleFontWeight,
    lineHeight: 'var(--custom-line-height-tight)'
  }
  
  // Si tiene gradiente de texto, aplicar estilos de gradiente
  if (props.subtitleGradient) {
    return {
      ...baseStyles,
      background: props.subtitleGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      // Sombra para mejorar legibilidad sobre gradientes
      textShadow: hasGradient.value ? 'var(--custom-text-shadow-md)' : 'none'
    }
  }
  
  // Si el slide tiene fondo con gradiente, usar blanco
  if (hasGradient.value) {
    return {
      ...baseStyles,
      color: 'var(--custom-text-on-gradient)',
      textShadow: 'var(--custom-text-shadow-md)'
    }
  }
  
  // Por defecto, usar color adaptable al tema (dark/light)
  return {
    ...baseStyles,
    color: props.subtitleColor || 'var(--vp-c-text-1)'
  }
})

</script>

<template>

  <article 
    class="slide-base"
    :style="containerStyle"
    role="article"
    :aria-label="subtitle || 'Diapositiva'"
    tabindex="0">
    <!-- Subtitle independiente encima de todo -->
    <header v-if="subtitle">
      <h3 
        class="slide-subtitle"
        :style="subtitleStyle">
        {{ subtitle }}
      </h3>
    </header>
    
    <div 
      class="slide-grid"
      :style="gridStyle">
      <!-- Componente de Media -->
      <SlideMedia
        v-if="imageSrc"
        :image-src="imageSrc"
        :image-alt="imageAlt || subtitle || 'Imagen de diapositiva'"
        :image-width="imageWidth"
        :image-height="imageHeight"
        :media-max-width="mediaMaxWidth"
        :media-aspect-ratio="mediaAspectRatio"
        :image-border-radius="imageBorderRadius"
        :image-shadow="imageShadow"
        :image-object-fit="imageObjectFit"
        :media-padding="mediaPadding" />
      
      <!-- Componente de Contenido (sin subtitle) -->
      <SlideContent
        :content-padding="contentPadding"
        :has-gradient-background="hasGradient"
        :text-align="contentTextAlign">
        <slot></slot>
      </SlideContent>
    </div>
  </article>

</template>

<style scoped>

/* ============================================================================
 * SlideBase - Estilos minimalistas (orquestador)
 * ============================================================================ */

.slide-base {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--custom-space-4);
}

/* Subtitle independiente */
.slide-subtitle {
  margin: 0;
  padding: 0;
  text-align: center;
  width: 100%;
  color: var(--vp-c-text-1); /* Color adaptativo por defecto */
  transition: color var(--custom-transition-base), text-shadow var(--custom-transition-base);
}

.slide-grid {
  width: 100%;
  flex: 1;
}

/* ============================================================================
 * RESPONSIVE - Grid adaptativo
 * ============================================================================ */

/* Tablet (max-width: 768px) - Apilar verticalmente */
@media (max-width: 768px) {
  .slide-grid {
    display: flex !important;
    flex-direction: column;
    gap: var(--custom-space-4) !important;
  }
  
  .slide-subtitle {
    font-size: var(--custom-font-size-xl);
  }
}

/* Mobile Small (max-width: 480px) - Máxima compactación */
@media (max-width: 480px) {
  .slide-base {
    gap: var(--custom-space-3);
  }
  
  .slide-grid {
    gap: var(--custom-space-3) !important;
  }
  
  .slide-subtitle {
    font-size: var(--custom-font-size-lg);
  }
}

</style>
