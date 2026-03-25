---
layout: doc
title: Tutorial — Crear un curso desde cero
outline: [2, 3]
---

# 🛠️ Tutorial: Crear un curso desde cero

Este tutorial te guía paso a paso para transformar la plantilla EduPress en tu propio curso. Al terminar tendrás un sitio con dos unidades, tus colores y tus logos.

**Tiempo estimado: 20-30 minutos.**

::: info-box Antes de empezar
Asegúrate de haber completado la [Instalación y Arranque](./2-instalacion). El servidor debe estar corriendo y accesible en el navegador.
:::

## Paso 1 — Datos del sitio

Edita `src/.vitepress/config/project.ts`.

::: tabs

== Qué cambiar

Modifica estos cuatro campos:

```typescript
export const PROJECT = {
  basePath:    '/mi-curso/',           // ← nombre de tu repositorio GitHub
  lang:        'es-ES',
  description: 'Módulo de Laravel — IES Ejemplo',
  copyright:   'Copyright © 2026 — Tu Centro',
  socialLinks: [
    { icon: 'github', link: 'https://github.com/tu-usuario' },
  ],
  outDir: '../docs',
}
```

== Resultado esperado

- el título de la pestaña del navegador refleja tu curso
- el footer muestra el copyright correcto
- el icono de GitHub aparece en la esquina superior derecha del navbar

:::

## Paso 2 — Logos

Copia tus logos a `src/public/img/`. Los nombres de archivo deben ser exactamente estos:

| Archivo | Dónde aparece | Tamaño |
|---|---|---|
| `logo.png` | Navbar (barra superior) | 48×48 px |
| `logo-autor.png` | Sidebar inferior y footer | 165 px alto |
| `logo-gva.png` | Institución pública (sidebar) | 60 px alto |
| `logo-centro.png` | Centro educativo (sidebar) | 90 px alto |

Después edita `src/.vitepress/config/logos.ts` para indicar cómo se adaptan en modo oscuro:

::: tabs

== Logo válido en ambos fondos (`same`)

Usa este modo si tu logo tiene colores que se ven bien tanto en fondo blanco como en fondo oscuro (por ejemplo, un logo a todo color con fondo transparente).

```typescript
export const LOGOS = {
  mode: 'same',
  darkSuffix: '-dark',
  heights: {
    autor:  '165px',
    gva:    '60px',
    centro: '90px',
    footer: '75px',
  },
}
```

== Logo negro que invertir (`invert`)

Usa este modo si tu logo es negro sobre fondo transparente. EduPress lo invertirá automáticamente a blanco en modo oscuro mediante CSS.

```typescript
export const LOGOS = {
  mode: 'invert',
  darkSuffix: '-dark',
  heights: { ... },
}
```

== Logos diferentes por modo (`separate`)

Usa este modo si tienes una versión específica para modo oscuro. Necesitas archivos adicionales:

```
src/public/img/
├── logo.png          ← modo claro
├── logo-dark.png     ← modo oscuro
├── logo-autor.png
├── logo-autor-dark.png
├── logo-gva.png
├── logo-gva-dark.png
├── logo-centro.png
└── logo-centro-dark.png
```

```typescript
export const LOGOS = {
  mode: 'separate',
  darkSuffix: '-dark',   // sufijo antes de la extensión
  heights: { ... },
}
```

:::

## Paso 3 — Color corporativo

Edita `src/.vitepress/config/colors.ts`. Solo necesitas cambiar dos valores:

```typescript
// ── Colores modo claro ────────────────────────────────────────────────────────
const brand        = '#2563eb'   // ← tu color corporativo (HEX)
const brandLight   = '#3b82f6'   // un poco más claro
const brandLighter = '#60a5fa'   // aún más claro
const brandDark    = '#1d4ed8'   // más oscuro
const brandDarker  = '#1e40af'   // el más oscuro

// ── Colores modo oscuro ───────────────────────────────────────────────────────
const darkBrand    = '#60a5fa'   // ← misma tonalidad pero más clara
```

::: tip-box Cómo elegir el color oscuro
Abre [coolors.co](https://coolors.co), introduce tu color corporativo y elige el tono 2-3 pasos más claro de la misma gama. Ese es tu `darkBrand`.

Herramientas útiles: [coolors.co](https://coolors.co) · [colorhunt.co](https://colorhunt.co) · [paletton.com](https://paletton.com)
:::

Guarda el archivo. El servidor de desarrollo aplicará los cambios automáticamente.

## Paso 4 — Crear las carpetas de las unidades

En este tutorial crearemos dos unidades: **UD1** y **UD2**.

```bash
# Desde la carpeta raíz del proyecto
cp -r src/general src/UD1
cp -r src/general src/UD2
```

Resultado:

```
src/
├── general/     ← plantilla original (puedes borrarla después)
├── UD1/
│   ├── index.md
│   ├── contenidos/
│   └── ejercicios/
└── UD2/
    ├── index.md
    ├── contenidos/
    └── ejercicios/
```

## Paso 5 — Configurar las unidades

Edita `src/.vitepress/config/units.ts`. Sustituye el contenido de navbars, sidebars y el registro de unidades:

::: tabs

== Navbars y sidebars

```typescript
import { DefaultTheme } from 'vitepress'

// ── Unidad 1 ─────────────────────────────────────────────────────────────────
const ud1Navbar: DefaultTheme.NavItem[] = [
  { text: '🏠 Inicio', link: '/' },
  {
    text: '📘 Unidad 1',
    items: [
      { text: 'Portada',        link: '/index' },
      { text: 'Introducción',   link: '/contenidos/1-intro' },
      { text: 'Instalación',    link: '/contenidos/2-instalacion' },
      { text: 'Primeros pasos', link: '/contenidos/3-primeros-pasos' },
    ]
  },
]

const ud1Sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📘 Unidad 1 — Fundamentos',
    collapsed: false,
    items: [
      { text: 'Introducción',   link: '/contenidos/1-intro' },
      { text: 'Instalación',    link: '/contenidos/2-instalacion' },
      { text: 'Primeros pasos', link: '/contenidos/3-primeros-pasos' },
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

// ── Unidad 2 ─────────────────────────────────────────────────────────────────
const ud2Navbar: DefaultTheme.NavItem[] = [
  { text: '🏠 Inicio', link: '/' },
  {
    text: '📗 Unidad 2',
    items: [
      { text: 'Portada',         link: '/index' },
      { text: 'Conceptos clave', link: '/contenidos/1-conceptos' },
      { text: 'Práctica',        link: '/contenidos/2-practica' },
    ]
  },
]

const ud2Sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📗 Unidad 2 — Avanzado',
    collapsed: false,
    items: [
      { text: 'Conceptos clave', link: '/contenidos/1-conceptos' },
      { text: 'Práctica',        link: '/contenidos/2-practica' },
    ]
  },
  {
    text: '🗂️ Ejercicios',
    collapsed: true,
    items: [
      { text: 'Ejercicio 2', link: '/ejercicios/ej2' },
    ]
  },
]
```

== Registro en UNITS

```typescript
export const UNITS: Record<string, UnitConfig> = {

  // Portada del sitio — no tocar
  root: {
    id: 'root',
    code: 'root',
    title: 'Mi Curso',
    fullTitle: 'Mi Curso Online',
    siteTitle: 'Mi</br>Curso',
    icon: '🏫',
    navbar: [{ text: '🏠 Inicio', link: '/' }],
    sidebar: []
  },

  UD1: {
    id: 'UD1',
    code: 'UD1',                         // → archivos en src/UD1/
    title: 'Unidad 1',
    fullTitle: 'Unidad 1 — Fundamentos',
    siteTitle: 'Unidad 1</br>Fundamentos',
    icon: '📘',
    navbar: ud1Navbar,
    sidebar: ud1Sidebar,
  },

  UD2: {
    id: 'UD2',
    code: 'UD2',                         // → archivos en src/UD2/
    title: 'Unidad 2',
    fullTitle: 'Unidad 2 — Avanzado',
    siteTitle: 'Unidad 2</br>Avanzado',
    icon: '📗',
    navbar: ud2Navbar,
    sidebar: ud2Sidebar,
  },

}
```

:::

## Paso 6 — Crear los archivos de contenido

Crea los archivos `.md` que has referenciado en el sidebar. El nombre del archivo debe coincidir exactamente con el link (sin la extensión `.md`).

```bash
# Contenidos de UD1
touch src/UD1/contenidos/1-intro.md
touch src/UD1/contenidos/2-instalacion.md
touch src/UD1/contenidos/3-primeros-pasos.md
touch src/UD1/ejercicios/ej1.md

# Contenidos de UD2
touch src/UD2/contenidos/1-conceptos.md
touch src/UD2/contenidos/2-practica.md
touch src/UD2/ejercicios/ej2.md
```

**Plantilla mínima para cada archivo:**

```markdown
---
layout: doc
title: Nombre del tema
---

# Nombre del tema

Tu contenido aquí.
```

## Paso 7 — Portada del módulo (`index.md`)

Cada unidad tiene un `index.md` propio (portada del módulo). Es la página que se carga en `/EduPress/UD1/index`. Edita `src/UD1/index.md` con la presentación de esa unidad y repite para `src/UD2/index.md`.

```markdown
---
layout: doc
title: Unidad 1 — Fundamentos
---

# 📘 Unidad 1 — Fundamentos

Descripción breve de qué aprenderá el alumnado en esta unidad.

## Contenidos

- [Introducción](./contenidos/1-intro)
- [Instalación](./contenidos/2-instalacion)
- [Primeros pasos](./contenidos/3-primeros-pasos)
```

## Paso 8 — Verificar el resultado

```bash
./start-project.sh
```

Abre el navegador y comprueba:

| URL | Qué debe mostrar |
|---|---|
| `http://localhost:XXXX/EduPress/` | Portada del sitio, sin sidebar |
| `http://localhost:XXXX/EduPress/UD1/index` | Portada de Unidad 1, con sidebar de UD1 |
| `http://localhost:XXXX/EduPress/UD2/index` | Portada de Unidad 2, con sidebar de UD2 |
| El navbar | Dropdown `📘 Unidad 1` + dropdown `📗 Unidad 2` |

::: tip-box El navbar desaparece o no cambia
Si el navbar no muestra las unidades, reinicia el servidor:

```bash
./stop-project.sh
./start-project.sh
```
:::

## Paso 9 — Build y despliegue

Cuando el sitio esté listo para publicar:

```bash
# Verificar que hay errores ni links rotos
npm run docs:build

# Si el build es correcto, despliega normalmente
git add .
git commit -m "Primer curso configurado"
git push origin main
```

::: warning-box Antes del build
Revisa que todos los archivos referenciados en `sidebar` existen físicamente. Si un link apunta a un `.md` que no existe, el build fallará con un error de "dead link".
:::
