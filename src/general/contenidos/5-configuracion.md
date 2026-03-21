# ⚙️ Configuración e Identidad Institucional

Adapta EduPress a los colores y logos de tu institución sin tocar el código de los componentes.

## Paso 1: Preparar los logos

Copia los logos a `src/public/img/`:

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `logo.png` | 48x48px | Navbar principal |
| `logo-autor.png` | 165px alto | Sidebar y footer (docente/autor) |
| `logo-gva.png` | 60px alto | Institución 1 (comunidad autónoma) |
| `logo-centro.png` | 90px alto | Institución 2 (centro educativo) |

**Formato recomendado:** PNG con fondo transparente.

## Paso 2: Configurar logos claro/oscuro

Edita el archivo `src/.vitepress/branding.ts`. Es el **único lugar** donde decides cómo se adaptan los logos al cambiar entre modo claro y oscuro:

```typescript
export const LOGO_BRANDING: LogoBrandingConfig = {
  mode: 'same',      // ← elige el modo (ver tabla)
  darkSuffix: '-dark',
}
```

Elige el `mode` según tu caso:

| Modo | Cuándo usarlo | Archivos necesarios |
|------|---------------|---------------------|
| `'same'` | El logo se ve bien en ambos fondos (p.ej. logo a color sobre fondo transparente) | Solo los 4 archivos base |
| `'invert'` | Logo negro sobre fondo transparente — se convierte en blanco automáticamente en dark mode mediante CSS | Solo los 4 archivos base |
| `'separate'` | Quieres un logo completamente distinto en dark mode | Los 4 archivos base + sus variantes `*-dark.png` |

### Modo `'separate'`: archivos adicionales

Coloca las versiones oscuras en la misma carpeta `src/public/img/` con el sufijo `-dark` antes de la extensión:

```
src/public/img/
├── logo.png                ← claro (navbar)
├── logo-dark.png           ← oscuro (navbar)
├── logo-autor.png          ← claro (sidebar + footer)
├── logo-autor-dark.png     ← oscuro (sidebar + footer)
├── logo-gva.png            ← claro
├── logo-gva-dark.png       ← oscuro
├── logo-centro.png         ← claro
└── logo-centro-dark.png    ← oscuro
```

Si usas un sufijo diferente, actualiza `darkSuffix`:

```typescript
export const LOGO_BRANDING: LogoBrandingConfig = {
  mode: 'separate',
  darkSuffix: '-oscuro',   // → logo-autor-oscuro.png
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
