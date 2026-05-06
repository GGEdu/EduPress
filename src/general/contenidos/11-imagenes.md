# 🖼️ Imágenes para Contenidos

Las imágenes para contenidos viven en `src/public/img/contenidos/`. VitePress las sirve como estáticos.

> Las imágenes de ejercicios (parallax y estándar) están documentadas en [Imágenes en Ejercicios](../ejercicios/imagenes-ejercicios).

## Estructura recomendada

```
src/public/img/
├── logo.png                    # Logo navbar (48x48px)
├── logo-autor.png              # Footer docente (165px alto)
├── logo-gva.png                # Institución 1 (60px alto)
├── logo-centro.png             # Institución 2 (90px alto)
└── contenidos/
    ├── introduccion.jpg        # Imágenes para capítulos de contenido
    ├── arquitectura.png
    └── diagrama.svg
```

## Usar imágenes en contenidos Markdown

```markdown
# Imagen normal
![Descripción](/img/contenidos/general/mi-imagen.jpg)

# Imagen centrada (sufijo #center en el alt)
![Descripción del diagrama #center](/img/contenidos/general/diagrama.png)

# Imagen con tamaño personalizado (HTML directo)
<img src="/img/contenidos/general/mi-imagen.jpg" style="width: 300px; margin: 0 auto; display: block;" />
```

> Las rutas son **absolutas desde `src/public/`**: empiezan siempre con `/img/...`

## Tamaños óptimos

| Uso | Tamaño recomendado | Formato |
|-----|--------------------|---------|
| Logo navbar | 48x48px | PNG transparente |
| Logo footer | 165px alto | PNG transparente |
| Logo institución | 60-90px alto | PNG transparente |
| Contenidos | 800x600px | JPG / PNG |
| Screenshots | 1280px ancho máx. | PNG |
| Gráficos vectoriales | sin límite | SVG |

## Problemas frecuentes

| Problema | Causa | Solución |
|----------|-------|----------|
| Imagen no carga | Ruta relativa usada | Usar ruta absoluta: `/img/...` |

**Siguiente paso:** [Despliegue y Troubleshooting](./12-despliegue)
