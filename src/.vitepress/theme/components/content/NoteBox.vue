<script setup lang="ts">

/**
 * NoteBox - Componente mejorado para notas y avisos
 * 
 * FASE 6: Mejora de Componentes Content
 * - Hereda todas las mejoras de InfoBox
 * - Variante por defecto 'note'
 * - Icono por defecto 📝
 * 
 * @example
 * <NoteBox title="Nota importante" variant="warning">
 *   Este es el contenido de la nota
 * </NoteBox>
 */

import { useContentBox, contentBoxProps } from '../../composables/useContentBox'

const props = defineProps({
  ...contentBoxProps,
  variant: {
    ...contentBoxProps.variant,
    default: 'note' // Override default
  }
})

const {
  containerStyle,
  titleStyle,
  containerClasses,
  defaultIcon
} = useContentBox(props)

</script>

<template>

  <div 
    class="note-box"
    :class="containerClasses"
    :style="containerStyle">
    <!-- Header con título e icono -->
    <div v-if="title || defaultIcon" class="note-header">
      <span v-if="defaultIcon" class="note-icon">{{ defaultIcon }}</span>
      <h4 v-if="title" class="note-title" :style="titleStyle">
        {{ title }}
      </h4>
    </div>
    
    <!-- Contenido -->
    <div class="note-content">
      <slot></slot>
    </div>
  </div>

</template>

<style scoped>

/* ============================================================================
 * NoteBox Component - Estilos mejorados
 * ============================================================================ */

.note-box {
  position: relative;
}

.note-box:hover {
  transform: translateY(calc(-1 * var(--custom-space-1)));
  box-shadow: var(--custom-shadow-lg);
}

/* ============================================================================
 * Header
 * ============================================================================ */

.note-header {
  display: flex;
  align-items: center;
  gap: var(--custom-space-2);
  margin-bottom: var(--custom-space-3);
}

.note-icon {
  font-size: var(--custom-font-size-xl);
  flex-shrink: 0;
}

.note-title {
  margin: 0;
  line-height: var(--custom-line-height-tight);
}

/* ============================================================================
 * Contenido
 * ============================================================================ */

.note-content :deep(p) {
  margin: var(--custom-space-2) 0;
  line-height: var(--custom-line-height-relaxed);
}

.note-content :deep(ul),
.note-content :deep(ol) {
  margin: var(--custom-space-2) 0;
  padding-left: var(--list-padding-left);
}

.note-content :deep(strong) {
  font-weight: var(--custom-font-weight-semibold);
  color: var(--vp-c-brand);
}

.note-content :deep(code) {
  background: var(--custom-overlay-medium);
  padding: var(--code-padding);
  border-radius: var(--code-border-radius);
  font-family: var(--vp-font-family-mono);
}

/* ============================================================================
 * Variantes especiales para NoteBox
 * ============================================================================ */

/* Nota de tip con fondo más claro */
.box-variant-tip .note-content {
  color: var(--vp-c-text-1);
}

/* Nota importante con énfasis */
.box-variant-important {
  animation: pulseOnce 0.6s ease-out;
}

@keyframes pulseOnce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

@media (max-width: 768px) {
  .note-icon {
    font-size: var(--custom-font-size-lg);
  }
}

</style>
