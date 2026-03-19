# ⚙️ Configuración e Identidad Institucional

Adapta EduPress a los colores y logos de tu institución sin tocar el código de los componentes.

## Paso 1: Preparar los logos

Copia los logos a `src/public/img/`:

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `logo.png` | 48x48px | Navbar principal |
| `logo-autor.png` | 165px alto | Footer (docente/autor) |
| `logo-gva.png` | 60px alto | Institución 1 (comunidad autónoma) |
| `logo-centro.png` | 90px alto | Institución 2 (centro educativo) |

**Formato recomendado:** PNG con fondo transparente.

## Paso 2: Actualizar `config.mts`

Edita `src/.vitepress/config.mts`:

```typescript
// Base path del sitio (debe coincidir con el nombre del repositorio en GitHub)
const BASE_PATH = '/mi-repositorio/'

// Rutas de logos (siguen BASE_PATH automáticamente)
const logoAutorPath = `${BASE_PATH}img/logo-autor.png`
const logoGvaPath = `${BASE_PATH}img/logo-gva.png`
const logoCentroPath = `${BASE_PATH}img/logo-centro.png`
```

Actualiza también el pie de página:

```typescript
footer: {
  message: `<img src="${logoAutorPath}" alt="Docente" style="height:75px; margin: 0 auto; display:block;" />`,
  copyright: 'Copyright © 2025 - Tu Institución'
}
```

## Paso 3: Personalizar el título en `units.ts`

El campo `siteTitle` aparece en el navbar. El `</br>` fuerza un salto de línea:

```typescript
// src/.vitepress/units.ts
export const UNITS: Record<string, UnitConfig> = {
  general: {
    siteTitle: 'Tu Centro</br>Educativo',
    icon: '📘',
    // ...
  }
}
```

## Paso 4: Colores corporativos

Edita `src/.vitepress/theme/css/design-tokens.css`.

EduPress usa un sistema de tokens CSS que respeta automáticamente el modo claro y oscuro. Solo necesitas cambiar el color primario de tu institución:

```css
:root {
  /* Color primario (modo claro) — sustituye por el HEX corporativo */
  --vp-c-brand:   #ed6e51;
  --vp-c-brand-1: #ed6e51;
  --vp-c-brand-2: #ed6e51;
  --vp-c-brand-3: #ed6e51;
}

.dark {
  /* Modo oscuro: usa una variante ligeramente más clara para cumplir WCAG */
  --vp-c-brand:   #f48061;
  --vp-c-brand-1: #fc9578;
}
```

El color primario se aplica automáticamente a:

- Enlaces activos y hover
- Botones y elementos interactivos
- Bordes de bloques informativos (`info-box`, `tip-box`...)
- Elementos activos en sidebar y navbar

## Archivos CSS del sistema

| Archivo | Propósito |
|---------|-----------|
| `design-tokens.css` | Colores, tipografía, sombras (editar aquí para branding) |
| `styles.css` | Estilos generales y layout de VitePress (no suele tocarse) |
| `ejercicios.css` | Layout parallax para ejercicios gamificados |
| `ejer_imgs.css` | Mapa de clases CSS → imágenes parallax (ver [Imágenes en Ejercicios](../ejercicios/imagenes-ejercicios)) |
| `slides.css` | Motor visual de diapositivas y lightbox |

**Siguiente paso:** [Crear Contenidos](./6-crear-contenidos)
