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
      { text: '2. Diapositivas', link: '/contenidos/2-diapositivas' },
      { text: '3. Ejemplo Simple', link: '/contenidos/3-diapositivas-demo' },
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
      { text: '1. Introducción', link: '/contenidos/1-introduccion' },
      { text: '2. Diapositivas', link: '/contenidos/2-diapositivas' },
      { text: '3. Ejemplos Diapositivas', link: '/contenidos/3-diapositivas-demo' },
    ]
  },
  {
    text: '🗂️ Ejercicios',
    collapsed: true,
    items: [
      { text: 'Inicio', link: '/ejercicios/' },
      { text: 'Ejercicio', link: '/ejercicios/ejercicio' },
      { text: 'Final', link: '/ejercicios/final' }
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
 * Start with pilot units (UD1, UD2) to test modularity before scaling.
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

  UD1: {
    id: 'UD1',
    code: 'UD1',
    title: 'Unidad 1',
    fullTitle: 'Unidad 1 - Fundamentos',
    siteTitle: 'Unidad 1</br>Fundamentos',
    icon: '📘',
    navbar: baseNavbar,
    sidebar: baseSidebar
  },

  UD2: {
    id: 'UD2',
    code: 'UD2',
    title: 'Unidad 2',
    fullTitle: 'Unidad 2 - Profundización',
    siteTitle: 'Unidad 2</br>Profundización',
    icon: '📗',
    navbar: baseNavbar,
    sidebar: baseSidebar
  }
};

/**
 * Active unit selector.
 * Change this to switch between units without modifying config.mts.
 * Examples: 'root', 'UD1', 'UD2'
 * 
 * ✅ NOW ACTIVE: 'UD1' with content in src/UD1/contenidos/ and src/UD1/ejercicios/
 * Routes are prefixed by unitHelpers: /contenidos/x → /UD1/contenidos/x
 */
export const ACTIVE_UNIT = 'UD1';

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
