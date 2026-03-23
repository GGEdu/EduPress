<script setup lang="ts">
/**
 * ThemedImage.vue
 *
 * Imagen reactiva que adapta su src o apariencia según el modo light/dark
 * y el LogoMode configurado en branding.ts.
 *
 * Props:
 *   src        — Ruta del logo en modo claro (siempre requerida)
 *   mode       — 'same' | 'invert' | 'separate'
 *   darkSuffix — sufijo para derivar la versión oscura (por defecto '-dark')
 *   alt        — texto alternativo
 *   height     — altura CSS, p.ej. '75px'
 *   imgStyle   — estilos CSS extra (cadena)
 *   imgClass   — clases CSS extra
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import { getDarkLogoPath } from '../../config/logos'
import type { LogoMode } from '../../config/logos'

const props = withDefaults(defineProps<{
  src: string
  mode: LogoMode
  darkSuffix?: string
  alt?: string
  height?: string
  imgStyle?: string
  imgClass?: string
}>(), {
  alt: '',
  darkSuffix: '-dark',
})

const { isDark } = useData()

/** Src efectivo: cambia en modo oscuro solo cuando mode === 'separate' */
const effectiveSrc = computed(() => {
  if (props.mode === 'separate' && isDark.value) {
    return getDarkLogoPath(props.src, props.darkSuffix)
  }
  return props.src
})

/** Estilo final: combina height, invert filter y estilos extra */
const computedStyle = computed(() => {
  const parts: string[] = []
  if (props.height)                              parts.push(`height:${props.height}`)
  if (props.mode === 'invert' && isDark.value)   parts.push('filter:brightness(0) invert(1)')
  if (props.imgStyle)                            parts.push(props.imgStyle)
  return parts.join(';')
})
</script>

<template>
  <img
    :src="effectiveSrc"
    :alt="alt"
    :style="computedStyle"
    :class="imgClass"
  />
</template>
