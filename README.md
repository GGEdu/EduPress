# 📚 EduPress — Plantilla Educativa Modular

**Plantilla VitePress para crear cursos y temarios online con estructura modular por unidades.**  
Diseñada para docentes que necesitan una presentación clara y mantenible sin complejidad técnica.

---

## ¿Qué incluye?

- **Motor Markdown enriquecido** — Bloques informativos (`info-box`, `warning-box`, `tip-box`...), pestañas, diagramas Mermaid, imágenes centradas.
- **Sistema de presentaciones** — Diapositivas full-screen nativas desde Markdown con `SlidesViewer` y lightbox con zoom.
- **Ejercicios gamificados (parallax)** — Diseño visual tipo storytelling con imágenes de fondo en scroll.
- **Enunciados estándar** — Modelo Markdown limpio para ejercicios estructurados con criterios de evaluación.
- **Módulos / Unidades** — Soporte para módulo único o múltiples unidades (UD1, UD2, UD3...).
- **Identidad institucional** — Logos, colores corporativos y modo claro/oscuro configurables.
- **Despliegue en GitHub Pages** — Build estático listo para publicar.
- **Docker opcional** — No se instala automáticamente. Requiere Docker instalado previamente si se usa.

---

## Inicio rápido

### Requisitos

- Node.js 16+ y npm 8+
- Git
- *(Opcional)* Docker + Docker Compose

### Instalación

```bash
git clone URL_DEL_REPOSITORIO
cd EduPress
npm install
```

### Arrancar

```bash
./start-project.sh          # Inicia servidor de desarrollo
./status-project.sh         # Ver URL de acceso
./stop-project.sh           # Detener
```

O directamente:

```bash
npm run docs:dev            # → http://localhost:5173/EduPress/
```

---

## Documentación por temas

Las guías están integradas en el sitio VitePress, accesibles desde el sidebar bajo **"Guías del Sistema"** y **"Ejercicios"**. También puedes leerlas directamente:

| Guía | Ruta en el proyecto |
|------|---------------------|
| Instalación y Arranque | `src/general/contenidos/2-instalacion.md` |
| Estructura del Proyecto | `src/general/contenidos/3-estructura.md` |
| Módulos y Unidades | `src/general/contenidos/4-modulos.md` |
| Configuración e Identidad | `src/general/contenidos/5-configuracion.md` |
| Crear Contenidos | `src/general/contenidos/6-crear-contenidos.md` |
| Crear Diapositivas | `src/general/contenidos/7-diapositivas.md` |
| Catálogo de Patrones | `src/general/contenidos/8-diapositivas-demo.md` |
| Imágenes para Contenido | `src/general/contenidos/9-imagenes.md` |
| Despliegue y Troubleshooting | `src/general/contenidos/10-despliegue.md` |
| Imágenes en Ejercicios | `src/general/ejercicios/imagenes-ejercicios.md` |

---

## Licencia

MIT — Libre para uso educativo.

---

**Diseñado para la comunidad educativa** — Simplificando la creación de contenido didáctico digital.
