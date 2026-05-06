---
layout: doc
title: Crear Contenidos
sidebar: true
outline: [2, 3]
aside: true
---

# ✍️ Crear Contenidos

Los contenidos de EduPress son archivos Markdown (`.md`) organizados en carpetas. Cada archivo se convierte en una página del sitio.

## Estructura de archivos

```
src/
└── mi-curso/
    ├── index.md            # Portada del módulo
    └── contenidos/
        ├── 1-introduccion.md
        ├── 2-variables.md
        └── 3-funciones.md
```

::: tip Convención de nombres
Usa prefijos numéricos (`1-`, `2-`, `3-`) para controlar el orden en el sidebar. El nombre del archivo se usará como parte de la URL: `1-introduccion.md` → `/mi-curso/contenidos/1-introduccion`.
:::

## Frontmatter de una página

Cada archivo `.md` debe empezar con un bloque frontmatter YAML:

```md
---
layout: doc
title: Introducción a las Variables
sidebar: true
outline: [2, 3]
aside: true
---
```

| Campo | Valor | Descripción |
|-------|-------|-------------|
| `layout` | `doc` | Diseño de página de contenido (siempre `doc` para contenidos) |
| `title` | texto | Título de la pestaña del navegador |
| `sidebar` | `true` | Muestra el sidebar lateral izquierdo |
| `outline` | `[2, 3]` | Niveles de encabezado en el índice derecho |
| `aside` | `true` | Muestra el índice de sección (tabla de contenidos) |

## Registrar una página en el sidebar

Una vez creado el archivo `.md`, añade una entrada en `units.ts`:

```ts
const baseSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📚 Contenidos',
    collapsed: false,
    items: [
      { text: 'Introducción',    link: '/contenidos/1-introduccion' },
      { text: 'Variables',       link: '/contenidos/2-variables' },    // ← nueva página
      { text: 'Funciones',       link: '/contenidos/3-funciones' },
    ]
  },
]
```

::: warning Los archivos no registrados no aparecen en el sidebar
VitePress los compila igualmente, pero el usuario no los encontrará por navegación. Registra siempre cada página nueva.
:::

## Escribir contenido en Markdown

### Encabezados

```md
# Título principal (H1) — uno por página
## Sección (H2) — aparece en el índice lateral
### Subsección (H3) — aparece en el índice si outline incluye el nivel 3
```

### Listas

```md
- Elemento sin orden
- Otro elemento
  - Subelemento (con indentación de 2 espacios)

1. Elemento numerado
2. Segundo elemento
```

### Énfasis y código

```md
**Negrita** — para términos clave
_Cursiva_ — para énfasis suave
`código en línea` — para nombres de archivos, comandos, variables

\```bash
# Bloque de código con resaltado de sintaxis
npm install
\```
```

### Tablas

```md
| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Celda A   | Celda B   | Celda C   |
| Celda D   | Celda E   | Celda F   |
```

### Imágenes

```md
![Descripción alternativa](/img/contenidos/mi-curso/mi-imagen.jpg)
```

Consulta [Imágenes para Contenido](./11-imagenes) para rutas y formatos.

### Links internos

```md
[Texto del link](./2-variables)           <!-- misma carpeta -->
[Texto del link](../ejercicios/ejercicio) <!-- carpeta adyacente -->
[Texto del link](/mi-curso/contenidos/1-introduccion) <!-- ruta absoluta -->
```

## Bloques enriquecidos

EduPress extiende Markdown con bloques especiales. Consulta el [Catálogo de Componentes](./8-componentes) para ver todos con ejemplos.

**Resumen rápido:**

```md
::: info-box Título opcional
Informacion general o contexto.
:::

::: accent-box success Título opcional
Nota positiva o resultado esperado.
:::

::: tabs
== Pestaña 1
Contenido de la primera pestaña.

== Pestaña 2
Contenido de la segunda pestaña.
:::
```

---

**Siguiente paso:** [Catálogo de Componentes →](./8-componentes)
