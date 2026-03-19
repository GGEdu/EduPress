# 04 - Crear Contenidos

Los contenidos son páginas Markdown dentro de `src/{unidad}/contenidos/`.

## Crear un contenido nuevo

**1. Crear el archivo:**

```bash
# Ejemplo para la unidad 'general'
touch src/general/contenidos/4-tema-nuevo.md
```

**2. Añadir front-matter:**

```markdown
---
layout: doc
title: Tema Nuevo
sidebar: true
outline: true
---

# 4. Tema Nuevo

Tu contenido aquí...
```

**3. Registrar en `src/.vitepress/units.ts`:**

```typescript
const baseNavbar: DefaultTheme.NavItem[] = [
  {
    text: '📚 Contenidos',
    items: [
      { text: '1. Introducción', link: '/contenidos/1-introduccion' },
      { text: '4. Tema Nuevo', link: '/contenidos/4-tema-nuevo' },  // ⭐ nuevo
    ]
  }
]

const baseSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '📚 Contenidos',
    collapsed: true,
    items: [
      { text: '1. Introducción', link: '/contenidos/1-introduccion' },
      { text: '4. Tema Nuevo', link: '/contenidos/4-tema-nuevo' },  // ⭐ nuevo
    ]
  }
]
```

## Bloques disponibles en Markdown

### Bloques de información

```markdown
::: info-box Título opcional
Contenido informativo general.
:::

::: note-box
Una nota de contexto o aclaración.
:::

::: accent-box
Destacado especial, elemento clave.
:::

::: tip-box Consejo
Sugerencia práctica para el alumnado.
:::

::: warning-box Atención
Advertencia sobre un error común.
:::

::: danger-box Peligro
Error crítico o acción irreversible.
:::
```

### Pestañas

```markdown
::: tabs
== Opción A
Contenido de la primera pestaña.

== Opción B
Contenido de la segunda pestaña.
:::
```

### Citas

```markdown
> Una cita inspiradora o reflexión de contexto.
```

### Diagramas Mermaid

Envuelve el bloque en `<div v-pre>` para evitar conflictos de renderizado de Vue:

```markdown
<div v-pre>

```mermaid
graph TD
  A[Inicio] --> B[Proceso]
  B --> C[Fin]
` ``

</div>
```

### Imágenes centradas

Usa el sufijo `#center` en el atributo `alt` de la imagen:

```markdown
![Descripción del esquema #center](/img/contenidos/mi-imagen.jpg)
```

## Bloques en diapositivas (SlidesViewer)

Todos los bloques anteriores funcionan también dentro de `<SlidesViewer>` y se adaptan automáticamente al tamaño de la diapositiva. → Ver [Crear Diapositivas](./7-diapositivas).

## Componentes Vue adicionales

Disponibles fuera de slides en cualquier página `layout: doc`:

```markdown
<Badge text="Importante" />

<Button text="Descargar" href="/archivo.pdf" />

<Quote>
Una cita inspiradora aquí
</Quote>

<TwoColumns>
  <template #left>Columna izquierda</template>
  <template #right>Columna derecha</template>
</TwoColumns>
```

**Siguiente paso:** [Crear Diapositivas](./7-diapositivas)
