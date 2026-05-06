---
layout: doc
title: Crear un Curso Único
sidebar: true
outline: [2, 3]
aside: true
---

# 🎯 Crear un Curso Único

Un curso único tiene **un solo módulo** con navegación plana en el menú superior. Es la opción más sencilla: perfecta para una asignatura, un módulo profesional o un tema concreto.

::: info ¿Cuándo usar el modo único?
- Tienes **una sola unidad** de contenido (un módulo, una asignatura).
- Quieres navegación simple sin menú desplegable.
- Es tu primera vez con EduPress — es el modo más rápido para empezar.

Si después necesitas más unidades, puedes migrar al [curso modular](./5-curso-modular) sin reescribir nada.
:::

## Paso 1 — Clonar e instalar

```bash
# Clona el repositorio (o descarga el ZIP de la plantilla)
git clone https://github.com/GGEdu/EduPress mi-curso
cd mi-curso

# Instala las dependencias (~2-5 minutos)
npm install

# Arranca el servidor de desarrollo
./start-project.sh
```

Abre la URL que aparece en la terminal (normalmente `http://localhost:5173/EduPress/`). Verás la pantalla de inicio de la plantilla.

## Paso 2 — Configura la identidad del sitio

Edita `src/.vitepress/config/project.ts`:

```ts
export const PROJECT = {
  // Ruta base: debe coincidir con el nombre del repositorio en GitHub
  basePath: '/mi-curso/',   // ← Cambia EduPress por el nombre de tu repo

  lang: 'es-ES',

  description: 'Módulo Profesional de Programación Web — IES Ejemplo',

  copyright: 'Copyright © 2025 · IES Ejemplo',
  // ...
}
```

::: tip ¿Por qué es importante `basePath`?
Si tu repositorio se llama `mi-curso`, la URL final será `https://tuusuario.github.io/mi-curso/`. Si `basePath` no coincide, los recursos CSS/JS no cargarán.
:::

## Paso 3 — Define tu módulo en `units.ts`

Edita `src/.vitepress/config/units.ts`. Localiza la constante `baseSidebar` y el bloque `MODULO`, y personalízalos:

```ts
// --- Sidebar de tu módulo ---
const baseSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📚 Contenidos',
    collapsed: false,
    items: [
      { text: 'Introducción',          link: '/contenidos/1-introduccion' },
      { text: 'Tema 1: Variables',     link: '/contenidos/2-variables' },
      { text: 'Tema 2: Funciones',     link: '/contenidos/3-funciones' },
      // Añade más páginas aquí
    ]
  },
]

// --- Registro del módulo ---
export const UNITS = {
  root: { /* no tocar */ },

  MODULO: {
    id: 'MODULO',
    code: 'mi-curso',           // ← Nombre de la carpeta en src/
    title: 'Programación Web',
    fullTitle: 'Módulo Profesional de Programación Web',
    siteTitle: 'Programación</br>Web',
    icon: '💻',
    navbar: baseNavbar,
    sidebar: baseSidebar
  },
}
```

::: warning Importante: `code` debe coincidir con el nombre de la carpeta
Si pones `code: 'mi-curso'`, VitePress buscará los archivos en `src/mi-curso/contenidos/`.
:::

## Paso 4 — Ajusta los colores corporativos

Edita `src/.vitepress/config/colors.ts`. En la mayoría de casos, solo necesitas cambiar dos líneas:

```ts
// Modo claro
const brand = '#ed6e51'       // ← Color principal (hex con buen contraste sobre blanco)

// Modo oscuro (puede ser el mismo o más brillante)
const darkBrand = '#f48061'   // ← Color principal en temas oscuros
```

Si quieres una guía completa de paleta de colores, consulta [Configuración e Identidad](./6-configuracion).

## Paso 5 — Crea tu primera página

Crea la carpeta de tu módulo y una primera página de contenido:

```bash
mkdir -p src/mi-curso/contenidos
```

Crea el archivo `src/mi-curso/contenidos/1-introduccion.md`:

```md
---
layout: doc
title: Introducción
sidebar: true
outline: [2, 3]
aside: true
---

# Bienvenida al módulo

Escribe aquí el contenido de tu primera página en Markdown.

## ¿Qué aprenderemos?

- Punto 1
- Punto 2
- Punto 3
```

También necesitas una portada del módulo en `src/mi-curso/index.md`:

```md
---
layout: doc
title: Programación Web
sidebar: true
aside: true
---

# 💻 Programación Web

Descripción breve del módulo y enlace a la primera página.

[Empezar →](./contenidos/1-introduccion)
```

## Verificación final

Con el servidor en marcha, comprueba:

- [ ] La página de inicio (`/`) muestra el hero de EduPress con tus botones CTA.
- [ ] El menú superior mostrando el nombre de tu módulo.
- [ ] La sidebar lateral con tus páginas.
- [ ] La primera página de contenido renderizada correctamente.
- [ ] El modo oscuro funciona (icono ☀️/🌙 en el navbar).

---

**Siguiente paso:** [Configuración e Identidad →](./6-configuracion)  
**Alternativa:** [Crear un Curso Modular →](./5-curso-modular)
