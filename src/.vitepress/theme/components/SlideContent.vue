<script setup lang="ts">

/**
 * SlideContent - Componente para manejar el contenido de texto en slides
 * 
 * Responsabilidad única: Renderizar y estilizar el contenido textual
 * de un slide (párrafos, listas, etc.)
 * 
 * REFACTORIZACIÓN RESPONSIVE:
 * - Añadido soporte para colapso automático en móvil
 * - Botón "Ver más" para contenido extenso
 * - Mejora significativa de UX en dispositivos móviles
 * 
 * NOTA: El subtitle ahora se maneja en SlideBase, no aquí
 * 
 * @component
 */

import { computed, ref } from 'vue'
import { useMobileSlideCollapse } from '../composables/useMobileSlideCollapse'

const props = defineProps({
  /** Padding del contenedor */
  contentPadding: {
    type: String,
    default: 'var(--custom-space-4)'
  },
  
  /** Si el slide tiene fondo con gradiente */
  hasGradientBackground: {
    type: Boolean,
    default: false
  },
  
  /** Alineación del texto */
  textAlign: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right', 'justify'].includes(value)
  },
  
  /** Activar/desactivar colapso en móvil */
  enableMobileCollapse: {
    type: Boolean,
    default: true
  },
  
  /** Altura máxima antes de colapsar (px) */
  collapseThreshold: {
    type: Number,
    default: 600
  }
})

// Ref del contenido
const contentRef = ref<HTMLElement | null>(null)

// Composable para colapso en móvil
const {
  isCollapsed,
  toggleCollapse,
  shouldCollapse
} = useMobileSlideCollapse(contentRef, {
  threshold: props.collapseThreshold,
  enabled: props.enableMobileCollapse
})

// Estilos del contenedor
const containerStyle = computed(() => ({
  padding: props.contentPadding,
  textAlign: props.textAlign,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%'
}))

// Clases dinámicas para el contenido
const contentClasses = computed(() => ({
  'gradient-content': props.hasGradientBackground
}))

</script>

<template>

  <div 
    class="content-container"
    :style="containerStyle">
    <div 
      ref="contentRef"
      class="main-content"
      :class="[contentClasses, { 'is-collapsed': shouldCollapse && isCollapsed }]">
      <slot></slot>
    </div>
    
    <!-- Botón "Ver más" solo en móvil con contenido largo -->
    <button
      v-if="shouldCollapse"
      class="expand-button"
      @click="toggleCollapse"
      :aria-expanded="!isCollapsed"
      :aria-label="isCollapsed ? 'Ver contenido completo' : 'Ver menos'">
      <span class="expand-button-text">
        {{ isCollapsed ? '📖 Ver más' : '📕 Ver menos' }}
      </span>
      <span class="expand-button-icon" :class="{ 'rotated': !isCollapsed }">
        ▼
      </span>
    </button>
  </div>

</template>

<style scoped>

/* ============================================================================
 * SlideContent - Estilos con Design Tokens
 * ============================================================================ */

.content-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-content {
  width: 100%;
}

/* Estilos para párrafos */
.main-content :deep(p) {
  line-height: var(--custom-line-height-loose);
  margin: var(--custom-space-2) 0;
}

/* Estilos para listas */
.main-content :deep(ul),
.main-content :deep(ol) {
  padding-left: var(--list-padding-left);
  margin: var(--custom-space-4) 0;
}

.main-content :deep(li) {
  margin: var(--custom-space-2) 0;
  line-height: var(--custom-line-height-loose);
}

/* Estilos para código inline */
.main-content :deep(code) {
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
  padding: var(--code-padding);
  border-radius: var(--code-border-radius);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
}

/* ============================================================================
 * Estilos para contenido con fondo gradiente
 * ============================================================================ */

.gradient-content :deep(h3) {
  color: white;
  text-shadow: var(--custom-text-shadow-md);
  font-weight: var(--custom-font-weight-bold);
}

.gradient-content :deep(p) {
  color: white;
  text-shadow: var(--custom-text-shadow-sm);
}

.gradient-content :deep(strong) {
  color: white;
  text-shadow: var(--custom-text-shadow-sm);
}

.gradient-content :deep(code) {
  background: var(--custom-overlay-medium);
  color: white;
  padding: var(--code-padding);
  border-radius: var(--code-border-radius);
  font-family: var(--vp-font-family-mono);
}

.gradient-content :deep(li) {
  color: white;
  text-shadow: var(--custom-text-shadow-sm);
}

/* Estilos especiales para Quote en gradiente */
.gradient-content :deep(.quote-component) {
  border-left-color: var(--custom-overlay-heavy);
  background: var(--custom-overlay-light);
  backdrop-filter: blur(10px);
  padding: var(--custom-space-4);
  border-radius: var(--custom-radius-md);
}

.gradient-content :deep(.quote-component strong) {
  color: white;
  text-shadow: var(--custom-text-shadow-lg);
}

.gradient-content :deep(.quote-component code) {
  color: white;
}

/* ============================================================================
 * Estado colapsado (solo móvil)
 * ============================================================================ */

.main-content.is-collapsed {
  max-height: 400px;
  overflow: hidden;
  position: relative;
}

/* Gradiente de fade-out cuando está colapsado */
.main-content.is-collapsed::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--vp-c-bg) 80%
  );
  pointer-events: none;
}

/* ============================================================================
 * Botón "Ver más"
 * ============================================================================ */

.expand-button {
  display: inline-flex;
  align-items: center;
  gap: var(--custom-space-2);
  margin-top: var(--custom-space-4);
  padding: var(--custom-space-3) var(--custom-space-5);
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: var(--custom-radius-full);
  font-family: var(--vp-font-family-base);
  font-size: var(--custom-font-size-sm);
  font-weight: var(--custom-font-weight-semibold);
  cursor: pointer;
  transition: var(--custom-transition-base);
  box-shadow: var(--custom-shadow-md);
  width: auto;
  align-self: center;
}

.expand-button:hover {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: var(--custom-shadow-lg);
}

.expand-button:active {
  transform: translateY(0);
}

.expand-button-text {
  font-size: var(--custom-font-size-sm);
}

.expand-button-icon {
  display: inline-block;
  transition: transform var(--custom-duration-medium) var(--custom-ease-in-out);
  font-size: var(--custom-font-size-xs);
}

.expand-button-icon.rotated {
  transform: rotate(180deg);
}

/* Focus state para accesibilidad */
.expand-button:focus-visible {
  outline: 2px solid var(--a11y-focus-color);
  outline-offset: 2px;
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

@media (max-width: 768px) {
  .content-container {
    padding: var(--custom-space-3);
  }
  
  .main-content {
    margin-top: var(--custom-space-3);
  }
  
  .main-content :deep(ul),
  .main-content :deep(ol) {
    padding-left: var(--custom-space-5);
  }
  
  /* Reducir altura colapsada en tablet */
  .main-content.is-collapsed {
    max-height: 350px;
  }
}

@media (max-width: 480px) {
  .content-container {
    padding: var(--custom-space-2);
  }
  
  /* Reducir aún más en móvil pequeño */
  .main-content.is-collapsed {
    max-height: 300px;
  }
  
  .expand-button {
    padding: var(--custom-space-2) var(--custom-space-4);
    font-size: var(--custom-font-size-xs);
    width: 100%;
    justify-content: center;
  }
}

/* Solo mostrar botón en móvil */
@media (min-width: 769px) {
  .expand-button {
    display: none;
  }
  
  .main-content.is-collapsed {
    max-height: none !important;
    overflow: visible !important;
  }
  
  .main-content.is-collapsed::after {
    display: none;
  }
}

</style>
