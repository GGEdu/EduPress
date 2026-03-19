/**
 * units.ts
 *
 * Declarative unit configuration for modular EduPress template.
 * Each unit defines its own navbar/sidebar structure which is then transformed
 * with unit-specific route prefixes via unitHelpers.
 *
 * To add a new unit:
 * 1. Create src/UDx/ folder with index.md + contenidos/ + ejercicios/ subdirs
 * 2. Add entry to UNITS object below
 * 3. Change ACTIVE_UNIT constant to activate it
 */

import { DefaultTheme } from 'vitepress';

/**
 * Base shared navbar structure (not unit-specific).
 * Each unit will get its links transformed to include unit prefix.
 */
const baseNavbar: DefaultTheme.NavItem[] = [
  { text: '🏠 Inicio', link: '/' },
  {
    text: '📚 Contenidos',
    items: [
      { text: '1. Introducción', link: '/contenidos/1-introduccion' },
      { text: '2. Diapositivas', link: '/contenidos/7-diapositivas' },
      { text: '3. Catálogo de Patrones', link: '/contenidos/8-diapositivas-demo' },
    ]
  },
];

/**
 * Base shared sidebar structure (not unit-specific).
 * Each unit will get its links transformed to include unit prefix.
 */
const baseSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📚 Contenidos',
    collapsed: true,
    items: [
      { text: 'Introducción', link: '/contenidos/1-introduccion' },
      { text: 'Instalación y Arranque', link: '/contenidos/2-instalacion' },
      { text: 'Estructura del Proyecto', link: '/contenidos/3-estructura' },
      { text: 'Módulos y Unidades', link: '/contenidos/4-modulos' },
      { text: 'Configuración e Identidad', link: '/contenidos/5-configuracion' },
      { text: 'Crear Contenidos', link: '/contenidos/6-crear-contenidos' },
      { text: 'Crear Diapositivas', link: '/contenidos/7-diapositivas' },
      { text: 'Catálogo de Patrones', link: '/contenidos/8-diapositivas-demo' },
      { text: 'Imágenes para Contenido', link: '/contenidos/9-imagenes' },
      { text: 'Despliegue', link: '/contenidos/10-despliegue' },
    ]
  },
  {
    text: '🗂️ Ejercicios',
    collapsed: true,
    items: [
      { text: 'Introducción', link: '/ejercicios/' },
      { text: 'Imágenes en Ejercicios', link: '/ejercicios/imagenes-ejercicios' },
      {
        text: 'Ejemplos',
        items: [
          { text: 'Historia gamificada (parallax)', link: '/ejercicios/ejercicio' },
          { text: 'Enunciado directo (Markdown)', link: '/ejercicios/enunciado' },
        ]
      }
    ]
  }
];

/**
 * Unit configuration contract - minimal but sufficient for template to work.
 * Can be extended with additional fields per unit as needed.
 */
export interface UnitConfig {
  id: string;
  code: string;
  title: string;
  fullTitle: string;
  siteTitle: string;
  icon: string;
  navbar: DefaultTheme.NavItem[];
  sidebar: DefaultTheme.SidebarItem[];
}

/**
 * Central unit registry.
 * Start with a default module and optional extra units to test modularity before scaling.
 */
export const UNITS: Record<string, UnitConfig> = {
  root: {
    id: 'root',
    code: 'root',
    title: 'EduPress',
    fullTitle: 'Plantilla EduPress Modular',
    siteTitle: 'EduPress</br>Plantilla',
    icon: '📐',
    navbar: [
      { text: '🏠 Inicio', link: '/' },
    ],
    sidebar: []
  },

  MODULO: {
    id: 'MODULO',
    code: 'general',
    title: 'Modulo General',
    fullTitle: 'Modulo General - Fundamentos',
    siteTitle: 'Modulo</br>General',
    icon: '📘',
    navbar: baseNavbar,
    sidebar: baseSidebar
  },
};

/**
 * Active unit selector.
 * Change this to switch between units without modifying config.mts.
 * Examples: 'root', 'MODULO', 'UD2'
 * 
 * ✅ NOW ACTIVE: 'MODULO' with content in src/general/contenidos/ and src/general/ejercicios/
 * Routes are prefixed by unitHelpers: /contenidos/x -> /general/contenidos/x
 */
export const ACTIVE_UNIT = 'MODULO';

/**
 * Helper to get all units as array for iteration.
 * Useful for config.mts when building locales or sidebar structures.
 */
export function getAllUnitsArray(): UnitConfig[] {
  return Object.values(UNITS);
}

/**
 * Helper to get a specific unit config by code.
 */
export function getUnitByCode(code: string): UnitConfig | undefined {
  return UNITS[code];
}

/**
 * Helper to get the active unit configuration.
 */
export function getActiveUnit(): UnitConfig {
  const unit = getUnitByCode(ACTIVE_UNIT);
  if (!unit) {
    throw new Error(`Active unit '${ACTIVE_UNIT}' not found in UNITS registry`);
  }
  return unit;
}
