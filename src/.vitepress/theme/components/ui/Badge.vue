<script setup lang="ts">

/**
 * Badge - Componente de etiqueta/insignia
 * 
 * FASE 7: Componentes UI Reutilizables
 * - 8 variantes de color
 * - 3 tamaños
 * - Modo dot (punto indicador)
 * - Icono opcional
 * - Closeable (con botón cerrar)
 * 
 * @example
 * <Badge variant="primary">New</Badge>
 * 
 * @example
 * <Badge variant="success" icon="✓" size="sm">Verified</Badge>
 * 
 * @example
 * <Badge variant="warning" :dot="true" />
 * 
 * @example
 * <Badge variant="danger" :closeable="true" @close="handleClose">
 *   Error
 * </Badge>
 */

import { computed } from 'vue'

const props = defineProps({
  /**
   * Variante visual del badge
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default',
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'info',
      'dark'
    ].includes(value)
  },
  
  /**
   * Tamaño del badge
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  /**
   * Icono opcional
   */
  icon: {
    type: String,
    default: ''
  },
  
  /**
   * Modo dot (solo punto, sin texto)
   */
  dot: {
    type: Boolean,
    default: false
  },
  
  /**
   * Hacer el badge cerrable
   */
  closeable: {
    type: Boolean,
    default: false
  },
  
  /**
   * Borde redondeado completo
   */
  rounded: {
    type: Boolean,
    default: false
  },
  
  /**
   * Estilo outline
   */
  outline: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Clases computadas
const badgeClasses = computed(() => {
  return [
    `badge-${props.variant}`,
    `badge-${props.size}`,
    {
      'badge-dot-only': props.dot,
      'badge-rounded': props.rounded,
      'badge-outline': props.outline,
      'badge-closeable': props.closeable
    }
  ]
})

// Handle close
const handleClose = (event) => {
  event.stopPropagation()
  emit('close')
}

</script>

<template>

  <span
    class="badge"
    :class="badgeClasses">
    <!-- Dot indicator -->
    <span v-if="dot" class="badge-dot"></span>
    
    <!-- Icon -->
    <span v-if="icon && !dot" class="badge-icon">{{ icon }}</span>
    
    <!-- Content -->
    <span class="badge-content">
      <slot></slot>
    </span>
    
    <!-- Closeable -->
    <button
      v-if="closeable"
      class="badge-close"
      type="button"
      @click="handleClose"
      aria-label="Close">
      ×
    </button>
  </span>

</template>

<style scoped>

/* ============================================================================
 * Badge Component - Estilos base
 * ============================================================================ */

.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--custom-space-1);
  font-family: var(--vp-font-family-base);
  font-weight: var(--custom-font-weight-medium);
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: var(--custom-radius-sm);
  transition: all var(--custom-transition-fast);
}

/* ============================================================================
 * Tamaños
 * ============================================================================ */

.badge-sm {
  padding: 2px var(--custom-space-2);
  font-size: var(--custom-font-size-xs);
  gap: 2px;
}

.badge-md {
  padding: var(--custom-space-1) var(--custom-space-2);
  font-size: var(--custom-font-size-sm);
}

.badge-lg {
  padding: var(--custom-space-2) var(--custom-space-3);
  font-size: var(--custom-font-size-base);
}

/* ============================================================================
 * Variantes
 * ============================================================================ */

/* Default */
.badge-default {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

/* Primary */
.badge-primary {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
}

/* Secondary */
.badge-secondary {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
}

/* Success */
.badge-success {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-darker);
}

/* Warning */
.badge-warning {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-darker);
}

/* Danger */
.badge-danger {
  background: var(--vp-c-red-soft);
  color: var(--vp-c-red-darker);
}

/* Info */
.badge-info {
  background: var(--vp-c-blue-soft);
  color: var(--vp-c-blue-darker);
}

/* Dark */
.badge-dark {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
}

/* ============================================================================
 * Modificador: Outline
 * ============================================================================ */

.badge-outline {
  background: transparent;
  border: 1px solid currentColor;
}

.badge-outline.badge-default {
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.badge-outline.badge-primary {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.badge-outline.badge-success {
  border-color: var(--vp-c-green-1);
  color: var(--vp-c-green-1);
}

.badge-outline.badge-warning {
  border-color: var(--vp-c-yellow-1);
  color: var(--vp-c-yellow-1);
}

.badge-outline.badge-danger {
  border-color: var(--vp-c-red-1);
  color: var(--vp-c-red-1);
}

.badge-outline.badge-info {
  border-color: var(--vp-c-blue-1);
  color: var(--vp-c-blue-1);
}

/* ============================================================================
 * Modificador: Rounded
 * ============================================================================ */

.badge-rounded {
  border-radius: 999px;
}

/* ============================================================================
 * Modo Dot
 * ============================================================================ */

.badge-dot-only {
  padding: 0;
  background: transparent;
  border: none;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.badge-sm.badge-dot-only .badge-dot {
  width: 6px;
  height: 6px;
}

.badge-lg.badge-dot-only .badge-dot {
  width: 10px;
  height: 10px;
}

/* Colorear el dot según la variante */
.badge-default .badge-dot {
  background: var(--vp-c-text-2);
}

.badge-primary .badge-dot {
  background: var(--vp-c-brand);
}

.badge-success .badge-dot {
  background: var(--vp-c-green-1);
}

.badge-warning .badge-dot {
  background: var(--vp-c-yellow-1);
}

.badge-danger .badge-dot {
  background: var(--vp-c-red-1);
}

.badge-info .badge-dot {
  background: var(--vp-c-blue-1);
}

.badge-dark .badge-dot {
  background: var(--vp-c-text-1);
}

/* ============================================================================
 * Icono
 * ============================================================================ */

.badge-icon {
  font-size: 1.1em;
  line-height: 1;
}

/* ============================================================================
 * Botón cerrar
 * ============================================================================ */

.badge-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: var(--custom-space-1);
  background: transparent;
  border: none;
  color: currentColor;
  font-size: 1.2em;
  line-height: 1;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--custom-transition-fast);
}

.badge-close:hover {
  opacity: 1;
}

.badge-sm .badge-close {
  font-size: 1.1em;
}

.badge-lg .badge-close {
  font-size: 1.3em;
  margin-left: var(--custom-space-2);
}

/* ============================================================================
 * Animación de entrada
 * ============================================================================ */

.badge {
  animation: fadeInScale 0.2s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>
