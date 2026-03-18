# 📚 EduPress - Plantilla Educativa VitePress

**Plantilla educativa impulsada por VitePress para dar vida a temarios, guías y cursos online.** Diseñada para docentes y creadores de contenido que buscan una presentación clara, atractiva y fácil de mantener.

## ✨ Características

- 🚀 **Rápido y moderno** - Construido con VitePress
- 🎨 **Diseño educativo** - Optimizado para contenido didáctico
- 📱 **Responsive** - Adaptable a todos los dispositivos
- 🔍 **Búsqueda integrada** - Encuentra contenido al instante
- 🌐 **Multiidioma** - Soporte para español y catalán
- 🐳 **Docker Ready** - Desarrollo sin complicaciones
- ⚡ **Auto-deploy** - Despliegue automático en GitHub Pages

## 🌐 Demo

[Ver la plantilla en acción](https://ggedu.github.io/EduPress/)

## 🚀 Inicio Rápido

### Opción 1: Con Scripts Automáticos (Recomendado)

```bash
# Iniciar proyecto con puertos automáticos
./start-project.sh

# Ver estado y URLs
./status-project.sh

# Modo preview (producción)
./start-project.sh preview

# Detener proyecto
./stop-project.sh
```

**Ventajas:**

- ✅ Puertos automáticos (sin conflictos)
- ✅ URLs claras mostradas en consola
- ✅ Gestión sencilla de contenedores
- ✅ Soporte para múltiples proyectos simultáneos

### Opción 2: Método Tradicional

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

### Opción 3: Docker Manual

```bash
# Desarrollo
docker compose up vitepress

# Preview de producción
docker compose --profile preview up preview
```

## 📁 Estructura del Proyecto

```
EduPress/
├── src/                          # Contenido principal
│   ├── index.md                  # Página de inicio
│   ├── .vitepress/
│   │   ├── config.mts           # Configuración principal
│   │   └── theme/               # Personalización del tema
│   ├── contenidos/              # Materiales didácticos
│   ├── ejercicios/                # Ejercicios y prácticas
│   └── public/                  # Recursos estáticos
├── docker-compose.yml           # Configuración Docker
├── start-project.sh            # Script de inicio automático
├── stop-project.sh             # Script de parada
└── status-project.sh           # Script de estado
```

## ⚙️ Configuración Esencial

### Personalización Rápida

1. **Edita `src/.vitepress/config.mts`:**

  ```typescript
  export default defineConfig({
    base: '/TU-REPOSITORIO/',     // Cambia por el nombre de tu repositorio
    locales: {
     root: {
      title: 'Título de tu curso',
      description: 'Descripción del curso'
     }
    }
  })
  ```

  ⚠️ **Importante:** Busca y reemplaza todas las ocurrencias de `EduPress` por el nombre de tu repositorio en los archivos de configuración, ya que se usan como rutas absolutas.

2. **Actualiza contenido:**
   - Logo: `src/public/img/logo.png`
   - Página inicio: `src/index.md`
   - Materiales: `src/contenidos/`
   - Ejercicios: `src/ejercicios/`

## 🚀 Despliegue en GitHub Pages

### Configuración Automática

1. **Activar GitHub Pages:**
   - Ve a `Settings > Pages` en tu repositorio
   - Selecciona **"GitHub Actions"** en "Build and deployment"

2. **Hacer push:**

   ```bash
   git add .
   git commit -m "Deploy EduPress"
   git push origin main
   ```

3. **¡Listo!** Tu sitio estará en: `https://TUUSUARIO.github.io/TU-REPOSITORIO/`

## 🛠️ Uso Avanzado

### Múltiples Proyectos Simultáneos

```bash
# Terminal 1 - Proyecto Matemáticas
cd /path/to/matematicas-curso
./start-project.sh
# → Puerto 5173

# Terminal 2 - Proyecto Historia  
cd /path/to/historia-curso
./start-project.sh
# → Puerto 5174 (automático)

# Terminal 3 - Proyecto Ciencias
cd /path/to/ciencias-curso
./start-project.sh preview
# → Puerto 4173 (preview)
```

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
