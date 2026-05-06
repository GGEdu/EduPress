<script setup lang="ts">
import { ref } from 'vue'
import { PROJECT } from '../../config/project'

const isGenerating = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)

const handleDownload = async () => {
  if (PROJECT.pdfExportMode === 'text') {
    // Modo 'text': usamos impresión nativa del navegador
    // Funciona perfecto con CSS de impresión para ocultar menús
    window.print()
    return
  }

  // Modo 'image': usamos html2canvas-pro + jspdf
  try {
    isGenerating.value = true
    // Importación dinámica
    const htmlToImageModule = await import('html-to-image')
    const jsPDFModule = await import('jspdf')
    const jsPDF = jsPDFModule.jsPDF
    
    // Obtenemos el elemento que contiene el texto del artículo (VitePress usa .vp-doc)
    const element = document.querySelector('.vp-doc') as HTMLElement
    if (!element) {
      console.warn('No se encontró el contenido principal (.vp-doc)')
      return
    }

    const title = document.title ? document.title.split('|')[0].trim() : 'documento'

    // 1. Ocultar el botón de exportación temporalmente
    if (wrapperRef.value) {
      wrapperRef.value.style.display = 'none'
    }

    // 2. Forzar modo claro y desactivar transiciones
    // Esto evita que el texto quede gris/invisible al exportar desde el modo oscuro
    const html = document.documentElement
    const wasDark = html.classList.contains('dark')
    
    const style = document.createElement('style')
    style.innerHTML = `
      * { transition: none !important; }
      /* Prevenir desbordamiento horizontal que rompe el cálculo de páginas */
      pre, code, .line { 
        white-space: pre-wrap !important; 
        word-break: break-word !important; 
        overflow-x: hidden !important; 
      }
      .vp-doc { overflow-x: hidden !important; }
    `
    document.head.appendChild(style)

    if (wasDark) {
      html.classList.remove('dark')
    }

    // Ahorro de tinta: Aplicar estilos inline transparentes para asegurar que sobreescriban TODO
    // html-to-image a veces ignora las etiquetas <style> inyectadas si hay variables CSS muy específicas
    const originalStyles = new Map<HTMLElement, string>()
    const elementsToClearBg = element.querySelectorAll<HTMLElement>('.custom-block, table tr, table th, table td, div[class*="language-"]')
    
    elementsToClearBg.forEach(el => {
      originalStyles.set(el, el.style.cssText)
      el.style.setProperty('background', 'transparent', 'important')
      el.style.setProperty('background-color', 'transparent', 'important')
      
      // Asegurar que el texto en los bloques de código sea visible si le quitamos el fondo oscuro
      if (el.className.includes('language-')) {
        el.style.setProperty('color', '#333333', 'important')
        const spans = el.querySelectorAll<HTMLElement>('span, code')
        spans.forEach(span => {
          if (!originalStyles.has(span)) {
            originalStyles.set(span, span.style.cssText)
          }
          span.style.setProperty('color', '#333333', 'important')
        })
      }
    })

    // Forzar reflow para que los estilos apliquen instantáneamente
    void document.body.offsetHeight

    // Esperar un poco para que Vue/Navegador apliquen las clases de light-mode
    await new Promise(resolve => setTimeout(resolve, 200))

    // Asegurar que todas las imágenes estén cargadas antes de capturar
    const images = Array.from(element.querySelectorAll('img'))
    images.forEach(img => {
      if (img.getAttribute('loading') === 'lazy') {
        img.setAttribute('loading', 'eager')
      }
    })
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve()
      return new Promise((resolve) => {
        img.onload = resolve
        img.onerror = resolve
      })
    }))

    // 3. Preparar contenedor
    const originalPadding = element.style.padding
    element.style.padding = '40px' // Un poco más de margen para que se vea mejor

    // --- ALGORITMO DE PAGINACIÓN INTELIGENTE ---
    // Calculamos la altura de una página A4 en píxeles del DOM
    const A4_RATIO = 297 / 210
    const domPageHeight = element.offsetWidth * A4_RATIO

    // Seleccionar contenedores y bloques que no deben cortarse por la mitad
    // Incluimos div[class*="language-"] para capturar los bloques de código completos
    // e ignoramos tr/li para no romper el HTML, en su lugar empujamos el table/ul/ol padre si caben.
    const blocks = element.querySelectorAll('h1, h2, h3, h4, h5, p, .custom-block, div[class*="language-"], details, table, img, ul, ol, blockquote')
    const spacers: HTMLDivElement[] = []

    Array.from(blocks).forEach(block => {
      const rect = block.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      
      const relativeTop = rect.top - elementRect.top
      const relativeBottom = relativeTop + rect.height
      
      const pageIndexTop = Math.floor(relativeTop / domPageHeight)
      const pageIndexBottom = Math.floor(relativeBottom / domPageHeight)
      
      // Si el bloque empieza en una página y termina en otra, y cabe entero en una página
      if (pageIndexTop !== pageIndexBottom && rect.height < domPageHeight) {
        // Calculamos cuánto hay que empujarlo para que empiece en la página siguiente
        const pushAmount = ((pageIndexBottom * domPageHeight) - relativeTop) + 20 // 20px de respiro
        
        // Evitamos insertar divs dentro de tablas o listas para no romper la estructura visual
        if (block.parentNode && !['UL', 'OL', 'TBODY', 'THEAD', 'TR', 'TABLE'].includes(block.parentNode.nodeName)) {
          const spacer = document.createElement('div')
          spacer.style.height = `${pushAmount}px`
          spacer.style.width = '100%'
          spacer.style.clear = 'both'
          block.parentNode.insertBefore(spacer, block)
          spacers.push(spacer)
        }
      }
    })
    // -------------------------------------------

    // Aumentar el scale/pixelRatio para mejorar considerablemente la nitidez
    const pixelRatio = window.devicePixelRatio > 2 ? window.devicePixelRatio : 3
    const imgData = await htmlToImageModule.toPng(element, { 
      pixelRatio,
      backgroundColor: '#ffffff',
      skipFonts: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      style: {
        margin: '0',
        transform: 'none'
      }
    })

    // 4. Restaurar el DOM a su estado original
    element.style.padding = originalPadding
    spacers.forEach(spacer => spacer.remove()) // Limpiamos los espaciadores
    
    // Restaurar los fondos originales de los bloques
    originalStyles.forEach((cssText, el) => {
      el.style.cssText = cssText
    })

    if (wasDark) {
      html.classList.add('dark')
    }
    document.head.removeChild(style)
    if (wrapperRef.value) {
      wrapperRef.value.style.display = ''
    }

    // 5. Configurar PDF (A4 vertical) y paginar
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Calcular las dimensiones de la imagen
    const img = new Image()
    img.src = imgData
    await new Promise(resolve => { img.onload = resolve })

    const pdfHeight = (img.height * pdfWidth) / img.width
    
    let heightLeft = pdfHeight
    let position = 0

    // Añadir primera página
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, '', 'FAST')
    heightLeft -= pageHeight

    // Añadir páginas adicionales si el contenido es más largo que una página
    while (heightLeft > 0) {
      position -= pageHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, '', 'FAST')
      heightLeft -= pageHeight
    }

    pdf.save(`${title}.pdf`)
  } catch (error) {
    console.error('Error generando PDF:', error)
  } finally {
    isGenerating.value = false
    // Asegurar que el botón vuelva a verse en caso de error
    if (wrapperRef.value) {
      wrapperRef.value.style.display = ''
    }
  }
}
</script>

<template>
  <div class="export-pdf-wrapper" ref="wrapperRef">
    <Button 
      variant="primary" 
      iconLeft="📄" 
      :loading="isGenerating"
      @click="handleDownload"
    >
      {{ isGenerating ? 'Generando PDF...' : 'Descargar PDF' }}
    </Button>
  </div>
</template>

<style scoped>
.export-pdf-wrapper {
  margin: var(--custom-space-4) 0;
  display: flex;
  justify-content: flex-end;
}

/* En caso de exportar a texto (impresión), ocultamos este mismo botón */
@media print {
  .export-pdf-wrapper {
    display: none !important;
  }
}
</style>
