---
layout: doc
title: Uso de Diapositivas
---

# 🎨 Presentaciones y Diapositivas

EduPress incluye un sistema completo de presentaciones integrado en tus contenidos. Puedes crear de forma muy visual y accesible diapositivas directamente escribiendo Markdown y usando el componente `<SlidesViewer>`.

A continuación, se detalla la documentación completa para crear y visualizar presentaciones.

## 🚀 ¿Cómo se usan?

Para insertar una presentación en cualquier página, debes envolver tus diapositivas dentro del componente contenedor `<SlidesViewer>`. Para crear cada diapositiva individual, separas el contenido usando el marcador `---` (tres guiones) como en el siguiente ejemplo:

```md
<SlidesViewer>

# Diapositiva 1
Contenido inicial introductorio. 

---

# Diapositiva 2
Más detalles y explicaciones.

---

# Diapositiva 3
Fin de la presentación.

</SlidesViewer>
```

## 🎨 Bloques y Estilos Especiales

Dentro de tus diapositivas puedes utilizar las mismas herramientas, estilos y componentes de VitePress, pero la presentación los adapta automáticamente al tamaño y escala del contenedor visual.

### Bloques de información y pestañas

Todos los bloques disponibles en contenidos (`:::info-box`, `:::warning-box`, `:::tip-box`, pestañas, citas...) funcionan también dentro de `<SlidesViewer>` y se adaptan automáticamente al tamaño de la diapositiva. Consulta la lista completa en [Crear Contenidos](./6-crear-contenidos).

### Imágenes y Zoom

Para centrar imágenes dentro de una diapositiva usa el sufijo `#center` en el `alt`. → Ver [Imágenes para Contenido](./9-imagenes).

**Sistema de Zoom y Ampliación (Lightbox):**
Hacer clic en las imágenes dentro y fuera de la presentación en modo pantalla completa (**Lightbox**) permite usar el visualizador avanzado.
Si expandes una presentación o clickeas una imagen nativa, puedes utilizar los controles de Zoom (`+`, `-`) y Reset (`⌂`) que EduPress incorpora en la parte superior sin interferir con las imágenes subyacentes.

## ⚙️ Pantalla Completa y Controles

Al renderizar la presentación vía `<SlidesViewer>`, verás que las diapositivas inicialmente actúan como un **bloque incrustado** en la página. Sin embargo, este componente provee controles automáticos.

- **Modo Pantalla Completa:** En la parte inferior derecha de cada presentación incrustada verás un icono de expansión (⛶). Si lo pulsas, la diapositiva cambiará a un diseño *Lightbox Fullscreen* bloqueando el avance en del scroll del sitio.
- **Navegación Táctil y Teclado:** Utiliza las flechas `←` y `→` de tu teclado para moverte entre la diapositiva, o las flechas de navegación visuales a izquierda y derecha.

## 💡 Recomendaciones

1. **Evita la sobrecarga cognitiva:** Al escribir dentro del `<SlidesViewer>`, limita la cantidad de texto al mínimo estricto. Usa viñetas y bloques de diseño (`::: tip`) para llamar la atención en el modo panorámico.
2. **Aprovecha el soporte para Código:** Gracias a VitePress y Vue, puedes insertar bloques de código completo en cualquier lenguaje y este conservará su resaltado de estructura (`syntax-highlighting`).
3. **Imágenes ligeras y de contraste:** En el modo diapositiva es recomendable usar imágenes SVG o PNG transparentes para un estilo coherente en los dos modos (`.light` y `.dark`).

---

<br/>

*Disfruta desarrollando documentaciones impresionantes y presentaciones combinadas con EduPress.*

**Siguiente paso:** [Catálogo de Patrones de Diapositivas](./8-diapositivas-demo)
