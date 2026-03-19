# 🧩 Módulo único vs Unidades

EduPress soporta dos modos de organización: un módulo único o múltiples unidades independientes. La elección se hace en `src/.vitepress/units.ts`.

## Opción 1: Módulo único (recomendado para cursos pequeños)

**Cuándo usarlo:** 1 o 2 módulos temáticos sin subdivisión por unidades didácticas.

**Estructura física:**

```
src/
└── general/         ← tu único módulo
    ├── contenidos/
    └── ejercicios/
```

**Configuración en `units.ts`:**

```typescript
export const UNITS: Record<string, UnitConfig> = {
  general: {
    id: 'general',
    code: 'general',
    title: 'Módulo General',
    fullTitle: 'Módulo General',
    siteTitle: 'Mi</br>Curso',
    icon: '📘',
    navbar: baseNavbar,
    sidebar: baseSidebar
  }
}

export const ACTIVE_UNIT = 'general'
```

Las URLs resultantes son: `/EduPress/general/contenidos/1-introduccion`

### Usar un nombre personalizado

No estás obligado a usar `general`. Elige el nombre más descriptivo para tu curso:

```typescript
export const UNITS: Record<string, UnitConfig> = {
  MODULO: { id: 'MODULO', code: 'MODULO', ... }
}
export const ACTIVE_UNIT = 'MODULO'
```

Y renombra la carpeta `src/general/` a `src/MODULO/`.

> Las URLs seguirán el nombre de la carpeta: `/EduPress/MODULO/contenidos/...`

## Opción 2: Múltiples unidades (recomendado para cursos completos)

**Cuándo usarlo:** Cursos con 3+ bloques temáticos diferenciados (UD1, UD2, UD3...).

**Estructura física:**

```
src/
├── UD1/    ← Unidad 1
│   ├── contenidos/
│   └── ejercicios/
├── UD2/    ← Unidad 2
└── UD3/    ← Unidad 3
```

### Paso a paso

**1. Crear la estructura:**

```bash
cp -r src/general src/UD1
cp -r src/UD1 src/UD2
```

**2. Registrar en `units.ts`:**

```typescript
export const UNITS: Record<string, UnitConfig> = {
  UD1: {
    id: 'UD1',
    code: 'UD1',
    title: 'Unidad 1 - Introducción',
    fullTitle: 'Unidad 1 - Introducción al módulo',
    siteTitle: 'Unidad 1</br>Introducción',
    icon: '📘',
    navbar: baseNavbar,
    sidebar: baseSidebar
  },
  UD2: {
    id: 'UD2',
    code: 'UD2',
    title: 'Unidad 2 - Avanzada',
    fullTitle: 'Unidad 2 - Temas Avanzados',
    siteTitle: 'Unidad 2</br>Avanzada',
    icon: '📗',
    navbar: baseNavbar,
    sidebar: baseSidebar
  }
}
```

**3. Activar una unidad para desarrollo:**

```typescript
export const ACTIVE_UNIT = 'UD1'  // Cambia para trabajar en otra unidad
```

**4. Personalizar contenidos** en cada carpeta `src/UD1/contenidos/`, `src/UD2/contenidos/`, etc.

## Referencia rápida

| Situación | Configuración |
|-----------|---------------|
| 1 módulo temático | `ACTIVE_UNIT = 'general'` + carpeta `src/general/` |
| 1 módulo con nombre propio | `ACTIVE_UNIT = 'MODULO'` + carpeta `src/MODULO/` |
| Varios módulos | Varios registros en `UNITS` + carpeta por módulo |

**Siguiente paso:** [Configuración e Identidad](./5-configuracion)
