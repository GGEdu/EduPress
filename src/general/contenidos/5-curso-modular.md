---
layout: doc
title: Crear un Curso Modular
sidebar: true
outline: [2, 3]
aside: true
---

# 🗂️ Crear un Curso Modular

Un curso modular tiene **varias unidades** (UD1, UD2, sesiones, temas...) y genera automáticamente un menú desplegable en el navbar. Cada unidad tiene su propio sidebar.

::: info ¿Cuándo usar el modo modular?
- Tu curso se divide en **unidades didácticas** bien diferenciadas.
- Quieres que el alumno sepa en qué unidad está con un menú desplegable.
- Necesitas sidebars independientes por unidad.

Si empiezas con un módulo único y luego necesitas añadir más, puedes escalar sin reescribir nada: solo añadir entradas en `units.ts` y crear las carpetas correspondientes.
:::

## Pasos 1–4: igual que el curso único

Sigue los **pasos 1 a 4** de la guía [Curso Único](./4-curso-unico): clonar, instalar, configurar `project.ts`, ajustar colores. Vuelve aquí cuando tengas el primer módulo funcionando.

## Paso 5 — Añade más unidades en `units.ts`

Edita `src/.vitepress/config/units.ts` y define un sidebar por unidad:

```ts
// --- Sidebar de la Unidad 1 ---
const sidebarUD1: DefaultTheme.SidebarItem[] = [
  {
    text: '📚 UD1 — Introducción',
    collapsed: false,
    items: [
      { text: 'Presentación',    link: '/contenidos/1-presentacion' },
      { text: 'Conceptos clave', link: '/contenidos/2-conceptos' },
      { text: 'Ejercicio 1',     link: '/contenidos/3-ejercicio' },
    ]
  },
]

// --- Sidebar de la Unidad 2 ---
const sidebarUD2: DefaultTheme.SidebarItem[] = [
  {
    text: '📚 UD2 — Desarrollo',
    collapsed: false,
    items: [
      { text: 'Introducción',    link: '/contenidos/1-intro' },
      { text: 'Práctica guiada', link: '/contenidos/2-practica' },
    ]
  },
]

// --- Registro de unidades ---
export const UNITS = {
  root: { /* no tocar */ },

  UD1: {
    id: 'UD1',
    code: 'mi-curso',           // → archivos en src/mi-curso/
    title: 'UD1 — Introducción',
    fullTitle: 'Unidad 1 — Introducción a la Programación',
    siteTitle: 'UD1</br>Introducción',
    icon: '📘',
    navbar: baseNavbar,
    sidebar: sidebarUD1
  },

  UD2: {
    id: 'UD2',
    code: 'mi-modulo-2',        // → archivos en src/mi-modulo-2/
    title: 'UD2 — Desarrollo',
    fullTitle: 'Unidad 2 — Desarrollo de Aplicaciones',
    siteTitle: 'UD2</br>Desarrollo',
    icon: '⚙️',
    navbar: baseNavbar,
    sidebar: sidebarUD2
  },

  // Añade más unidades aquí siguiendo el mismo patrón...
}
```

::: tip El sistema detecta el modo automáticamente
- **1 unidad** en `UNITS` (sin contar `root`) → navbar plano, sin dropdown.
- **2+ unidades** → navbar con menú desplegable por unidad.

No hay que cambiar ningún otro archivo: el navbar y el sidebar se construyen solos.
:::

## Paso 6 — Crea las carpetas de cada unidad

```bash
# Unidad 1 (usando el code 'mi-curso')
mkdir -p src/mi-curso/contenidos

# Unidad 2 (usando el code 'mi-modulo-2')
mkdir -p src/mi-modulo-2/contenidos
```

Crea los archivos `.md` correspondientes a cada entrada del sidebar.

**Portada de unidad** `src/mi-curso/index.md`:

```md
---
layout: doc
title: UD1 — Introducción
sidebar: true
aside: true
---

# 📘 Unidad 1 — Introducción

Descripción de la unidad.

[Empezar →](./contenidos/1-presentacion)
```

**Portada del segundo módulo** `src/mi-modulo-2/index.md`:

```md
---
layout: doc
title: UD2 — Desarrollo
sidebar: true
aside: true
---

# ⚙️ Unidad 2 — Desarrollo

Descripción de la unidad.

[Empezar →](./contenidos/1-intro)
```

## Paso 7 — Actualiza el navbar

La constante `baseNavbar` en `units.ts` controla qué aparece en el menú superior. Para un curso modular, añade un dropdown con las unidades:

```ts
const baseNavbar: DefaultTheme.NavItem[] = [
  { text: '🏠 Inicio', link: '/' },
  {
    text: '📚 Unidades',
    items: [
      { text: 'UD1 — Introducción', link: '/mi-curso/' },
      { text: 'UD2 — Desarrollo',   link: '/mi-modulo-2/' },
    ]
  },
]
```

## Verificación final

Con el servidor en marcha:

- [ ] La página de inicio (`/`) muestra el landing de EduPress.
- [ ] El navbar muestra un dropdown con tus unidades.
- [ ] Cada unidad tiene su propio sidebar lateral.
- [ ] Los links del sidebar llevan a los archivos correctos.
- [ ] El modo oscuro funciona en todas las unidades.

::: warning Dead links en el build
Si el build falla con "dead links", comprueba que cada `link` del sidebar tiene su archivo `.md` correspondiente en la carpeta de la unidad.
:::

---

**Siguiente paso:** [Configuración e Identidad →](./6-configuracion)
