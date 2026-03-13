<script setup lang="ts">

/**
 * InfoBox - Componente mejorado para cajas de información
 * 
 * FASE 6: Mejora de Componentes Content
 * - Añadidas variantes (default, primary, success, warning, danger, info, note, tip, important)
 * - Tamaños (sm, md, lg)
 * - Iconos y emojis
 * - Colapsable
 * - Slots nombrados (header, footer)
 * - Shadow y bordered opcionales
 * 
 * @example
 * <InfoBox 
 *   variant="success" 
 *   size="lg" 
 *   title="¡Éxito!" 
 *   icon="✓"
 *   shadow
 *   collapsible>
 *   <template #header>
 *     <CustomHeader />
 *   </template>
 *   
 *   Contenido del box
 *   
 *   <template #footer>
 *     <button>Acción</button>
 *   </template>
 * </InfoBox>
 */

import { ref } from 'vue'
import { useContentBox, contentBoxProps } from '../../composables/useContentBox'

const props = defineProps(contentBoxProps)

const {
  containerStyle,
  titleStyle,
  containerClasses,
  defaultIcon
} = useContentBox(props)

// Estado de colapso
const isCollapsed = ref(props.defaultCollapsed)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

</script>

<template>

  <div 
    class="info-box"
    :class="containerClasses"
    :style="containerStyle">
    <!-- Header con título e icono -->
    <div v-if="title || icon || $slots.header" class="info-header">
      <slot name="header">
        <div class="info-header-content">
          <!-- Icono -->
          <span v-if="defaultIcon" class="info-icon">{{ defaultIcon }}</span>
          
          <!-- Título -->
          <h4 v-if="title" class="info-title" :style="titleStyle">
            {{ title }}
          </h4>
        </div>
      </slot>
      
      <!-- Botón collapse (si es colapsable) -->
      <button 
        v-if="collapsible"
        class="info-collapse-btn"
        @click="toggleCollapse"
        :aria-expanded="!isCollapsed"
        :aria-label="isCollapsed ? 'Expandir' : 'Colapsar'">
        <span class="collapse-icon">{{ isCollapsed ? '▼' : '▲' }}</span>
      </button>
    </div>
    
    <!-- Contenido principal -->
    <div 
      v-show="!isCollapsed"
      class="info-content">
      <slot></slot>
    </div>
    
    <!-- Footer opcional -->
    <div v-if="$slots.footer" class="info-footer">
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<style scoped>

/* ============================================================================
 * InfoBox Component - Estilos mejorados
 * ============================================================================ */

.info-box {
  position: relative;
  overflow: hidden;
}

/* Forzar texto blanco y sombra en variantes con gradiente */
.box-variant-primary .info-box,
.box-variant-success .info-box,
.box-variant-warning .info-box,
.box-variant-danger .info-box,
.box-variant-info .info-box,
.box-variant-note .info-box,
.box-variant-tip .info-box,
.box-variant-important .info-box {
  color: var(--custom-text-on-gradient) !important;
  text-shadow: var(--custom-text-shadow-gradient);
}

.box-variant-primary .info-box *:not(code),
.box-variant-success .info-box *:not(code),
.box-variant-warning .info-box *:not(code),
.box-variant-danger .info-box *:not(code),
.box-variant-info .info-box *:not(code),
.box-variant-note .info-box *:not(code),
.box-variant-tip .info-box *:not(code),
.box-variant-important .info-box *:not(code) {
  color: var(--custom-text-on-gradient) !important;
  text-shadow: var(--custom-text-shadow-gradient);
}

.info-box:hover {
  transform: translateY(calc(-1 * var(--custom-space-1)));
  box-shadow: var(--custom-shadow-lg);
}

/* ============================================================================
 * Header
 * ============================================================================ */

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--custom-space-3);
}

.info-header-content {
  display: flex;
  align-items: center;
  gap: var(--custom-space-2);
  flex: 1;
}

.info-icon {
  font-size: var(--custom-font-size-xl);
  flex-shrink: 0;
}

.info-title {
  margin: 0;
  line-height: var(--custom-line-height-tight);
}

/* ============================================================================
 * Botón Collapse
 * ============================================================================ */

.info-collapse-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--custom-space-1);
  color: var(--vp-c-text-2);
  transition: var(--custom-transition-fast);
  border-radius: var(--custom-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-collapse-btn:hover {
  background: var(--custom-overlay-light);
  color: var(--vp-c-text-1);
}

.collapse-icon {
  font-size: var(--custom-font-size-sm);
  transition: transform var(--custom-transition-fast);
}

/* ============================================================================
 * Contenido
 * ============================================================================ */

.info-content {
  animation: fadeIn var(--custom-duration-fast) var(--custom-timing-ease-out);
}

.info-content :deep(p),
.info-content :deep(li) {
  margin: var(--custom-space-2) 0;
}

.info-content :deep(ul),
.info-content :deep(ol) {
  margin: var(--custom-space-2) 0;
  padding-left: var(--list-padding-left);
}

.info-content :deep(code) {
  background: var(--custom-overlay-medium);
  padding: var(--code-padding);
  border-radius: var(--code-border-radius);
}

/* ============================================================================
 * Footer
 * ============================================================================ */

.info-footer {
  margin-top: var(--custom-space-4);
  padding-top: var(--custom-space-4);
  border-top: var(--custom-border-width-sm) solid var(--custom-overlay-light);
}

/* ============================================================================
 * Animaciones
 * ============================================================================ */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(calc(-1 * var(--custom-space-2)));
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
  .info-box {
    padding: var(--custom-space-4);
    gap: var(--custom-space-3);
    margin: var(--custom-space-4) 0;
    /* Reducir decoraciones en móvil */
    box-shadow: var(--custom-shadow-sm);
  }
  
  .box-size-sm {
    padding: var(--custom-space-3);
  }
  
  .box-size-lg {
    padding: var(--custom-space-3) var(--custom-space-4);
  }
  
  .box-size-xl {
    padding: var(--custom-space-3) var(--custom-space-5);
  }
  
  .info-icon {
    font-size: var(--custom-font-size-base);
  }
  
  .info-header {
    font-size: var(--custom-font-size-base);
  }
  
  .collapse-button {
    padding: var(--custom-space-2) var(--custom-space-3);
    font-size: var(--custom-font-size-xs);
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .info-box {
    /* Reducir sombra en tablet */
    box-shadow: var(--custom-shadow-md);
  }
  
  .info-icon {
    font-size: var(--custom-font-size-lg);
  }
}

</style>
