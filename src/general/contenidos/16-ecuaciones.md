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

Pon cada `$$` **solo en su línea**. Si el de apertura va pegado al final de una frase (`Texto pegado:$$`), la fórmula no se cierra bien y el resto de la página desaparece. Para leerlo mejor, déjale además una línea en blanco antes y después, como a cualquier párrafo.

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

## Precios con dólar

Si escribes precios con `$`, pon `\$`. Desde esta versión, algunos pares de `$` en la misma línea se toman como fórmula, y el texto entre ellos sale en letra matemática. Esto cambia también los cursos que ya existían: revisa sus precios antes de publicar.

```md
Cuesta \$5 el cuaderno y \$12 el libro.
```

## Un `$$` sin cerrar

Un bloque `$$` necesita su cierre. Si falta, el texto que sigue se trata como fórmula: no da error, pero el resto de la página se ve roto, con las frases mezcladas con la fórmula y los `$$` sobrantes a la vista.

El build no falla, pero avisa en la consola con el fichero y la línea del `$$` que sobra:

```text
[EduPress] Un `$$` sin cerrar en general/…/pagina.md, línea 9: el resto de la página se toma como fórmula. …
```

Para arreglarlo, busca la línea indicada y añade el `$$` que falta. Un `$$` dentro de un bloque de código o en un `código` en línea no cuenta.

## Otras cosas que conviene saber

- Dentro de un bloque de código (las comillas triples) el dólar no se interpreta: se muestra tal cual, como en los ejemplos de arriba.
- Las fórmulas se compilan al generar el sitio. Una fórmula mal escrita no para el build: en la página aparece el mensaje de error de MathJax en lugar de la fórmula, así que conviene revisarla al previsualizar.
- Por seguridad, MathJax no admite `\href`, `\class`, `\style` ni `\cssId`: los enlaces y los estilos se escriben en Markdown, no dentro de una fórmula.
