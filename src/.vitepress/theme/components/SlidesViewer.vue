<template>
  <div class="slides-container" ref="containerRef">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue';

const containerRef = ref(null);

onMounted(async () => {
  // Esperar múltiples ciclos para asegurar que VitePress procese todo
  await nextTick();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Esperar a que las pestañas se procesen completamente
  await nextTick();
  
  // Procesar las diapositivas después de que todo esté renderizado
  setTimeout(() => {
    if (!containerRef.value) return;
    
    const container = containerRef.value;
    
    // Verificar si hay pestañas en el contenido
    const hasTabs = container.querySelector('.plugin-tabs') || 
                   container.textContent.includes('::: tabs') ||
                   container.innerHTML.includes('== DAW') ||
                   container.innerHTML.includes('== DAM') ||
                   container.innerHTML.includes('== ASIR');
    
    if (hasTabs) {
      // Si hay pestañas, aplicar estilos de slide sin mover elementos
      console.log('Tabs detected, applying slide styles without DOM manipulation');
      
      // Dividir por separadores HR y aplicar estilos
      const elements = Array.from(container.children);
      let currentGroup = [];
      const groups = [];
      
      elements.forEach(element => {
        if (element.tagName === 'HR') {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else {
          currentGroup.push(element);
        }
      });
      
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      
      // Aplicar estilos de slide a cada grupo
      groups.forEach((group, index) => {
        if (group.length > 0) {
          const wrapper = document.createElement('div');
          wrapper.className = 'slide';
          
          // Insertar el wrapper antes del primer elemento del grupo
          const firstElement = group[0];
          firstElement.parentNode.insertBefore(wrapper, firstElement);
          
          // Mover todos los elementos del grupo al wrapper
          group.forEach(element => {
            wrapper.appendChild(element);
          });
        }
      });
      
      // Remover elementos HR que ahora están huérfanos
      container.querySelectorAll('hr').forEach(hr => hr.remove());
      
      return;
    }
    
    // Procesamiento normal para contenido sin pestañas
    const slides = [];
    let currentSlide = document.createElement('div');
    currentSlide.className = 'slide';

    const children = Array.from(container.children);
    
    children.forEach(node => {
      if (node.tagName === 'HR') {
        if (currentSlide.children.length > 0) {
          slides.push(currentSlide);
        }
        currentSlide = document.createElement('div');
        currentSlide.className = 'slide';
      } else {
        currentSlide.appendChild(node);
      }
    });
    
    if (currentSlide.children.length > 0) {
      slides.push(currentSlide);
    }

    if (slides.length > 0) {
      container.innerHTML = '';
      slides.forEach(slide => {
        container.appendChild(slide);
      });
    }
  }, 2000);
});
</script>

<style scoped>
.slides-container {
  width: 100%;
}
</style>

<style scoped>
.slides-container :deep(h1),
.slides-container :deep(h2),
.slides-container :deep(h3),
.slides-container :deep(h4),
.slides-container :deep(h5),
.slides-container :deep(h6) {
  margin-top: 0;
  padding-top: 0;
}
</style>
