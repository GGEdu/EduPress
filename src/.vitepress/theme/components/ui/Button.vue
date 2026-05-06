<script setup lang="ts">

/**
 * Button - Componente de botón reutilizable
 * 
 * FASE 7: Componentes UI Reutilizables
 * - 6 variantes de color
 * - 4 tamaños
 * - Estados: loading, disabled
 * - Iconos izquierda/derecha
 * - Soporte para links (tag="a")
 * 
 * @example
 * <Button variant="primary" size="md" @click="handleClick">
 *   Click me
 * </Button>
 * 
 * @example
 * <Button variant="success" icon-left="✓" :loading="isLoading">
 *   Save
 * </Button>
 */

import { computed, useSlots } from 'vue'

const props = defineProps({
  /**
   * Variante visual del botón
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
      'ghost',
      'link'
    ].includes(value)
  },
  
  /**
   * Tamaño del botón
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  
  /**
   * Tipo HTML del botón
   */
  nativeType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  
  /**
   * Tag HTML a renderizar (button o a)
   */
  tag: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'a'].includes(value)
  },
  
  /**
   * Botón deshabilitado
   */
  disabled: {
    type: Boolean,
    default: false
  },
  
  /**
   * Estado de carga
   */
  loading: {
    type: Boolean,
    default: false
  },
  
  /**
   * Icono a la izquierda
   */
  iconLeft: {
    type: String,
    default: ''
  },
  
  /**
   * Icono a la derecha
   */
  iconRight: {
    type: String,
    default: ''
  },
  
  /**
   * Botón de ancho completo
   */
  block: {
    type: Boolean,
    default: false
  },
  
  /**
   * Botón con borde redondeado completo
   */
  rounded: {
    type: Boolean,
    default: false
  },
  
  /**
   * Botón outline (solo borde)
   */
  outline: {
    type: Boolean,
    default: false
  },
  
  /**
   * Etiqueta ARIA para accesibilidad
   * Útil cuando el contenido del botón no es suficientemente descriptivo
   */
  ariaLabel: {
    type: String,
    default: ''
  },
  
  /**
   * ID del elemento que describe este botón
   */
  ariaDescribedby: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])
const slots = useSlots()

// Clases computadas
const buttonClasses = computed(() => {
  return [
    `btn-${props.variant}`,
    `btn-${props.size}`,
    {
      'btn-block': props.block,
      'btn-rounded': props.rounded,
      'btn-outline': props.outline,
      'btn-loading': props.loading,
      'btn-disabled': props.disabled,
      'btn-icon-only': !slots.default && (props.iconLeft || props.iconRight)
    }
  ]
})

// Handle click
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

</script>

<template>

  <button
    v-if="tag === 'button'"
    class="btn"
    :class="buttonClasses"
    :type="nativeType as any"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :aria-disabled="disabled"
    :aria-label="ariaLabel || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    @click="handleClick">
    <!-- Icono izquierdo -->
    <span 
      v-if="iconLeft && !loading" 
      class="btn-icon btn-icon-left"
      aria-hidden="true">
      {{ iconLeft }}
    </span>
    
    <!-- Loading spinner -->
    <span 
      v-if="loading" 
      class="btn-loading"
      role="status"
      aria-label="Cargando">
      <span class="spinner" aria-hidden="true"></span>
      <span class="sr-only">Cargando...</span>
    </span>
    
    <!-- Contenido -->
    <span class="btn-content">
      <slot></slot>
    </span>
    
    <!-- Icono derecho -->
    <span 
      v-if="iconRight && !loading" 
      class="btn-icon btn-icon-right"
      aria-hidden="true">
      {{ iconRight }}
    </span>
  </button>

  <a
    v-else
    class="btn"
    :class="buttonClasses"
    :aria-busy="loading"
    :aria-disabled="disabled"
    :aria-label="ariaLabel || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    role="button"
    @click="handleClick">
    <!-- Icono izquierdo -->
    <span 
      v-if="iconLeft && !loading" 
      class="btn-icon btn-icon-left"
      aria-hidden="true">
      {{ iconLeft }}
    </span>
    
    <!-- Loading spinner -->
    <span 
      v-if="loading" 
      class="btn-loading"
      role="status"
      aria-label="Cargando">
      <span class="spinner" aria-hidden="true"></span>
      <span class="sr-only">Cargando...</span>
    </span>
    
    <!-- Contenido -->
    <span class="btn-content">
      <slot></slot>
    </span>
    
    <!-- Icono derecho -->
    <span 
      v-if="iconRight && !loading" 
      class="btn-icon btn-icon-right"
      aria-hidden="true">
      {{ iconRight }}
    </span>
  </a>

</template>

<style scoped>

/* ============================================================================
 * Button Component - Estilos base
 * ============================================================================ */

.btn {
  /* Reset */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--custom-space-2);
  
  /* Tipografía */
  font-family: var(--vp-font-family-base);
  font-weight: var(--custom-font-weight-medium);
  line-height: var(--custom-line-height-tight);
  text-decoration: none;
  white-space: nowrap;
  
  /* Bordes */
  border: 1px solid transparent;
  border-radius: var(--custom-radius-md);
  
  /* Interacción */
  cursor: pointer;
  user-select: none;
  transition: all var(--custom-transition-fast);
  
  /* Estados */
  &:focus-visible {
    outline: 2px solid var(--vp-c-brand);
    outline-offset: 2px;
  }
}

/* ============================================================================
 * Tamaños
 * ============================================================================ */

.btn-xs {
  padding: var(--custom-space-1) var(--custom-space-2);
  font-size: var(--custom-font-size-xs);
  gap: var(--custom-space-1);
}

.btn-sm {
  padding: var(--custom-space-2) var(--custom-space-3);
  font-size: var(--custom-font-size-sm);
}

.btn-md {
  padding: var(--custom-space-3) var(--custom-space-4);
  font-size: var(--custom-font-size-base);
}

.btn-lg {
  padding: var(--custom-space-4) var(--custom-space-6);
  font-size: var(--custom-font-size-lg);
}

/* ============================================================================
 * Variante: Default
 * ============================================================================ */

.btn-default {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.btn-default:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-light);
  transform: translateY(-1px);
}

.btn-default:active:not(.btn-disabled):not(.btn-loading) {
  transform: translateY(0);
}

/* ============================================================================
 * Variante: Primary
 * ============================================================================ */

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.btn-primary:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-brand-dark);
  border-color: var(--vp-c-brand-dark);
  transform: translateY(-1px);
  box-shadow: var(--custom-shadow-md);
}

.btn-primary:active:not(.btn-disabled):not(.btn-loading) {
  transform: translateY(0);
}

/* ============================================================================
 * Variante: Secondary
 * ============================================================================ */

.btn-secondary {
  background: var(--vp-c-text-2);
  color: white;
  border-color: var(--vp-c-text-2);
}

.btn-secondary:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-text-1);
  border-color: var(--vp-c-text-1);
  transform: translateY(-1px);
  box-shadow: var(--custom-shadow-md);
}

/* ============================================================================
 * Variante: Success
 * ============================================================================ */

.btn-success {
  background: var(--vp-c-green-1);
  color: white;
  border-color: var(--vp-c-green-1);
}

.btn-success:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-green-2);
  border-color: var(--vp-c-green-2);
  transform: translateY(-1px);
  box-shadow: var(--custom-shadow-md);
}

/* ============================================================================
 * Variante: Warning
 * ============================================================================ */

.btn-warning {
  background: var(--vp-c-yellow-1);
  color: var(--vp-c-yellow-darker);
  border-color: var(--vp-c-yellow-1);
}

.btn-warning:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-yellow-2);
  border-color: var(--vp-c-yellow-2);
  transform: translateY(-1px);
  box-shadow: var(--custom-shadow-md);
}

/* ============================================================================
 * Variante: Danger
 * ============================================================================ */

.btn-danger {
  background: var(--vp-c-red-1);
  color: white;
  border-color: var(--vp-c-red-1);
}

.btn-danger:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-red-2);
  border-color: var(--vp-c-red-2);
  transform: translateY(-1px);
  box-shadow: var(--custom-shadow-md);
}

/* ============================================================================
 * Variante: Ghost
 * ============================================================================ */

.btn-ghost {
  background: transparent;
  color: var(--vp-c-text-1);
  border-color: transparent;
}

.btn-ghost:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand);
}

/* ============================================================================
 * Variante: Link
 * ============================================================================ */

.btn-link {
  background: transparent;
  color: var(--vp-c-brand);
  border-color: transparent;
  padding: 0;
}

.btn-link:hover:not(.btn-disabled):not(.btn-loading) {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

/* ============================================================================
 * Modificador: Outline
 * ============================================================================ */

.btn-outline.btn-primary {
  background: transparent;
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.btn-outline.btn-primary:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-brand);
  color: white;
}

.btn-outline.btn-success {
  background: transparent;
  color: var(--vp-c-green-1);
  border-color: var(--vp-c-green-1);
}

.btn-outline.btn-success:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-green-1);
  color: white;
}

.btn-outline.btn-danger {
  background: transparent;
  color: var(--vp-c-red-1);
  border-color: var(--vp-c-red-1);
}

.btn-outline.btn-danger:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-red-1);
  color: white;
}

.btn-outline.btn-warning {
  background: transparent;
  color: var(--vp-c-yellow-1);
  border-color: var(--vp-c-yellow-1);
}

.btn-outline.btn-warning:hover:not(.btn-disabled):not(.btn-loading) {
  background: var(--vp-c-yellow-1);
  color: var(--vp-c-yellow-darker);
}

/* ============================================================================
 * Modificadores
 * ============================================================================ */

/* Block (ancho completo) */
.btn-block {
  display: flex;
  width: 100%;
}

/* Rounded (completamente redondeado) */
.btn-rounded {
  border-radius: 999px;
}

/* Icon only (solo icono sin texto) */
.btn-icon-only {
  padding: var(--custom-space-3);
  aspect-ratio: 1;
}

.btn-icon-only.btn-xs {
  padding: var(--custom-space-1);
}

.btn-icon-only.btn-sm {
  padding: var(--custom-space-2);
}

.btn-icon-only.btn-lg {
  padding: var(--custom-space-4);
}

/* ============================================================================
 * Estados
 * ============================================================================ */

/* Disabled */
.btn-disabled,
.btn:disabled {
  opacity: var(--custom-opacity-disabled, 0.5);
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Loading */
.btn-loading {
  position: relative;
  pointer-events: none;
}

.btn-loading .btn-content {
  opacity: 0.6;
}

/* ============================================================================
 * Iconos
 * ============================================================================ */

.btn-icon {
  display: inline-flex;
  align-items: center;
  font-size: 1.2em;
  line-height: 1;
}

/* ============================================================================
 * Loading Spinner
 * ============================================================================ */

.btn-loading {
  position: relative;
}

.spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Animación @keyframes spin centralizada en design-tokens.css */

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .btn {
    /* Hacer botones más compactos en móvil */
    width: 100%;
  }
  
  .btn-sm {
    padding: var(--custom-space-1) var(--custom-space-2);
    font-size: var(--custom-font-size-xs);
  }
  
  .btn-md {
    padding: var(--custom-space-2) var(--custom-space-3);
    font-size: var(--custom-font-size-sm);
  }
  
  .btn-lg {
    padding: var(--custom-space-2) var(--custom-space-4);
    font-size: var(--custom-font-size-sm);
  }
  
  .btn-xl {
    padding: var(--custom-space-3) var(--custom-space-4);
    font-size: var(--custom-font-size-base);
  }
  
  .btn-icon-left,
  .btn-icon-right {
    font-size: var(--custom-font-size-sm);
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .btn-lg {
    padding: var(--custom-space-3) var(--custom-space-5);
    font-size: var(--custom-font-size-base);
  }
}

</style>
