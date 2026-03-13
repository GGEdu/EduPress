<script setup lang="ts">

/**
 * TwoColumns - Componente mejorado para layout de dos columnas
 * 
 * FASE 6: Mejora de Componentes Content
 * - Ratios de columnas personalizables (50/50, 60/40, 40/60, 70/30, 30/70)
 * - Gap ajustable entre columnas
 * - Opción de invertir orden en mobile
 * - Alineación vertical configurable
 * - Divider opcional entre columnas
 * - Padding opcional en columnas
 * 
 * @example
 * <TwoColumns ratio="60-40" gap="lg" divider>
 *   <template #left>Contenido izquierdo</template>
 *   <template #right>Contenido derecho</template>
 * </TwoColumns>
 * 
 * @example
 * <TwoColumns ratio="70-30" reverse-mobile align="center">
 *   <template #left>Principal</template>
 *   <template #right>Sidebar</template>
 * </TwoColumns>
 */

import { computed } from 'vue'

const props = defineProps({
  /**
   * Ratio de columnas
   */
  ratio: {
    type: String,
    default: '50-50',
    validator: (value) => [
      '50-50',
      '60-40',
      '40-60',
      '70-30',
      '30-70',
      '66-33',
      '33-66'
    ].includes(value)
  },
  
  /**
   * Tamaño del gap entre columnas
   */
  gap: {
    type: String,
    default: 'normal',
    validator: (value) => ['xs', 'sm', 'normal', 'md', 'lg', 'xl'].includes(value)
  },
  
  /**
   * Alineación vertical de las columnas
   */
  align: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'center', 'end', 'stretch', 'baseline'].includes(value)
  },
  
  /**
   * Invertir orden en responsive
   */
  reverseMobile: {
    type: Boolean,
    default: false
  },
  
  /**
   * Mostrar divider entre columnas
   */
  divider: {
    type: Boolean,
    default: false
  },
  
  /**
   * Breakpoint para cambiar a una columna (en px)
   */
  breakpoint: {
    type: Number,
    default: 768
  },
  
  /**
   * Padding en las columnas
   */
  columnPadding: {
    type: Boolean,
    default: false
  },
  
  /**
   * Hacer columnas del mismo alto
   */
  equalHeight: {
    type: Boolean,
    default: false
  }
})

// Mapeo de ratios
const ratioMap = {
  '50-50': '1fr 1fr',
  '60-40': '1.5fr 1fr',
  '40-60': '1fr 1.5fr',
  '70-30': '2.33fr 1fr',
  '30-70': '1fr 2.33fr',
  '66-33': '2fr 1fr',
  '33-66': '1fr 2fr'
}

// Mapeo de gaps
const gapMap = {
  xs: 'var(--custom-space-2)',
  sm: 'var(--custom-space-3)',
  normal: 'var(--custom-grid-gap)',
  md: 'var(--custom-space-6)',
  lg: 'var(--custom-space-8)',
  xl: 'var(--custom-space-12)'
}

// Clases del contenedor
const containerClasses = computed(() => {
  return [
    `align-${props.align}`,
    {
      'has-divider': props.divider,
      'reverse-mobile': props.reverseMobile,
      'equal-height': props.equalHeight
    }
  ]
})

// Clases de las columnas
const columnClasses = computed(() => {
  return {
    'has-padding': props.columnPadding
  }
})

// Estilos del contenedor
const containerStyle = computed(() => {
  return {
    gridTemplateColumns: ratioMap[props.ratio],
    gap: gapMap[props.gap],
    alignItems: props.align
  }
})

</script>

<template>

  <div 
    class="two-columns"
    :class="containerClasses"
    :style="containerStyle">
    <!-- Columna izquierda -->
    <div 
      class="column column-left"
      :class="columnClasses">
      <slot name="left"></slot>
    </div>
    
    <!-- Columna derecha -->
    <div 
      class="column column-right"
      :class="columnClasses">
      <slot name="right"></slot>
    </div>
  </div>

</template>

<style scoped>

/* ============================================================================
 * TwoColumns Component - Layout mejorado
 * ============================================================================ */

.two-columns {
  display: grid;
  margin: var(--custom-space-4) 0;
  width: 100%;
  position: relative;
}

/* ============================================================================
 * Columnas
 * ============================================================================ */

.column {
  width: 100%;
  min-width: 0; /* Prevenir overflow */
}

.column.has-padding {
  padding: var(--custom-space-4);
}

/* ============================================================================
 * Divider entre columnas
 * ============================================================================ */

.two-columns.has-divider {
  position: relative;
}

.two-columns.has-divider::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--vp-c-divider);
  transform: translateX(-50%);
}

/* ============================================================================
 * Alturas iguales
 * ============================================================================ */

.two-columns.equal-height {
  align-items: stretch;
}

.two-columns.equal-height .column {
  display: flex;
  flex-direction: column;
}

/* ============================================================================
 * Contenido interno
 * ============================================================================ */

.two-columns :deep(p) {
  margin: var(--custom-space-2) 0;
  line-height: var(--custom-line-height-relaxed);
}

.two-columns :deep(ul),
.two-columns :deep(ol) {
  margin: var(--custom-space-2) 0;
  padding-left: var(--list-padding-left);
}

.two-columns :deep(pre) {
  margin: var(--custom-space-2) 0;
  max-width: 100%;
  overflow-x: auto;
}

.two-columns :deep(h3),
.two-columns :deep(h4),
.two-columns :deep(h5) {
  margin: var(--custom-space-2) 0 var(--custom-space-3) 0;
  line-height: var(--custom-line-height-tight);
}

.two-columns :deep(h3:first-child),
.two-columns :deep(h4:first-child),
.two-columns :deep(h5:first-child) {
  margin-top: 0;
}

.two-columns :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
}

.two-columns :deep(table) {
  width: 100%;
  font-size: var(--custom-font-size-sm);
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) - Máxima compactación */
@media (max-width: 480px) {
  .two-columns {
    grid-template-columns: 1fr !important;
    gap: var(--custom-space-3);
    padding: var(--custom-space-2);
  }
  
  /* Invertir orden en mobile */
  .two-columns.reverse-mobile {
    display: flex;
    flex-direction: column-reverse;
  }
  
  /* Ocultar divider en mobile */
  .two-columns.has-divider::before {
    display: none;
  }
  
  /* Ajustar padding en mobile pequeño */
  .column.has-padding {
    padding: var(--custom-space-2);
  }
}

/* Tablet/Mobile (max-width: 768px) */
@media (max-width: 768px) {
  .two-columns {
    grid-template-columns: 1fr !important;
    gap: var(--custom-space-4);
  }
  
  /* Invertir orden en mobile */
  .two-columns.reverse-mobile {
    display: flex;
    flex-direction: column-reverse;
  }
  
  /* Ocultar divider en mobile */
  .two-columns.has-divider::before {
    display: none;
  }
  
  /* Ajustar padding en mobile */
  .column.has-padding {
    padding: var(--custom-space-3);
  }
}

/* Breakpoint intermedio para tablets grandes */
@media (max-width: 1024px) and (min-width: 769px) {
  .two-columns {
    gap: var(--custom-space-4);
  }
  
  /* Ajustar ratios extremos */
  .two-columns[style*="2.33fr"],
  .two-columns[style*="2fr"] {
    grid-template-columns: 1.5fr 1fr !important;
  }
}

/* ============================================================================
 * Animaciones
 * ============================================================================ */

.column {
  animation: fadeInUp 0.4s ease-out;
}

.column-left {
  animation-delay: 0.1s;
}

.column-right {
  animation-delay: 0.2s;
}

/* Nota: @keyframes fadeInUp está centralizado en design-tokens.css */

/* ============================================================================
 * Print styles
 * ============================================================================ */

@media print {
  .two-columns {
    display: block !important;
  }
  
  .column {
    page-break-inside: avoid;
    margin-bottom: var(--custom-space-4);
  }
  
  .two-columns.has-divider::before {
    display: none;
  }
}

</style>
