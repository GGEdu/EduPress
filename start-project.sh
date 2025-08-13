#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con colores
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un puerto está disponible
is_port_available() {
    local port=$1
    if ! command -v nc &> /dev/null; then
        # Si netcat no está disponible, usar ss o netstat
        if command -v ss &> /dev/null; then
            ! ss -tuln | grep -q ":$port "
        elif command -v netstat &> /dev/null; then
            ! netstat -tuln | grep -q ":$port "
        else
            # Último recurso: intentar conectar con bash
            ! (echo >/dev/tcp/localhost/$port) 2>/dev/null
        fi
    else
        ! nc -z localhost $port 2>/dev/null
    fi
}

# Función para encontrar el siguiente puerto disponible
find_available_port() {
    local start_port=$1
    local max_attempts=${2:-50}  # Máximo 50 intentos por defecto
    
    for ((i=0; i<max_attempts; i++)); do
        local port=$((start_port + i))
        if is_port_available $port; then
            echo $port
            return 0
        fi
    done
    
    return 1
}

# Obtener el nombre del proyecto (nombre del directorio actual)
PROJECT_NAME=$(basename "$PWD")

print_info "Iniciando proyecto: $PROJECT_NAME"

# Detectar la estructura del proyecto
if [ -f "package.json" ]; then
    # Verificar qué scripts están disponibles
    if grep -q '"docs:dev"' package.json; then
        DEV_SCRIPT="npm run docs:dev"
        BUILD_SCRIPT="npm run docs:build"
        PREVIEW_SCRIPT="npm run docs:preview"
        print_info "Detectada estructura con prefijo 'docs:'"
    elif grep -q '"dev"' package.json; then
        DEV_SCRIPT="npm run dev"
        BUILD_SCRIPT="npm run build"
        PREVIEW_SCRIPT="npm run preview"
        print_info "Detectada estructura estándar"
    else
        print_error "No se encontraron scripts de VitePress en package.json"
        exit 1
    fi
else
    print_error "No se encontró package.json en el directorio actual"
    exit 1
fi

# Definir puertos base
DEV_PORT_BASE=5173
HMR_PORT_BASE=24678
PREVIEW_PORT_BASE=4173

# Buscar puertos disponibles
print_info "Buscando puertos disponibles..."

DEV_PORT=$(find_available_port $DEV_PORT_BASE)
if [ $? -ne 0 ]; then
    print_error "No se pudo encontrar un puerto disponible para desarrollo (base: $DEV_PORT_BASE)"
    exit 1
fi

HMR_PORT=$(find_available_port $HMR_PORT_BASE)
if [ $? -ne 0 ]; then
    print_error "No se pudo encontrar un puerto disponible para HMR (base: $HMR_PORT_BASE)"
    exit 1
fi

PREVIEW_PORT=$(find_available_port $PREVIEW_PORT_BASE)
if [ $? -ne 0 ]; then
    print_error "No se pudo encontrar un puerto disponible para preview (base: $PREVIEW_PORT_BASE)"
    exit 1
fi

# Mostrar puertos encontrados
print_success "Puertos asignados:"
echo "  - Desarrollo: $DEV_PORT"
echo "  - HMR: $HMR_PORT"
echo "  - Preview: $PREVIEW_PORT"

# Crear archivo .env con los puertos
cat > .env << EOF
# Puertos asignados automáticamente
DEV_PORT=$DEV_PORT
HMR_PORT=$HMR_PORT
PREVIEW_PORT=$PREVIEW_PORT
PROJECT_NAME=$PROJECT_NAME

# Comandos detectados automáticamente
DEV_COMMAND=$DEV_SCRIPT
BUILD_COMMAND=$BUILD_SCRIPT
PREVIEW_COMMAND=$PREVIEW_SCRIPT
EOF

print_info "Archivo .env creado con los puertos asignados"

# Determinar qué perfil usar (desarrollo por defecto)
PROFILE=""
MODE="development"

if [ "$1" = "preview" ] || [ "$1" = "prod" ]; then
    PROFILE="--profile preview"
    MODE="preview"
    print_info "Iniciando en modo preview"
else
    print_info "Iniciando en modo desarrollo"
fi

# Limpiar contenedores anteriores si existen
print_info "Limpiando contenedores anteriores..."
docker-compose down 2>/dev/null

# Iniciar el proyecto
print_info "Iniciando Docker Compose..."
if docker-compose $PROFILE up -d; then
    print_success "¡Proyecto iniciado exitosamente!"
    echo ""
    echo "==============================================="
    echo "🚀 URLs del proyecto:"
    echo "==============================================="
    
    if [ "$MODE" = "preview" ]; then
        echo "📱 Preview: http://localhost:$PREVIEW_PORT"
    else
        echo "🔧 Desarrollo: http://localhost:$DEV_PORT"
        echo "⚡ HMR: http://localhost:$HMR_PORT"
    fi
    
    echo "📁 Proyecto: $PROJECT_NAME"
    echo "==============================================="
    echo ""
    print_info "Para detener el proyecto, ejecuta: docker-compose down"
    print_info "Para ver los logs, ejecuta: docker-compose logs -f"
else
    print_error "Error al iniciar Docker Compose"
    exit 1
fi
