<script setup lang="ts">

/**
 * Override de PluginTabsTab — usa v-show en lugar de v-if para que todos los
 * paneles estén en el DOM (display:none los inactivos). Así SlideLightbox
 * puede capturar innerHTML con todos los paneles y reconectar los clicks.
 *
 * Escrito en JS puro para evitar problemas de compilación TypeScript en Vite.
 */
import { inject, onBeforeMount, onUnmounted, ref } from 'vue'

defineProps(['label'])

// La injection key real es el string 'vitepress:tabSingleState' (tipado como
// symbol en TypeScript pero su valor en runtime es el string).
const state = inject('vitepress:tabSingleState')
if (!state) throw new Error('[vitepress-plugin-tabs] TabsSingleState should be injected')
const { uid, selected } = state

// Replicar useIsPrint
const mm = typeof window !== 'undefined' ? window.matchMedia('print') : undefined
const isPrint = ref(mm?.matches ?? false)
const listener = () => { isPrint.value = mm?.matches ?? false }
onBeforeMount(() => mm?.addEventListener('change', listener))
onUnmounted(() => mm?.removeEventListener('change', listener))

</script>

<template>

  <div
    v-show="selected === label || isPrint"
    :id="`panel-${label}-${uid}`"
    class="plugin-tabs--content"
    role="tabpanel"
    tabindex="0"
    :aria-labelledby="`tab-${label}-${uid}`"
    :data-tab-label="label"
    :data-is-print="isPrint"
  >
    <slot />
  </div>

</template>

<style scoped>

.plugin-tabs--content {
  padding: 16px;
}

.plugin-tabs--content[data-is-print='true']:not(:last-child) {
  border-bottom: 2px solid var(--vp-plugin-tabs-tab-divider);
}

.plugin-tabs--content > :first-child:first-child {
  margin-top: 0;
}

.plugin-tabs--content > :last-child:last-child {
  margin-bottom: 0;
}

.plugin-tabs--content > :deep(div[class*='language-']) {
  border-radius: 8px;
  margin: 16px 0px;
}

:root:not(.dark) .plugin-tabs--content :deep(div[class*='language-']) {
  background-color: var(--vp-c-bg);
}

</style>
