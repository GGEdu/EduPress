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
  padding: 12px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 4px;
}

.screen-nav-title {
  padding: 4px 12px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.screen-nav-item {
  display: block;
  padding: 10px 12px;
  font-size: 15px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.screen-nav-item:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}
</style>
