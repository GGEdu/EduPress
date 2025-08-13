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

### CSS Personalizado

- `src/.vitepress/theme/css/styles.css` - Estilos generales
- `src/.vitepress/theme/css/ejercicios.css` - Estilos para capítulos

### Componentes Vue

Agrega componentes personalizados en `src/.vitepress/theme/`

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
