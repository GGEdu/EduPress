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

export const unitNavbars = data.unitNavbars as unknown as Record<string, NavGroup[]>
