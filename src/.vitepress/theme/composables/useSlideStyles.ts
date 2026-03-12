/**
 * =============================================================================
 * useSlideStyles - Composable para gestionar estilos de slides
 * =============================================================================
 * 
 * Este composable centraliza toda la lógica de cálculo de estilos para los
 * componentes de slides. Reemplaza los múltiples computed properties que
 * estaban dispersos en SlideBase.vue
 */

import { computed, type ComputedRef, type CSSProperties } from 'vue'
import type { SlideBaseProps } from './useSlideProps'

/**
 * Interfaz para el retorno de useSlideStyles
 */
export interface UseSlideStylesReturn {
  containerBackground: ComputedRef<string>
  hasGradient: ComputedRef<boolean>
  containerStyle: ComputedRef<CSSProperties>
  mediaStyle: ComputedRef<CSSProperties>
  mediaContainerStyle: ComputedRef<CSSProperties>
  contentContainerStyle: ComputedRef<CSSProperties>
  subtitleStyle: ComputedRef<CSSProperties>
}

/**
 * Hook para gestionar estilos de slides
 */
export function useSlideStyles(props: Partial<SlideBaseProps>): UseSlideStylesReturn {
  /**
   * Determina el background del contenedor principal
   * NOTA: Gradientes deshabilitados para diapositivas (Fase 6)
   */
  const containerBackground = computed<string>(() => {
    // Ya no usamos gradientes en diapositivas
    return props.background && props.background !== 'gradient' 
      ? props.background 
      : 'transparent'
  })

  /**
   * Verifica si el slide tiene un gradiente como fondo
   * NOTA: Siempre retorna false para diapositivas (Fase 6)
   */
  const hasGradient = computed<boolean>(() => false)

  /**
   * Estilos del contenedor principal del slide
   */
  const containerStyle = computed<CSSProperties>(() => ({
    background: containerBackground.value,
    padding: props.padding || 'var(--custom-space-4)',
    borderRadius: props.borderRadius || '0',
    color: props.textColor || 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'var(--custom-transition-medium)'
  }))

  /**
   * Estilos de la imagen/media
   */
  const mediaStyle = computed<CSSProperties>(() => {
    const baseStyle: CSSProperties = {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: props.imageBorderRadius || 'var(--custom-radius-xl)',
      transition: 'var(--custom-transition-medium)'
    }

    // Para tipo terminal, border más sutil
    if (props.mediaType === 'terminal') {
      return {
        ...baseStyle,
        borderRadius: 'var(--custom-radius-lg)'
      }
    }

    // Para imagen normal, añadir sombra y borde
    return {
      ...baseStyle,
      boxShadow: props.imageShadow || 'var(--custom-shadow-image)',
      border: props.imageBorder !== 'none' ? props.imageBorder : undefined
    }
  })

  /**
   * Estilos del contenedor de media (imagen o terminal)
   */
  const mediaContainerStyle = computed<CSSProperties>(() => {
    const baseStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      order: props.image === 'right' ? 2 : 1,
      transition: 'var(--custom-transition-medium)'
    }

    // Si es tipo terminal, añadir estilos específicos
    if (props.mediaType === 'terminal') {
      return {
        ...baseStyle,
        background: props.terminalBg || 'var(--custom-bg-terminal)',
        borderRadius: props.imageBorderRadius || 'var(--custom-radius-xl)',
        padding: 'var(--custom-space-4)'
      }
    }

    return baseStyle
  })

  /**
   * Estilos del contenedor de contenido
   */
  const contentContainerStyle = computed<CSSProperties>(() => ({
    order: props.image === 'right' ? 1 : 2,
    width: '100%'
  }))

  /**
   * Estilos del subtítulo
   */
  const subtitleStyle = computed<CSSProperties>(() => {
    // Si es tipo terminal, aplicar gradiente al texto
    if (props.mediaType === 'terminal') {
      return {
        fontSize: 'var(--custom-font-size-xl)',
        marginBottom: 'var(--custom-space-4)',
        background: props.gradient || 'var(--custom-gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'var(--custom-font-weight-semibold)'
      }
    }

    // Por defecto, usar el color especificado
    return {
      fontSize: 'var(--custom-font-size-xl)',
      marginBottom: 'var(--custom-space-4)',
      color: props.color || 'var(--vp-c-brand)',
      fontWeight: 'var(--custom-font-weight-semibold)'
    }
  })

  return {
    // Estados computados
    containerBackground,
    hasGradient,
    
    // Estilos
    containerStyle,
    mediaStyle,
    mediaContainerStyle,
    contentContainerStyle,
    subtitleStyle
  }
}

