/**
 * =============================================================================
 * useSlideProcessor - Composable para procesar y organizar slides
 * =============================================================================
 * 
 * Este composable maneja la lógica de procesamiento del DOM para convertir
 * contenido Markdown en slides individuales, detectando separadores (HR)
 * y manejando casos especiales como pestañas.
 */

import { ref, nextTick, type Ref } from 'vue'
import { DEFAULT_SLIDE_MEDIA } from '../config/slideMedia'

/**
 * Opciones de configuración para useSlideProcessor
 */
export interface UseSlideProcessorOptions {
  separator?: string
  slideClass?: string
  preserveTabs?: boolean
  delay?: number
}

/**
 * Interfaz para el retorno de useSlideProcessor
 */
export interface UseSlideProcessorReturn {
  slides: Ref<HTMLElement[]>
  isProcessing: Ref<boolean>
  hasProcessed: Ref<boolean>
  processSlides: (container: HTMLElement | null) => Promise<HTMLElement[]>
  reset: () => void
  getSlides: (container: HTMLElement | null) => HTMLElement[]
  countSlides: (container: HTMLElement | null) => number
  hasTabs: (container: HTMLElement) => boolean
  processWithTabs: (container: HTMLElement) => HTMLElement[]
  processNormal: (container: HTMLElement) => HTMLElement[]
}

/**
 * Hook para procesar y organizar slides
 */
export function useSlideProcessor(
  options: UseSlideProcessorOptions = {}
): UseSlideProcessorReturn {
  const {
    separator = 'HR',
    slideClass = 'slide',
    preserveTabs = true,
    delay = 2000
  } = options

  const slides = ref<HTMLElement[]>([])
  const isProcessing = ref(false)
  const hasProcessed = ref(false)

  /**
   * Detecta si el contenedor tiene pestañas (tabs)
   */
  const hasTabs = (container: HTMLElement): boolean => {
    return !!(
      container.querySelector('.plugin-tabs') ||
      container.textContent?.includes('::: tabs') ||
      container.innerHTML.includes('== DAW') ||
      container.innerHTML.includes('== DAM') ||
      container.innerHTML.includes('== ASIR')
    )
  }

  /**
   * Procesa slides con pestañas (tabs)
   * Usa buildSmartSlide para que la detección de imagen y el grid funcionen igual
   * que en processNormal. Los nodos DOM (incluidos los listeners del plugin tabs)
   * se conservan al moverlos via appendChild, no se clonan.
   */
  const processWithTabs = (container: HTMLElement): HTMLElement[] => {
    console.log('Tabs detected, processing with buildSmartSlide for full grid support')
    
    const elements = Array.from(container.children) as HTMLElement[]
    let currentGroup: HTMLElement[] = []
    const groups: HTMLElement[][] = []
    
    // Agrupar elementos entre separadores HR
    elements.forEach(element => {
      if (element.tagName === separator) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup)
          currentGroup = []
        }
      } else {
        currentGroup.push(element)
      }
    })
    
    // Añadir último grupo si existe
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }
    
    // Construir cada slide con buildSmartSlide para obtener grid + imagen
    const processedSlides: HTMLElement[] = []
    
    groups.forEach((group, idx) => {
      if (group.length > 0) {
        processedSlides.push(buildSmartSlide(group, idx))
      }
    })
    
    // Reemplazar contenido del contenedor con los slides procesados
    if (processedSlides.length > 0) {
      container.innerHTML = ''
      processedSlides.forEach(slide => {
        container.appendChild(slide)
      })
    }
    
    slides.value = processedSlides
    return processedSlides
  }

  /**
   * Helper que construye una diapositiva final completa replicando la estructura
   * de componentes Vue (SlideBase -> Header, Grid -> SlideMedia, SlideContent).
   */
  const buildSmartSlide = (elements: HTMLElement[], slideIndex: number): HTMLElement => {
    const slideWrapper = document.createElement('div')
    slideWrapper.className = slideClass
    
    // 1. Extraer título (h1, h2, h3)
    const titleIndex = elements.findIndex(el => el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3')
    let slideTitle = null
    
    if (titleIndex !== -1) {
      slideTitle = elements[titleIndex]
      elements.splice(titleIndex, 1) // Quitar del array principal
      
      const header = document.createElement('header')
      slideTitle.className = 'slide-subtitle'
      header.appendChild(slideTitle)
      slideWrapper.appendChild(header)
    }

    // 2. Extraer TODAS las imágenes para encontrar la primera válida (incluso dentro de <p>)
    let mainImage: HTMLImageElement | null = null
    
    // Buscar la primera imagen directamente
    const rawImageIndex = elements.findIndex(el => el.tagName === 'IMG')
    if (rawImageIndex !== -1) {
      mainImage = elements[rawImageIndex] as HTMLImageElement
      elements.splice(rawImageIndex, 1)
    } else {
      // Buscar una imagen envuelta en <p> (comportamiento muy común en Markdown)
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].tagName === 'P') {
          const img = elements[i].querySelector('img')
          if (img && !img.alt.includes('#center')) {
            mainImage = img
            // Si el párrafo solo tenía la imagen (y espacios), vaciamos el párrafo para que no ocupe espacio visual.
            if (elements[i].textContent?.trim() === '') {
              elements.splice(i, 1)
            } else {
              img.remove() // Lo sacamos del párrafo original
            }
            break
          }
        }
      }
    }

    // 3. Crear el Grid Layout
    const slideGrid = document.createElement('div')
    
    // Si hay imagen, la ponemos alternando (pares izquierda, impares derecha)
    if (mainImage) {
      const imageIsRight = slideIndex % 2 !== 0
      slideGrid.className = `slide-grid ${imageIsRight ? 'image-right' : 'image-left'}`
      // Forzar el grid como inline styles para garantizar que funcione dentro del
      // lightbox (v-html) donde la especificidad CSS puede no resolverse correctamente
      slideGrid.style.display = 'grid'
      // Usar 'fr' en lugar de '%' para evitar que el grid + el gap superen el 100%
      slideGrid.style.gridTemplateColumns = imageIsRight ? '1.5fr 1fr' : '1fr 1.5fr'
      slideGrid.style.width = '100%'
      slideGrid.style.gap = 'var(--slide-gap, 2rem)'
      slideGrid.style.alignItems = 'stretch'
      
      // Contenedor de Media — ocupa toda la celda del grid (ancho y alto completo)
      const mediaContainer = document.createElement('div')
      mediaContainer.className = 'media-container'
      mediaContainer.style.width = '100%'
      mediaContainer.style.height = '100%'
      mediaContainer.style.minWidth = '0'
      mediaContainer.style.overflow = 'hidden'
      mediaContainer.style.display = 'flex'
      mediaContainer.style.alignItems = 'center'
      mediaContainer.style.justifyContent = 'center'
      
      mainImage.className = 'media-image'
      mainImage.style.width = '100%'
      mainImage.style.maxWidth = '100%'
      mainImage.style.height = '100%'
      mainImage.style.maxHeight = '100%'
      mainImage.style.borderRadius = 'var(--custom-radius-lg)'
      mainImage.style.boxShadow = 'var(--custom-shadow-lg)'
      mainImage.style.objectFit = DEFAULT_SLIDE_MEDIA.objectFit
      mainImage.style.objectPosition = DEFAULT_SLIDE_MEDIA.objectPosition
      mainImage.style.display = 'block'
      
      mediaContainer.appendChild(mainImage)

      // Contenedor de Texto
      const contentContainer = document.createElement('div')
      contentContainer.className = 'slide-content'
      contentContainer.style.width = '100%'
      contentContainer.style.height = '100%'
      contentContainer.style.minWidth = '0'
      
      elements.forEach(el => contentContainer.appendChild(el))

      // Organizar el layout dependiendo si es par o impar
      if (imageIsRight) {
        slideGrid.appendChild(contentContainer)
        slideGrid.appendChild(mediaContainer)
      } else {
        slideGrid.appendChild(mediaContainer)
        slideGrid.appendChild(contentContainer)
      }
      
    } else {
      // Sin imagen, 1 columna
      slideGrid.className = 'slide-grid no-image'
      
      const contentContainer = document.createElement('div')
      contentContainer.className = 'slide-content'
      contentContainer.style.width = '100%'
      contentContainer.style.height = '100%'
      contentContainer.style.minWidth = '0'
      
      elements.forEach(el => contentContainer.appendChild(el))
      slideGrid.appendChild(contentContainer)
    }

    slideWrapper.appendChild(slideGrid)
    
    return slideWrapper
  }

  /**
   * Procesa slides normales (sin pestañas)
   */
  const processNormal = (container: HTMLElement): HTMLElement[] => {
    const processedSlides: HTMLElement[] = []
    
    const children = Array.from(container.children) as HTMLElement[]
    let currentElements: HTMLElement[] = []
    let slideCounter = 0
    
    children.forEach(node => {
      if (node.tagName === separator) {
        // Al encontrar un separador, guardar el slide actual (si tiene al menos un bloque)
        if (currentElements.length > 0) {
          processedSlides.push(buildSmartSlide(currentElements, slideCounter))
          slideCounter++
          currentElements = []
        }
      } else {
        // Añadir elemento al slide actual
        currentElements.push(node)
      }
    })
    
    // Añadir último slide si tiene contenido
    if (currentElements.length > 0) {
      processedSlides.push(buildSmartSlide(currentElements, slideCounter))
    }

    // Reemplazar contenido del contenedor con los slides procesados
    if (processedSlides.length > 0) {
      container.innerHTML = ''
      processedSlides.forEach(slide => {
        container.appendChild(slide)
      })
    }
    
    slides.value = processedSlides
    return processedSlides
  }

  /**
   * Procesa el contenedor y convierte su contenido en slides
   */
  const processSlides = async (
    container: HTMLElement | null
  ): Promise<HTMLElement[]> => {
    if (!container) {
      console.warn('useSlideProcessor: No container provided')
      return []
    }

    if (isProcessing.value) {
      console.warn('useSlideProcessor: Already processing')
      return slides.value
    }

    isProcessing.value = true

    try {
      // Esperar a que el DOM esté completamente renderizado
      await nextTick()
      await new Promise<void>(resolve => setTimeout(resolve, delay))
      await nextTick()

      // Detectar y procesar según el tipo de contenido
      if (preserveTabs && hasTabs(container)) {
        processWithTabs(container)
      } else {
        processNormal(container)
      }

      hasProcessed.value = true
      isProcessing.value = false

      return slides.value
    } catch (error) {
      console.error('useSlideProcessor: Error processing slides', error)
      isProcessing.value = false
      return []
    }
  }

  /**
   * Reinicia el estado del procesador
   */
  const reset = (): void => {
    slides.value = []
    isProcessing.value = false
    hasProcessed.value = false
  }

  /**
   * Obtiene todos los slides del contenedor (después de procesar)
   */
  const getSlides = (container: HTMLElement | null): HTMLElement[] => {
    if (!container) return []
    return Array.from(container.querySelectorAll(`.${slideClass}`)) as HTMLElement[]
  }

  /**
   * Cuenta los slides en el contenedor
   */
  const countSlides = (container: HTMLElement | null): number => {
    return getSlides(container).length
  }

  return {
    // Estado
    slides,
    isProcessing,
    hasProcessed,
    
    // Métodos principales
    processSlides,
    reset,
    
    // Utilidades
    getSlides,
    countSlides,
    hasTabs,
    
    // Métodos de procesamiento específicos (por si se necesitan)
    processWithTabs,
    processNormal
  }
}

