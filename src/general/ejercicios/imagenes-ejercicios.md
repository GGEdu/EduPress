# 🖼️ Imágenes en Ejercicios

Las imágenes funcionan de forma diferente según el tipo de ejercicio que uses.

## En historia gamificada (parallax)

Las imágenes no van como `<img>` dentro del Markdown. Se aplican como `background-image` mediante clases CSS sobre contenedores `.container` dentro del bloque `.cap`.

Hay dos archivos CSS involucrados:

1. **`ejercicios.css`** — Define el scroll parallax y el layout de los bloques `.cap`.
2. **`ejer_imgs.css`** — Asigna la imagen concreta a cada clase de `.container`.

### Clases disponibles

Las clases están definidas en `src/.vitepress/theme/css/ejer_imgs.css`:

| Clase | Imagen asignada |
|-------|-----------------|
| `.container.initial` | `img/ejercicios/1.00.jpeg` |
| `.container.zero` | `img/ejercicios/1.01.jpeg` |
| `.container.first` | `img/ejercicios/1.02.jpeg` |
| `.container.img-first` | `img/ejercicios/1.10.jpeg` |
| `.container.img-first_1` | `img/ejercicios/1.11.jpeg` |
| `.container.img-first_2` | `img/ejercicios/1.12.jpeg` |

### Uso en el markdown del ejercicio

```html
<div class="container img-first"></div>      <!-- pantalla con imagen de fondo -->
<div class="blank"><p>Texto entre pantallas</p></div>
<div class="container img-first_1"></div>    <!-- siguiente pantalla -->
```

### Añadir una imagen parallax nueva

1. Copia la imagen a `src/public/img/ejercicios/nueva.jpeg`.  
   Tamaño recomendado: **1920×1080px mínimo**, formato JPG.

2. Declara la clase en `src/.vitepress/theme/css/ejer_imgs.css`:

   ```css
   .cap .container.mi-clase {
     background-image: url('/EduPress/img/ejercicios/nueva.jpeg');
   }
   ```

3. Úsala en el markdown:

   ```html
   <div class="container mi-clase"></div>
   ```

## En enunciado directo (Markdown)

Las imágenes se insertan como Markdown estándar, igual que en los contenidos:

```markdown
# Imagen normal
![Descripción del ejercicio](/img/ejercicios/mi-imagen.jpg)

# Imagen centrada
![Diagrama del proceso #center](/img/ejercicios/diagrama.png)
```

Las rutas son absolutas desde `src/public/`: empiezan siempre con `/img/...`  
Tamaño recomendado: **1024×768px** en JPG o PNG.

---

[Volver a la introducción de ejercicios](./)
