/**
 * =============================================================================
 * Composables Index - Punto de entrada centralizado
 * =============================================================================
 * 
 * Este archivo exporta todos los composables del tema para facilitar
 * las importaciones en los componentes.
 * 
 * Uso:
 * import { useSlideStyles, useSlideLayout } from '@theme/composables'
 */

// Estilos
export { useSlideStyles, type UseSlideStylesReturn } from './useSlideStyles'

// Layout
export { useSlideLayout, type UseSlideLayoutReturn, type GridStyle, type GridAreas } from './useSlideLayout'

// Navegación
export { 
  useSlideNavigation, 
  type UseSlideNavigationOptions, 
  type UseSlideNavigationReturn 
} from './useSlideNavigation'

// Procesamiento de slides
export { 
  useSlideProcessor, 
  type UseSlideProcessorOptions, 
  type UseSlideProcessorReturn 
} from './useSlideProcessor'

// Interacciones
export { 
  useSlideInteractions, 
  type UseSlideInteractionsOptions,
  type UseSlideInteractionsReturn,
  type OnOpenCallback
} from './useSlideInteractions'

// Mobile collapse (NUEVO - Responsive)
export {
  useMobileSlideCollapse,
  type UseMobileSlideCollapseOptions,
  type UseMobileSlideCollapseReturn
} from './useMobileSlideCollapse'

// Content boxes (FASE 6)
export { 
  useContentBox, 
  useQuote,
  contentBoxProps,
  quoteProps,
  type ContentBoxVariant,
  type ContentBoxSize,
  type QuoteVariant,
  type ContentBoxProps,
  type UseContentBoxReturn,
  type QuoteProps,
  type UseQuoteReturn
} from './useContentBox'

// Props y utilidades
export {
  // Props agrupadas
  contentProps,
  mediaProps,
  backgroundProps,
  layoutProps,
  imageStyleProps,
  containerStyleProps,
  slideBaseProps,
  slideSimpleProps,
  
  // Tipos
  type MediaType,
  type ImagePosition,
  type BackgroundType,
  type SlideBaseProps,
  
  // Helpers
  getValueOrToken,
  isValidColor,
  isValidSize,
  
  // Valores por defecto
  defaultValues
} from './useSlideProps'

