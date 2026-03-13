<script setup lang="ts">

/**
 * Card - Componente de tarjeta reutilizable
 * 
 * FASE 7: Componentes UI Reutilizables
 * - 4 variantes visuales
 * - 3 tamaños de padding
 * - Slots: header, media, body, footer
 * - Soporte para hover, bordered, shadow
 * - Imagen opcional
 * 
 * @example
 * <Card title="Mi Tarjeta" variant="elevated">
 *   Contenido de la tarjeta
 * </Card>
 * 
 * @example
 * <Card image="/img/photo.jpg" hoverable>
 *   <template #header>
 *     <h3>Título personalizado</h3>
 *   </template>
 *   Contenido
 *   <template #footer>
 *     <Button>Ver más</Button>
 *   </template>
 * </Card>
 */

import { computed } from 'vue'

const props = defineProps({
  /**
   * Variante visual de la tarjeta
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default',
      'bordered',
      'elevated',
      'flat'
    ].includes(value)
  },
  
  /**
   * Tamaño del padding interno
   */
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  
  /**
   * Título de la tarjeta (alternativa al slot header)
   */
  title: {
    type: String,
    default: ''
  },
  
  /**
   * Subtítulo de la tarjeta
   */
  subtitle: {
    type: String,
    default: ''
  },
  
  /**
   * URL de la imagen (alternativa al slot media)
   */
  image: {
    type: String,
    default: ''
  },
  
  /**
   * Texto alternativo para la imagen
   */
  imageAlt: {
    type: String,
    default: ''
  },
  
  /**
   * Activar efecto hover
   */
  hoverable: {
    type: Boolean,
    default: false
  },
  
  /**
   * Hacer la tarjeta clickeable
   */
  clickable: {
    type: Boolean,
    default: false
  },
  
  /**
   * Color de fondo personalizado
   */
  bgColor: {
    type: String,
    default: ''
  },
  
  /**
   * Etiqueta ARIA para accesibilidad
   * Especialmente útil cuando la tarjeta es clickeable
   */
  ariaLabel: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

// Clases computadas
const cardClasses = computed(() => {
  return [
    `card-${props.variant}`,
    `card-padding-${props.padding}`,
    {
      'card-hoverable': props.hoverable,
      'card-clickable': props.clickable
    }
  ]
})

// Estilos computados
const cardStyle = computed(() => {
  const styles = {}
  
  if (props.bgColor) {
    styles.backgroundColor = props.bgColor
  }
  
  return styles
})

// Handle click
const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}

</script>

<template>

  <component
    :is="clickable ? 'article' : 'div'"
    class="card"
    :class="cardClasses"
    :style="cardStyle"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="ariaLabel || undefined"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick">
    <!-- Header -->
    <header v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </header>
    
    <!-- Media (imagen superior) -->
    <div v-if="$slots.media || image" class="card-media">
      <slot name="media">
        <img
          v-if="image"
          :src="image"
          :alt="imageAlt || title || 'Imagen de tarjeta'"
          class="card-image"
          loading="lazy"
        />
      </slot>
    </div>
    
    <!-- Body -->
    <div class="card-body">
      <slot></slot>
    </div>
    
    <!-- Footer -->
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </footer>
  </component>

</template>

<style scoped>

/* ============================================================================
 * Card Component - Estilos base
 * ============================================================================ */

.card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border-radius: var(--custom-radius-lg);
  overflow: hidden;
  transition: all var(--custom-transition-base);
}

/* ============================================================================
 * Variantes
 * ============================================================================ */

/* Default */
.card-default {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

/* Bordered */
.card-bordered {
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-divider);
}

/* Elevated (con sombra) */
.card-elevated {
  background: var(--vp-c-bg);
  border: 1px solid transparent;
  box-shadow: var(--custom-shadow-lg);
}

/* Flat (sin bordes ni sombra) */
.card-flat {
  background: var(--vp-c-bg-soft);
  border: none;
}

/* ============================================================================
 * Header
 * ============================================================================ */

.card-header {
  padding: var(--custom-space-4) var(--custom-space-5);
  border-bottom: 1px solid var(--vp-c-divider);
}

.card-title {
  margin: 0;
  font-size: var(--custom-font-size-xl);
  font-weight: var(--custom-font-weight-semibold);
  line-height: var(--custom-line-height-tight);
  color: var(--vp-c-text-1);
}

/* ============================================================================
 * Media
 * ============================================================================ */

.card-media {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--vp-c-bg-mute);
}

.card-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform var(--custom-transition-medium);
}

.card-hoverable:hover .card-image {
  transform: scale(1.05);
}

/* ============================================================================
 * Body
 * ============================================================================ */

.card-body {
  flex: 1;
  color: var(--vp-c-text-1);
  line-height: var(--custom-line-height-relaxed);
}

/* Padding variants */
.card-padding-none .card-body {
  padding: 0;
}

.card-padding-sm .card-body {
  padding: var(--custom-space-3) var(--custom-space-4);
}

.card-padding-md .card-body {
  padding: var(--custom-space-4) var(--custom-space-5);
}

.card-padding-lg .card-body {
  padding: var(--custom-space-6) var(--custom-space-8);
}

/* Ajustar padding del header y footer según el padding del body */
.card-padding-sm .card-header,
.card-padding-sm .card-footer {
  padding: var(--custom-space-3) var(--custom-space-4);
}

.card-padding-lg .card-header,
.card-padding-lg .card-footer {
  padding: var(--custom-space-6) var(--custom-space-8);
}

/* ============================================================================
 * Footer
 * ============================================================================ */

.card-footer {
  padding: var(--custom-space-4) var(--custom-space-5);
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
}

/* ============================================================================
 * Contenido interno
 * ============================================================================ */

.card-body :deep(p) {
  margin: var(--custom-space-2) 0;
}

.card-body :deep(p:first-child) {
  margin-top: 0;
}

.card-body :deep(p:last-child) {
  margin-bottom: 0;
}

.card-body :deep(h1),
.card-body :deep(h2),
.card-body :deep(h3),
.card-body :deep(h4),
.card-body :deep(h5),
.card-body :deep(h6) {
  margin: var(--custom-space-3) 0 var(--custom-space-2) 0;
  line-height: var(--custom-line-height-tight);
}

.card-body :deep(h1):first-child,
.card-body :deep(h2):first-child,
.card-body :deep(h3):first-child,
.card-body :deep(h4):first-child,
.card-body :deep(h5):first-child,
.card-body :deep(h6):first-child {
  margin-top: 0;
}

.card-body :deep(ul),
.card-body :deep(ol) {
  margin: var(--custom-space-2) 0;
  padding-left: var(--list-padding-left);
}

/* ============================================================================
 * Estados
 * ============================================================================ */

/* Hoverable */
.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--custom-shadow-xl);
}

.card-hoverable.card-bordered:hover {
  border-color: var(--vp-c-brand-light);
}

/* Clickable */
.card-clickable {
  cursor: pointer;
}

.card-clickable:active {
  transform: translateY(0);
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .card {
    margin: var(--custom-space-4) 0;
    /* Reducir decoraciones en móvil */
    box-shadow: var(--custom-shadow-sm);
  }
  
  .card-padding-sm .card-body,
  .card-padding-sm .card-header,
  .card-padding-sm .card-footer {
    padding: var(--custom-space-2);
  }
  
  .card-padding-md .card-body,
  .card-padding-md .card-header,
  .card-padding-md .card-footer {
    padding: var(--custom-space-3);
  }
  
  .card-padding-lg .card-body,
  .card-padding-lg .card-header,
  .card-padding-lg .card-footer {
    padding: var(--custom-space-4);
  }
  
  .card-title {
    font-size: var(--custom-font-size-base);
  }
  
  .card-subtitle {
    font-size: var(--custom-font-size-xs);
  }
  
  .card-hover:hover {
    /* Reducir efecto hover en móvil */
    transform: none;
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .card {
    /* Reducir sombra en tablet */
    box-shadow: var(--custom-shadow-md);
  }
  
  .card-padding-lg .card-body,
  .card-padding-lg .card-header,
  .card-padding-lg .card-footer {
    padding: var(--custom-space-4) var(--custom-space-5);
  }
  
  .card-title {
    font-size: var(--custom-font-size-lg);
  }
}

</style>
