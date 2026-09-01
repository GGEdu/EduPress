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
   - **Directorio de salida:** `docs`

   > Esta plantilla construye en `docs/`, no en `.vitepress/dist`: lo fija `outDir: '../docs'` en `src/.vitepress/config/project.ts`. Si pones `.vitepress/dist`, el despliegue no encontrará los archivos.
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
   - En **Application domain**, selecciona el dominio que Cloudflare le asignó a tu web en el Paso 1 (terminará en `.pages.dev`).

   > **Una aplicación protege un hostname, no "tu web".** Si más adelante añades un dominio personalizado, tu curso pasará a estar disponible en **dos** direcciones: la tuya y la `.pages.dev` original, que sigue viva. Proteger solo una deja la otra abierta. Añade el segundo hostname como destino de la misma aplicación.
4. Dale a **Next** para ir a la pestaña **Policies**:
   - **Policy name:** "Permitir Alumnos".
   - **Action:** `Allow`.
   - Baja hasta la sección **Include** y define quién puede entrar.
     - **Opción A (Lista de Emails):** Selecciona `Emails` y escribe uno a uno los correos de tus alumnos separados por comas.
     - **Opción B (Organización GitHub):** Selecciona `GitHub Organization` y pon el nombre de la organización de GitHub a la que pertenecen tus alumnos.
5. Haz clic en **Next** y luego en **Add application**.

> **Ten paciencia al comprobarlo.** Cloudflare tarda unos minutos en aplicar una política nueva en toda su red. Si abres la web justo después de guardar y la ves cargar sin pedirte login, no significa que esté mal: espera y vuelve a probar antes de tocar nada.

### Paso 5: Proteger los despliegues de vista previa

El Paso 4 protege la dirección de producción, pero Cloudflare Pages crea además una URL propia **por cada rama y por cada despliegue**:

```text
mi-curso.pages.dev              ← producción, protegida en el Paso 4
una-rama.mi-curso.pages.dev     ← NO protegida
a1b2c3d4.mi-curso.pages.dev     ← NO protegida
```

Para Cloudflare son hostnames distintos, así que la aplicación del Paso 4 no los cubre: sirven una copia completa de tu curso sin pedir login. Y como Pages genera vistas previas de todas las ramas por defecto, basta con que hayas trabajado en una rama para tener el material publicado sin candado.

Tienes dos formas de cerrarlo, según lo que necesites:

- **Si no usas las vistas previas:** desactívalas en el proyecto de Pages, en **Settings** > **Builds** > *Preview deployments* > **None**. Ojo: eso evita que se creen nuevas, pero **las que ya existen siguen sirviéndose**. Bórralas a mano en la pestaña **Deployments**.
- **Si las usas:** protégelas con Access. En el proyecto de Pages activa el control de acceso de las vistas previas; Cloudflare crea una aplicación con destino `*.mi-curso.pages.dev` a la que puedes asignar la misma política del Paso 4. Esta opción tiene una ventaja: cubre también los despliegues **antiguos**, sin borrar nada.

> **Comprueba siempre las dos superficies**, sin haber iniciado sesión y con el navegador en modo incógnito:
>
> ```bash
> curl -sI https://mi-curso.pages.dev/            | head -1
> curl -sI https://una-rama.mi-curso.pages.dev/   | head -1
> ```
>
> Lo correcto es un `302` hacia `…cloudflareaccess.com` en ambos. Un `200` significa que ese hostname está sirviendo tu curso a cualquiera.

---

🎉 **¡Listo!** Ahora, cuando alguien intente acceder a una de las direcciones que has protegido, verá una pantalla de Cloudflare pidiendo iniciar sesión con GitHub. Si el correo o usuario no coincide con tu política de acceso, será bloqueado y ni siquiera se cargará el HTML de tu curso.

Esa garantía vale **para los hostnames que hayas cubierto**, no para el proyecto en bloque. Si añades un dominio personalizado o vuelves a activar las vistas previas, repasa los Pasos 4 y 5: cada dirección nueva es una puerta nueva.
