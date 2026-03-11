#!/bin/bash

# Script para detener el proyecto actual
PROJECT_NAME=$(basename "$PWD")

echo "🛑 Deteniendo proyecto: $PROJECT_NAME"

# Detener contenedores
docker compose down

# Limpiar archivo .env
if [ -f .env ]; then
    rm .env
    echo "✅ Archivo .env eliminado"
fi

echo "✅ Proyecto detenido"
