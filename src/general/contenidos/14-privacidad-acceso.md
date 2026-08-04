---
layout: doc
title: Privacidad y Control de Acceso
sidebar: true
---

# 🔒 Privacidad y Control de Acceso

VitePress genera una web estática (archivos HTML, CSS y JS). Al no tener una base de datos propia ni un servidor backend ejecutando código (como PHP o Node.js), **la seguridad no se puede configurar directamente dentro del código de VitePress**, sino que debe establecerse en el servidor donde alojas la web.

Si quieres usar esta plantilla con tus alumnos y asegurar que **solo ellos puedan acceder** utilizando su cuenta de GitHub o estando en una lista cerrada de emails, la mejor solución es delegar esta protección a **Cloudflare**.

---

## 🛡️ Cloudflare Pages + Zero Trust (Recomendado y Gratuito)

Esta es la solución estándar de la industria y la más sencilla de implementar. Funciona interceptando las visitas antes de que lleguen a la web de VitePress, pidiendo al usuario que inicie sesión.

**Requisitos previos:**
- Tener tu código alojado en GitHub.
- Crear una cuenta gratuita en [Cloudflare](https://dash.cloudflare.com/sign-up).

### Paso 1: Desplegar en Cloudflare Pages

1. Entra a tu panel de Cloudflare.
2. Ve a **Workers & Pages** > **Crear aplicación** > pestaña **Pages** > **Conectarse a Git**.
3. Selecciona tu repositorio de GitHub donde tienes el proyecto EduPress.
4. En "Configuraciones de compilación", usa:
   - **Framework:** `VitePress`
   - **Comando de compilación:** `npm run docs:build`
   - **Directorio de salida:** `.vitepress/dist`
5. Haz clic en **Guardar e implementar**. En unos minutos tu web será pública.

### Paso 2: Configurar Zero Trust

1. En el panel izquierdo de Cloudflare, busca y entra a **Zero Trust** (es gratis para hasta 50 usuarios activos).
2. Te pedirá que elijas un nombre de equipo (ej: `mis-clases`).

### Paso 3: Añadir GitHub como Método de Inicio de Sesión

1. Dentro de Zero Trust, ve a **Settings** > **Authentication**.
2. En la sección **Login methods**, haz clic en **Add new**.
3. Elige **GitHub** y sigue las instrucciones para conectar la aplicación (Cloudflare te dará los pasos exactos para crear una *OAuth App* en GitHub y copiar los tokens).

### Paso 4: Crear la Política de Acceso (La barrera de entrada)

1. En el menú de Zero Trust, ve a **Access** > **Applications**.
2. Haz clic en **Add an application** y elige **Self-hosted**.
3. **Application Configuration:**
   - Ponle un nombre (ej: "Curso Privado").
   - En **Application domain**, selecciona el dominio que Cloudflare le asignó a tu web en el Paso 1 (terminará en `.pages.dev` o en tu dominio personalizado).
4. Dale a **Next** para ir a la pestaña **Policies**:
   - **Policy name:** "Permitir Alumnos".
   - **Action:** `Allow`.
   - Baja hasta la sección **Include** y define quién puede entrar.
     - **Opción A (Lista de Emails):** Selecciona `Emails` y escribe uno a uno los correos de tus alumnos separados por comas.
     - **Opción B (Organización GitHub):** Selecciona `GitHub Organization` y pon el nombre de la organización de GitHub a la que pertenecen tus alumnos.
5. Haz clic en **Next** y luego en **Add application**.

---

🎉 **¡Listo!** Ahora, cuando cualquier persona intente acceder a la URL de tu curso, verá una pantalla de Cloudflare pidiendo iniciar sesión con GitHub. Si el correo o usuario de la persona no coincide con tu política de acceso, será bloqueado y ni siquiera se cargará el HTML de tu curso.
