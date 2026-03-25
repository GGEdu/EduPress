/**
 * Módulo para gestionar el lightbox de imágenes y SVGs con navegación y zoom
 */

let lightboxOverlay: HTMLDivElement | null = null;
let currentIndex: number = 0;
let allImages: HTMLElement[] = [];

// Estado del zoom
interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

let zoomState: ZoomState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0
};

/**
 * Resetea el estado del zoom
 */
function resetZoom(): void {
  zoomState = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  };
  applyZoomTransform();
}

/**
 * Aplica la transformación de zoom a la imagen
 */
function applyZoomTransform(): void {
  const content = lightboxOverlay?.querySelector('.image-lightbox-content') as HTMLElement;
  if (!content) return;

  const img = content.querySelector('img, svg') as HTMLElement;
  if (!img) return;

  img.style.transform = `translate(${zoomState.translateX}px, ${zoomState.translateY}px) scale(${zoomState.scale})`;
  img.style.transformOrigin = 'center center';
  
  // Actualizar cursor según el estado
  if (zoomState.scale > 1) {
    img.style.cursor = zoomState.isDragging ? 'grabbing' : 'grab';
    content.style.cursor = zoomState.isDragging ? 'grabbing' : 'grab';
  } else {
    img.style.cursor = 'zoom-in';
    content.style.cursor = 'default';
  }

  // Actualizar botones de zoom
  const zoomInBtn = lightboxOverlay?.querySelector('.image-lightbox-zoom-in') as HTMLButtonElement;
  const zoomOutBtn = lightboxOverlay?.querySelector('.image-lightbox-zoom-out') as HTMLButtonElement;
  const zoomResetBtn = lightboxOverlay?.querySelector('.image-lightbox-zoom-reset') as HTMLButtonElement;

  if (zoomOutBtn) zoomOutBtn.disabled = zoomState.scale <= 1;
  if (zoomResetBtn) zoomResetBtn.disabled = zoomState.scale === 1 && zoomState.translateX === 0 && zoomState.translateY === 0;
}

/**
 * Realiza zoom en un punto específico
 */
function zoomAtPoint(scaleDelta: number, clientX: number, clientY: number): void {
  const content = lightboxOverlay?.querySelector('.image-lightbox-content');
  if (!content) return;

  const img = content.querySelector('img, svg') as HTMLElement;
  if (!img) return;

  const rect = content.getBoundingClientRect();
  const contentCenterX = rect.left + rect.width / 2;
  const contentCenterY = rect.top + rect.height / 2;

  const newScale = Math.max(1, Math.min(5, zoomState.scale + scaleDelta));
  
  if (newScale === zoomState.scale) return;

  // Calcular el punto relativo al centro del contenido
  const pointX = clientX - contentCenterX;
  const pointY = clientY - contentCenterY;

  // Ajustar la traducción para mantener el punto bajo el cursor
  const scaleChange = newScale / zoomState.scale;
  zoomState.translateX = pointX - (pointX - zoomState.translateX) * scaleChange;
  zoomState.translateY = pointY - (pointY - zoomState.translateY) * scaleChange;

  zoomState.scale = newScale;
  applyZoomTransform();
}

/**
 * Centra y hace zoom sobre un elemento SVG específico (como un nodo de Mermaid)
 */
function zoomToElement(element: Element): void {
  const content = lightboxOverlay?.querySelector('.image-lightbox-content');
  if (!content) return;

  const rect = element.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  
  // Calcular el centro del elemento en coordenadas de pantalla
  const elementCenterX = rect.left + rect.width / 2;
  const elementCenterY = rect.top + rect.height / 2;
  
  // Calcular el centro del contenedor del lightbox
  const contentCenterX = contentRect.left + contentRect.width / 2;
  const contentCenterY = contentRect.top + contentRect.height / 2;

  // Distancia desde el centro del lightbox al centro actual de la pantalla
  const offsetX = contentCenterX - elementCenterX;
  const offsetY = contentCenterY - elementCenterY;

  // Queremos que el elemento ocupe aproximadamente el 60-80% del alto/ancho disponible
  // sin exceder un zoom máximo de 5x
  const scaleX = (contentRect.width * 0.8) / (rect.width / zoomState.scale);
  const scaleY = (contentRect.height * 0.8) / (rect.height / zoomState.scale);
  
  // Usar la escala menor para que quepa completamente por ambos lados, limitando entre 1 y 5
  const exactScale = Math.min(scaleX, scaleY);
  const targetScale = Math.max(1, Math.min(5, exactScale));

  // Ajustar el offset teniendo en cuenta cómo escalará el pivote
  const scaleRatio = targetScale / zoomState.scale;
  
  // Nueva traslación = Traslación actual + (Offset para centrar * Factor de escala)
  zoomState.translateX = (zoomState.translateX + offsetX) * scaleRatio;
  zoomState.translateY = (zoomState.translateY + offsetY) * scaleRatio;
  
  zoomState.scale = targetScale;
  applyZoomTransform();
}

/**
 * Actualiza el contenido del lightbox con la imagen en el índice actual
 */
function updateLightboxContent(): void {
  if (!lightboxOverlay || allImages.length === 0) return;

  // Resetear zoom al cambiar de imagen
  resetZoom();

  const element = allImages[currentIndex];
  const existingContent = lightboxOverlay.querySelector('.image-lightbox-content');
  if (!existingContent) return;

  // Limpiar contenido anterior
  existingContent.innerHTML = '';

  // Crear el nuevo contenido según el tipo de elemento
  if (element.classList.contains('mermaid-container') || element.classList.contains('mermaid')) {
    const svg = element.tagName.toLowerCase() === 'svg' ? element as unknown as SVGSVGElement : element.querySelector('svg');
    if (svg) {
      const svgClone = svg.cloneNode(true) as SVGElement;
      
      const viewBox = svg.getAttribute('viewBox');
      if (viewBox) svgClone.setAttribute('viewBox', viewBox);

      // Obtener dimensiones reales del SVG
      let width = 800;
      let height = 600;

      try {
        const bbox = svg.getBBox();
        if (bbox.width > 0 && bbox.height > 0) {
          width = bbox.width;
          height = bbox.height;
        } else if (viewBox) {
          const parts = viewBox.split(' ');
          if (parts.length === 4) {
            width = parseFloat(parts[2]);
            height = parseFloat(parts[3]);
          }
        }
      } catch (e) {
        console.error('[Lightbox] SVG getBBox failed:', e);
        if (viewBox) {
          const parts = viewBox.split(' ');
          if (parts.length === 4) {
            width = parseFloat(parts[2]);
            height = parseFloat(parts[3]);
          }
        }
      }

      const maxWidth = window.innerWidth * 0.90;
      const maxHeight = window.innerHeight * 0.90;
      const scale = Math.min(maxWidth / width, maxHeight / height);

      const finalWidth = width * scale;
      const finalHeight = height * scale;

      svgClone.setAttribute('width', finalWidth.toString());
      svgClone.setAttribute('height', finalHeight.toString());

      // IMPORTANTE: Mermaid inyecta inline styles como max-width que sobreescriben
      // nuestras reglas de CSS (max-width: 90vw). Debemos eliminarlos y fijar
      // las dimensiones estrictas que hemos calculado nosotros mismos.
      svgClone.style.maxWidth = '100%';
      svgClone.style.maxHeight = '100%';
      svgClone.style.setProperty('width', `${finalWidth}px`, 'important');
      svgClone.style.setProperty('height', `${finalHeight}px`, 'important');
      svgClone.style.cursor = 'zoom-in';
      svgClone.style.display = 'block';
      svgClone.style.transition = 'transform 0.1s ease-out';

      // Incluir entorno vp-doc por si el SVG usa variables CSS temáticas
      existingContent.classList.add('vp-doc');
      existingContent.style.width = '';
      existingContent.style.height = '';

      // Importante: Mermaid.js usa a menudo reglas CSS como `.mermaid svg { ... }`. 
      // Si insertamos el SVG desnudo, pierde sus estilos y se vuelve invisible.
      // Lo envolvemos en su clase original:
      const mermaidWrapper = document.createElement('div');
      mermaidWrapper.className = 'mermaid';
      mermaidWrapper.style.display = 'flex';
      mermaidWrapper.style.justifyContent = 'center';
      mermaidWrapper.style.alignItems = 'center';
      mermaidWrapper.style.width = '100%';
      mermaidWrapper.style.height = '100%';
      
      mermaidWrapper.appendChild(svgClone);
      existingContent.appendChild(mermaidWrapper);
      
      applyZoomTransform();
    }
  } else if (element.tagName === 'IMG') {
    const img = element as HTMLImageElement;
    const imgClone = document.createElement('img');
    imgClone.src = img.src;
    imgClone.alt = img.alt || '';
    imgClone.style.cursor = 'zoom-in';
    imgClone.style.transition = 'transform 0.1s ease-out';

    imgClone.onload = () => {
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.9;
      const imgWidth = imgClone.naturalWidth;
      const imgHeight = imgClone.naturalHeight;
      const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

      if (scale < 1) {
        imgClone.style.width = (imgWidth * scale) + 'px';
        imgClone.style.height = (imgHeight * scale) + 'px';
      }
      applyZoomTransform();
    };

    existingContent.appendChild(imgClone);
  } else {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.cursor = 'zoom-in';
    clone.style.maxWidth = '90vw';
    clone.style.maxHeight = '90vh';
    clone.style.transition = 'transform 0.1s ease-out';
    existingContent.appendChild(clone);
  }

  // Actualizar contador
  const counter = lightboxOverlay.querySelector('.image-lightbox-counter');
  if (counter && allImages.length > 1) {
    counter.textContent = `${currentIndex + 1} / ${allImages.length}`;
  }

  // Actualizar estado de los botones de navegación
  const prevButton = lightboxOverlay.querySelector('.image-lightbox-prev') as HTMLButtonElement;
  const nextButton = lightboxOverlay.querySelector('.image-lightbox-next') as HTMLButtonElement;
  
  if (prevButton) prevButton.disabled = currentIndex === 0;
  if (nextButton) nextButton.disabled = currentIndex === allImages.length - 1;
}

/**
 * Crea y muestra el lightbox con el elemento proporcionado
 */
export function createLightbox(element: HTMLElement, initialIndex: number = 0): void {
  // Prevenir la creación de múltiples lightboxes
  if (lightboxOverlay) { return; }

  // Recalcular índice real por cambios asíncronos en DOM si fuera posible
  const realIndex = allImages.indexOf(element);
  currentIndex = realIndex !== -1 ? realIndex : initialIndex;

  // Crear overlay
  lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'image-lightbox-overlay';

  // Crear contenedor de contenido
  const content = document.createElement('div');
  content.className = 'image-lightbox-content';

  // Crear botón de cierre
  const closeButton = document.createElement('button');
  closeButton.className = 'image-lightbox-close';
  closeButton.setAttribute('aria-label', 'Cerrar');
  closeButton.innerHTML = '×';

  // Añadir elementos al overlay
  lightboxOverlay.appendChild(content);
  lightboxOverlay.appendChild(closeButton);

  // Crear controles de zoom
  const zoomControls = document.createElement('div');
  zoomControls.className = 'image-lightbox-zoom-controls';

  const zoomInButton = document.createElement('button');
  zoomInButton.className = 'image-lightbox-zoom-in';
  zoomInButton.setAttribute('aria-label', 'Acercar');
  zoomInButton.innerHTML = '+';
  zoomInButton.title = 'Acercar (Rueda del mouse arriba)';

  const zoomOutButton = document.createElement('button');
  zoomOutButton.className = 'image-lightbox-zoom-out';
  zoomOutButton.setAttribute('aria-label', 'Alejar');
  zoomOutButton.innerHTML = '−';
  zoomOutButton.disabled = true;
  zoomOutButton.title = 'Alejar (Rueda del mouse abajo)';

  const zoomResetButton = document.createElement('button');
  zoomResetButton.className = 'image-lightbox-zoom-reset';
  zoomResetButton.setAttribute('aria-label', 'Resetear zoom');
  zoomResetButton.innerHTML = '⌂';
  zoomResetButton.disabled = true;
  zoomResetButton.title = 'Resetear zoom (1:1)';

  zoomControls.appendChild(zoomInButton);
  zoomControls.appendChild(zoomOutButton);
  zoomControls.appendChild(zoomResetButton);
  lightboxOverlay.appendChild(zoomControls);

  // Event listeners para zoom
  zoomInButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = content.getBoundingClientRect();
    zoomAtPoint(0.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  zoomOutButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = content.getBoundingClientRect();
    zoomAtPoint(-0.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  zoomResetButton.addEventListener('click', (e) => {
    e.stopPropagation();
    resetZoom();
  });

  // Si hay más de una imagen, añadir controles de navegación
  if (allImages.length > 1) {
    // Botón anterior
    const prevButton = document.createElement('button');
    prevButton.className = 'image-lightbox-prev';
    prevButton.setAttribute('aria-label', 'Anterior');
    prevButton.innerHTML = '‹';
    prevButton.disabled = currentIndex === 0;

    // Botón siguiente
    const nextButton = document.createElement('button');
    nextButton.className = 'image-lightbox-next';
    nextButton.setAttribute('aria-label', 'Siguiente');
    nextButton.innerHTML = '›';
    nextButton.disabled = currentIndex === allImages.length - 1;

    // Contador
    const counter = document.createElement('div');
    counter.className = 'image-lightbox-counter';
    counter.textContent = `${currentIndex + 1} / ${allImages.length}`;

    lightboxOverlay.appendChild(prevButton);
    lightboxOverlay.appendChild(nextButton);
    lightboxOverlay.appendChild(counter);

    // Event listeners para navegación
    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex > 0) {
        currentIndex--;
        updateLightboxContent();
      }
    });

    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentIndex < allImages.length - 1) {
        currentIndex++;
        updateLightboxContent();
      }
    });
  }

  document.body.appendChild(lightboxOverlay);
  document.body.classList.add('lightbox-open');

  // Cargar el contenido inicial
  updateLightboxContent();

  // Eventos de cierre
  const closeLightbox = () => {
    if (lightboxOverlay) {
      // Limpiar event listeners
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      lightboxOverlay.removeEventListener('wheel', handleWheel);
      
      // Resetear zoom
      resetZoom();
      
      lightboxOverlay.style.animation = 'fadeOut 0.2s ease forwards';
      setTimeout(() => {
        lightboxOverlay?.remove();
        lightboxOverlay = null;
        document.body.classList.remove('lightbox-open');
      }, 200);
    }
  };

  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  // Manejar eventos de teclado
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
      document.removeEventListener('keydown', handleKeyDown);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      currentIndex--;
      updateLightboxContent();
    } else if (e.key === 'ArrowRight' && currentIndex < allImages.length - 1) {
      currentIndex++;
      updateLightboxContent();
    }
  };
  document.addEventListener('keydown', handleKeyDown);

  // Evitar que el clic en el contenido cierre el lightbox
  // Detect clicks on sub-elements (nodes/clusters) to auto-zoom, or double clicks
  let lastClickTime = 0;
  let clickStartX = 0;
  let clickStartY = 0;

  content.addEventListener('mousedown', (e) => {
    clickStartX = e.clientX;
    clickStartY = e.clientY;
  });

  content.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Si el mouse se movió demasiado, fue un pan (arrastre), no un click
    const moveDist = Math.hypot(e.clientX - clickStartX, e.clientY - clickStartY);
    if (moveDist > 5) return;

    // Detect click-to-zoom on specific SVG nodes
    const target = e.target as Element;
    const node = target.closest('g.node, g.cluster');
    if (node) {
      zoomToElement(node);
      return;
    }
    
    // Doble clic para zoom rápido
    const currentTime = Date.now();
    if (currentTime - lastClickTime < 300) {
      // Doble clic detectado
      if (zoomState.scale > 1) {
        resetZoom();
      } else {
        zoomAtPoint(1.5, e.clientX, e.clientY);
      }
    }
    lastClickTime = currentTime;
  });

  // Zoom con rueda del mouse
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Zoom con rueda del mouse (con o sin Ctrl/Cmd)
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    zoomAtPoint(delta, e.clientX, e.clientY);
  };

  lightboxOverlay.addEventListener('wheel', handleWheel, { passive: false });

  // Pan (arrastrar) cuando está zoomed
  const handleMouseDown = (e: MouseEvent) => {
    if (zoomState.scale > 1 && (e.target === content || content.contains(e.target as Node))) {
      zoomState.isDragging = true;
      zoomState.lastMouseX = e.clientX;
      zoomState.lastMouseY = e.clientY;
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (zoomState.isDragging) {
      const deltaX = e.clientX - zoomState.lastMouseX;
      const deltaY = e.clientY - zoomState.lastMouseY;
      
      zoomState.translateX += deltaX;
      zoomState.translateY += deltaY;
      
      zoomState.lastMouseX = e.clientX;
      zoomState.lastMouseY = e.clientY;
      
      applyZoomTransform();
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    zoomState.isDragging = false;
  };

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

/**
 * Adjunta los event listeners a las imágenes y contenedores de Mermaid
 */
export function attachLightboxListeners(): void {
  // Recopilar todas las imágenes y diagramas disponibles
  allImages = [];
  
  // Recopilar todas las imágenes dentro de .vp-doc y también en el visor de slides (que es un teleport a body)
  const containers = [document.querySelector('.vp-doc'), document.querySelector('.slide-lightbox-overlay')].filter(Boolean);
  if (containers.length === 0) containers.push(document.body);
  
  containers.forEach(container => {
    container.querySelectorAll('img').forEach((img) => {
      const isUIElement = img.closest('.VPNav, .VPSidebar, .VPFooter, .VPLocalNav, .VPHomeHero, .VPHomeFeatures');
      // Excluir también imágenes que sean parte de componentes de UI
      const isLogo = img.closest('header, footer, nav, .logo, .VPImage');
      // Incluir imágenes dentro de slides (diapositivas)
      const isInSlide = img.closest('.slide');
      if (!isUIElement && !isLogo) {
        allImages.push(img as HTMLElement);
        // Asegurar que las imágenes en slides tengan cursor pointer o zoom-in
        if (isInSlide) {
          (img as HTMLElement).style.cursor = 'zoom-in';
        }
      }
    });

    // Recopilar todos los contenedores de Mermaid dentro del contenido
    container.querySelectorAll('.mermaid-container, .mermaid').forEach((mermaidEl) => {
      allImages.push(mermaidEl as HTMLElement);
    });
  });

  // Añadir event listeners a cada elemento
  let newAttachments = 0;
  allImages.forEach((element, index) => {
    if (!element.getAttribute('data-lightbox-attached')) {
      element.setAttribute('data-lightbox-attached', 'true');
      (element as HTMLElement).style.cursor = 'pointer';
      newAttachments++;
      
      // Añadir listener con capture para asegurar que se ejecute primero
      element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        createLightbox(element, index);
        return false;
      }, { capture: true, passive: false });
    }
  });
  

}

/**
 * Inicializa el sistema de lightbox
 */
export function initLightbox(): void {
  // Ejecutar al cargar la página
  attachLightboxListeners();

  // Observar cambios en el DOM para elementos dinámicos
  const observer = new MutationObserver(() => {
    attachLightboxListeners();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

