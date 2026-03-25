<script setup lang="ts">

import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'
import { attachLightboxListeners, createLightbox } from '../utils/lightboxManager'

const { frontmatter } = useData()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  slides: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'slideChange'])

// Referencias
const contentRef = ref(null)
const currentIndex = ref(props.initialIndex)

// Computed
const totalSlides = computed(() => props.slides.length)
const canGoPrevious = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < totalSlides.value - 1)

const currentSlideContent = computed(() => {
  if (!props.slides[currentIndex.value]) return ''
  return props.slides[currentIndex.value].innerHTML
})

// Métodos de navegación
const handleNext = () => {
  if (canGoNext.value) {
    currentIndex.value++
    emit('slideChange', currentIndex.value)
  }
}

const handlePrevious = () => {
  if (canGoPrevious.value) {
    currentIndex.value--
    emit('slideChange', currentIndex.value)
  }
}

const handleClose = () => {
  emit('close')
  document.body.style.overflow = ''
}

// Manejo de teclado
const handleKeyDown = (e) => {
  if (!props.isOpen) return
  
  switch (e.key) {
    case 'Escape':
      handleClose()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      handlePrevious()
      break
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
      e.preventDefault()
      handleNext()
      break
    case 'Home':
      currentIndex.value = 0
      emit('slideChange', currentIndex.value)
      break
    case 'End':
      currentIndex.value = totalSlides.value - 1
      emit('slideChange', currentIndex.value)
      break
  }
}

// Re-adjuntar comportamiento de tabs tras v-html.
// Con nuestro override de PluginTabsTab (v-show), todos los paneles están en el DOM
// con display:none en los inactivos. Solo necesitamos reconectar los click listeners.
const reattachTabs = () => {
  if (!contentRef.value) return
  contentRef.value.querySelectorAll('.plugin-tabs').forEach(tabsEl => {
    const tabs = Array.from(tabsEl.querySelectorAll('.plugin-tabs--tab'))
    const panels = Array.from(tabsEl.querySelectorAll('.plugin-tabs--content'))

    // Asegurar estado inicial correcto
    const activeIdx = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true')
    const initialIdx = activeIdx !== -1 ? activeIdx : 0
    panels.forEach((p, i) => {
      p.style.display = i === initialIdx ? 'block' : 'none'
    })
    if (activeIdx === -1 && tabs[0]) tabs[0].setAttribute('aria-selected', 'true')

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'))
        tab.setAttribute('aria-selected', 'true')
        panels.forEach((p, j) => { p.style.display = j === i ? 'block' : 'none' })
      })
    })
  })
}

// Mantengo esto como alias para llamar al manager global en los watchers
const attachZoomListeners = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      attachLightboxListeners();
    }, 100);
    
    // Delegación de eventos ultra-agresiva para ganar a medium-zoom
    if (contentRef.value && !contentRef.value._hasCaptureListener) {
      contentRef.value._hasCaptureListener = true;
      contentRef.value.addEventListener('click', (e) => {
        // Enlace normal ignorado
        if (e.target.closest && e.target.closest('a')) return;
        
        let targetImg = null;
        if (e.target.tagName === 'IMG') {
          targetImg = e.target;
        } else {
          const mermaid = e.target.closest ? e.target.closest('.mermaid-container') : null;
          if (mermaid) targetImg = mermaid;
        }
        
        if (targetImg) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          // Verificar si ya está en attachLightboxListeners (o hacerlo on-the-fly)
          if (!targetImg.getAttribute('data-lightbox-attached')) {
            attachLightboxListeners(); // forzar un escaneo si es nueva
          }
          createLightbox(targetImg);
          return false;
        }
      }, true); // Fase de captura!
    }
  }
}

// Watchers
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      reattachTabs()
      attachZoomListeners()
    })
  } else {
    document.body.style.overflow = ''
  }
})

watch(currentIndex, () => {
  nextTick(() => {
    reattachTabs()
    attachZoomListeners()
  })
})

watch(() => props.initialIndex, (newValue) => {
  currentIndex.value = newValue
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})

</script>

<template>

  <Teleport to="body" v-if="isOpen">
    <div 
      class="slide-lightbox-overlay" 
      :class="frontmatter.pageClass"
      @click.self="handleClose"
    >
      <!-- Contenido del slide -->
      <div 
        class="slide-lightbox-content" 
        ref="contentRef"
      >
        <div 
          class="slide" 
          v-html="currentSlideContent"
        />
      </div>
      
      <!-- Botón cerrar -->
      <button 
        class="slide-lightbox-close" 
        @click="handleClose" 
        aria-label="Cerrar"
        :style="{ transition: 'var(--custom-transition-medium)' }"
      >
        ×
      </button>
      
      <!-- Navegación (solo si hay más de un slide) -->
      <template v-if="totalSlides > 1">
        <button 
          class="slide-lightbox-prev" 
          @click.stop="handlePrevious"
          :disabled="!canGoPrevious"
          aria-label="Anterior"
          :style="{ transition: 'var(--custom-transition-medium)' }"
        >
          ‹
        </button>
        
        <button 
          class="slide-lightbox-next" 
          @click.stop="handleNext"
          :disabled="!canGoNext"
          aria-label="Siguiente"
          :style="{ transition: 'var(--custom-transition-medium)' }"
        >
          ›
        </button>
        
        <!-- Contador -->
        <div class="slide-lightbox-counter">
          {{ currentIndex + 1 }} / {{ totalSlides }}
        </div>
      </template>
    </div>
  </Teleport>

</template>

<style scoped>

/* ============================================================================
 * Overlay y Contenedor Principal
 * ============================================================================ */

.slide-lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--lightbox-backdrop-bg);
  backdrop-filter: blur(8px);
  z-index: var(--lightbox-z-index);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease forwards;
}

.slide-lightbox-content {
  width: 90vw;
  height: 90vh;
  background: var(--vp-c-bg);
  border-radius: var(--custom-radius-xl);
  overflow-y: auto;
  box-shadow: var(--custom-shadow-2xl);
  animation: slideIn 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
}

.slide-lightbox-content .slide {
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  background: var(--custom-gradient-bg-soft);
  padding: clamp(2rem, 5vh, 4rem) clamp(2rem, 5vw, 4rem);
  border-radius: var(--slide-border-radius);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  box-shadow: none;
  min-height: auto;
  position: relative;
  overflow: visible;
}

/* Borde superior decorativo */
.slide-lightbox-content .slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--slide-top-accent-height);
  background: var(--custom-gradient-brand);
  border-radius: var(--slide-border-radius) var(--slide-border-radius) 0 0;
}

.slide-lightbox-content .slide:hover {
  box-shadow: none;
  transform: none;
}

.slide-lightbox-content .slide > * {
  max-width: 100%;
}

/* ============================================================================
 * Controles de UI
 * ============================================================================ */

.slide-lightbox-close {
  position: absolute;
  top: var(--custom-space-5);
  right: var(--custom-space-5);
  width: 50px;
  height: 50px;
  background: var(--custom-overlay-white-heavy);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  border-radius: 50%;
  cursor: pointer;
  font-size: 36px;
  line-height: 1;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: calc(var(--lightbox-z-index) + 1);
  box-shadow: var(--custom-shadow-lg);
  transition: var(--custom-transition-base);
}

.slide-lightbox-close:hover {
  background: var(--vp-c-bg-soft);
  transform: scale(1.1) rotate(90deg);
}

.slide-lightbox-prev,
.slide-lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: var(--custom-overlay-white-heavy);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  border-radius: 50%;
  cursor: pointer;
  font-size: 48px;
  line-height: 1;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: calc(var(--lightbox-z-index) + 1);
  box-shadow: var(--custom-shadow-lg);
  font-weight: var(--custom-font-weight-light);
  font-family: Arial, sans-serif;
  transition: var(--custom-transition-base);
}

.slide-lightbox-prev {
  left: var(--custom-space-8);
}

.slide-lightbox-next {
  right: var(--custom-space-8);
}

.slide-lightbox-prev:hover:not(:disabled),
.slide-lightbox-next:hover:not(:disabled) {
  background: var(--vp-c-bg-soft);
  transform: translateY(-50%) scale(1.15);
}

.slide-lightbox-prev:disabled,
.slide-lightbox-next:disabled {
  opacity: var(--custom-opacity-disabled);
  cursor: not-allowed;
}

.slide-lightbox-counter {
  position: absolute;
  bottom: var(--custom-space-8);
  left: 50%;
  transform: translateX(-50%);
  background: var(--custom-overlay-white-heavy);
  color: var(--vp-c-text-1);
  padding: var(--custom-space-3) var(--custom-space-5);
  border-radius: var(--custom-radius-full);
  border: var(--custom-border-width-thin) solid var(--vp-c-divider);
  font-size: var(--custom-font-size-base);
  font-weight: var(--custom-font-weight-semibold);
  z-index: calc(var(--lightbox-z-index) + 1);
  box-shadow: var(--custom-shadow-lg);
  user-select: none;
}

/* ============================================================================
 * Animaciones
 * ============================================================================ */

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* ============================================================================
 * Responsive
 * ============================================================================ */

/* Mobile Small (max-width: 480px) */
@media (max-width: 480px) {
  .slide-lightbox-content {
    width: 100vw;
    height: 100vh;
    padding: var(--custom-space-4);
    border-radius: 0;
  }
  
  .slide-lightbox-prev,
  .slide-lightbox-next {
    width: 40px;
    height: 40px;
    font-size: 28px;
  }
  
  .slide-lightbox-prev {
    left: var(--custom-space-2);
  }
  
  .slide-lightbox-next {
    right: var(--custom-space-2);
  }
  
  .slide-lightbox-close {
    width: 35px;
    height: 35px;
    font-size: 24px;
    top: var(--custom-space-2);
    right: var(--custom-space-2);
  }
  
  .slide-lightbox-counter {
    font-size: var(--custom-font-size-xs);
    padding: var(--custom-space-1) var(--custom-space-3);
    bottom: var(--custom-space-3);
  }
  
  .zoom-controls button {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
}

/* Tablet (max-width: 768px) */
@media (max-width: 768px) {
  .slide-lightbox-content {
    width: 95vw;
    height: 95vh;
    padding: var(--custom-space-6);
  }
  
  .slide-lightbox-prev,
  .slide-lightbox-next {
    width: 45px;
    height: 45px;
    font-size: 36px;
  }
  
  .slide-lightbox-prev {
    left: var(--custom-space-4);
  }
  
  .slide-lightbox-next {
    right: var(--custom-space-4);
  }
  
  .slide-lightbox-close {
    width: 40px;
    height: 40px;
    font-size: 28px;
    top: var(--custom-space-4);
    right: var(--custom-space-4);
  }
  
  .slide-lightbox-counter {
    font-size: var(--custom-font-size-sm);
    padding: var(--custom-space-2) var(--custom-space-4);
    bottom: var(--custom-space-5);
  }
}

</style>

<style scoped>

/* ============================================================================
 * Estilos globales para contenido del slide en lightbox
 * ============================================================================ */

.slide-lightbox-content .slide :deep(img) {
  max-height: 90vh;
  max-width: 90%;
  cursor: zoom-in;
}

.slide-lightbox-content .slide :deep(p img[alt*="#center"]) {
  max-width: 80%;
  max-height: 45vh;
  display: block;
  margin: 0 auto 1.5rem auto;
  object-fit: contain;
}

.slide-lightbox-content .slide :deep(.mermaid-container) {
  max-height: 70vh;
  cursor: zoom-in;
}

.slide-lightbox-content .slide :deep(.mermaid-container svg) {
  max-height: 70vh !important;
}

</style>
