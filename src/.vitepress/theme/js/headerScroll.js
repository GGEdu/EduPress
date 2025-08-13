// Script para manejar la animación del encabezado al hacer scroll

// Variable para guardar la referencia al detector de eventos
let scrollHandler = null;

// Variable para controlar el intento de inicialización
let initializationAttempts = 0;
const MAX_ATTEMPTS = 5;

// Función para controlar el comportamiento del encabezado
export function setupHeaderScroll() {
  // Eliminar listeners anteriores para evitar duplicados
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }

  // Función que se ejecutará para inicializar el comportamiento del scroll
  function initHeaderScroll() {
    // Elemento header
    const header = document.querySelector('.cap header');
    
    // Si no existe el header, intentar de nuevo si no hemos superado el máximo de intentos
    if (!header) {
      initializationAttempts++;
      if (initializationAttempts < MAX_ATTEMPTS) {
        console.warn(`❌ No se encontró el elemento .cap header. Intento ${initializationAttempts} de ${MAX_ATTEMPTS}`);
        setTimeout(initHeaderScroll, 300);
        return false;
      } else {
        console.warn('⚠️ Máximo de intentos alcanzado. No se pudo encontrar el elemento .cap header');
        initializationAttempts = 0;
        return false;
      }
    }

    // Reiniciar contador de intentos si se encontró el header
    initializationAttempts = 0;
    // Determinar el punto de activación del scroll
    const scrollTrigger = window.innerHeight * 0.3; // Activar después de 30% del alto de la ventana

    // Función para manejar el evento de scroll
    scrollHandler = function() {
      try {
        // Verificar si el header sigue existiendo (puede haber cambiado de página)
        const currentHeader = document.querySelector('.cap header');
        if (!currentHeader) {
          console.warn('⚠️ Header no encontrado durante el scroll, removiendo listener');
          window.removeEventListener('scroll', scrollHandler);
          return;
        }
        
        // Comprobar la posición del scroll y aplicar/quitar clase
        if (window.scrollY > scrollTrigger) {
          currentHeader.classList.add('scrolled');
        } else {
          currentHeader.classList.remove('scrolled');
        }
      } catch (error) {
        console.error('Error en el manejador de scroll:', error);
        window.removeEventListener('scroll', scrollHandler);
      }
    };

    // Escuchar el evento de scroll
    window.addEventListener('scroll', scrollHandler);
    
    // Comprobar la posición inicial
    scrollHandler();
    return true;
  }

  // Tratar de inicializar inmediatamente
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initHeaderScroll();
  } else {
    // Si el documento no está listo, esperar a que se cargue
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initHeaderScroll, 100);
    });
  }

  // También intentar después de un tiempo para asegurarse
  setTimeout(initHeaderScroll, 500);
}
