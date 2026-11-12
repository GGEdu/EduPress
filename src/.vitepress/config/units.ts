// ============================================================================
// CONFIGURACIÓN DE UNIDADES — Lectura de units.json
// ============================================================================
//
// 👤 La estructura del curso se edita en units.json, no aquí. Ese fichero es
//    dato puro: lo leen VitePress y EduPress Studio, y Studio solo escribe en
//    cursos que tengan este formato (formatVersion).
//
// CONCEPTOS CLAVE de units.json:
//   formatVersion — Versión del formato. Hoy, 1.
//   units         — Unidades del curso. `root` es la página de inicio.
//   unitNavbars   — Desplegable opcional del navbar según la URL activa.
//   unitMenu      — Opcional. Cómo se listan las unidades en el navbar:
//                   { "mode": "all" } (ausente = all): un desplegable por unidad.
//                   { "mode": "cumulative", "label": "Sesiones" }: el navbar global
//                   solo lleva la raíz, y cada unidad tiene un desplegable con las
//                   unidades 1..N hasta ella (nunca las posteriores). `label` es el
//                   texto del desplegable (por defecto «Sesiones»).
//                   Un unitNavbars escrito a mano para una unidad manda sobre el generado.
//
// PROPIEDADES DE CADA UNIDAD:
//   id        — Identificador único (debe coincidir con la clave del objeto)
//   code      — Prefijo de URL: los enlaces se prefijan con /<code>/
//               Ejemplo: code='s1' → '/contenidos/intro' → '/s1/contenidos/intro'
//   title     — Nombre corto (migas de pan y referencias internas)
//   fullTitle — Nombre completo (pestaña del navegador)
//   siteTitle — Nombre en el sidebar (admite </br>)
//   icon      — Emoji decorativo
//   navbar    — Ítems del menú superior
//   sidebar   — Secciones del panel lateral
//
// CADA SECCIÓN es una carpeta más su entrada de menú: un grupo del sidebar con
// `folder` (carpeta dentro de src/<code>/) e `items` (sus páginas).
// ============================================================================

import { DefaultTheme } from 'vitepress'
import type { NavGroup } from '../shared/navigation'
import data from './units.json'

export interface UnitConfig {
  id: string
  code: string
  title: string
  fullTitle: string
  siteTitle: string
  icon: string
  navbar: DefaultTheme.NavItem[]
  sidebar: DefaultTheme.SidebarItem[]
}

export const UNITS = data.units as unknown as Record<string, UnitConfig>

export function getAllUnitsArray(): UnitConfig[] {
  return Object.values(UNITS)
}

export function getUnitByCode(code: string): UnitConfig | undefined {
  return UNITS[code]
}

// ── Menú de unidades (unitMenu) ──────────────────────────────────────────────
// Ausente en units.json = 'all'. Los cursos antiguos no lo tienen.
export type UnitMenuMode = 'all' | 'cumulative'
export const UNIT_MENU_MODE: UnitMenuMode =
  (data as { unitMenu?: { mode?: string } }).unitMenu?.mode === 'cumulative' ? 'cumulative' : 'all'
export const UNIT_MENU_LABEL: string =
  (data as { unitMenu?: { label?: string } }).unitMenu?.label ?? 'Sesiones'

// Primer enlace del sidebar de una unidad (en orden de aparición), con su prefijo.
function primeraPagina(unidad: UnitConfig): string {
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

// Desplegable acumulativo: en la unidad N se listan las unidades 1..N.
function unitNavbarsAcumulativos(): Record<string, NavGroup[]> {
  const unidades = Object.values(UNITS).filter(u => u.id !== 'root')
  const resultado: Record<string, NavGroup[]> = {}
  if (unidades.length < 2) return resultado
  unidades.forEach((unidad, i) => {
    resultado[unidad.code] = [{
      text: UNIT_MENU_LABEL,
      items: unidades.slice(0, i + 1).map(u => ({
        text: `${u.icon} ${u.fullTitle || u.title}`,
        link: primeraPagina(u),
      })),
    }]
  })
  return resultado
}

const unitNavbarsManuales = data.unitNavbars as unknown as Record<string, NavGroup[]>

// Lo escrito a mano en unitNavbars manda sobre lo generado para esa unidad.
export const unitNavbars: Record<string, NavGroup[]> = UNIT_MENU_MODE === 'cumulative'
  ? { ...unitNavbarsAcumulativos(), ...unitNavbarsManuales }
  : unitNavbarsManuales
