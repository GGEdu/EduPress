# 📚 EduPress - Plantilla Educativa Modular

**Plantilla educativa VitePress para crear cursos y temarios online con estructura modular por unidades.**  
Diseñada para docentes que necesitan una presentación clara, atractiva y fácil de mantener sin complejidad técnica.

---

## 📋 Tabla de Contenidos

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Ejecución del Servidor](#ejecución-del-servidor)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Configuración de Institución](#configuración-de-institución)
6. [Decisión: Módulo Único vs Unidades](#decisión-módulo-único-vs-unidades)
7. [Crear Contenidos](#crear-contenidos)
8. [Crear Ejercicios](#crear-ejercicios)
9. [Gestionar Imágenes](#gestionar-imágenes)
10. [Despliegue](#despliegue)

---

## Requisitos

### Software necesario

- **Node.js 16+** - [Descargar](https://nodejs.org/)
- **npm 8+** - Se instala con Node.js
- **Git** - [Descargar](https://git-scm.com/)
- *Opcional:* **Docker + Docker Compose** - Para entorno containerizado

### Verificar instalación

```bash
node --version     # Debe mostrar v16 o superior
npm --version      # Debe mostrar 8 o superior
git --version      # Debe mostrar la versión de Git

# Ejemplo de salida esperada:
# v18.14.2
# 8.19.4
# git version 2.40.0
```

---

## Instalación

### Paso 1: Clonar el repositorio

```bash
# Reemplaza URL_DEL_REPOSITORIO con la URL del proyecto
git clone URL_DEL_REPOSITORIO
cd EduPress
```

### Paso 2: Instalar dependencias

```bash
npm install

# Esto descargará todas las librerías necesarias (~500MB)
# Tarda 2-5 minutos depende de tu conexión
```

### Paso 3: Verificar estructura

```bash
ls -la src/

# Debes ver:
# index.md
# .vitepress/    (configuración)
# UD1/           (contenidos para Unidad 1)
# public/        (imágenes y recursos)
```

✅ **Instalación completada.**

---

## Ejecución del Servidor

### Opción A: Con Scripts Automáticos (Recomendado)

```bash
# Iniciar servidor de desarrollo
./start-project.sh

# En otra terminal: ver estado y URL de acceso
./status-project.sh

# Ver preview de producción (opcional)
./start-project.sh preview

# Detener servidor
./stop-project.sh
```

**Ventajas:** Puertos automáticos, sin conflictos, gestión sencilla.

### Opción B: Sin Scripts

```bash
# Desarrollo (con hot reload)
npm run docs:dev
# → Accede a http://localhost:5173/EduPress/

# Preview de producción
npm run docs:preview
# → http://localhost:4173/EduPress/

# Construir para deployment
npm run docs:build
```

### Opción C: Docker

```bash
docker compose up vitepress
# → http://localhost:5173/EduPress/
```

---

## Estructura del Proyecto

```
EduPress/
├── src/
│   ├── index.md                              # Página de inicio
│   ├── UD1/                                  # Unidad 1 (estructura modelo)
│   │   ├── index.md                         # Portada de unidad
│   │   ├── contenidos/
│   │   │   ├── 1-introduccion.md
│   │   │   ├── 2-diapositivas.md
│   │   │   └── 3-diapositivas-demo.md
│   │   └── ejercicios/
│   │       ├── index.md                    # Lista de ejercicios
│   │       ├── ejercicio.md
│   │       └── final.md
│   ├── .vitepress/
│   │   ├── config.mts                       # ⭐ Configuración principal
│   │   ├── units.ts                         # ⭐ Registro de unidades
│   │   ├── unitHelpers.ts                   # Transformadores de rutas
│   │   ├── contentPaths.ts                  # Rutas centralizadas
│   │   ├── theme/
│   │   │   ├── index.ts                     # Bootstrap del tema
│   │   │   ├── css/                         # Estilos
│   │   │   ├── components/                  # Componentes Vue
│   │   │   └── utils/
│   └── public/
│       └── img/
│           ├── logo.png                     # Logo principal
│           ├── logo-autor.png               # Logo autor
│           ├── logo-gva.png                 # Logo institución 1
│           ├── logo-centro.png              # Logo institución 2
│           ├── contenidos/                  # Imágenes de contenidos
│           └── ejercicios/                  # Imágenes de ejercicios
├── docker-compose.yml
├── package.json
├── start-project.sh                         # ⭐ Ejecución fácil
├── stop-project.sh
└── status-project.sh
```

---

## Configuración de Institución

### Paso 1: Preparar imágenes

Guarda los logos en `src/public/img/`:

- **`logo.png`** (48x48px) - Logo principal en navbar
- **`logo-autor.png`** (165px alto) - Footer (docente/autor)
- **`logo-gva.png`** (60px alto) - Comunidad autónoma
- **`logo-centro.png`** (90px alto) - Centro educativo

**Formato recomendado:** PNG con fondo transparente

### Paso 2: Editar configuración en `src/.vitepress/config.mts`

Busca y actualiza estas líneas:

```typescript
// Línea ~37
const BASE_PATH = '/EduPress/'  // Cambia por /tu-repo-nombre/

// Línea ~48-51
const logoAutorPath = `${BASE_PATH}img/logo-autor.png`
const logoGvaPath = `${BASE_PATH}img/logo-gva.png`
const logoCentroPath = `${BASE_PATH}img/logo-centro.png`
```

### Paso 3: Personalizar siteTitle en `src/.vitepress/units.ts`

```typescript
// Línea ~69 - Unidad UD1
UD1: {
  siteTitle: 'Tu Centro</br>Educativo',  // ⭐ Cambia aquí
  icon: '📘',
  // ... resto de config
}
```

**Nota:** El `</br>` causa salto de línea en el navbar. Úsalo para títulos largos.

### Paso 4: Actualizar pie de página

En `src/.vitepress/config.mts`, línea ~146:

```typescript
footer: {
  message: `<img src="${logoAutorPath}" alt="Docente" style="height:75px; margin: 0 auto; display:block;" />`,
  copyright: 'Copyright © 2025 - Tu Institución'  // ⭐ Cambia aquí
}
```

✅ **Institución configurada.**

---

## Decisión: Módulo Único vs Unidades

### Opción 1: Módulo Único (Recomendado para cursos pequeños)

**Uso:** 1-2 módulos temáticos

**Estructura:**
```
EduPress/
└── src/
    └── UD1/  # Tu único módulo
        ├── contenidos/
        └── ejercicios/
```

**Configuración:** 
- Cambia `ACTIVE_UNIT = 'UD1'` en `src/.vitepress/units.ts`
- Los usuarios ven URLs como: `/EduPress/UD1/contenidos/1-intro`

### Opción 2: Múltiples Unidades (Recomendado para cursos completos)

**Uso:** Modularización por temas (UD1, UD2, UD3...)

**Estructura:**
```
EduPress/
└── src/
    ├── UD1/  # Unidad 1
    ├── UD2/  # Unidad 2
    └── UD3/  # Unidad 3
```

**Paso a paso:**

1. **Copiar plantilla UD1:**
   ```bash
   cp -r src/UD1 src/UD2
   cp -r src/UD1 src/UD3
   ```

2. **Registrar en `src/.vitepress/units.ts`:**
   ```typescript
   export const UNITS: Record<string, UnitConfig> = {
     UD1: { /* ... */ },
     UD2: {
       id: 'UD2',
       code: 'UD2',
       title: 'Unidad 2 - Avanzada',
       fullTitle: 'Unidad 2 - Temas Avanzados',
       siteTitle: 'Unidad 2</br>Avanzada',
       icon: '📗',
       navbar: baseNavbar,
       sidebar: baseSidebar
     },
     UD3: { /* similar a UD2 */ }
   }
   ```

3. **Cambiar unidad activa:**
   ```typescript
   export const ACTIVE_UNIT = 'UD2'  // Para ver UD2
   ```

4. **Actualizar contenidos** en `src/UD2/contenidos/` y `src/UD2/ejercicios/`

---

## Crear Contenidos

### Estructura de archivos

Dentro de `src/UD1/contenidos/`:

```
contenidos/
├── 1-introduccion.md         # Capítulo 1
├── 2-conceptos-basicos.md    # Capítulo 2
└── 3-ejemplos-practicos.md   # Capítulo 3
```

### Crear un contenido nuevo

1. **Crear archivo:** `src/UD1/contenidos/4-tema-nuevo.md`

2. **Añadir front-matter (metadatos):**
   ```markdown
   ---
   layout: page
   title: Tema Nuevo
   ---

   # 4. Tema Nuevo

   Tu contenido aquí...
   ```

3. **Registrar en navbar/sidebar** dentro de `src/.vitepress/units.ts`:
   ```typescript
   const baseNavbar: DefaultTheme.NavItem[] = [
     // ...
     {
       text: '📚 Contenidos',
       items: [
         { text: '1. Introducción', link: '/contenidos/1-introduccion' },
         { text: '2. Conceptos', link: '/contenidos/2-conceptos-basicos' },
         { text: '3. Ejemplos', link: '/contenidos/3-ejemplos-practicos' },
         { text: '4. Tema Nuevo', link: '/contenidos/4-tema-nuevo' },  // ⭐ Nuevo
       ]
     }
   ]
   ```

### Elementos disponibles en Markdown

**Bloques especiales:**

```markdown
::: info-box Título opcional
Contenido info
:::

::: note-box
Contenido nota
:::

::: accent-box
Contenido destacado
:::

::: tip-box Consejo
Contenido útil
:::
```

**Componentes Vue:**

```markdown
<Badge text="Importante" />

<Button text="Descargar" href="/archivo.pdf" />

<Quote>
Una cita inspiradora aquí
</Quote>

<TwoColumns>
  <div slot="left">Columna izquierda</div>
  <div slot="right">Columna derecha</div>
</TwoColumns>
```

---

## Crear Ejercicios

### Estructura de archivos

Dentro de `src/UD1/ejercicios/`:

```
ejercicios/
├── index.md          # Portada/índice de ejercicios
├── ejercicio.md      # Ejercicio 1
├── ejercicio2.md     # Ejercicio 2 (si aplica)
└── final.md          # Proyecto final
```

### Crear un ejercicio nuevo

1. **Crear archivo:** `src/UD1/ejercicios/ejercicio2.md`

2. **Plantilla básica:**
   ```markdown
   ---
   layout: page
   title: Ejercicio 2
   sidebar: true
   ---

   # Ejercicio 2 - Aplicar Conceptos

   ## 📝 Enunciado

   Describe aquí qué debe hacer el estudiante...

   ## 🎯 Objetivos

   - Objetivo 1
   - Objetivo 2
   - Objetivo 3

   ## 📋 Requisitos

   - Requisito 1
   - Requisito 2

   ## 💡 Pistas

   ::: tip-box
   Sugerencias para resolver el ejercicio
   :::

   ## 📦 Entregable

   El alumno debe entregar:
   - Archivo 1
   - Archivo 2

   ## ⏱️ Tiempo estimado

   2-3 horas
   ```

3. **Actualizar índice:** `src/UD1/ejercicios/index.md`
   ```markdown
   # 🗂️ Ejercicios

   ## Ejercicios prácticos

   - [Ejercicio 1 - Inicio](/ejercicios/ejercicio)
   - [Ejercicio 2 - Aplicar Conceptos](/ejercicios/ejercicio2)  # ⭐ Nuevo
   - [Proyecto Final](/ejercicios/final)
   ```

4. **Registrar en sidebar** en `src/.vitepress/units.ts`:
   ```typescript
   const baseSidebar: DefaultTheme.SidebarItem[] = [
     {
       text: '💻 Ejercicios',
       items: [
         { text: 'Inicio', link: '/ejercicios/' },
         { text: 'Ejercicio 1', link: '/ejercicios/ejercicio' },
         { text: 'Ejercicio 2', link: '/ejercicios/ejercicio2' },  // ⭐ Nuevo
         { text: 'Final', link: '/ejercicios/final' }
       ]
     }
   ]
   ```

---

## Gestionar Imágenes

### Cargar imágenes en contenidos

**Ubicación:** `src/public/img/`

**Uso en Markdown:**

```markdown
# Forma 1: Imagen normal
![Descripción](​/img/mi-imagen.jpg)

# Forma 2: Imagen centrada (etiqueta especial)
![Titulo de imagen centrada#center](​/img/mi-imagen.jpg)

# Forma 3: Imagen con ancho personalizado (HTML)
<img src="/img/mi-imagen.jpg" style="width: 300px; margin: 0 auto; display: block;" />
```

### Parallax (Efecto de fondo fijo)

Para crear un efecto parallax en ejercicios:

1. **Guardar imagen:** `src/public/img/ejercicios/parallax.jpg` (mínimo 1920x1080px)

2. **Crear CSS personalizado** en `src/.vitepress/theme/css/ejercicios.css`:

```css
.parallax-hero {
  background-image: url('/img/ejercicios/parallax.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
```

3. **Usar en Markdown:**

```markdown
<div class="parallax-hero">
  <h1>Titulo del Ejercicio</h1>
</div>

Tu contenido aquí...
```

### Estructura recomendada de imágenes

```
src/public/img/
├── logo.png                    # Principal (48x48)
├── logo-autor.png              # Footer (165px alto)
├── logo-gva.png                # Institución 1 (60px)
├── logo-centro.png             # Institución 2 (90px)
├── contenidos/
│   ├── introduccion.jpg        # Para cap 1
│   ├── arquitectura.png        # Para cap 2
│   └── diagrama.svg            # Gráficos vectoriales
├── ejercicios/
│   ├── parallax.jpg            # Parallax fondo (1920x1080)
│   ├── instrucciones.png       # Guías visuales
│   └── 1.00.jpeg               # Galería de ejercicios
└── slides/                     # Si usas presentaciones
    ├── diapositiva-1.png
    └── diapositiva-2.png
```

### Tamaños óptimos

- **Logos:** 48x48px a 300px alto (según contexto)
- **Contenidos:** 800x600px (responsive)
- **Parallax:** 1920x1080px mínimo
- **Ejercicios:** 1024x768px
- **Screenshots:** 1280px ancho máximo
- **Formato:** JPG (fotos), PNG (gráficos), SVG (iconos)

---

## Despliegue

### En GitHub Pages (Recomendado)

1. **Configurar repositorio:**
   - Ve a `Settings > Pages`
   - Branch: `main`, carpeta `/` (o `.github/workflows/` si usas Actions)

2. **Actualizar `base` en config:**
   ```typescript
   // src/.vitepress/config.mts, línea ~27
   const BASE_PATH = '/tu-nombre-repositorio/'
   ```

3. **Hacer push:**
   ```bash
   git add .
   git commit -m "Contenidos actualizados"
   git push origin main
   ```

4. **Acceder a:** `https://tu-usuario.github.io/tu-nombre-repositorio/`

---

## ✨ Checklist Inicial

- [ ] Instaladas dependencias (`npm install`)
- [ ] Servidor funciona (`./start-project.sh`)
- [ ] Logos copiados a `src/public/img/`
- [ ] Configuración de institución actualizada
- [ ] Unidades (UD1, UD2...) creadas en `units.ts`
- [ ] Primer contenido redactado
- [ ] Primer ejercicio creado
- [ ] Imágenes enlazadas correctamente
- [ ] Build sin errores (`npm run docs:build`)
- [ ] Configurado GitHub Pages

---

## 🆘 Troubleshooting

| Problema | Solución |
|----------|----------|
| Port 5173 en uso | `./stop-project.sh` + `./start-project.sh` |
| Imágenes no cargan | Verifica rutas: `/img/...` (absoluta, no relativa) |
| Cambios no aparecen | Recarga `Ctrl+Shift+R` (borrar caché) |
| Build fallido | Revisa console: `npm run docs:build` |
| URLs tipo `#center` no funcionan | Úsalas en `alt=` del img: `![img#center]` |
| Navbar no actualiza | Reinicia servidor: `./stop-project.sh` + `./start-project.sh` |

---

## 📚 Referencias

- [Documentación VitePress](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Configuración completa de proyectos educativos](./MANIFIESTO-ARQUITECTURA.md)

### Configurar Nuevos Proyectos

```bash
# Desde el directorio donde están tus proyectos
./setup-all-projects.sh
```

## 🎨 Personalización

### Configuración de Colores e Identidad Institucional

EduPress cuenta con un sistema de tokens en CSS estricto diseñado para respetar tanto el **modo claro como el modo oscuro** automáticamente, manteniendo una alta accesibilidad y contraste tipográfico. 

Todos los colores de la interfaz se derivan de variables en el archivo maestro de estilos de EduPress. Para adaptar los colores de la interfaz a tu marca o institución educativa, debes editar el archivo `design-tokens.css`:

**1. Edición de `design-tokens.css`**:  
Abre el archivo `src/.vitepress/theme/css/design-tokens.css`.  
Encontrarás dos bloques principales de configuración (root para el light-mode y .dark para el modo nocturno).  

**2. Cambiar los Valores de Identidad**:  
El color primario está asignado al alias corporativo `--vp-c-brand`. Solo tienes que sustituir ese código Hexadecimal por el de tu institución.  

```css
:root {
  /* Sustituye este color por el primario de tu organización */
  --vp-c-brand: #ed6e51;    
  --vp-c-brand-1: #ed6e51;  
  --vp-c-brand-2: #ed6e51;  
  --vp-c-brand-3: #ed6e51;  
}

.dark {
  /* Usa siempre una variante ligeramente más clara en modo oscuro para cumplir con WCAG */
  --vp-c-brand: #f48061;    
  --vp-c-brand-1: #fc9578;  
}
```

EduPress usará internamente estas variables para dar color a enlaces, botones, bordes, elementos activos en el menú de navegación lateral superior, custom-blocks, y más.

### CSS y Estructuras Adicionales

- `src/.vitepress/theme/css/styles.css` - Estilos generales, layout principal de Vitepress.
- `src/.vitepress/theme/css/design-tokens.css` - Sistema de Colores, tipografía y sombras corporativos de forma unificada.
- `src/.vitepress/theme/css/ejercicios.css` - Estilos dedicados para la visualización de ejercicios.
- `src/.vitepress/theme/css/slides.css` - Estilos para el motor visual de presentaciones (Diapositivas y Lightbox Custom).

## 🚀 Resumen del Alcance Actual

Este template, en su alcance actual documentado, se consolida como un robusto **LMS Estático Generador de Documentación (LMS-Doc)** con capacidades interactivas ampliadas frente a la base clásica de VitePress.

Actualmente proporciona:
- **Motor de Renderizado Markdown**: Compilación ultrarrápida del texto docente enriquecido mediante SSR (Vite y Vue).
- **Sistema de Presentaciones Full-Screen (Slides)**: Capacidad para redactar presentaciones tipo Powerpoint/RevealJS nativas desde Markdown e injertarlas dentro de la página con su propio modo panorámico (Lightbox).
- **Zoom Dinámico Avanzado**: Sistema de visualización fotográfica y de slides que bloquea eventos y delegados sobrepuestos de terceros para garantizar un zoom limpio, arrastre mediante transformaciones, y controles de magnificación sin interferencias.
- **Dark/Light Mode y Accesibilidad Optimizada**: Revisión manual del contraste de cajas informativas (Info/Danger/Tip) e identidad de marca (EduPress Orange) en ambas modalidades de visualización para legibilidad ininterrumpida.
- **Listos para Despliegue con Github Actions**: Docker preparado y pre-configurado para publicar temarios online en servidores propios o Github Pages.

## 🔧 Solución de Problemas

### Puerto ocupado

```bash
./stop-project.sh  # Detener proyecto
./start-project.sh # Reiniciar con puerto automático
```

### Docker no responde

```bash
sudo systemctl restart docker
docker system prune -f
```

### Error de despliegue

- Verifica que `base` en `config.mts` coincida con el nombre del repositorio
- Asegúrate de usar "GitHub Actions" en Pages

## 📚 Recursos

- [Documentación VitePress](https://vitepress.dev/)
- [Guía Markdown](https://www.markdownguide.org/)
- [GitHub Pages](https://pages.github.com/)

## 📄 Licencia

MIT License - Libre para uso educativo

---

**💝 Diseñado para la comunidad educativa** - Simplificando la creación de contenido didáctico digital.
