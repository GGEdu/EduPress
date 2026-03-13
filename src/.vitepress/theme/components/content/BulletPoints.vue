<script setup lang="ts">

/**
 * BulletPoints - Componente mejorado para listas de puntos
 * 
 * FASE 6: Mejora de Componentes Content
 * - Sistema de variantes con colores
 * - Bullets personalizados (emojis, iconos, símbolos)
 * - Tamaños ajustables
 * - Título opcional con icono
 * - Animaciones suaves
 * 
 * @example
 * <BulletPoints 
 *   :items="['Item 1', 'Item 2', 'Item 3']"
 *   variant="success"
 *   customBullet="✓"
 *   title="Lista de verificación"
 * />
 * 
 * @example
 * <BulletPoints 
 *   :items="points"
 *   variant="warning"
 *   size="lg"
 *   icon="⚠️"
 * />
 */

import { computed } from 'vue'
import { useContentBox, contentBoxProps } from '../../composables/useContentBox'

const props = defineProps({
  /**
   * Array de items a mostrar
   */
  items: {
    type: Array,
    default: () => []
  },
  
  /**
   * Bullet personalizado (emoji o símbolo)
   */
  customBullet: {
    type: String,
    default: ''
  },
  
  /**
   * Tipo de lista (disc, circle, square, none)
   */
  listStyle: {
    type: String,
    default: 'disc',
    validator: (value) => ['disc', 'circle', 'square', 'none'].includes(value)
  },
  
  /**
   * Espaciado entre items
   */
  spacing: {
    type: String,
    default: 'normal',
    validator: (value) => ['compact', 'normal', 'relaxed'].includes(value)
  },
  
  // Heredar props de contentBox
  ...contentBoxProps,
  
  variant: {
    ...contentBoxProps.variant,
    default: 'default'
  }
})

const {
  containerStyle,
  titleStyle,
  containerClasses,
  colors
} = useContentBox(props)

// Clases para la lista
const listClasses = computed(() => {
  return [
    `list-style-${props.listStyle}`,
    `spacing-${props.spacing}`,
    {
      'has-custom-bullet': props.customBullet
    }
  ]
})

</script>

<template>

  <div 
    class="bullet-points-container"
    :class="containerClasses"
    :style="containerStyle">
    <!-- Título opcional -->
    <div v-if="title" class="bullet-points-header">
      <span v-if="icon" class="bullet-points-icon">{{ icon }}</span>
      <h4 class="bullet-points-title" :style="titleStyle">{{ title }}</h4>
    </div>
    
    <!-- Lista de puntos -->
    <ul 
      class="bullet-points"
      :class="listClasses">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="bullet-point-item">
        <!-- Bullet personalizado -->
        <span v-if="customBullet" class="custom-bullet">{{ customBullet }}</span>
        <span class="bullet-point-content" v-html="item"></span>
      </li>
    </ul>
  </div>

</template>

<style scoped>

/* ============================================================================
 * BulletPoints Component - Estilos mejorados
 * ============================================================================ */

.bullet-points-container {
  position: relative;
}

/* Forzar texto blanco y sombra en variantes con gradiente */
.box-variant-primary .bullet-points-container,
.box-variant-success .bullet-points-container,
.box-variant-warning .bullet-points-container,
.box-variant-danger .bullet-points-container,
.box-variant-info .bullet-points-container,
.box-variant-note .bullet-points-container,
.box-variant-tip .bullet-points-container,
.box-variant-important .bullet-points-container {
  color: var(--vp-c-text-1) !important;
}

.box-variant-primary .bullet-points-container *:not(code),
.box-variant-success .bullet-points-container *:not(code),
.box-variant-warning .bullet-points-container *:not(code),
.box-variant-danger .bullet-points-container *:not(code),
.box-variant-info .bullet-points-container *:not(code),
.box-variant-note .bullet-points-container *:not(code),
.box-variant-tip .bullet-points-container *:not(code),
.box-variant-important .bullet-points-container *:not(code) {
  color: var(--vp-c-text-1) !important;
}

/* ============================================================================
 * Header
 * ============================================================================ */

.bullet-points-header {
  display: flex;
  align-items: center;
  gap: var(--custom-space-2);
  margin-bottom: var(--custom-space-3);
}

.bullet-points-icon {
  font-size: var(--custom-font-size-xl);
  flex-shrink: 0;
}

.bullet-points-title {
  margin: 0;
  line-height: var(--custom-line-height-tight);
}

/* ============================================================================
 * Lista
 * ============================================================================ */

.bullet-points {
  padding-left: var(--list-padding-left);
  margin: 0;
  list-style-position: outside;
}

/* Estilos de lista */
.bullet-points.list-style-disc {
  list-style-type: disc;
}

.bullet-points.list-style-circle {
  list-style-type: circle;
}

.bullet-points.list-style-square {
  list-style-type: square;
}

.bullet-points.list-style-none,
.bullet-points.has-custom-bullet {
  list-style-type: none;
  padding-left: 0;
}

/* ============================================================================
 * Items
 * ============================================================================ */

.bullet-point-item {
  line-height: var(--custom-line-height-loose);
  transition: var(--custom-transition-fast);
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--custom-space-2);
}

/* Espaciado entre items */
.spacing-compact .bullet-point-item {
  margin: var(--custom-space-1) 0;
}

.spacing-normal .bullet-point-item {
  margin: var(--list-item-margin);
}

.spacing-relaxed .bullet-point-item {
  margin: var(--custom-space-4) 0;
}

/* Hover effect */
.bullet-point-item:hover {
  transform: translateX(var(--custom-space-1));
}

.list-style-none .bullet-point-item:hover,
.has-custom-bullet .bullet-point-item:hover {
  transform: translateX(var(--custom-space-2));
}

/* ============================================================================
 * Bullet personalizado
 * ============================================================================ */

.custom-bullet {
  font-size: var(--custom-font-size-lg);
  flex-shrink: 0;
  line-height: 1;
  margin-top: 2px;
}

.bullet-point-content {
  flex: 1;
}

/* ============================================================================
 * Contenido del item
 * ============================================================================ */

.bullet-point-content :deep(strong) {
  font-weight: var(--custom-font-weight-semibold);
  color: var(--vp-c-brand);
}

.bullet-point-content :deep(code) {
  background: var(--custom-overlay-medium);
  padding: var(--code-padding);
  border-radius: var(--code-border-radius);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
}

.bullet-point-content :deep(a) {
  color: var(--vp-c-brand);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: var(--custom-transition-fast);
}

.bullet-point-content :deep(a:hover) {
  color: var(--vp-c-brand-dark);
}

/* ============================================================================
 * Variantes de color
 * ============================================================================ */

/* Colorear el bullet según la variante */
.box-variant-success .custom-bullet {
  color: var(--vp-c-green-1);
}

.box-variant-warning .custom-bullet {
  color: var(--vp-c-yellow-1);
}

.box-variant-danger .custom-bullet {
  color: var(--vp-c-red-1);
}

.box-variant-info .custom-bullet {
  color: var(--vp-c-blue-1);
}

.box-variant-primary .custom-bullet {
  color: var(--vp-c-brand);
}

/* Colorear markers nativos */
.box-variant-success .bullet-points::marker {
  color: var(--vp-c-green-1);
}

.box-variant-warning .bullet-points::marker {
  color: var(--vp-c-yellow-1);
}

.box-variant-danger .bullet-points::marker {
  color: var(--vp-c-red-1);
}

.box-variant-info .bullet-points::marker {
  color: var(--vp-c-blue-1);
}

.box-variant-primary .bullet-points::marker {
  color: var(--vp-c-brand);
}

/* ============================================================================
 * Animación de entrada
 * ============================================================================ */

.bullet-point-item {
  animation: fadeInUp 0.3s ease-out backwards;
}

.bullet-point-item:nth-child(1) { animation-delay: 0.05s; }
.bullet-point-item:nth-child(2) { animation-delay: 0.1s; }
.bullet-point-item:nth-child(3) { animation-delay: 0.15s; }
.bullet-point-item:nth-child(4) { animation-delay: 0.2s; }
.bullet-point-item:nth-child(5) { animation-delay: 0.25s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(var(--custom-space-2));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .bullet-points {
    padding: var(--custom-space-3);
    gap: var(--custom-space-2);
    margin: var(--custom-space-4) 0;
    /* Reducir decoraciones en móvil */
    box-shadow: var(--custom-shadow-sm);
  }
  
  .bullet-point-item {
    gap: var(--custom-space-2);
    padding: var(--custom-space-2);
  }
  
  .custom-bullet {
    font-size: var(--custom-font-size-sm);
  }
  
  .bullet-points-header {
    margin-bottom: var(--custom-space-3);
    font-size: var(--custom-font-size-base);
  }
  
  .bullet-points-icon {
    font-size: var(--custom-font-size-xl);
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .bullet-points {
    padding: var(--custom-space-5);
    /* Reducir sombra en tablet */
    box-shadow: var(--custom-shadow-md);
  }
  
  .custom-bullet {
    font-size: var(--custom-font-size-base);
  }
}

</style>
