# 🧩 Módulos y Unidades

EduPress organiza el curso en **unidades**, cada una con su propia navegación (navbar y sidebar). La configuración se hace en `src/.vitepress/config/units.ts`.

El sistema detecta automáticamente todas las unidades definidas y sirve el sidebar correcto según la URL visitada:

| URL visitada | Sidebar mostrado |
|---|---|
| `/EduPress/` | Sin sidebar (portada del sitio) |
| `/EduPress/general/` | Sidebar de la unidad con `code: 'general'` |
| `/EduPress/ud2/` | Sidebar de la unidad con `code: 'ud2'` |

## Cómo se escriben los enlaces

Los links del navbar y sidebar **no llevan el prefijo de unidad** — el sistema lo añade automáticamente:

| Link escrito en `units.ts` | URL generada (con `code: 'general'`) | Página |
|---|---|---|
| `'/'` | `/EduPress/` | Portada del sitio (`src/index.md`) |
| `'/index'` | `/EduPress/general/index` | Portada del módulo (`src/general/index.md`) |
| `'/contenidos/1-tema'` | `/EduPress/general/contenidos/1-tema` | Contenido del módulo |
| `'/ejercicios/ej1'` | `/EduPress/general/ejercicios/ej1` | Ejercicio del módulo |

## Opción 1: Módulo único

Ideal para cursos con un único bloque temático.

### 1. Estructura física de archivos

```
src/
└── mi-modulo/
    ├── index.md              ← portada del módulo
    ├── contenidos/
    │   ├── 1-introduccion.md
    │   └── 2-desarrollo.md
    └── ejercicios/
        └── ejercicio.md
```

### 2. Configuración en `config/units.ts`

Copia y adapta este bloque completo:

```typescript
import { DefaultTheme } from 'vitepress'

// ── Navbar ───────────────────────────────────────────────────────────────────
const navbar: DefaultTheme.NavItem[] = [
  { text: '🏠 Inicio', link: '/' },
  {
    text: '📘 Contenidos',
    items: [
      { text: 'Portada del módulo', link: '/index' },
      { text: 'Introducción',       link: '/contenidos/1-introduccion' },
      { text: 'Desarrollo',         link: '/contenidos/2-desarrollo' },
    ]
  },
]

// ── Sidebar ──────────────────────────────────────────────────────────────────
const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📘 Mi Módulo',
    collapsed: false,
    items: [
      { text: 'Introducción', link: '/contenidos/1-introduccion' },
      { text: 'Desarrollo',         link: '/contenidos/2-desarrollo' },
    ]
  },
  {
    text: '🗂️ Ejercicios',
    collapsed: true,
    items: [
      { text: 'Ejercicio 1', link: '/ejercicios/ejercicio' },
    ]
  },
]

// ── Registro ─────────────────────────────────────────────────────────────────
export const UNITS: Record<string, UnitConfig> = {
  root: { ... },   // no tocar — portada del sitio

  MI_MODULO: {
    id: 'MI_MODULO',
    code: 'mi-modulo',              // → archivos en src/mi-modulo/
    title: 'Mi Módulo',
    fullTitle: 'Mi Módulo — Nombre completo',
    siteTitle: 'Mi</br>Módulo',     // </br> añade salto de línea en el sidebar
    icon: '📘',
    navbar: navbar,
    sidebar: sidebar,
  },
}
```

Las URLs resultantes serán: `/EduPress/mi-modulo/contenidos/1-tema`

::: tip-box Renombrar la carpeta del módulo
El `code` debe coincidir exactamente con el nombre de la carpeta en `src/`. Si usas `code: 'mi-modulo'`, la carpeta debe ser `src/mi-modulo/`.
:::

## Opción 2: Múltiples unidades

Ideal para cursos con varias unidades didácticas independientes.

### 1. Estructura física de archivos

```
src/
├── UD1/
│   ├── index.md
│   ├── contenidos/
│   └── ejercicios/
└── UD2/
    ├── index.md
    ├── contenidos/
    └── ejercicios/
```

### 2. Copiar la estructura existente

```bash
cp -r src/general src/UD1
cp -r src/UD1 src/UD2
```

### 3. Configuración en `config/units.ts`

Define un navbar y sidebar por unidad, luego regístralos en `UNITS`:

```typescript
import { DefaultTheme } from 'vitepress'

// ── Navbar de Unidad 1 ───────────────────────────────────────────────────────
const ud1Navbar: DefaultTheme.NavItem[] = [
  { text: '🏠 Inicio', link: '/' },
  {
    text: '📘 Unidad 1',
    items: [
      { text: 'Portada',       link: '/index' },
      { text: 'Introducción',  link: '/contenidos/1-intro' },
      { text: 'Fundamentos',   link: '/contenidos/2-fundamentos' },
    ]
  },
]

// ── Sidebar de Unidad 1 ──────────────────────────────────────────────────────
const ud1Sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📘 Unidad 1 — Introducción',
    collapsed: false,
    items: [
      { text: 'Introducción',  link: '/contenidos/1-intro' },
      { text: 'Fundamentos',   link: '/contenidos/2-fundamentos' },
    ]
  },
  {
    text: '🗂️ Ejercicios',
    collapsed: true,
    items: [
      { text: 'Ejercicio 1', link: '/ejercicios/ej1' },
    ]
  },
]

// ── Navbar de Unidad 2 ───────────────────────────────────────────────────────
const ud2Navbar: DefaultTheme.NavItem[] = [
  { text: '🏠 Inicio', link: '/' },
  {
    text: '📗 Unidad 2',
    items: [
      { text: 'Portada',        link: '/index' },
      { text: 'Concepto A',     link: '/contenidos/1-concepto-a' },
      { text: 'Concepto B',     link: '/contenidos/2-concepto-b' },
    ]
  },
]

// ── Sidebar de Unidad 2 ──────────────────────────────────────────────────────
const ud2Sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📗 Unidad 2 — Avanzado',
    collapsed: false,
    items: [
      { text: 'Concepto A',     link: '/contenidos/1-concepto-a' },
      { text: 'Concepto B',     link: '/contenidos/2-concepto-b' },
    ]
  },
  {
    text: '🗂️ Ejercicios',
    collapsed: true,
    items: [
      { text: 'Ejercicio 2',    link: '/ejercicios/ej2' },
      { text: 'Ejercicio 3',    link: '/ejercicios/ej3' },
    ]
  },
]

// ── Registro de unidades ─────────────────────────────────────────────────────
export const UNITS: Record<string, UnitConfig> = {
  root: { ... },   // no tocar — portada del sitio

  UD1: {
    id: 'UD1',
    code: 'UD1',               // → archivos en src/UD1/
    title: 'Unidad 1',
    fullTitle: 'Unidad 1 — Introducción',
    siteTitle: 'Unidad 1</br>Introducción',
    icon: '📘',
    navbar: ud1Navbar,
    sidebar: ud1Sidebar,
  },

  UD2: {
    id: 'UD2',
    code: 'UD2',               // → archivos en src/UD2/
    title: 'Unidad 2',
    fullTitle: 'Unidad 2 — Avanzado',
    siteTitle: 'Unidad 2</br>Avanzado',
    icon: '📗',
    navbar: ud2Navbar,
    sidebar: ud2Sidebar,
  },
}
```

> Los links del navbar/sidebar **no llevan el prefijo** (`UD1/`, `UD2/`). El sistema los añade automáticamente al generar el sitio.

### 4. Navbar global en cursos multi-unidad

Cuando hay varias unidades, el navbar muestra automáticamente un **dropdown por unidad** con sus ítems. No hay nada adicional que configurar — el sistema lo genera a partir de `UNITS`:

```
[ 🏠 Inicio ]  [ 📘 Unidad 1 ▾ ]  [ 📗 Unidad 2 ▾ ]
```

## Añadir una página nueva a una unidad

**1. Crear el archivo `.md`:**

```bash
# Ejemplo: nueva página en la unidad con code = 'UD1'
touch src/UD1/contenidos/3-nuevo-tema.md
```

**2. Añadir la entrada en `config/units.ts`:**

```typescript
const ud1Sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📘 Unidad 1',
    items: [
      { text: 'Introducción', link: '/contenidos/1-intro' },
      { text: 'Fundamentos',  link: '/contenidos/2-fundamentos' },
      { text: 'Nuevo Tema',   link: '/contenidos/3-nuevo-tema' },  // ← nueva
    ]
  },
]
```

## Referencia rápida

| Situación | Qué hacer |
|-----------|-----------|
| 1 módulo temático | Una entrada en `UNITS` (+ `root`) |
| Múltiples unidades | N entradas en `UNITS`, una por unidad |
| Añadir página al contenido | Crear `.md` + añadir en el array `sidebar` |
| Añadir ítem al menú superior | Añadir en el array `navbar` |
| Enlazar a la portada del sitio | Link `'/'` |
| Enlazar a la portada del módulo | Link `'/index'` |

**Siguiente paso:** [Configuración e Identidad](./5-configuracion)
