<script setup lang="ts">

/**
 * Toast - Notificaciones accesibles con ARIA live regions
 * 
 * FASE 4: Accesibilidad (a11y)
 * - Usa aria-live="polite" para anunciar mensajes a lectores de pantalla
 * - role="status" o "alert" según la importancia
 * - Auto-cierre configurable
 * - Soporte para diferentes variantes (success, error, warning, info)
 * 
 * @example
 * <Toast 
 *   :is-visible="showToast"
 *   message="Guardado exitosamente"
 *   variant="success"
 *   :duration="3000"
 *   @close="showToast = false"
 * />
 */

import { computed, watch } from 'vue'

const props = defineProps({
  /**
   * Mostrar/ocultar toast
   */
  isVisible: {
    type: Boolean,
    default: false
  },
  
  /**
   * Mensaje principal
   */
  message: {
    type: String,
    required: true
  },
  
  /**
   * Descripción opcional (texto secundario)
   */
  description: {
    type: String,
    default: ''
  },
  
  /**
   * Variante visual
   */
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'error', 'warning', 'info'].includes(value)
  },
  
  /**
   * Icono personalizado
   */
  icon: {
    type: String,
    default: ''
  },
  
  /**
   * Duración en ms (0 = sin auto-cierre)
   */
  duration: {
    type: Number,
    default: 4000
  },
  
  /**
   * Mostrar botón de cerrar
   */
  closeable: {
    type: Boolean,
    default: true
  },
  
  /**
   * Posición del toast
   */
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ].includes(value)
  }
})

const emit = defineEmits(['close'])

// Clases computadas
const toastClasses = computed(() => [
  `toast-${props.variant}`,
  `toast-${props.position}`
])

// Auto-cierre
let closeTimeout = null

watch(() => props.isVisible, (newValue) => {
  if (newValue && props.duration > 0) {
    // Limpiar timeout anterior
    if (closeTimeout) clearTimeout(closeTimeout)
    
    // Configurar nuevo timeout
    closeTimeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

// Métodos
const close = () => {
  if (closeTimeout) clearTimeout(closeTimeout)
  emit('close')
}

// Limpiar al desmontar
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (closeTimeout) clearTimeout(closeTimeout)
})

</script>

<template>

  <Teleport to="body">
    <div 
      class="toast-container"
      aria-live="polite"
      aria-atomic="true"
      role="status">
      <Transition name="toast" mode="out-in">
        <div
          v-if="isVisible"
          :key="message"
          class="toast"
          :class="toastClasses"
          role="alert">
          <!-- Icono -->
          <span v-if="icon" class="toast-icon" aria-hidden="true">
            {{ icon }}
          </span>
          
          <!-- Contenido -->
          <div class="toast-content">
            <p class="toast-message">{{ message }}</p>
            <p v-if="description" class="toast-description">{{ description }}</p>
          </div>
          
          <!-- Botón cerrar -->
          <button
            v-if="closeable"
            type="button"
            class="toast-close"
            @click="close"
            aria-label="Cerrar notificación">
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>

</template>

<style scoped>

/* ============================================================================
 * Container
 * ============================================================================ */

.toast-container {
  position: fixed;
  z-index: var(--custom-z-toast);
  pointer-events: none;
}

/* ============================================================================
 * Toast base
 * ============================================================================ */

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--custom-space-3);
  min-width: 300px;
  max-width: 500px;
  padding: var(--custom-space-4);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--custom-radius-lg);
  box-shadow: var(--custom-shadow-xl);
  pointer-events: all;
  transition: var(--custom-transition-base);
}

/* ============================================================================
 * Posiciones
 * ============================================================================ */

/* Top */
.toast-top-left {
  top: var(--custom-space-4);
  left: var(--custom-space-4);
}

.toast-top-center {
  top: var(--custom-space-4);
  left: 50%;
  transform: translateX(-50%);
}

.toast-top-right {
  top: var(--custom-space-4);
  right: var(--custom-space-4);
}

/* Bottom */
.toast-bottom-left {
  bottom: var(--custom-space-4);
  left: var(--custom-space-4);
}

.toast-bottom-center {
  bottom: var(--custom-space-4);
  left: 50%;
  transform: translateX(-50%);
}

.toast-bottom-right {
  bottom: var(--custom-space-4);
  right: var(--custom-space-4);
}

/* ============================================================================
 * Variantes
 * ============================================================================ */

.toast-default {
  border-color: var(--vp-c-divider);
}

.toast-success {
  background: var(--custom-gradient-success);
  border-color: var(--vp-c-green-1);
}

.toast-error {
  background: var(--custom-gradient-danger);
  border-color: var(--vp-c-red-1);
}

.toast-warning {
  background: var(--custom-gradient-warning);
  border-color: var(--vp-c-yellow-1);
}

.toast-info {
  background: var(--custom-gradient-info);
  border-color: var(--vp-c-blue-1);
}

/* ============================================================================
 * Elementos internos
 * ============================================================================ */

.toast-icon {
  font-size: var(--custom-font-size-2xl);
  line-height: 1;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-message {
  font-weight: var(--custom-font-weight-semibold);
  color: var(--vp-c-text-1);
  margin: 0;
}

.toast-description {
  font-size: var(--custom-font-size-sm);
  color: var(--vp-c-text-2);
  margin: var(--custom-space-1) 0 0;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--custom-radius-sm);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: var(--custom-font-size-2xl);
  line-height: 1;
  transition: var(--custom-transition-fast);
}

.toast-close:hover {
  background: var(--custom-overlay-light);
  color: var(--vp-c-text-1);
}

/* ============================================================================
 * Animaciones
 * ============================================================================ */

.toast-enter-active,
.toast-leave-active {
  transition: all var(--custom-duration-normal) var(--custom-timing-spring);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Para posiciones bottom, invertir animación */
[class*="toast-bottom-"].toast-enter-from {
  transform: translateY(100%);
}

[class*="toast-bottom-"].toast-leave-to {
  transform: translateY(20px);
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

@media (max-width: 480px) {
  .toast {
    min-width: auto;
    max-width: calc(100vw - var(--custom-space-8));
    margin: 0 var(--custom-space-2);
  }
  
  .toast-top-center,
  .toast-bottom-center {
    left: var(--custom-space-2);
    right: var(--custom-space-2);
    transform: none;
  }
}

</style>
