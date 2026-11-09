---
layout: page
title: Diapositivas libres
description: Diapositivas con cajas colocadas a mano, que se apilan en pantallas estrechas
---

<SlidesViewer>

::::: lienzo fondo=#F5EFE9 transicion=fundido
:::: caja x=6 y=8 w=56 h=auto tam=44 color=marca
## ¿Qué es un framework?
::::

:::: caja x=64 y=8 w=30 h=62 r=3 radio=4 sombra
![Diapositiva de ejemplo](/img/contenidos/general/diapositivas/03.jpg)
::::

:::: caja x=6 y=34 w=54 h=auto tam=26
Un framework es como la cocina de un restaurante: los fogones **ya están**.

- Rutas, plantillas y base de datos.
- Tú pones la receta.
::::

:::: caja x=6 y=78 w=40 h=12 fondo=marca color=fondo radio=50 tam=24 decorativa
::::

:::: forma flecha x=48 y=80 w=14 h=8 relleno=marca decorativa
::::
:::::

::: notas
v1:cHJ1ZWJhLWl2:Tm90YXMgZGUgZWplbXBsbywgY2lmcmFkYXM
:::

---

::::: lienzo fondo=degradado:marca,verdeazulado
:::: caja x=0 y=0 w=100 h=100
![Fondo de la portada](/img/contenidos/general/diapositivas/07.jpg)
::::

:::: caja x=8 y=30 w=84 h=auto tam=64 color=#FFFFFF fondo=#1F2937 radio=2
## Diapositivas libres
::::

:::: caja x=8 y=58 w=60 h=auto tam=28 color=#FFFFFF fondo=#1F2937
Coloca cada caja donde quieras. En un móvil se apilan en el orden del fichero, y la imagen que cubre el lienzo pasa a ser su fondo.
::::
:::::

</SlidesViewer>

## Cómo se escriben

Cada diapositiva libre es un bloque `lienzo` con cajas dentro. Cada caja lleva su
posición y su tamaño en porcentajes del lienzo (`x`, `y`, `w`, `h`), y dentro,
Markdown normal. EduPress Studio las escribe por ti al arrastrar las cajas.
