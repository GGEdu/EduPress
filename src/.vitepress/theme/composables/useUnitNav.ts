import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import type { NavGroup, UnitNavbarMap } from '../../shared/navigation'

function normalizePath(path: string, base: string): string {
  if (!path) return '/'

  let normalized = path

  if (base !== '/' && normalized.startsWith(base)) {
    normalized = normalized.slice(base.length - 1)
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  normalized = normalized.replace(/\.html$/, '')

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return normalized
}

export function useUnitNav() {
  const { site, theme } = useData()
  const route = useRoute()

  return computed<NavGroup[]>(() => {
    const navbars = theme.value.unitNavbars as UnitNavbarMap | undefined
    if (!navbars) return []

    const base = site.value.base || '/'
    const routePath = normalizePath(route.path, base)
    const browserPath = typeof window !== 'undefined'
      ? normalizePath(window.location.pathname, base)
      : routePath
    const path = browserPath.length >= routePath.length ? browserPath : routePath

    for (const [unitCode, groups] of Object.entries(navbars)) {
      if (path === `/${unitCode}` || path.startsWith(`/${unitCode}/`)) {
        return groups
      }
    }

    return []
  })
}
