<script setup lang="ts">
/**
 * PrintWatermark.vue
 *
 * Marca de agua con el logo del sitio que aparece ÚNICAMENTE al imprimir o
 * "Guardar como PDF" desde el navegador. En pantalla está oculta (display:none).
 *
 * Se usa un <img> real (no background-image) para que se imprima aunque el
 * usuario no active "Gráficos de fondo" en el diálogo de impresión.
 * El elemento es position:fixed, por lo que el navegador lo repite en cada
 * página impresa.
 *
 * Configurable vía themeConfig.printWatermark = { logo, opacity } (config.mts).
 */
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { theme } = useData()
const wm = computed(() => (theme.value.printWatermark as { logo?: string; opacity?: number } | undefined))
const logoSrc = computed(() => withBase(wm.value?.logo ?? '/img/logo.png'))
const opacity = computed(() => wm.value?.opacity ?? 0.1)
</script>

<template>
  <div class="print-watermark" aria-hidden="true">
    <img :src="logoSrc" alt="" class="print-watermark__logo" :style="{ opacity }" />
  </div>
</template>

<style scoped>
/* Oculta en pantalla: solo existe para la impresión. */
.print-watermark {
  display: none;
}

@media print {
  .print-watermark {
    display: flex;
    position: fixed;
    inset: 0;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    pointer-events: none;
  }

  .print-watermark__logo {
    width: 60%;
    max-width: 480px;
    height: auto;
  }
}
</style>
