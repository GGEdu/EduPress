// .vitepress/theme/index.ts
import type { Theme, EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import customEnhanceApp from './enhanceApp'
import { initializeHeaderScrollController } from './js/headerScrollController'

// Importar los estilos personalizados
import './css/styles.css'
import './css/ejercicios.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    // 1) Crida l'enhanceApp original si existeix
    DefaultTheme.enhanceApp?.(ctx)
    // 2) Activa el plugin de Tabs
    enhanceAppWithTabs(ctx.app)
    // 3) Aplica el teu filtre de pestanyes
    customEnhanceApp(ctx)
    
    // 4) Inicializar el controlador del header solo en el cliente
    if (typeof window !== 'undefined') {
      // Inicializar cuando el DOM esté listo
      window.addEventListener('DOMContentLoaded', () => {
        try {
          initializeHeaderScrollController();
        } catch (error) {
          console.error('Error al inicializar el controlador en DOMContentLoaded:', error);
        }
      });
      
      // También intentar inicializar después de un tiempo
      setTimeout(() => {
        try {
          initializeHeaderScrollController();
        } catch (error) {
          console.error('Error al inicializar el controlador en setTimeout:', error);
        }
      }, 300);
    }
  }
} satisfies Theme
