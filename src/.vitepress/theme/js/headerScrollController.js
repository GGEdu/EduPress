// headerScrollController.js - Controlador para el efecto de scroll del encabezado

import { setupHeaderScroll } from './headerScroll';

// Función para configurar el efecto de scroll
export function setupHeaderEffect() {
  try {
    setupHeaderScroll();
    
    // También configuramos un observador para detectar cambios en el DOM
    setupMutationObserver();
  } catch (error) {
    console.error('Error al configurar el efecto de scroll:', error);
  }
}

// Función para monitorizar cambios en la URL
export function monitorUrlChanges() {
  if (typeof window === 'undefined') return;
  
  try {
    let lastUrl = window.location.href;
    
    setInterval(() => {
      try {
        if (lastUrl !== window.location.href) {
          lastUrl = window.location.href;
          setTimeout(() => {
            try {
              setupHeaderScroll();
            } catch (error) {
              console.error('Error al reinicializar el scroll después del cambio de URL:', error);
            }
          }, 200);
        }
      } catch (error) {
        console.error('Error en la monitorización de URL:', error);
      }
    }, 500);
  } catch (error) {
    console.error('Error al inicializar el monitor de URL:', error);
  }
}

// Función para configurar un observador de mutaciones
export function setupMutationObserver() {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new MutationObserver((mutations) => {
      try {
        // Verificar si hay cambios relevantes en el DOM
        let headerChanged = false;
        
        for (const mutation of mutations) {
          // Verificar que mutation.target no sea null
          if (!mutation.target) continue;
          
          if (mutation.target.nodeName === 'BODY' || 
              (mutation.target instanceof Element && mutation.target.classList?.contains('VPContent')) ||
              (mutation.target instanceof Element && mutation.target.classList?.contains('cap'))) {
            headerChanged = true;
            break;
          }
        }
        
        if (headerChanged) {
          setTimeout(() => {
            try {
              setupHeaderScroll();
            } catch (error) {
              console.error('Error al reinicializar el scroll después de cambios en el DOM:', error);
            }
          }, 100);
        }
      } catch (error) {
        console.error('Error en el callback del observador:', error);
      }
    });
    
    // Observar cambios en el documento
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: false, 
      characterData: false 
    });
    
    return observer;
  } catch (error) {
    console.error('Error al configurar el observador de mutaciones:', error);
    return null;
  }
}

// Función principal de inicialización que se puede llamar desde fuera
export function initializeHeaderScrollController() {
  if (typeof window === 'undefined') return;
  
  try {
    // Inicializar todo
    setupHeaderEffect();
    monitorUrlChanges();
    
    // También reintentar después de un tiempo
    setTimeout(() => {
      try {
        setupHeaderEffect();
      } catch (error) {
        console.error('Error en el reintento de inicialización:', error);
      }
    }, 1000);
  } catch (error) {
    console.error('Error al inicializar el controlador de scroll:', error);
  }
}
