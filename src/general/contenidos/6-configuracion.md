---
layout: doc
title: Configuración e Identidad
sidebar: true
outline: [2, 3]
aside: true
---

# ⚙️ Configuración e Identidad

EduPress se personaliza completamente a través de **4 archivos de configuración**. No es necesario tocar CSS ni componentes Vue.

| Archivo | Qué controla |
|---------|-------------|
| `src/.vitepress/config/project.ts` | URL base, idioma, copyright, redes sociales |
| `src/.vitepress/config/colors.ts` | Paleta de colores y tipografía |
| `src/.vitepress/config/logos.ts` | Logos y modo claro/oscuro |
| `src/.vitepress/config/units.ts` | Módulos, navbar y sidebar |

---

## 1. `project.ts` — Identidad del sitio

```ts
export const PROJECT = {
  // Ruta base: debe coincidir con el nombre del repositorio en GitHub
  // /mi-curso/ → https://tuusuario.github.io/mi-curso/
  basePath: '/mi-curso/',

  lang: 'es-ES',

  description: 'Módulo Profesional de Programación Web — IES Ejemplo',

  copyright: 'Copyright © 2025 · IES Ejemplo',

  // Modo de exportación a PDF ('image' | 'text'). Por defecto es 'text'.
  // - 'image': Rasteriza el DOM tal cual se ve, aplicando mejoras de paginación y ahorro de tinta.
  // - 'text': Imprime usando el diálogo nativo del navegador, manteniendo el texto seleccionable.
  pdfExportMode: 'image',
}
```

::: warning `basePath` es crítico para el despliegue
Si el repositorio se llama `mi-curso` en GitHub, `basePath` debe ser `/mi-curso/` con barras inicial y final. Si no coincide, los CSS/JS no cargarán en producción.
:::

---

## 2. `colors.ts` — Paleta cromática

### 🎨 Seleccionar un Tema Predeterminado

EduPress incluye varias paletas de colores profesionales listas para usar. El archivo `src/.vitepress/config/colors.ts` funciona como un **puente** para elegir cuál de estas paletas cargar.

Para cambiar el tema, simplemente edita el archivo `colors.ts` y descomenta la línea de la paleta que desees (asegurándote de comentar las demás).

Ejemplo para usar la paleta "Azul y Coral":
```typescript
// import { COLORS } from './colors-3-pizarra-teal'
import { COLORS } from './colors-5-azul-coral'

export { COLORS }
```

Si prefieres personalizar colores individualmente, puedes duplicar uno de estos archivos (por ejemplo, creando `colors-6-mi-tema.ts`), configurarlo a tu gusto y luego importarlo de la misma forma.

### La regla 60/30/10

Un principio clásico de diseño que EduPress aplica en su sistema de tokens:

| Rol | Proporción | En EduPress | Uso |
|-----|-----------|-------------|-----|
| **Fondo principal** | ~60% | `bg` (`#FFFFFF`), `bgSoft` (`#F6F6F7`) | Texto, áreas de lectura |
| **Color estructural** | ~30% | `brand` — tu color corporativo | Navbar, sidebar, cabeceras |
| **Color acento** | ~10% | `brandDark` — variación más oscura | CTAs, hovers, gradientes |

### Cambiar el color corporativo

En la mayoría de casos, basta con modificar **dos variables**:

```ts
// Modo claro — elige un HEX con contraste ≥ 4.5:1 sobre blanco (#FFFFFF)
const brand = '#ed6e51'

// Modo oscuro — puede ser el mismo o una versión más clara/saturada
const darkBrand = '#f48061'
```

::: tip Herramientas recomendadas para elegir color
- [Coolors.co](https://coolors.co) — generador de paletas
- [Color Hunt](https://colorhunt.co) — paletas curadas
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — verificar contraste WCAG
:::

### Contraste y accesibilidad (WCAG 2.1)

EduPress cumple por defecto con los niveles de contraste mínimos de WCAG 2.1:

| Tipo de texto | Ratio mínimo | Nivel |
|--------------|-------------|-------|
| Texto normal (< 18px o < 14px negrita) | **4.5:1** | AA |
| Texto grande (≥ 18px o ≥ 14px negrita) | **3:1** | AA |
| Texto en callouts (`:::info-box`, etc.) | **7:1** | AAA |

Cuando cambies `brand`, comprueba que el color elegido supera el ratio **4.5:1** sobre fondo blanco `#FFFFFF`. El checker de WebAIM lo calcula automáticamente.

::: info Colores de callouts — no tocar salvo necesidad
Los colores `noteText`, `tipText`, `warningText`, `cautionText` dentro de `colors.ts` están configurados para AAA (> 7:1) sobre los fondos de cada callout. Si los cambias, verifica el contraste.
:::

### Tipografía

La fuente base se define en `colors.ts`:

```ts
const fontBase = [
  "'Roboto'",
  "-apple-system",
  "BlinkMacSystemFont",
  // ...
].join(', ')
```

Para cambiar la fuente, añade tu `@import` de Google Fonts en `design-tokens.css` (al principio del archivo) y actualiza `fontBase` en `colors.ts`.

---

## 3. `logos.ts` — Logos e imágenes institucionales

### Archivos de logo

Coloca tus logos en `src/public/img/`:

| Archivo | Dimensiones recomendadas | Uso |
|---------|------------------------|-----|
| `logo.png` | 48×48 px | Navbar (esquina superior izquierda) |
| `logo-autor.png` | variable, máx. 165px alto | Footer del docente |
| `logo-gva.png` | variable, máx. 60px alto | Institución regional |
| `logo-centro.png` | variable, máx. 90px alto | Centro educativo |

### Modo oscuro para logos

```ts
export const LOGOS = {
  // 'same'     — mismo archivo en claro y oscuro
  // 'invert'   — CSS invierte el logo (útil para logos negros sobre blanco)
  // 'separate' — archivo separado: logo.png → logo-dark.png
  mode: 'separate' as LogoMode,

  darkSuffix: '-dark',  // Se añade antes de la extensión

  heights: {
    autor:  '165px',
    gva:    '60px',
    centro: '90px',
    footer: '75px',
  },
}
```

::: tip ¿Qué modo usar?
- `same` — Logo en color sobre fondo claro y oscuro (si tiene buen contraste en ambos).
- `invert` — Logo en negro: en modo oscuro se invierte a blanco automáticamente con CSS.
- `separate` — Control total: crea `logo.png` (versión clara) y `logo-dark.png` (versión oscura).
:::

---

## 4. `units.ts` — Estructura de navegación

La configuración de módulos y sidebars se documenta en detalle en:

- [Guía: Curso Único](./4-curso-unico) — un módulo, navbar plano.
- [Guía: Curso Modular](./5-curso-modular) — varios módulos, dropdown.

---

## Qué NO debes tocar

| Archivo | Razón |
|---------|-------|
| `src/.vitepress/config.mts` | Lee `project.ts`, `colors.ts`, `logos.ts` y `units.ts`. Solo escala lo que tú configuras. |
| `src/.vitepress/theme/css/design-tokens.css` | Generado dinámicamente desde `colors.ts` en el build. Los cambios manuales se sobreescriben. |
| `src/.vitepress/theme/index.ts` | Bootstrap del tema Vue. No requiere cambios. |
| `src/.vitepress/theme/components/` | Componentes Vue del sistema. No modificar. |

---

**Siguiente paso:** [Crear Contenidos →](./7-crear-contenidos)
