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
      let diagramCounter = 0; // Contador global para IDs únicos
      
      const initMermaid = async () => {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: 'default'
          });
          
          const renderDiagrams = () => {
            document.querySelectorAll('.language-mermaid:not([data-processed])').forEach((el) => {
              const code = el.textContent?.replace(/^mermaid\s*/i, '').trim();
              if (code) {
                el.setAttribute('data-processed', 'true');
                const uniqueId = `mermaid-diagram-${Date.now()}-${++diagramCounter}`;
                
                mermaid.render(uniqueId, code).then(result => {
                  const div = document.createElement('div');
                  div.innerHTML = result.svg;
                  div.className = 'mermaid-container';
                  el.parentNode?.insertBefore(div, el);
                  (el as HTMLElement).style.display = 'none';
                }).catch(error => {
                  console.error(`Error rendering diagram ${uniqueId}:`, error);
                  // Mostrar el código original si hay error
                  (el as HTMLElement).style.display = 'block';
                  el.removeAttribute('data-processed');
                });
              }
            });
          };
          
          renderDiagrams();
          new MutationObserver(renderDiagrams).observe(document.body, { childList: true, subtree: true });
        } catch (error) {
          console.error('Mermaid error:', error);
        }
      };
      
      // Inicializar cuando el DOM esté listo
      window.addEventListener('DOMContentLoaded', () => {
        try {
          initializeHeaderScrollController();
          initMermaid();
        } catch (error) {
          console.error('Error al inicializar el controlador en DOMContentLoaded:', error);
        }
      });
      
      // También intentar inicializar después de un tiempo
      setTimeout(() => {
        try {
          initializeHeaderScrollController();
          initMermaid();
        } catch (error) {
          console.error('Error al inicializar el controlador en setTimeout:', error);
        }
      }, 300);
    }
  }
} satisfies Theme
