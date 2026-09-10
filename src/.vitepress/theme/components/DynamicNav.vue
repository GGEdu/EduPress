<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { useUnitNav } from '../composables/useUnitNav'

const navGroups = useUnitNav()
const openIndex = ref<number | null>(null)
</script>

<template>
  <div
    v-if="navGroups.length"
    class="dynamic-nav-groups"
  >
    <div
      v-for="(navGroup, index) in navGroups"
      :key="`${navGroup.text}-${index}`"
      class="dynamic-nav-group"
      @mouseenter="openIndex = index"
      @mouseleave="openIndex = null"
      @focusin="openIndex = index"
      @focusout="openIndex = null"
    >
      <button class="button" type="button" :aria-expanded="openIndex === index" :aria-haspopup="true">
        <span class="button-text">{{ navGroup.text }}</span>
        <span class="vpi-chevron-right button-arrow" />
      </button>

      <div class="flyout" :class="{ open: openIndex === index }">
        <a
          v-for="item in navGroup.items"
          :key="item.link"
          :href="withBase(item.link)"
          class="flyout-item"
        >
          {{ item.text }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dynamic-nav-groups {
  display: flex;
  align-items: center;
  gap: 2px;
}

.dynamic-nav-group {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--vp-nav-height);
}

.button {
  display: flex;
  align-items: center;
  gap: var(--custom-space-1);
  padding: 0 var(--custom-space-2);
  height: 100%;
  font-size: var(--custom-font-size-sm);
  font-weight: var(--custom-font-weight-medium);
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: var(--custom-transition-color);
}

.button:hover {
  color: var(--vp-c-brand-1);
}

.button-arrow {
  display: inline-block;
  width: 14px;
  height: 14px;
  transform: rotate(90deg);
  opacity: 0.6;
  flex-shrink: 0;
}

.flyout {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 210px;
  padding: var(--custom-space-2);
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--custom-radius-lg);
  box-shadow: var(--vp-shadow-3);
  opacity: 0;
  /* `visibility: hidden` es lo que de verdad desactiva el flyout cerrado.
     `pointer-events: none` NO basta: VitePress declara
        .VPNavBar .container * { pointer-events: auto }
     y ese `*` alcanza a los .flyout-item, devolviéndoles el puntero aunque el
     contenedor lo tenga desactivado. Sin `visibility`, el flyout invisible deja
     un rectángulo de enlaces activos sobre el navbar y el contenido: al bajar
     hacia el menú de idiomas el ratón entraba en él, disparaba el mouseenter
     del grupo y abría Unidades cerrando Idiomas. */
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-4px);
  /* La visibilidad conmuta de golpe, no se interpola: inmediata al abrir y
     retrasada al cerrar, para no cortar el fundido de salida. */
  transition:
    opacity    var(--custom-duration-fast) var(--custom-ease-out),
    transform  var(--custom-duration-fast) var(--custom-ease-out),
    visibility 0s linear var(--custom-duration-fast);
  z-index: var(--custom-z-dropdown);
}

.flyout.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
  transition:
    opacity    var(--custom-duration-fast) var(--custom-ease-out),
    transform  var(--custom-duration-fast) var(--custom-ease-out),
    visibility 0s;
}

.flyout-item {
  display: block;
  padding: 7px 12px;
  font-size: var(--custom-font-size-sm);
  font-weight: var(--custom-font-weight-medium);
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-radius: var(--custom-radius-md);
  transition: var(--custom-transition-fast);
}

.flyout-item:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}
</style>
