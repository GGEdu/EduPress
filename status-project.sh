#!/bin/bash

# Script para mostrar el estado actual del proyecto
PROJECT_NAME=$(basename "$PWD")

echo "📊 Estado del proyecto: $PROJECT_NAME"
echo "=================================="

# Verificar si existe .env
if [ -f .env ]; then
    echo "📄 Configuración actual:"
    cat .env | grep -E "(DEV_PORT|HMR_PORT|PREVIEW_PORT)" | sed 's/^/  /'
    echo ""
fi

# Mostrar estado de contenedores
echo "🐳 Estado de contenedores:"
docker-compose ps

# Mostrar URLs si hay contenedores corriendo
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "🌐 URLs disponibles:"
    
    if [ -f .env ]; then
        source .env
        
        # Verificar qué contenedor está corriendo
        if docker-compose ps | grep -q "vitepress.*Up"; then
            echo "  🔧 Desarrollo: http://localhost:${DEV_PORT}"
            echo "  ⚡ HMR: http://localhost:${HMR_PORT}"
        fi
        
        if docker-compose ps | grep -q "preview.*Up"; then
            echo "  📱 Preview: http://localhost:${PREVIEW_PORT}"
        fi
    fi
fi
