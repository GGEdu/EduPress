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
  gap: 4px;
  padding: 0 8px;
  height: 100%;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.25s;
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
  padding: 8px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-3);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 0.2s, transform 0.2s;
  z-index: 100;
}

.flyout.open {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.flyout-item {
  display: block;
  padding: 7px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.flyout-item:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}
</style>
