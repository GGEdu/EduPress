---
layout: doc
title: Instalación y Arranque
sidebar: true
outline: [2, 3]
aside: true
---

# 🚀 Instalación y Arranque

## Requisitos

### Software necesario

- **Node.js 16+** — [Descargar](https://nodejs.org/)
- **npm 8+** — Se instala con Node.js
- **Git** — [Descargar](https://git-scm.com/)
- *Opcional:* **Docker + Docker Compose** — Para entorno containerizado

> Docker no es obligatorio. No se instala automáticamente desde este proyecto. Si eliges usarlo, debes instalarlo tú previamente.

### Verificar instalación

```bash
node --version     # v16 o superior
npm --version      # 8 o superior
git --version      # cualquier versión reciente
```

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/GGEdu/EduPress
cd EduPress

# 2. Instalar dependencias (~500MB, 2-5 minutos)
npm install

# 3. Verificar estructura
ls -la src/
# Debe mostrar: index.md  .vitepress/  general/  public/
```

## Arrancar el servidor

### Opción A: Scripts automáticos (recomendado)

```bash
./start-project.sh          # Inicia servidor de desarrollo
./status-project.sh         # Ver URL de acceso y estado
./stop-project.sh           # Detener servidor

./start-project.sh preview  # Preview de producción (opcional)
```

Los scripts gestionan puertos automáticamente y evitan conflictos.

### Opción B: npm directo

```bash
npm run docs:dev      # Desarrollo con hot reload → http://localhost:5173/EduPress/
npm run docs:preview  # Preview producción → http://localhost:4173/EduPress/
npm run docs:build    # Construir para despliegue
```

### Opción C: Docker

Requiere Docker y Docker Compose instalados previamente.

```bash
docker compose up vitepress
# → http://localhost:5173/EduPress/
```

Si no tienes Docker instalado, usa la Opción A o B.

## Primera verificación

Tras `./start-project.sh` debería aparecer una URL similar a:

```
  ➜  Local:   http://localhost:5173/EduPress/
```

Abre esa URL en el navegador. Si ves la pantalla de inicio, la instalación es correcta.

**Siguiente paso:** [Estructura del Proyecto](./3-estructura)
