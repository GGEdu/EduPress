/**
 * =============================================================================
 * useSlideProps - Definiciones de props reutilizables para slides
 * =============================================================================
 * 
 * Este archivo centraliza todas las definiciones de props para componentes
 * de slides, proporcionando valores por defecto consistentes y validadores.
 * 
 * Uso en un componente:
 * import { slideBaseProps } from '@theme/composables/useSlideProps'
 * defineProps({ ...slideBaseProps, ...customProps })
 */

import type { PropType } from 'vue'
import { DEFAULT_SLIDE_MEDIA } from '../config/slideMedia'

/**
 * Tipos de media soportados
 */
export type MediaType = 'image' | 'terminal' | 'video'

/**
 * Posiciones de imagen soportadas
 */
export type ImagePosition = 'left' | 'right' | 'none'

/**
 * Tipos de background soportados
 */
export type BackgroundType = 'transparent' | 'gradient' | string

/**
 * Props básicas para contenido
 */
export const contentProps = {
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  subtitleFontSize: {
    type: String,
    default: 'var(--custom-font-size-2xl)'
  },
  subtitleFontWeight: {
    type: String,
    default: 'var(--custom-font-weight-semibold)'
  },
  subtitleColor: {
    type: String,
    default: ''
  },
  subtitleGradient: {
    type: String,
    default: ''
  }
} as const

/**
 * Props para imagen/media
 */
export const mediaProps = {
  imageSrc: {
    type: String,
    default: ''
  },
  imageAlt: {
    type: String,
    default: 'Imagen'
  },
  image: {
    type: String as PropType<ImagePosition>,
    default: 'left' as ImagePosition,
    validator: (value: string): boolean => ['left', 'right', 'none'].includes(value)
  },
  imageWidth: {
    type: String,
    default: '100%'
  },
  imageHeight: {
    type: String,
    default: 'auto'
  },
  imageObjectFit: {
    type: String as PropType<'contain' | 'cover' | 'fill' | 'none' | 'scale-down'>,
    default: DEFAULT_SLIDE_MEDIA.objectFit,
    validator: (value: string): boolean => 
      ['contain', 'cover', 'fill', 'none', 'scale-down'].includes(value)
  },
  mediaMaxWidth: {
    type: String,
    default: () => DEFAULT_SLIDE_MEDIA.maxWidth
  },
  mediaAspectRatio: {
    type: String,
    default: () => DEFAULT_SLIDE_MEDIA.aspectRatio
  },
  mediaType: {
    type: String as PropType<MediaType>,
    default: 'image' as MediaType,
    validator: (value: string): boolean => ['image', 'terminal', 'video'].includes(value)
  }
} as const

/**
 * Props para background y colores
 */
export const backgroundProps = {
  background: {
    type: String as PropType<BackgroundType>,
    default: 'transparent' as BackgroundType
  },
  gradient: {
    type: String,
    default: '' // Si está vacío, usa var(--custom-gradient-primary)
  },
  color: {
    type: String,
    default: '' // Si está vacío, usa var(--vp-c-brand)
  },
  textColor: {
    type: String,
    default: 'inherit'
  },
  terminalBg: {
    type: String,
    default: '' // Si está vacío, usa var(--custom-bg-terminal)
  }
} as const

/**
 * Props para layout y espaciado
 */
export const layoutProps = {
  gap: {
    type: String,
    default: '' // Si está vacío, usa var(--slide-gap)
  },
  padding: {
    type: String,
    default: '' // Si está vacío, usa var(--custom-space-4)
  },
  contentPadding: {
    type: String,
    default: 'var(--custom-space-4)'
  },
  mediaPadding: {
    type: String,
    default: 'var(--custom-space-4)'
  },
  contentTextAlign: {
    type: String as PropType<'left' | 'center' | 'right' | 'justify'>,
    default: 'left' as const,
    validator: (value: string): boolean => 
      ['left', 'center', 'right', 'justify'].includes(value)
  },
  columns: {
    type: String,
    default: '' // Si está vacío, usa var(--custom-columns-two)
  }
} as const

/**
 * Props para estilos de imagen
 */
export const imageStyleProps = {
  imageBorderRadius: {
    type: String,
    default: '' // Si está vacío, usa var(--custom-radius-xl)
  },
  imageShadow: {
    type: String,
    default: '' // Si está vacío, usa var(--custom-shadow-image)
  },
  imageBorder: {
    type: String,
    default: 'none'
  }
} as const

/**
 * Props para estilos del contenedor
 */
export const containerStyleProps = {
  borderRadius: {
    type: String,
    default: '0'
  },
  minHeight: {
    type: String,
    default: '' // Ej: '80vh', 'auto'
  },
  maxWidth: {
    type: String,
    default: '100%'
  }
} as const

/**
 * Todas las props de SlideBase combinadas
 */
export const slideBaseProps = {
  ...contentProps,
  ...mediaProps,
  ...backgroundProps,
  ...layoutProps,
  ...imageStyleProps,
  ...containerStyleProps
} as const

/**
 * Props simplificadas para slides básicos (sin tantas opciones)
 */
export const slideSimpleProps = {
  ...contentProps,
  imageSrc: mediaProps.imageSrc,
  imageAlt: mediaProps.imageAlt,
  image: mediaProps.image,
  background: backgroundProps.background,
  gradient: backgroundProps.gradient
} as const

/**
 * Helper: Obtiene el valor de una prop o su valor por defecto desde tokens CSS
 */
export function getValueOrToken(value: string, tokenVar: string): string {
  return value || `var(${tokenVar})`
}

/**
 * Helper: Valida que un color sea válido (hex, rgb, rgba, o variable CSS)
 */
export function isValidColor(color: string): boolean {
  if (!color) return true // Vacío es válido (usará por defecto)
  
  // Hex color
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) return true
  
  // RGB/RGBA
  if (/^rgba?\(/.test(color)) return true
  
  // CSS variable
  if (/^var\(--/.test(color)) return true
  
  // Nombres de color CSS
  const cssColors = ['transparent', 'inherit', 'currentColor']
  if (cssColors.includes(color)) return true
  
  return false
}

/**
 * Helper: Valida que una medida sea válida (px, rem, em, %, vh, vw, o variable CSS)
 */
export function isValidSize(size: string): boolean {
  if (!size) return true // Vacío es válido
  
  // Unidades CSS
  if (/^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax)$/.test(size)) return true
  
  // CSS variable
  if (/^var\(--/.test(size)) return true
  
  // Calc
  if (/^calc\(/.test(size)) return true
  
  return false
}

/**
 * Valores por defecto consolidados (útil para documentación)
 */
export const defaultValues = {
  // Contenido
  title: '',
  subtitle: '',
  subtitleFontSize: 'var(--custom-font-size-2xl)',
  subtitleFontWeight: 'var(--custom-font-weight-semibold)',
  subtitleColor: '',
  subtitleGradient: '',
  
  // Media
  imageSrc: '',
  imageAlt: 'Imagen',
  image: 'left' as ImagePosition,
  imageWidth: '40%',
  imageHeight: 'auto',
  imageObjectFit: DEFAULT_SLIDE_MEDIA.objectFit,
  mediaMaxWidth: DEFAULT_SLIDE_MEDIA.maxWidth,
  mediaAspectRatio: DEFAULT_SLIDE_MEDIA.aspectRatio,
  mediaType: 'image' as MediaType,
  
  // Background
  background: 'transparent' as BackgroundType,
  gradient: 'var(--custom-gradient-primary)',
  color: 'var(--vp-c-brand)',
  textColor: 'inherit',
  terminalBg: 'var(--custom-bg-terminal)',
  
  // Layout
  gap: 'var(--slide-gap)',
  padding: 'var(--custom-space-4)',
  contentPadding: 'var(--custom-space-4)',
  mediaPadding: 'var(--custom-space-4)',
  contentTextAlign: 'left' as const,
  columns: 'var(--custom-columns-two)',
  
  // Estilos de imagen
  imageBorderRadius: 'var(--custom-radius-xl)',
  imageShadow: 'var(--custom-shadow-image)',
  imageBorder: 'none',
  
  // Contenedor
  borderRadius: '0',
  minHeight: '',
  maxWidth: '100%'
} as const

/**
 * Tipo inferido de las props de SlideBase
 */
export type SlideBaseProps = {
  [K in keyof typeof slideBaseProps]: typeof slideBaseProps[K] extends { type: infer T }
    ? T extends PropType<infer U>
      ? U
      : any
    : any
}

