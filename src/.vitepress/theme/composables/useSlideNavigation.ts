/**
 * =============================================================================
 * useSlideNavigation - Composable para gestionar navegación entre slides
 * =============================================================================
 * 
 * Este composable maneja toda la lógica de navegación entre slides:
 * - Navegación por teclado (flechas, ESC)
 * - Navegación por botones
 * - Estado del índice actual
 * - Fullscreen/Lightbox
 */

import { ref, computed, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'

/**
 * Opciones de configuración para useSlideNavigation
 */
export interface UseSlideNavigationOptions<T = HTMLElement> {
  slides?: Ref<T[]>
  enableKeyboard?: boolean
  enableWheel?: boolean
  loop?: boolean
}

/**
 * Interfaz para touch start
 */
interface TouchStart {
  x: number
  y: number
  time: number
}

/**
 * Interfaz para el retorno de useSlideNavigation
 */
export interface UseSlideNavigationReturn<T = HTMLElement> {
  currentIndex: Ref<number>
  currentSlide: ComputedRef<T | null>
  totalSlides: ComputedRef<number>
  isFullscreen: Ref<boolean>
  isFirst: ComputedRef<boolean>
  isLast: ComputedRef<boolean>
  canGoPrevious: ComputedRef<boolean>
  canGoNext: ComputedRef<boolean>
  next: () => void
  previous: () => void
  goTo: (index: number) => void
  toggleFullscreen: () => void
  openFullscreen: (index?: number | null) => void
  closeFullscreen: () => void
  handleKeyboard: (event: KeyboardEvent) => void
  handleWheel: ((event: WheelEvent) => void) & { lastScroll?: number }
  handleTouchStart: (event: TouchEvent) => void
  handleTouchEnd: (event: TouchEvent) => void
  initEventListeners: () => void
  cleanupEventListeners: () => void
}

/**
 * Hook para gestionar navegación entre slides
 */
export function useSlideNavigation<T = HTMLElement>(
  options: UseSlideNavigationOptions<T> = {}
): UseSlideNavigationReturn<T> {
  const {
    slides = ref<T[]>([]),
    enableKeyboard = true,
    enableWheel = false,
    loop = false
  } = options

  // Estado
  const currentIndex = ref(0)
  const isFullscreen = ref(false)

  /**
   * Número total de slides
   */
  const totalSlides = computed<number>(() => slides.value.length)

  /**
   * Verifica si es el primer slide
   */
  const isFirst = computed<boolean>(() => currentIndex.value === 0)

  /**
   * Verifica si es el último slide
   */
  const isLast = computed<boolean>(() => currentIndex.value === totalSlides.value - 1)

  /**
   * Verifica si se puede navegar al anterior
   */
  const canGoPrevious = computed<boolean>(() => loop || !isFirst.value)

  /**
   * Verifica si se puede navegar al siguiente
   */
  const canGoNext = computed<boolean>(() => loop || !isLast.value)

  /**
   * Obtiene el slide actual
   */
  const currentSlide = computed<T | null>(() => {
    if (totalSlides.value === 0) return null
    return slides.value[currentIndex.value]
  })

  /**
   * Navega al slide siguiente
   */
  const next = (): void => {
    if (!canGoNext.value) return

    if (isLast.value && loop) {
      currentIndex.value = 0
    } else {
      currentIndex.value = Math.min(currentIndex.value + 1, totalSlides.value - 1)
    }
  }

  /**
   * Navega al slide anterior
   */
  const previous = (): void => {
    if (!canGoPrevious.value) return

    if (isFirst.value && loop) {
      currentIndex.value = totalSlides.value - 1
    } else {
      currentIndex.value = Math.max(currentIndex.value - 1, 0)
    }
  }

  /**
   * Navega a un slide específico por índice
   */
  const goTo = (index: number): void => {
    if (index < 0 || index >= totalSlides.value) return
    currentIndex.value = index
  }

  /**
   * Alterna el modo fullscreen
   */
  const toggleFullscreen = (): void => {
    isFullscreen.value = !isFullscreen.value
  }

  /**
   * Abre el slide en fullscreen
   */
  const openFullscreen = (index: number | null = null): void => {
    if (index !== null) {
      goTo(index)
    }
    isFullscreen.value = true
  }

  /**
   * Cierra el modo fullscreen
   */
  const closeFullscreen = (): void => {
    isFullscreen.value = false
  }

  /**
   * Manejador de eventos de teclado
   */
  const handleKeyboard = (event: KeyboardEvent): void => {
    if (!enableKeyboard) return

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ': // Espacio
        event.preventDefault()
        next()
        break

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault()
        previous()
        break

      case 'Home':
        event.preventDefault()
        goTo(0)
        break

      case 'End':
        event.preventDefault()
        goTo(totalSlides.value - 1)
        break

      case 'Escape':
        if (isFullscreen.value) {
          event.preventDefault()
          closeFullscreen()
        }
        break

      default:
        // Números del 1-9 para ir a slides específicos
        if (event.key >= '1' && event.key <= '9') {
          const index = parseInt(event.key) - 1
          if (index < totalSlides.value) {
            event.preventDefault()
            goTo(index)
          }
        }
        break
    }
  }

  /**
   * Manejador de eventos de rueda del mouse (opcional)
   */
  const handleWheel: ((event: WheelEvent) => void) & { lastScroll?: number } = (
    event: WheelEvent
  ): void => {
    if (!enableWheel) return

    // Debounce para evitar navegación demasiado rápida
    const now = Date.now()
    if (handleWheel.lastScroll && now - handleWheel.lastScroll < 300) {
      return
    }
    handleWheel.lastScroll = now

    if (event.deltaY > 0) {
      next()
    } else if (event.deltaY < 0) {
      previous()
    }
  }

  /**
   * Manejador de eventos táctiles (swipe)
   */
  const touchStart = ref<TouchStart>({ x: 0, y: 0, time: 0 })

  const handleTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0]
    touchStart.value = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }

  const handleTouchEnd = (event: TouchEvent): void => {
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStart.value.x
    const deltaY = touch.clientY - touchStart.value.y
    const deltaTime = Date.now() - touchStart.value.time

    // Detectar swipe horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
      if (deltaX > 0) {
        previous() // Swipe derecha -> anterior
      } else {
        next() // Swipe izquierda -> siguiente
      }
    }
  }

  /**
   * Inicializa los event listeners
   */
  const initEventListeners = (): void => {
    if (typeof window === 'undefined') return

    if (enableKeyboard) {
      window.addEventListener('keydown', handleKeyboard)
    }

    if (enableWheel) {
      window.addEventListener('wheel', handleWheel, { passive: true })
    }

    // Siempre habilitar touch para móviles
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  /**
   * Limpia los event listeners
   */
  const cleanupEventListeners = (): void => {
    if (typeof window === 'undefined') return

    window.removeEventListener('keydown', handleKeyboard)
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchend', handleTouchEnd)
  }

  // Lifecycle hooks
  onMounted(() => {
    initEventListeners()
  })

  onBeforeUnmount(() => {
    cleanupEventListeners()
  })

  return {
    // Estado
    currentIndex,
    currentSlide,
    totalSlides,
    isFullscreen,
    
    // Flags de navegación
    isFirst,
    isLast,
    canGoPrevious,
    canGoNext,
    
    // Métodos de navegación
    next,
    previous,
    goTo,
    
    // Fullscreen
    toggleFullscreen,
    openFullscreen,
    closeFullscreen,
    
    // Event handlers (por si se necesitan manualmente)
    handleKeyboard,
    handleWheel,
    handleTouchStart,
    handleTouchEnd,
    
    // Utilidades
    initEventListeners,
    cleanupEventListeners
  }
}

