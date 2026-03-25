---
layout: doc
sidebar: true
outline: [2, 3]
aside: true
title: Ejercicios
---

# 🎮 Ejercicios en EduPress

EduPress ofrece dos enfoques para presentar ejercicios al alumnado. Puedes usarlos por separado o combinarlos en el mismo módulo.

## Enfoque A — Historia gamificada (parallax)

El ejercicio se presenta como una experiencia visual envolvente. El alumno avanza scrolleando entre pantallas con imágenes de fondo hasta llegar al enunciado.

Las imágenes de fondo no van en el Markdown como `<img>`. Se aplican como `background-image` por CSS sobre contenedores `.container` dentro de un bloque `.cap`.

::: tip-box Cuándo usarlo
Cuando quieres motivar al alumno con contexto visual antes de presentarle la tarea. La historia puede terminar con un enlace al enunciado.
:::

[Ver ejemplo →](./ejercicio)

## Enfoque B — Enunciado directo (Markdown)

El ejercicio se presenta como un documento Markdown estructurado: enunciado, objetivos, requisitos, criterios de evaluación y entregable.

::: tip-box Cuándo usarlo
Cuando priorizas claridad, rapidez de edición o necesitas que el ejercicio sea imprimible y fácil de mantener.
:::

[Ver ejemplo →](./enunciado)

## Combinar los dos enfoques

Los enfoques son compatibles. Un flujo habitual es:

1. El alumno entra en la **historia gamificada**.
2. Avanza entre las pantallas visuales que dan contexto al reto.
3. La última pantalla incluye un enlace al **enunciado**.

Así el docente controla cuándo se revelan los detalles de la tarea.

## Imágenes

Las imágenes funcionan de forma diferente en cada enfoque:

- **Historia gamificada** → imágenes de fondo CSS (`background-image`), sin etiqueta `<img>`.
- **Enunciado directo** → imágenes Markdown estándar (`![desc](/img/...)`).

[Guía de imágenes en ejercicios →](./imagenes-ejercicios)
