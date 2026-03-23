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

Edita `src/.vitepress/config/logos.ts`. Es el **único lugar** donde decides cómo se adaptan los logos al cambiar entre modo claro y oscuro:

```typescript
// src/.vitepress/config/logos.ts
export const LOGOS = {
  mode: 'same',        // ← elige el modo (ver tabla)
  darkSuffix: '-dark',
  // ...
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

Si usas un sufijo diferente, actualiza `darkSuffix` en `config/logos.ts`:

```typescript
// src/.vitepress/config/logos.ts
export const LOGOS = {
  mode: 'separate',
  darkSuffix: '-oscuro',   // → logo-autor-oscuro.png
  // ...
}
```

## Paso 3: Personalizar el título en `config/units.ts`

El campo `siteTitle` aparece en el navbar. El `</br>` fuerza un salto de línea:

```typescript
// src/.vitepress/config/units.ts
export const UNITS: Record<string, UnitConfig> = {
  general: {
    siteTitle: 'Tu Centro</br>Educativo',
    icon: '📘',
    // ...
  }
}
```

## Paso 4: Colores corporativos

Edita `src/.vitepress/config/colors.ts`. No es necesario tocar ningún archivo CSS.

Las dos variables principales son `brand` (modo claro) y `darkBrand` (modo oscuro). El resto de variaciones se puede dejar como está o ajustar a tu gusto.

**Ejemplo: cambiar al azul corporativo de tu centro**

```typescript
// src/.vitepress/config/colors.ts

// ── Colores modo claro ────────────────────────────────────────────────────────
const brand        = '#2563eb'   // ← tu color corporativo
const brandLight   = '#3b82f6'   // un poco más claro
const brandLighter = '#60a5fa'   // aún más claro
const brandDark    = '#1d4ed8'   // más oscuro (hover intenso)
const brandDarker  = '#1e40af'   // el más oscuro

// ── Colores modo oscuro ───────────────────────────────────────────────────────
const darkBrand    = '#60a5fa'   // ← versión más clara para fondo oscuro
```

::: tip-box Regla general para el color oscuro
El `darkBrand` debe ser una versión **más clara** del `brand` de modo claro, para mantener contraste sobre el fondo oscuro del sitio. Normalmente subir 2-3 tonos en la paleta es suficiente.
:::

Los colores configurados aquí se inyectan automáticamente en el `<head>` del sitio con mayor prioridad que el sistema de tokens CSS interno. **No necesitas editar `design-tokens.css`.**

El color principal se aplica automáticamente a:

- Enlaces activos y hover
- Botones y elementos interactivos
- Bordes de bloques informativos (`info-box`, `tip-box`...)
- Elementos activos en sidebar y navbar

## Archivos CSS del sistema

Estos archivos forman el motor visual — **no necesitas tocarlos** para personalizar el sitio:

| Archivo | Propósito |
|---------|-----------|
| `design-tokens.css` | Sistema completo de tokens CSS (colores, tipografía, sombras) |
| `styles.css` | Estilos generales y layout de VitePress |
| `ejercicios.css` | Layout parallax para ejercicios gamificados |
| `ejer_imgs.css` | URLs de imágenes parallax — generadas desde `config/project.ts` |
| `slides.css` | Motor visual de diapositivas y lightbox |

**Siguiente paso:** [Crear Contenidos](./6-crear-contenidos)
