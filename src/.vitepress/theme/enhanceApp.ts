import type { EnhanceAppContext } from 'vitepress'

export default function customEnhanceApp(ctx: EnhanceAppContext) {
  if (typeof window === 'undefined') return

  const desiredTabs = ['Java']  // Només volem mostrar "Java"

  const hideUnwantedTabs = () => {
    // 1) recórrer cada bloc de pestanyes
    document
      .querySelectorAll<HTMLDivElement>('.plugin-tabs--tab-list')
      .forEach(tabList => {
        // 2) seleccionar tots els botons de pestanya
        const tabs = Array.from(
          tabList.querySelectorAll<HTMLButtonElement>('button.plugin-tabs--tab')
        )

        // 3) per a cada pestanya, mirem si la volem
        tabs.forEach(tab => {
          const title = tab.textContent?.trim() || ''
          const panelId = tab.getAttribute('aria-controls')
          const panel = panelId
            ? document.getElementById(panelId)
            : null

          if (desiredTabs.includes(title)) {
            // MOSTRAR pestanya i panell
            tab.style.display = ''
            if (panel) panel.style.display = ''
          } else {
            // OCULTAR pestanya i panell
            //tab.style.display = 'none'
            //if (panel) panel.style.display = 'none'
          }
        })
        /*
        const javaTab = tabs.find(t => t.textContent?.trim() === desiredTabs.toString())
        if (javaTab) {
          javaTab.click()
        }*/
      })
  }

  // Aplica-ho en carregar i cada vegada que muta el DOM
  hideUnwantedTabs()
  new MutationObserver(hideUnwantedTabs).observe(document.body, {
    childList: true,
    subtree: true
  })
}
