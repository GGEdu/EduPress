/**
 * =============================================================================
 * useSlideInteractions - Composable para manejar interacciones de slides
 * =============================================================================
 * 
 * Este composable gestiona:
 * - Efectos hover de slides
 * - Clics en slides para abrir lightbox
 * - Prevención de conflictos con imágenes y diagramas
 * - Eventos táctiles
 */

import { onBeforeUnmount } from 'vue'

/**
 * Opciones de configuración para useSlideInteractions
 */
export interface UseSlideInteractionsOptions {
  enableHover?: boolean
  enableClick?: boolean
  hoverScale?: number
  excludeSelectors?: string[]
}

/**
 * Interfaz para almacenar event listeners
 */
interface EventListener {
  element: HTMLElement | Element
  event: string
  handler: EventListenerOrEventListenerObject
}

/**
 * Callback al abrir lightbox
 */
export type OnOpenCallback = (index: number) => void

/**
 * Interfaz para el retorno de useSlideInteractions
 */
export interface UseSlideInteractionsReturn {
  setupSlideInteractions: (slide: HTMLElement, index: number, onOpen: OnOpenCallback) => void
  setupAllSlides: (slides: HTMLElement[], onOpen: OnOpenCallback) => void
  applyHoverEffect: (slide: HTMLElement) => void
  attachClickHandler: (slide: HTMLElement, index: number, onOpen: OnOpenCallback) => void
  preventNestedLightbox: (slide: HTMLElement, index: number, onOpen: OnOpenCallback) => void
  removeHoverEffect: (slide: HTMLElement) => void
  isExcludedElement: (event: Event) => boolean
  cleanup: () => void
}

/**
 * Hook para manejar interacciones de slides
 */
export function useSlideInteractions(
  options: UseSlideInteractionsOptions = {}
): UseSlideInteractionsReturn {
  const {
    enableHover = true,
    enableClick = true,
    hoverScale = 1.02,
    excludeSelectors = ['IMG', '.mermaid-container']
  } = options

  // Almacenar event listeners para cleanup
  const listeners: EventListener[] = []

  /**
   * Aplica efecto hover a un slide
   */
  const applyHoverEffect = (slide: HTMLElement): void => {
    if (!enableHover) return

    slide.style.cursor = 'pointer'
    slide.style.transition = 'var(--custom-transition-medium)'
    
    const handleMouseEnter = (): void => {
      slide.style.transform = `scale(${hoverScale})`
      slide.style.boxShadow = 'var(--custom-shadow-xl)'
    }
    
    const handleMouseLeave = (): void => {
      slide.style.transform = 'scale(1)'
      slide.style.boxShadow = ''
    }
    
    slide.addEventListener('mouseenter', handleMouseEnter)
    slide.addEventListener('mouseleave', handleMouseLeave)
    
    listeners.push({
      element: slide,
      event: 'mouseenter',
      handler: handleMouseEnter
    })
    listeners.push({
      element: slide,
      event: 'mouseleave',
      handler: handleMouseLeave
    })
  }

  /**
   * Verifica si el clic fue en un elemento excluido
   */
  const isExcludedElement = (event: Event): boolean => {
    const target = event.target as HTMLElement
    
    for (const selector of excludeSelectors) {
      if (typeof selector === 'string') {
        // Es un tag name (ej: 'IMG')
        if (target.tagName === selector) return true
        // Es un selector CSS (ej: '.mermaid-container')
        if (selector.startsWith('.') || selector.startsWith('#')) {
          if (target.closest(selector)) return true
        }
      }
    }
    return false
  }

  /**
   * Configura el clic en un slide para abrir lightbox
   */
  const attachClickHandler = (
    slide: HTMLElement,
    index: number,
    onOpen: OnOpenCallback
  ): void => {
    if (!enableClick) return

    const handleClick = (e: Event): void => {
      // Solo abrir si no se hizo clic en un elemento excluido
      if (!isExcludedElement(e)) {
        onOpen(index)
      }
    }
    
    slide.addEventListener('click', handleClick)
    
    listeners.push({
      element: slide,
      event: 'click',
      handler: handleClick
    })
  }

  /**
   * Previene que imágenes y diagramas activen sus propios lightbox
   * En su lugar, abren el slide completo
   */
  const preventNestedLightbox = (
    slide: HTMLElement,
    index: number,
    onOpen: OnOpenCallback
  ): void => {
    // Prevenir lightbox en imágenes
    const images = slide.querySelectorAll('img')
    images.forEach(img => {
      const handleImageClick = (e: Event): void => {
        e.stopPropagation()
        onOpen(index)
      }
      
      img.addEventListener('click', handleImageClick)
      
      listeners.push({
        element: img,
        event: 'click',
        handler: handleImageClick
      })
    })
    
    // Prevenir lightbox en diagramas Mermaid
    const mermaidContainers = slide.querySelectorAll('.mermaid-container')
    mermaidContainers.forEach(container => {
      const handleMermaidClick = (e: Event): void => {
        e.stopPropagation()
        onOpen(index)
      }
      
      container.addEventListener('click', handleMermaidClick)
      
      listeners.push({
        element: container,
        event: 'click',
        handler: handleMermaidClick
      })
    })
  }

  /**
   * Configura todas las interacciones para un slide
   */
  const setupSlideInteractions = (
    slide: HTMLElement,
    index: number,
    onOpen: OnOpenCallback
  ): void => {
    applyHoverEffect(slide)
    attachClickHandler(slide, index, onOpen)
    preventNestedLightbox(slide, index, onOpen)
  }

  /**
   * Configura interacciones para múltiples slides
   */
  const setupAllSlides = (slides: HTMLElement[], onOpen: OnOpenCallback): void => {
    slides.forEach((slide, index) => {
      setupSlideInteractions(slide, index, onOpen)
    })
  }

  /**
   * Limpia todos los event listeners
   */
  const cleanup = (): void => {
    listeners.forEach(({ element, event, handler }) => {
      if (element) {
        element.removeEventListener(event, handler)
      }
    })
    listeners.length = 0
  }

  /**
   * Remueve efectos de hover (útil para modo lightbox)
   */
  const removeHoverEffect = (slide: HTMLElement): void => {
    slide.style.cursor = 'default'
    slide.style.transform = 'none'
    slide.style.transition = 'none'
  }

  // Cleanup automático al desmontar
  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    // Setup
    setupSlideInteractions,
    setupAllSlides,
    
    // Métodos individuales
    applyHoverEffect,
    attachClickHandler,
    preventNestedLightbox,
    removeHoverEffect,
    
    // Utilidades
    isExcludedElement,
    cleanup
  }
}

