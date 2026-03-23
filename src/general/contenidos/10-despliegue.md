# 🌐 Despliegue y Troubleshooting

## Despliegue en GitHub Pages

**1. Crear repositorio** en GitHub con el nombre que usará el sitio (p.ej. `mi-curso`).

**2. Actualizar `basePath`** en `src/.vitepress/config/project.ts`:

```typescript
basePath: '/mi-curso/',   // Debe coincidir exactamente con el nombre del repositorio
```

**3. Hacer push:**

```bash
git add .
git commit -m "Configurado para GitHub Pages"
git push origin main
```

**4. Activar GitHub Pages:**

- Ve a `Settings > Pages` del repositorio.
- Branch: `main`, carpeta: `/` (raíz) o usa GitHub Actions si lo tienes configurado.

**5. Acceder al sitio:**

```
https://tu-usuario.github.io/mi-curso/
```

## Checklist antes del primer despliegue

- [ ] `npm install` ejecutado sin errores
- [ ] `./start-project.sh` arranca y la URL es accesible
- [ ] Logos copiados a `src/public/img/`
- [ ] `siteTitle` actualizado en `units.ts`
- [ ] `copyright` actualizado en `config.mts`
- [ ] `basePath` en `config/project.ts` apunta al nombre correcto del repositorio
- [ ] Al menos un contenido redactado en `contenidos/`
- [ ] Build sin errores: `npm run docs:build`
- [ ] GitHub Pages activado

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Puerto 5173 en uso | `./stop-project.sh` y vuelve a `./start-project.sh` |
| Imágenes no cargan | Verifica que la ruta empiece con `/img/...` (absoluta, desde `public/`) |
| Cambios no aparecen | Recarga limpia: `Ctrl+Shift+R` (borra caché del navegador) |
| Build fallido con dead links | Revisa rutas en `units.ts`: deben existir los archivos `.md` correspondientes |
| `#center` no funciona en imagen | El sufijo va en el `alt`, no en el `src`: `![descripción #center](/img/...)` |
| Navbar no actualiza tras cambios | Reinicia el servidor: `./stop-project.sh` + `./start-project.sh` |
| Parallax no aparece | Verifica que la clase esté declarada en `ejer_imgs.css` con `background-image` |
| URL 404 en producción | Comprueba que `basePath` en `config/project.ts` coincide exactamente con el nombre del repositorio |

## Comandos de referencia rápida

```bash
# Desarrollo con hot reload
./start-project.sh
npm run docs:dev

# Preview de lo que se verá en producción
./start-project.sh preview
npm run docs:preview

# Build para despliegue
npm run docs:build

# Ver estado y URL del servidor
./status-project.sh

# Detener servidor
./stop-project.sh
```

## Recursos externos

- [Documentación VitePress](https://vitepress.dev/)
- [Guía de Markdown](https://www.markdownguide.org/)
- [GitHub Pages - Documentación](https://docs.github.com/pages)
