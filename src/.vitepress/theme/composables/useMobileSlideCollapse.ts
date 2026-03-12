/**
 * =============================================================================
 * useMobileSlideCollapse - Composable para manejar colapso de slides en móvil
 * =============================================================================
 * 
 * Este composable permite detectar slides con contenido extenso en dispositivos
 * móviles y proporcionar funcionalidad de colapso/expansión para mejorar UX.
 * 
 * Características:
 * - Detecta altura del contenido automáticamente
 * - Colapsa contenido que exceda un umbral en móvil
 * - Proporciona botón "Ver más" / "Ver menos"
 * - Solo se activa en dispositivos móviles
 * 
 * @example
 * const { isCollapsed, toggleCollapse, shouldCollapse, contentHeight } = 
 *   useMobileSlideCollapse(contentRef, { threshold: 600 })
 */

import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface UseMobileSlideCollapseOptions {
  /** Altura máxima antes de colapsar (en px) */
  threshold?: number
  
  /** Breakpoint móvil (en px) */
  mobileBreakpoint?: number
  
  /** Activar/desactivar funcionalidad */
  enabled?: boolean
}

export interface UseMobileSlideCollapseReturn {
  /** Estado de colapso */
  isCollapsed: Ref<boolean>
  
  /** Función para alternar colapso */
  toggleCollapse: () => void
  
  /** Si el slide debería colapsarse */
  shouldCollapse: Ref<boolean>
  
  /** Altura actual del contenido */
  contentHeight: Ref<number>
  
  /** Si estamos en móvil */
  isMobile: Ref<boolean>
}

/**
 * Hook para manejar colapso de slides en móvil
 */
export function useMobileSlideCollapse(
  contentRef: Ref<HTMLElement | null>,
  options: UseMobileSlideCollapseOptions = {}
): UseMobileSlideCollapseReturn {
  const {
    threshold = 600,
    mobileBreakpoint = 768,
    enabled = true
  } = options

  // Estado
  const isCollapsed = ref(false)
  const contentHeight = ref(0)
  const isMobile = ref(false)

  /**
   * Detecta si estamos en móvil
   */
  const checkIfMobile = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= mobileBreakpoint
  }

  /**
   * Mide la altura del contenido
   */
  const measureContent = (): void => {
    if (!contentRef.value || !enabled) return
    
    contentHeight.value = contentRef.value.scrollHeight
    isMobile.value = checkIfMobile()
    
    // Auto-colapsar si estamos en móvil y el contenido es muy largo
    if (isMobile.value && contentHeight.value > threshold) {
      isCollapsed.value = true
    }
  }

  /**
   * Si el slide debería mostrar botón de colapso
   */
  const shouldCollapse = computed<boolean>(() => {
    return enabled && isMobile.value && contentHeight.value > threshold
  })

  /**
   * Alterna el estado de colapso
   */
  const toggleCollapse = (): void => {
    isCollapsed.value = !isCollapsed.value
    
    // Scroll suave al inicio del slide si se está colapsando
    if (isCollapsed.value && contentRef.value) {
      contentRef.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }

  /**
   * Manejador de resize con debounce
   */
  let resizeTimeout: NodeJS.Timeout
  const handleResize = (): void => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      measureContent()
    }, 150)
  }

  // Lifecycle
  onMounted(() => {
    if (!enabled) return
    
    // Medir después de que el DOM se haya renderizado
    setTimeout(measureContent, 100)
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  })

  return {
    isCollapsed,
    toggleCollapse,
    shouldCollapse,
    contentHeight,
    isMobile
  }
}

