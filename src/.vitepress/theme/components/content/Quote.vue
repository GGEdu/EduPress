<script setup lang="ts">

/**
 * Quote - Componente mejorado para citas y blockquotes
 * 
 * FASE 6: Mejora de Componentes Content
 * - Añadidas variantes de estilo (default, fancy, minimal, card)
 * - Soporte para autor y fuente
 * - Comillas decorativas opcionales
 * - Responsive y accesible
 * 
 * @example
 * <Quote variant="fancy" author="Linus Torvalds" source="Just for Fun">
 *   Talk is cheap. Show me the code.
 * </Quote>
 */

import { computed } from 'vue'
import { useQuote, quoteProps } from '../../composables/useContentBox'

const props = defineProps(quoteProps)

const { quoteStyle, hasAttribution } = useQuote(props)

const quoteClasses = computed(() => ({
  [`quote-variant-${props.variant}`]: true,
  'quote-with-quotes': props.showQuotes,
  'quote-with-attribution': hasAttribution.value
}))

</script>

<template>

  <blockquote 
    class="quote-component"
    :class="quoteClasses"
    :style="quoteStyle">
    <!-- Comillas decorativas (opcional) -->
    <span v-if="showQuotes" class="quote-mark quote-mark-open">"</span>
    
    <!-- Contenido de la cita -->
    <div class="quote-content">
      <slot></slot>
    </div>
    
    <!-- Attribution (autor y fuente) -->
    <footer v-if="hasAttribution" class="quote-attribution">
      <cite>
        <span v-if="author" class="quote-author">— {{ author }}</span>
        <span v-if="source" class="quote-source">{{ source }}</span>
      </cite>
    </footer>
    
    <!-- Comillas decorativas de cierre (opcional) -->
    <span v-if="showQuotes" class="quote-mark quote-mark-close">"</span>
  </blockquote>

</template>

<style scoped>

/* ============================================================================
 * Quote Component - Estilos mejorados
 * ============================================================================ */

.quote-component {
  position: relative;
  color: var(--vp-c-text-1);
  padding-left: 30px;
}

.quote-component:hover {
  transform: translateX(var(--custom-space-1));
}

/* Contenido de la cita */
.quote-content {
  position: relative;
  z-index: 1;
}

.quote-content :deep(p) {
  margin: var(--custom-space-2) 0;
}

.quote-content :deep(strong) {
  font-weight: var(--custom-font-weight-semibold);
  color: var(--vp-c-brand);
}

.quote-content :deep(code) {
  color: var(--vp-c-brand-1);
  background: var(--custom-overlay-light);
  padding: var(--code-padding);
  border-radius: var(--code-border-radius);
}

/* ============================================================================
 * Attribution (autor y fuente)
 * ============================================================================ */

.quote-attribution {
  margin-top: var(--custom-space-4);
  font-style: normal;
  font-size: var(--custom-font-size-sm);
  color: var(--vp-c-text-2);
}

.quote-author {
  font-weight: var(--custom-font-weight-medium);
  color: var(--vp-c-brand);
}

.quote-source {
  display: block;
  margin-top: var(--custom-space-1);
  font-style: italic;
  opacity: 0.8;
}

.quote-source::before {
  content: '• ';
  margin-right: var(--custom-space-1);
}

/* ============================================================================
 * Comillas decorativas
 * ============================================================================ */

.quote-mark {
  position: absolute;
  font-size: 4rem;
  font-weight: var(--custom-font-weight-bold);
  color: var(--vp-c-brand);
  opacity: 0.15;
  line-height: 1;
  font-family: Georgia, serif;
  z-index: 0;
}

html.dark .quote-mark {
  opacity: 0.3;
}

.quote-mark-open {
  top: 5px;
  left: 15px;
}

.quote-mark-close {
  bottom: -20px;
  right: 15px;
}

/* ============================================================================
 * Variante: Card
 * ============================================================================ */

.quote-variant-card:hover {
  box-shadow: var(--custom-shadow-lg);
  transform: translateY(calc(-1 * var(--custom-space-1)));
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .quote-container {
    padding: var(--custom-space-4);
    margin: var(--custom-space-4) 0;
    /* Simplificar decoración en móvil */
    box-shadow: var(--custom-shadow-sm);
  }
  
  .quote-mark {
    font-size: var(--custom-font-size-2xl);
    margin-bottom: var(--custom-space-2);
  }
  
  .quote-text {
    font-size: var(--custom-font-size-sm);
    margin-bottom: var(--custom-space-3);
  }
  
  .quote-attribution {
    font-size: 0.7rem;
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .quote-container {
    /* Reducir sombra en tablet */
    box-shadow: var(--custom-shadow-md);
  }
  
  .quote-mark {
    font-size: var(--custom-font-size-3xl);
  }
  
  .quote-attribution {
    font-size: var(--custom-font-size-xs);
  }
}

</style>
