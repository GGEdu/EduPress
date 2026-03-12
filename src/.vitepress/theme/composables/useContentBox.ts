/**
 * useContentBox - Composable para componentes de contenido (boxes)
 * 
 * Proporciona lógica y estilos comunes para InfoBox, NoteBox, AccentBox, etc.
 * Soporta variantes, tamaños, iconos y temas
 * 
 * FASE 6: Mejora de Componentes Content
 */

import { computed, type ComputedRef, type CSSProperties, type PropType } from 'vue'

/**
 * Variantes de color disponibles para content boxes
 */
export type ContentBoxVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'note'
  | 'tip'
  | 'important'

/**
 * Tamaños disponibles para content boxes
 */
export type ContentBoxSize = 'sm' | 'md' | 'lg'

/**
 * Variantes de estilo para Quote
 */
export type QuoteVariant = 'default' | 'fancy' | 'minimal' | 'card'

/**
 * Configuración de colores para cada variante
 */
interface VariantColors {
  bg: string
  border: string
  text: string
  title: string
}

/**
 * Configuración de estilos para cada tamaño
 */
interface SizeStyles {
  padding: string
  fontSize: string
  titleSize: string
  borderRadius: string
}

/**
 * Props comunes para todos los content boxes
 */
export const contentBoxProps = {
  /** Variante de color del box */
  variant: {
    type: String as PropType<ContentBoxVariant>,
    default: 'default' as ContentBoxVariant,
    validator: (value: string): boolean => [
      'default',
      'primary',
      'success',
      'warning',
      'danger',
      'info',
      'note',
      'tip',
      'important'
    ].includes(value)
  },

  /** Tamaño del box */
  size: {
    type: String as PropType<ContentBoxSize>,
    default: 'md' as ContentBoxSize,
    validator: (value: string): boolean => ['sm', 'md', 'lg'].includes(value)
  },

  /** Título del box */
  title: {
    type: String,
    default: ''
  },

  /** Nombre del icono (si se usa sistema de iconos) */
  icon: {
    type: String,
    default: ''
  },

  /** Si debe mostrar borde */
  bordered: {
    type: Boolean,
    default: true
  },

  /** Si debe tener sombra */
  shadow: {
    type: Boolean,
    default: false
  },

  /** Si debe ser colapsable */
  collapsible: {
    type: Boolean,
    default: false
  },

  /** Estado inicial si es colapsable */
  defaultCollapsed: {
    type: Boolean,
    default: false
  }
} as const

/**
 * Props para useContentBox
 */
export interface ContentBoxProps {
  variant?: ContentBoxVariant
  size?: ContentBoxSize
  title?: string
  icon?: string
  bordered?: boolean
  shadow?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
}

/**
 * Retorno de useContentBox
 */
export interface UseContentBoxReturn {
  containerStyle: ComputedRef<CSSProperties>
  titleStyle: ComputedRef<CSSProperties>
  containerClasses: ComputedRef<Record<string, boolean>>
  colors: ComputedRef<VariantColors>
  sizing: ComputedRef<SizeStyles>
  defaultIcon: ComputedRef<string>
}

/**
 * Hook principal para content boxes
 */
export function useContentBox(props: ContentBoxProps): UseContentBoxReturn {
  // Mapeo de variantes a colores
  const variantColors: Record<ContentBoxVariant, VariantColors> = {
    default: {
      bg: 'var(--vp-c-default-soft)',
      border: 'var(--vp-c-brand-1)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-brand-1)'
    },
    primary: {
      bg: 'var(--vp-c-brand-soft)',
      border: 'var(--vp-c-brand)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-brand)'
    },
    success: {
      bg: 'var(--custom-gradient-tip)',
      border: 'var(--vp-c-tip)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-tip)'
    },
    warning: {
      bg: 'var(--custom-gradient-warning)',
      border: 'var(--vp-c-warning)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-warning)'
    },
    danger: {
      bg: 'var(--custom-gradient-important)',
      border: 'var(--vp-c-important)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-important)'
    },
    info: {
      bg: 'var(--custom-gradient-info)',
      border: 'var(--vp-c-note)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-note)'
    },
    note: {
      bg: 'var(--custom-gradient-note)',
      border: 'var(--vp-c-note)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-note)'
    },
    tip: {
      bg: 'var(--custom-gradient-tip)',
      border: 'var(--vp-c-tip)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-tip)'
    },
    important: {
      bg: 'var(--custom-gradient-important)',
      border: 'var(--vp-c-important)',
      text: 'var(--vp-c-text-1)',
      title: 'var(--vp-c-important)'
    }
  }

  // Mapeo de tamaños
  const sizeStyles: Record<ContentBoxSize, SizeStyles> = {
    sm: {
      padding: 'var(--custom-space-3) var(--custom-space-3)',
      fontSize: 'var(--custom-font-size-sm)',
      titleSize: 'var(--custom-font-size-base)',
      borderRadius: 'var(--custom-radius-md)'
    },
    md: {
      padding: 'var(--box-padding)',
      fontSize: 'var(--custom-font-size-base)',
      titleSize: 'var(--custom-font-size-lg)',
      borderRadius: 'var(--box-border-radius)'
    },
    lg: {
      padding: 'var(--custom-space-3) var(--custom-space-6)',
      fontSize: 'var(--custom-font-size-base)',
      titleSize: 'var(--custom-font-size-xl)',
      borderRadius: 'var(--custom-radius-xl)'
    }
  }

  // Obtener colores de la variante actual
  const colors = computed<VariantColors>(() =>
    variantColors[props.variant || 'default'] || variantColors.default
  )

  // Obtener estilos del tamaño actual
  const sizing = computed<SizeStyles>(() =>
    sizeStyles[props.size || 'md'] || sizeStyles.md
  )

  // Estilos del contenedor
  const containerStyle = computed<CSSProperties>(() => ({
    backgroundColor: colors.value.bg,
    borderLeftColor: colors.value.border,
    borderLeftWidth: props.bordered ? 'var(--box-border-width)' : '0',
    borderLeftStyle: 'solid',
    padding: sizing.value.padding,
    borderRadius: sizing.value.borderRadius,
    margin: 'var(--box-margin)',
    fontSize: sizing.value.fontSize,
    boxShadow: props.shadow ? 'var(--custom-shadow-md)' : 'none',
    transition: 'var(--custom-transition-base)'
  }))

  // Estilos del título
  const titleStyle = computed<CSSProperties>(() => ({
    color: colors.value.title,
    fontSize: sizing.value.titleSize,
    fontWeight: 'var(--custom-font-weight-semibold)',
    marginBottom: 'var(--custom-space-3)'
  }))

  // Clases dinámicas
  const containerClasses = computed<Record<string, boolean>>(() => ({
    [`box-variant-${props.variant || 'default'}`]: true,
    [`box-size-${props.size || 'md'}`]: true,
    'box-bordered': props.bordered || false,
    'box-shadow': props.shadow || false,
    'box-collapsible': props.collapsible || false
  }))

  // Emoji/icono por defecto según variante
  const defaultIcon = computed<string>(() => {
    const icons: Partial<Record<ContentBoxVariant, string>> = {
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ',
      note: '📝',
      tip: '💡',
      important: '❗'
    }
    return props.icon || icons[props.variant as ContentBoxVariant] || ''
  })

  return {
    containerStyle,
    titleStyle,
    containerClasses,
    colors,
    sizing,
    defaultIcon
  }
}

/**
 * Props específicas para Quote
 */
export const quoteProps = {
  /** Autor de la cita */
  author: {
    type: String,
    default: ''
  },

  /** Fuente de la cita */
  source: {
    type: String,
    default: ''
  },

  /** Si debe mostrar comillas visuales */
  showQuotes: {
    type: Boolean,
    default: false
  },

  /** Variante de estilo */
  variant: {
    type: String as PropType<QuoteVariant>,
    default: 'default' as QuoteVariant,
    validator: (value: string): boolean =>
      ['default', 'fancy', 'minimal', 'card'].includes(value)
  }
} as const

/**
 * Props para useQuote
 */
export interface QuoteProps {
  author?: string
  source?: string
  showQuotes?: boolean
  variant?: QuoteVariant
}

/**
 * Retorno de useQuote
 */
export interface UseQuoteReturn {
  quoteStyle: ComputedRef<CSSProperties>
  hasAttribution: ComputedRef<boolean>
}

/**
 * Hook para Quote component
 */
export function useQuote(props: QuoteProps): UseQuoteReturn {
  const variantStyles: Record<QuoteVariant, CSSProperties> = {
    default: {
      borderLeft: 'var(--custom-border-width-thick) solid var(--vp-c-brand)',
      paddingLeft: 'var(--custom-space-6)',
      fontStyle: 'italic'
    },
    fancy: {
      background: 'var(--custom-gradient-subtle)',
      padding: 'var(--custom-space-3) var(--custom-space-6)',
      borderLeft: 'var(--custom-border-width-thick) solid var(--vp-c-brand)',
      borderRadius: 'var(--custom-radius-lg)',
      fontStyle: 'italic'
    },
    minimal: {
      paddingLeft: 'var(--custom-space-6)',
      fontStyle: 'normal',
      color: 'var(--vp-c-text-2)'
    },
    card: {
      background: 'var(--vp-c-bg-soft)',
      padding: 'var(--custom-space-3) var(--custom-space-6)',
      borderRadius: 'var(--custom-radius-xl)',
      boxShadow: 'var(--custom-shadow-md)',
      fontStyle: 'italic'
    }
  }

  const quoteStyle = computed<CSSProperties>(() => ({
    ...variantStyles[props.variant || 'default'],
    margin: 'var(--box-margin)',
    transition: 'var(--custom-transition-base)'
  }))

  const hasAttribution = computed<boolean>(() =>
    Boolean(props.author || props.source)
  )

  return {
    quoteStyle,
    hasAttribution
  }
}

