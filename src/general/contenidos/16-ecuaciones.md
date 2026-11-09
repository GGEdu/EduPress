---
layout: doc
title: Ecuaciones
description: Fórmulas matemáticas con $…$ y $$…$$, en el texto, en bloque y dentro de una diapositiva libre
---

# ➗ Ecuaciones

EduPress escribe las fórmulas en LaTeX entre signos de dólar y las compila al generar el sitio con MathJax. No hace falta ningún script en la página.

## Fórmula en línea

Se escribe entre un `$` y otro, y va dentro de la frase:

```md
La energía de un cuerpo en reposo es $E = mc^2$, donde $c$ es la velocidad de la luz.
```

La energía de un cuerpo en reposo es $E = mc^2$, donde $c$ es la velocidad de la luz.

## Fórmula en bloque

Con dos dólares en cada lado, la fórmula va centrada en su propia línea:

```md
$$
\int_{0}^{1} x^{2}\,dx = \frac{1}{3}
$$
```

$$
\int_{0}^{1} x^{2}\,dx = \frac{1}{3}
$$

Un bloque de fórmula necesita una línea en blanco antes y después, como cualquier párrafo.

## Fórmulas con subíndices, fracciones y sumas

```md
La media de $n$ datos es $\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$.

$$
x = \frac{-b \pm \sqrt{b^{2}-4ac}}{2a}
$$
```

La media de $n$ datos es $\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$.

$$
x = \frac{-b \pm \sqrt{b^{2}-4ac}}{2a}
$$

## Dentro de una diapositiva libre

Una fórmula dentro de una `caja` de una diapositiva libre se escribe igual que en el resto del texto:

```md
::::: lienzo fondo=#F5EFE9
:::: caja x=6 y=10 w=88 h=auto tam=34
Teorema de Pitágoras:

$$
a^{2} + b^{2} = c^{2}
$$
::::
:::::
```

<SlidesViewer>

::::: lienzo fondo=#F5EFE9
:::: caja x=6 y=10 w=88 h=auto tam=34
Teorema de Pitágoras:

$$
a^{2} + b^{2} = c^{2}
$$
::::

:::: caja x=6 y=62 w=88 h=auto tam=26
Una fórmula en línea también funciona: $a^{2} + b^{2} = c^{2}$.
::::
:::::

</SlidesViewer>

## Qué conviene saber

- Para un dólar que no es una fórmula, escríbelo como `\$`, sobre todo si hay otro dólar en la misma línea: `Cuesta \$5 y $x^2$ es una fórmula`.
- Dentro de un bloque de código (las comillas triples) el dólar no se interpreta: se muestra tal cual, como en los ejemplos de arriba.
- Las fórmulas se compilan al generar el sitio. Una fórmula mal escrita no para el build: en la página aparece el mensaje de error de MathJax en lugar de la fórmula, así que conviene revisarla al previsualizar.
