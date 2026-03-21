<script setup lang="ts">
/**
 * SidebarLogos.vue
 *
 * Inyectado en el slot 'sidebar-nav-after' del Layout de VitePress.
 * Muestra los logos institucionales (autor, GVA, centro) en la parte inferior
 * de la barra lateral, con adaptación reactiva al modo light/dark.
 *
 * Los datos se leen de themeConfig.logoBranding (configurado en config.mts).
 */
import { useData } from 'vitepress'
import ThemedImage from './ThemedImage.vue'

const { theme } = useData()
const b = theme.value.logoBranding as {
  mode: 'same' | 'invert' | 'separate'
  darkSuffix: string
  logos: {
    autor:  { src: string; height: string }
    gva:    { src: string; height: string }
    centro: { src: string; height: string }
  }
}
</script>

<template>
  <div class="sidebar-logos">
    <ThemedImage
      :src="b.logos.autor.src"
      :mode="b.mode"
      :darkSuffix="b.darkSuffix"
      :height="b.logos.autor.height"
      alt="Autor"
      imgClass="logo-anim"
      imgStyle="display:block;margin:0 auto;"
    />
    <ThemedImage
      :src="b.logos.gva.src"
      :mode="b.mode"
      :darkSuffix="b.darkSuffix"
      :height="b.logos.gva.height"
      alt="GVA"
      imgClass="logo-anim"
      imgStyle="display:block;margin:0 auto;margin-top:12px;"
    />
    <ThemedImage
      :src="b.logos.centro.src"
      :mode="b.mode"
      :darkSuffix="b.darkSuffix"
      :height="b.logos.centro.height"
      alt="Centro"
      imgClass="logo-anim"
      imgStyle="display:block;margin:0 auto;margin-top:12px;"
    />
  </div>
</template>

<style scoped>
.sidebar-logos {
  padding: 16px 24px 32px;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 8px;
}
</style>
