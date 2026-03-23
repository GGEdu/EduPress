/**
 * unitHelpers.ts
 *
 * Transformation functions to adapt navbar/sidebar links based on unit context.
 * Enables per-unit route prefixing without duplicating link arrays.
 */

import { DefaultTheme } from 'vitepress';

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
