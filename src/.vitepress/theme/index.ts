// .vitepress/theme/index.ts
import type { Theme, EnhanceAppContext } from 'vitepress'
import { useData } from 'vitepress'
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import customEnhanceApp from './enhanceApp'
import { initializeHeaderScrollController } from './js/headerScrollController'
import { initLightbox } from './utils/lightboxManager'
import SlidesViewer from './components/SlidesViewer.vue'
import SlidesLayout from './components/SlidesLayout.vue'
import SidebarLogos from './components/SidebarLogos.vue'
import FooterLogo from './components/FooterLogo.vue'
import DynamicNav from './components/DynamicNav.vue'
import DynamicNavScreen from './components/DynamicNavScreen.vue'
import ThemedImage from './components/ThemedImage.vue'

// Importar los estilos personalizados
import './css/design-tokens.css'
import './css/dynamic-nav.css'
import './css/utilities.css'
import './css/styles.css'
import './css/ejercicios.css'
import './css/slides.css'
import './css/ejer_imgs.css'
import './css/lightbox.css'

// Importar componentes de slides y contenido
import SlideBase from './components/SlideBase.vue'
import PluginTabsTab from './components/PluginTabsTab.vue'
import SlideLightbox from './components/SlideLightbox.vue'
import AccentBox from './components/content/AccentBox.vue'
import InfoBox from './components/content/InfoBox.vue'
import NoteBox from './components/content/NoteBox.vue'
import Quote from './components/content/Quote.vue'
import TwoColumns from './components/content/TwoColumns.vue'
import BulletPoints from './components/content/BulletPoints.vue'
import Badge from './components/ui/Badge.vue'
import Button from './components/ui/Button.vue'
import Card from './components/ui/Card.vue'
import Input from './components/ui/Input.vue'
import Toast from './components/ui/Toast.vue'
import ExportPDF from './components/ExportPDF.vue'

export default {
  ...DefaultTheme,
  // Layout personalizado: delega a SlidesLayout cuando layout: slides,
  // o usa el DefaultTheme.Layout en cualquier otro caso.
  Layout: {
    setup() {
      const { frontmatter } = useData()
      return () => {
        if (frontmatter.value.layout === 'slides') {
          return h(SlidesLayout)
        }
        // Inyectar logos institucionales en el sidebar y footer via slots
        return h(DefaultTheme.Layout, null, {
          'sidebar-nav-after':         () => h(SidebarLogos),
          'layout-bottom':             () => h(FooterLogo),
          'nav-bar-content-after':     () => h(DynamicNav),
          'nav-screen-content-before': () => h(DynamicNavScreen),
        })
      }
    }
  },
  enhanceApp(ctx: EnhanceAppContext) {
    // 1) Setup de DefaultTheme y plugins
    DefaultTheme.enhanceApp?.(ctx)
    enhanceAppWithTabs(ctx.app)
    // 3) Aplica el teu filtre de pestanyes
    customEnhanceApp(ctx)

    // 4) Registra componentes globales.
    // Usamos el registro interno para sobreescribir sin warning los componentes que
    // DefaultTheme (Badge) y vitepress-plugin-tabs (PluginTabsTab) ya registraron.
    const components = (ctx.app as any)._context.components
    components['PluginTabsTab'] = PluginTabsTab  // override: usar v-show en vez de v-if
    ctx.app.component('SlidesViewer', SlidesViewer)
    ctx.app.component('SlideBase', SlideBase)
    ctx.app.component('SlideLightbox', SlideLightbox)
    ctx.app.component('AccentBox', AccentBox)
    ctx.app.component('InfoBox', InfoBox)
    ctx.app.component('NoteBox', NoteBox)
    ctx.app.component('Quote', Quote)
    ctx.app.component('TwoColumns', TwoColumns)
    ctx.app.component('BulletPoints', BulletPoints)
    ctx.app.component('ThemedImage', ThemedImage)
    components['Badge'] = Badge  // override: Badge extendido (8 variantes, dot, closeable...)
    ctx.app.component('Button', Button)
    ctx.app.component('Card', Card)
    ctx.app.component('Input', Input)
    ctx.app.component('Toast', Toast)
    ctx.app.component('ExportPDF', ExportPDF)

    // 5) Inicializar el controlador del header solo en el cliente
    if (typeof window !== 'undefined') {
      let diagramCounter = 0; // Contador global para IDs únicos

      const initMermaid = async () => {
        // Guard: solo inicializar una vez aunque se llame múltiples veces (HMR)
        if ((window as any).__mermaidInitialized) return;
        (window as any).__mermaidInitialized = true;

        try {
          const mermaid = (await import('mermaid')).default;

          const getMermaidTheme = () =>
            document.documentElement.classList.contains('dark') ? 'dark' : 'default';

          const reinitialize = () => {
            mermaid.initialize({ startOnLoad: false, theme: getMermaidTheme() });
          };

          reinitialize();

          // Generación de render: cuando se incrementa, los .then() pendientes
          // del lote anterior detectan que son obsoletos y se descartan.
          let renderGeneration = 0;
          let bodyObserver: MutationObserver;

          const renderDiagrams = () => {
            const generation = renderGeneration;
            document.querySelectorAll('.language-mermaid:not([data-processed])').forEach((el) => {
              const code = el.textContent?.replace(/^mermaid\s*/i, '').trim();
              if (code) {
                el.setAttribute('data-processed', 'true');
                const uniqueId = `mermaid-diagram-${Date.now()}-${++diagramCounter}`;

                mermaid.render(uniqueId, code).then(result => {
                  // Descartar si reRenderAll ya inició un lote más reciente
                  if (generation !== renderGeneration) return;
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

          const reRenderAll = () => {
            renderGeneration++; // Invalida todos los .then() pendientes del lote anterior
            bodyObserver.disconnect();
            document.querySelectorAll('.mermaid-container').forEach(el => el.remove());
            document.querySelectorAll('.language-mermaid[data-processed]').forEach(el => {
              el.removeAttribute('data-processed');
              (el as HTMLElement).style.display = '';
            });
            reinitialize();
            renderDiagrams();
            bodyObserver.observe(document.body, { childList: true, subtree: true });
          };

          renderDiagrams();
          bodyObserver = new MutationObserver(renderDiagrams);
          bodyObserver.observe(document.body, { childList: true, subtree: true });

          // Re-renderizar cuando VitePress cambia el tema claro/oscuro
          new MutationObserver(() => reRenderAll())
            .observe(document.documentElement, { attributeFilter: ['class'] });
        } catch (error) {
          console.error('Mermaid error:', error);
        }
      };
      
      // Inicializar cuando el DOM esté listo
      const initAll = () => {
        try {
          initializeHeaderScrollController();
          initMermaid();
          // Inicializar lightbox con un pequeño delay para asegurar que el DOM esté listo
          setTimeout(() => {
            try {
              initLightbox();
            } catch (error) {
              console.error('Error al inicializar el lightbox:', error);
            }
          }, 100);
        } catch (error) {
          console.error('Error en inicializar componentes:', error);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
      } else {
        initAll();
      }
      
      // Intentar inicializar después de un tiempo
      setTimeout(() => {
        try {
          initializeHeaderScrollController();
          initMermaid();
          initLightbox();
        } catch (error) {
          console.error('Error al inicializar el controlador en setTimeout:', error);
        }
      }, 300);

      // Reintento extra para el lightbox
      setTimeout(() => {
        try {
          initLightbox();
        } catch (error) {
          console.error('Error al reinicializar el lightbox (segundo intento):', error);
        }
      }, 1500);

      // Escucha cambios de ruta para actualizar
      window.addEventListener('vitepress:afterRouteChanged', () => {
        setTimeout(() => {
          try {
            initLightbox();
          } catch (error) {
            console.error('Error al reinicializar el lightbox después de cambio de ruta:', error);
          }
        }, 300);
      });
    }
  }
} satisfies Theme
