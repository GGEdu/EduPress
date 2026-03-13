<script setup lang="ts">

/**
 * AccentBox - Componente de caja destacada con gradientes
 * 
 * FASE 6: Mejora de Componentes Content
 * - Mantiene estilo de gradiente característico
 * - Añade sistema de variantes con gradientes personalizados
 * - Tamaños y opciones de centrado
 * 
 * @example
 * <AccentBox gradient="primary" size="lg" centered>
 *   Contenido destacado
 * </AccentBox>
 * 
 * @example
 * <AccentBox gradient="warning" title="¡Importante!" icon="⚠️">
 *   Contenido con título e icono
 * </AccentBox>
 */

import { computed, useSlots } from 'vue'

const props = defineProps({
  /**
   * Tipo de gradiente a aplicar
   */
  gradient: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary',
      'success',
      'warning',
      'danger',
      'info',
      'purple',
      'orange',
      'teal'
    ].includes(value)
  },
  
  /**
   * Tamaño del accent box
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  /**
   * Título opcional
   */
  title: {
    type: String,
    default: ''
  },
  
  /**
   * Icono o emoji opcional
   */
  icon: {
    type: String,
    default: ''
  },
  
  /**
   * Centrar contenido
   */
  centered: {
    type: Boolean,
    default: true
  },
  
  /**
   * Activar efecto de brillo
   */
  shine: {
    type: Boolean,
    default: false
  }
})

// Mapeo de gradientes
const gradientMap = {
  primary: 'var(--custom-gradient-primary)',
  success: 'var(--custom-gradient-success-solid)',
  warning: 'var(--custom-gradient-warning-solid)',
  danger: 'var(--custom-gradient-danger-solid)',
  info: 'var(--custom-gradient-info-solid)',
  purple: 'var(--custom-gradient-purple)',
  orange: 'var(--custom-gradient-orange)',
  teal: 'var(--custom-gradient-teal)'
}

// Mapeo de tamaños
const sizeMap = {
  sm: {
    padding: 'var(--custom-space-3) var(--custom-space-4)',
    fontSize: 'var(--custom-font-size-sm)',
    titleSize: 'var(--custom-font-size-lg)',
    borderRadius: 'var(--custom-radius-md)'
  },
  md: {
    padding: 'var(--box-padding)',
    fontSize: 'var(--custom-font-size-base)',
    titleSize: 'var(--custom-font-size-xl)',
    borderRadius: 'var(--box-border-radius)'
  },
  lg: {
    padding: 'var(--custom-space-3) var(--custom-space-6)',
    fontSize: 'var(--custom-font-size-base)',
    titleSize: 'var(--custom-font-size-xl)',
    borderRadius: 'var(--custom-radius-lg)'
  },
  xl: {
    padding: 'var(--custom-space-3) var(--custom-space-8)',
    fontSize: 'var(--custom-font-size-lg)',
    titleSize: 'var(--custom-font-size-2xl)',
    borderRadius: 'var(--custom-radius-xl)'
  }
}

// Detectar si hay contenido en el slot principal
const slots = useSlots()
const hasContent = computed(() => {
  return !!slots.default
})

// Clases computadas
const accentClasses = computed(() => {
  return [
    `accent-${props.gradient}`,
    `accent-${props.size}`,
    {
      'accent-centered': props.centered,
      'accent-shine': props.shine
    }
  ]
})

// Estilos computados
const accentStyle = computed(() => {
  const sizing = sizeMap[props.size]
  return {
    background: gradientMap[props.gradient],
    padding: sizing.padding,
    fontSize: sizing.fontSize,
    borderRadius: sizing.borderRadius
  }
})

</script>

<template>

  <div 
    class="accent-box"
    :class="accentClasses"
    :style="accentStyle">
    <!-- Header opcional con título e icono -->
    <div v-if="title || icon" class="accent-header" :class="{ 'header-only': !hasContent }">
      <slot name="header">
        <span v-if="icon" class="accent-icon" :class="{ 'icon-only': !hasContent }">{{ icon }}</span>
        <h3 v-if="title" class="accent-title" :class="{ 'title-only': !hasContent }">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- Contenido principal -->
    <div v-if="hasContent" class="accent-content" :class="{ 'has-header': title || icon }">
      <slot></slot>
    </div>
  </div>

</template>

<style scoped>

/* ============================================================================
 * AccentBox Component - Estilos con gradientes
 * ============================================================================ */

.accent-box {
  color: var(--custom-text-on-gradient);
  text-shadow: var(--custom-text-shadow-gradient);
  margin: var(--box-margin);
  box-shadow: var(--custom-shadow-md);
  transition: var(--custom-transition-medium);
  position: relative;
  overflow: hidden;
}

/* Asegurar color consistente en elementos de texto (evitar selector universal *) */
.accent-box :deep(p),
.accent-box :deep(h1),
.accent-box :deep(h2),
.accent-box :deep(h3),
.accent-box :deep(h4),
.accent-box :deep(h5),
.accent-box :deep(h6),
.accent-box :deep(span),
.accent-box :deep(li),
.accent-box :deep(strong),
.accent-box :deep(em),
.accent-box :deep(div) {
  color: var(--custom-text-on-gradient);
  text-shadow: var(--custom-text-shadow-gradient);
}

/* Efecto hover */
.accent-box:hover {
  transform: translateY(calc(-1 * var(--custom-space-1)));
  box-shadow: var(--custom-shadow-xl);
}

/* Efecto de brillo animado */
.accent-box.accent-shine::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    var(--custom-overlay-medium) 50%,
    transparent 70%
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* ============================================================================
 * Header
 * ============================================================================ */

.accent-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--custom-space-2);
  margin-bottom: var(--custom-space-2);
}

/* Cuando solo hay header (sin contenido), centrarlo verticalmente */
.accent-header.header-only {
  margin-bottom: 0;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accent-icon {
  font-size: var(--custom-font-size-xl);
  flex-shrink: 0;
  filter: drop-shadow(var(--custom-text-shadow-sm));
}

/* Icono más grande cuando no hay contenido */
.accent-icon.icon-only {
  font-size: var(--custom-font-size-2xl);
}

.accent-title {
  margin: 0;
  font-weight: var(--custom-font-weight-bold);
  line-height: var(--custom-line-height-tight);
  text-shadow: var(--custom-text-shadow-sm);
}

/* Título más grande cuando no hay contenido */
.accent-title.title-only {
  font-size: var(--custom-font-size-2xl);
}

/* ============================================================================
 * Contenido
 * ============================================================================ */

.accent-content {
  position: relative;
  z-index: 1;
}

.accent-content.has-header {
  padding-top: var(--custom-space-2);
}

.accent-centered {
  text-align: center;
}

.accent-content :deep(p) {
  margin: var(--custom-space-2) 0;
  color: inherit;
  line-height: var(--custom-line-height-relaxed);
}

.accent-content :deep(strong) {
  font-weight: var(--custom-font-weight-bold);
  color: inherit;
  text-shadow: var(--custom-text-shadow-sm);
}

.accent-content :deep(a) {
  color: white;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: var(--custom-transition-fast);
}

.accent-content :deep(a:hover) {
  text-decoration-thickness: 2px;
  opacity: 0.9;
}

.accent-content :deep(code) {
  background: var(--custom-overlay-light);
  color: white;
  padding: var(--code-padding);
  border-radius: var(--code-border-radius);
  font-family: var(--vp-font-family-mono);
  font-weight: var(--custom-font-weight-medium);
  text-shadow: none; /* Sin sombra para mejor legibilidad */
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .accent-box {
    padding: var(--custom-space-4);
    margin: var(--custom-space-4) 0;
    /* Reducir efectos decorativos en móvil */
    box-shadow: var(--custom-shadow-sm);
  }
  
  .accent-sm {
    padding: var(--custom-space-3);
    font-size: var(--custom-font-size-xs);
  }
  
  .accent-md {
    padding: var(--custom-space-4);
    font-size: var(--custom-font-size-sm);
  }
  
  .accent-lg {
    padding: var(--custom-space-5);
    font-size: var(--custom-font-size-base);
  }
  
  .accent-xl {
    padding: var(--custom-space-6);
    font-size: var(--custom-font-size-base);
  }
  
  .accent-icon {
    font-size: var(--custom-font-size-xl);
    margin-bottom: var(--custom-space-2);
  }
  
  .accent-header {
    margin-bottom: var(--custom-space-3);
    font-size: var(--custom-font-size-lg);
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .accent-icon {
    font-size: var(--custom-font-size-2xl);
  }
  
  .accent-xl {
    padding: var(--custom-space-6);
    font-size: var(--custom-font-size-lg);
  }
  
  .accent-box {
    /* Reducir sombra en tablet */
    box-shadow: var(--custom-shadow-md);
  }
}

</style>
