/**
 * =============================================================================
 * useSlideLayout - Composable para gestionar el layout de slides
 * =============================================================================
 * 
 * Este composable maneja la lógica del sistema de grid y la disposición
 * de los elementos dentro del slide (columnas, gap, alineación, etc.)
 */

import { computed, type ComputedRef, type CSSProperties } from 'vue'
import type { SlideBaseProps } from './useSlideProps'

/**
 * Interfaz para configuración del grid
 */
export interface GridStyle extends CSSProperties {
  display: string
  gridTemplateColumns: string
  gap: string
  alignItems?: string
  width: string
}

/**
 * Interfaz para áreas del grid
 */
export interface GridAreas {
  gridTemplateAreas: string
}

/**
 * Interfaz para el retorno de useSlideLayout
 */
export interface UseSlideLayoutReturn {
  hasMedia: ComputedRef<boolean>
  isMediaRight: ComputedRef<boolean>
  isMediaLeft: ComputedRef<boolean>
  mediaWidth: ComputedRef<string>
  gridStyle: ComputedRef<GridStyle>
  computedColumns: ComputedRef<string>
  gridAreas: ComputedRef<GridAreas>
  getResponsiveGrid: (breakpoint?: number) => ComputedRef<GridStyle>
}

/**
 * Hook para gestionar el layout de slides
 */
export function useSlideLayout(props: Partial<SlideBaseProps>): UseSlideLayoutReturn {
  /**
   * Determina si el slide tiene una imagen/media
   */
  const hasMedia = computed<boolean>(() => {
    return Boolean(props.imageSrc && props.image !== 'none')
  })

  /**
   * Determina si la imagen está a la derecha
   */
  const isMediaRight = computed<boolean>(() => {
    return props.image === 'right'
  })

  /**
   * Determina si la imagen está a la izquierda
   */
  const isMediaLeft = computed<boolean>(() => {
    return props.image === 'left'
  })

  /**
   * Determina el ancho de la imagen según su posición
   * Por defecto: 40% para imagen, 60% para contenido
   */
  const mediaWidth = computed<string>(() => {
    return props.imageWidth || '40%'
  })

  /**
   * Determina la configuración del grid principal
   */
  const gridStyle = computed<GridStyle>(() => {
    // Si no hay imagen, una sola columna
    if (!hasMedia.value) {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '0',
        width: '100%'
      }
    }

    // Con imagen: dos columnas 40% imagen / 60% contenido (por defecto)
    // Usar la prop columns o proporciones 40/60
    const columns = props.columns || '40% 60%'

    return {
      display: 'grid',
      gridTemplateColumns: columns,
      gap: props.gap || 'var(--slide-gap)',
      alignItems: 'center',
      width: '100%'
    }
  })

  /**
   * Calcula las columnas del grid basándose en la posición de la media
   * y el ancho especificado (por defecto 40% imagen / 60% contenido)
   */
  const computedColumns = computed<string>(() => {
    if (!hasMedia.value) {
      return '1fr'
    }

    const mediaWidthValue = props.imageWidth || '40%'
    const contentWidthValue = '60%' // Proporción fija 40/60

    // Si la imagen está a la derecha: contenido | imagen
    if (isMediaRight.value) {
      return `${contentWidthValue} ${mediaWidthValue}`
    }

    // Por defecto (izquierda): imagen | contenido
    return `${mediaWidthValue} ${contentWidthValue}`
  })

  /**
   * Determina las áreas del grid (grid-template-areas)
   * Útil para layouts más complejos en el futuro
   */
  const gridAreas = computed<GridAreas>(() => {
    if (!hasMedia.value) {
      return {
        gridTemplateAreas: '"content"'
      }
    }

    if (isMediaRight.value) {
      return {
        gridTemplateAreas: '"content media"'
      }
    }

    return {
      gridTemplateAreas: '"media content"'
    }
  })

  /**
   * Configuración responsive del grid
   * @param breakpoint - Punto de quiebre en px
   */
  const getResponsiveGrid = (breakpoint = 768): ComputedRef<GridStyle> => {
    return computed<GridStyle>(() => {
      if (typeof window === 'undefined') return gridStyle.value

      const isMobile = window.innerWidth <= breakpoint

      if (isMobile && hasMedia.value) {
        // En móvil, apilar verticalmente
        return {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--custom-space-6)',
          width: '100%'
        }
      }

      return gridStyle.value
    })
  }

  return {
    // Estados
    hasMedia,
    isMediaRight,
    isMediaLeft,
    mediaWidth,

    // Configuración de grid
    gridStyle,
    computedColumns,
    gridAreas,

    // Helpers
    getResponsiveGrid
  }
}

