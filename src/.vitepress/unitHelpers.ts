/**
 * unitHelpers.ts
 *
 * Transformation functions to adapt navbar/sidebar links based on unit context.
 * Enables per-unit route prefixing without duplicating link arrays.
 */

import { DefaultTheme } from 'vitepress';
import type { NavGroup } from './shared/navigation';

/**
 * Transform navbar links by prefixing unit code to content paths.
 * Example: '/contenidos/01-intro' becomes '/UDx_code/contenidos/01-intro'
 */
export function transformNavbarLinks(
  navbar: DefaultTheme.NavItem[],
  unitCode: string
): DefaultTheme.NavItem[] {
  return navbar.map(item => ({
    ...item,
    items: item.items?.map(subitem => ({
      ...subitem,
      link: subitem.link?.startsWith('/') && subitem.link !== '/' && !subitem.link.includes('://')
        ? `/${unitCode}${subitem.link}`
        : subitem.link
    })),
    link: item.link?.startsWith('/') && item.link !== '/' && !item.link.includes('://')
      ? `/${unitCode}${item.link}`
      : item.link
  }));
}

/**
 * Transform sidebar links by prefixing unit code to content paths.
 * Example: '/contenidos/01-intro' becomes '/UDx_code/contenidos/01-intro'
 */
export function transformSidebarLinks(
  sidebar: DefaultTheme.Sidebar,
  unitCode: string
): DefaultTheme.Sidebar {
  const transformObject = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => transformObject(item));
    }
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const transformed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'link' && typeof value === 'string' && value.startsWith('/') && !value.includes('://')) {
        transformed[key] = `/${unitCode}${value}`;
      } else if (key === 'items' && Array.isArray(value)) {
        transformed[key] = transformObject(value);
      } else if (typeof value === 'object' && value !== null) {
        transformed[key] = transformObject(value);
      } else {
        transformed[key] = value;
      }
    }
    return transformed;
  };

  return transformObject(sidebar) as DefaultTheme.Sidebar;
}

/**
 * Get navbar for a specific unit, transformed with unit prefix.
 */
export function getNavbarForUnit(baseNavbar: DefaultTheme.NavItem[], unitCode: string): DefaultTheme.NavItem[] {
  return transformNavbarLinks(baseNavbar, unitCode);
}

/**
 * Get sidebar for a specific unit, transformed with unit prefix.
 */
export function getSidebarForUnit(baseSidebar: DefaultTheme.Sidebar, unitCode: string): DefaultTheme.Sidebar {
  return transformSidebarLinks(baseSidebar, unitCode);
}

// ── Menú de unidades (units.json → unitMenu) ─────────────────────────────────
// Este fichero se actualiza con «Actualizar diseño»; config/ no. Por eso la
// lógica vive aquí y no en config/units.ts.
//
// unitMenu (opcional en units.json; ausente = 'all'):
//   { "mode": "all" }                                  un desplegable por unidad (de siempre)
//   { "mode": "cumulative", "label": "Sesiones" }      el navbar global solo lleva la raíz;
//                                                      la unidad N tiene un desplegable con
//                                                      las unidades 1..N, nunca las siguientes.
//   label: texto del desplegable. Por defecto «Sesiones».
//   Un unitNavbars escrito a mano para una unidad manda sobre el generado.

export interface UnitMenu {
  mode: 'all' | 'cumulative'
  label: string
}

/** Lee `unitMenu` de units.json (el objeto entero del JSON). Tolerante con cursos viejos. */
export function unitMenuDe(data: object): UnitMenu {
  const m = (data as { unitMenu?: { mode?: unknown; label?: unknown } }).unitMenu
  const mode = m?.mode === 'cumulative' ? 'cumulative' : 'all'
  const etiqueta = m?.label
  const label = typeof etiqueta === 'string' && etiqueta.trim() ? etiqueta.trim() : 'Sesiones'
  return { mode, label }
}

/** Unidad mínima que necesita el menú: el objeto UnitConfig de config/units.ts la cumple. */
export interface UnitParaMenu {
  id: string
  code: string
  title: string
  fullTitle?: string
  icon: string
  sidebar: DefaultTheme.SidebarItem[]
}

// Primer enlace del sidebar de una unidad (en orden de aparición), con su prefijo.
function primeraPagina(unidad: UnitParaMenu): string {
  const buscar = (items: DefaultTheme.SidebarItem[]): string | undefined => {
    for (const item of items) {
      if (item.link) return item.link
      const hijo = item.items && buscar(item.items)
      if (hijo) return hijo
    }
    return undefined
  }
  const enlace = buscar(unidad.sidebar)
  return enlace ? `/${unidad.code}${enlace}` : `/${unidad.code}/`
}

/**
 * Devuelve el unitNavbars final: en modo 'cumulative' (con más de una unidad
 * aparte de root) genera un desplegable por unidad; lo escrito a mano en
 * `manuales` prevalece por clave. En cualquier otro caso, devuelve `manuales`.
 */
export function construirUnitNavbars(
  data: object,
  unidades: Record<string, UnitParaMenu>,
  manuales: Record<string, NavGroup[]> | undefined,
): Record<string, NavGroup[]> {
  const declarados = manuales ?? {}
  const menu = unitMenuDe(data)
  if (menu.mode !== 'cumulative') return declarados

  const lista = Object.values(unidades).filter(u => u.id !== 'root')
  if (lista.length < 2) return declarados

  const generados: Record<string, NavGroup[]> = {}
  lista.forEach((unidad, i) => {
    generados[unidad.code] = [{
      text: menu.label,
      items: lista.slice(0, i + 1).map(u => ({
        text: `${u.icon} ${u.fullTitle || u.title}`,
        link: primeraPagina(u),
      })),
    }]
  })
  return { ...generados, ...declarados }
}
