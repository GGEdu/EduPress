<script setup lang="ts">
import { withBase } from 'vitepress'
import { useUnitNav } from '../composables/useUnitNav'

const navGroups = useUnitNav()
</script>

<template>
  <div v-if="navGroups.length">
    <div
      v-for="(navGroup, index) in navGroups"
      :key="`${navGroup.text}-${index}`"
      class="screen-nav"
    >
      <p class="screen-nav-title">{{ navGroup.text }}</p>
      <a
        v-for="item in navGroup.items"
        :key="item.link"
        :href="withBase(item.link)"
        class="screen-nav-item"
      >
        {{ item.text }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.screen-nav {
  padding: var(--custom-space-3) 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: var(--custom-space-1);
}

.screen-nav-title {
  padding: var(--custom-space-1) var(--custom-space-3) var(--custom-space-2);
  font-size: var(--custom-font-size-xs);
  font-weight: var(--custom-font-weight-semibold);
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: var(--custom-letter-spacing-wide);
}

.screen-nav-item {
  display: block;
  padding: var(--custom-space-2) var(--custom-space-3);
  font-size: var(--custom-font-size-base);
  font-weight: var(--custom-font-weight-medium);
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-radius: var(--custom-radius-lg);
  transition: var(--custom-transition-fast);
}

.screen-nav-item:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}
</style>
