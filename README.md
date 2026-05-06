# 📚 EduPress — Plantilla Educativa para VitePress

**Crea cursos y temarios online en Markdown, con diapositivas, ejercicios y colores corporativos.**  
Diseñada para docentes: sin frameworks complejos, sin base de datos, desplegable en GitHub Pages.

---

## [Demo](https://ggedu.github.io/EduPress/)

---

## 🔄 Elige tu camino

| ¿Qué necesitas? | Guía |
|---|---|
| Un solo módulo o asignatura | → [Crear un curso único](https://ggedu.github.io/EduPress/general/contenidos/4-curso-unico) |
| Varios módulos o unidades didácticas | → [Crear un curso modular](https://ggedu.github.io/EduPress/general/contenidos/5-curso-modular) |

## ¿Qué incluye?

- **Motor Markdown enriquecido** — Bloques informativos (`info-box`, `warning-box`, `tip-box`...), pestañas, diagramas Mermaid, imágenes centradas.
- **Sistema de presentaciones** — Diapositivas full-screen nativas desde Markdown con `SlidesViewer` y lightbox con zoom.
- **Ejercicios gamificados (parallax)** — Diseño visual tipo storytelling con imágenes de fondo en scroll.
- **Enunciados estándar** — Modelo Markdown limpio para ejercicios estructurados con criterios de evaluación.
- **Módulos / Unidades** — Soporte para módulo único o múltiples unidades (UD1, UD2, UD3...).
- **Identidad institucional** — Logos, colores corporativos y modo claro/oscuro configurables.
- **Configuración centralizada** — Toda la personalización (colores, logos, navegación, URL base) se concentra en la carpeta `src/.vitepress/config/`. Sin necesidad de editar CSS ni buscar ajustes dispersos por el proyecto.
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
git clone https://github.com/GGEdu/EduPress.git
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

## Personalización rápida

Todos los ajustes se hacen en los 4 archivos de `src/.vitepress/config/`:

| Archivo | Qué configura |
|---------|---------------|
| `config/project.ts` | URL base, idioma, redes sociales, copyright |
| `config/colors.ts` | Selección de tema, colores corporativos y tipografía |
| `config/logos.ts` | Rutas de logos, alturas y modo claro/oscuro |
| `config/units.ts` | Módulos/unidades activas, navbar y sidebar |

---

## Licencia

MIT — Libre para uso educativo.

---

**Diseñado para la comunidad educativa** — Simplificando la creación de contenido didáctico digital.
