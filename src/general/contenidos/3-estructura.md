# 🗂️ Estructura del Proyecto

## Árbol de directorios

```
EduPress/
├── src/
│   ├── index.md                    # Página de inicio del sitio
│   ├── general/                    # Módulo principal (estructura modelo)
│   │   ├── index.md                # Portada del módulo
│   │   ├── contenidos/
│   │   │   ├── 1-introduccion.md
│   │   │   ├── 2-instalacion.md
│   │   │   ├── 3-estructura.md
│   │   │   ├── 4-modulos.md
│   │   │   ├── 5-configuracion.md
│   │   │   ├── 6-crear-contenidos.md
│   │   │   ├── 7-diapositivas.md
│   │   │   ├── 8-diapositivas-demo.md
│   │   │   ├── 9-imagenes.md
│   │   │   └── 10-despliegue.md
│   │   └── ejercicios/
│   │       ├── index.md            # Introducción y guía de modelos
│   │       ├── ejercicio.md        # Ejercicio gamificado (Modelo A)
│   │       ├── enunciado.md        # Enunciado estándar (Modelo B)
│   │       ├── imagenes-ejercicios.md  # Imágenes en ejercicios
│   │       └── final.md            # Proyecto final
│   ├── .vitepress/
│   │   ├── config.mts              # Motor VitePress — lee de config/ (no tocar)
│   │   ├── config/                 # ⭐ AQUÍ SE PERSONALIZA EL SITIO
│   │   │   ├── project.ts          # ⭐ URL base, idioma, redes sociales, copyright
│   │   │   ├── colors.ts           # ⭐ Colores corporativos y tipografía
│   │   │   ├── logos.ts            # ⭐ Logos y modo claro/oscuro
│   │   │   └── units.ts            # ⭐ Módulos, navbar y sidebar
│   │   ├── unitHelpers.ts          # Transformadores de rutas (no tocar)
│   │   └── theme/
│   │       ├── index.ts            # Bootstrap del tema Vue
│   │       ├── css/
│   │       │   ├── styles.css          # Estilos generales y layout
│   │       │   ├── design-tokens.css   # Tokens de color e identidad
│   │       │   ├── ejercicios.css      # Layout parallax para ejercicios
│   │       │   ├── ejer_imgs.css       # Mapa de imágenes parallax → CSS
│   │       │   └── slides.css          # Motor visual de diapositivas
│   │       └── components/         # Componentes Vue reutilizables
│   └── public/
│       └── img/
│           ├── logo.png            # Logo navbar (48x48px)
│           ├── logo-autor.png      # Footer docente (165px alto)
│           ├── logo-gva.png        # Institución 1 (60px)
│           ├── logo-centro.png     # Institución 2 (90px)
│           ├── contenidos/         # Imágenes para páginas de contenido
│           └── ejercicios/         # Imágenes para el parallax de ejercicios
├── docker-compose.yml
├── package.json
├── start-project.sh                # ⭐ Arranque fácil del servidor
├── stop-project.sh
└── status-project.sh
```

## Archivos clave

| Archivo | Propósito |
|---------|-----------|
| `src/.vitepress/config/project.ts` | ⭐ URL base, idioma, redes sociales, copyright |
| `src/.vitepress/config/colors.ts` | ⭐ Colores corporativos y tipografía |
| `src/.vitepress/config/logos.ts` | ⭐ Logos y modo claro/oscuro |
| `src/.vitepress/config/units.ts` | ⭐ Módulos: navbar y sidebar |
| `src/.vitepress/config.mts` | Motor VitePress — lee de `config/` (no tocar) |
| `src/.vitepress/theme/css/design-tokens.css` | Sistema de tokens CSS completo (no tocar) |
| `src/general/` | Módulo de contenido principal (sirve como plantilla de módulo) |

## Convención de rutas

Las rutas del sitio siguen el patrón:

```
/EduPress/{unidad}/contenidos/{archivo}
/EduPress/{unidad}/ejercicios/{archivo}
```

Ejemplo con unidad `general`:

```
/EduPress/general/contenidos/1-introduccion
/EduPress/general/ejercicios/ejercicio
```

La ruta de cada unidad corresponde al valor de `code` en `src/.vitepress/config/units.ts`.

**Siguiente paso:** [Módulos y Unidades](./4-modulos)
