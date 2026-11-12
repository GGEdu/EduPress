<script setup lang="ts">
/**
 * SidebarLogos.vue
 *
 * Inyectado en el slot 'sidebar-nav-after' del Layout de VitePress.
 * Muestra los logos institucionales en la parte inferior de la barra lateral,
 * con adaptación reactiva al modo light/dark.
 *
 * Los datos se leen de themeConfig.logoBranding (configurado en config.mts).
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
import ThemedImage from './ThemedImage.vue'

interface Logo { src: string; height: string }
interface LogoBranding {
  mode: 'same' | 'invert' | 'separate'
  darkSuffix: string
  logos: Partial<Record<string, Logo>>
}

// Orden de aparición en el sidebar. Añadir una clave aquí basta para que se
// pinte, si config.mts la declara.
const ORDEN: { clave: string; alt: string }[] = [
  { clave: 'autor',  alt: 'Autor' },
  { clave: 'gva',    alt: 'GVA' },
  { clave: 'centro', alt: 'Centro' },
]

const { theme } = useData()
const branding = computed(() => theme.value.logoBranding as LogoBranding | undefined)
const mode = computed(() => branding.value?.mode ?? 'same')
const darkSuffix = computed(() => branding.value?.darkSuffix ?? '-dark')

const logos = computed(() => {
  const declarados = branding.value?.logos
  if (!declarados) return []
  return ORDEN
    .map(o => ({ ...o, logo: declarados[o.clave] }))
    .filter((o): o is { clave: string; alt: string; logo: Logo } => !!o.logo?.src)
})
</script>

<template>
  <!-- Sin logos declarados no se pinta el bloque, para no dejar suelto el borde superior. -->
  <div v-if="logos.length" class="sidebar-logos">
    <ThemedImage
      v-for="(item, i) in logos"
      :key="item.clave"
      :src="item.logo.src"
      :mode="mode"
      :darkSuffix="darkSuffix"
      :height="item.logo.height"
      :alt="item.alt"
      imgClass="logo-anim"
      :imgStyle="i === 0
        ? 'display:block;margin:0 auto;'
        : 'display:block;margin:0 auto;margin-top:var(--custom-space-3);'"
    />
  </div>
</template>

<style scoped>
.sidebar-logos {
  padding: var(--custom-space-4) var(--custom-space-6) var(--custom-space-8);
  border-top: 1px solid var(--vp-c-divider);
  margin-top: var(--custom-space-2);
}
</style>
