<script setup lang="ts">
/**
 * FooterLogo.vue
 *
 * Inyectado en el slot 'layout-bottom' del Layout de VitePress.
 * Muestra el logo del autor/docente en el footer con adaptación reactiva
 * al modo light/dark, visible en todas las páginas (incluido móvil).
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
    footer: { src: string; height: string }
  }
}
</script>

<template>
  <div class="footer-logo-wrap">
    <ThemedImage
      :src="b.logos.footer.src"
      :mode="b.mode"
      :darkSuffix="b.darkSuffix"
      :height="b.logos.footer.height"
      alt="Autor"
      imgStyle="display:block;margin:0 auto;"
    />
  </div>
</template>

<style scoped>
.footer-logo-wrap {
  text-align: center;
  padding: 24px 24px 8px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
