#!/bin/bash
# ============================================
# SCRIPT DE INICIO RÁPIDO - AguiAI Docker
# ============================================

set -e

echo "🚀 Iniciando AguiAI con Docker..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado"
    echo "   Descarga Docker desde: https://www.docker.com/"
    exit 1
fi

# Verificar que Docker Compose está disponible
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose no está disponible"
    exit 1
fi

echo -e "${GREEN}✅ Docker está instalado${NC}"
echo ""

# Detener contenedores existentes si los hay
echo -e "${BLUE}🛑 Deteniendo contenedores existentes...${NC}"
docker compose down 2>/dev/null || true

# Construir e iniciar servicios
echo ""
echo -e "${BLUE}🏗️  Construyendo imágenes...${NC}"
docker compose build

echo ""
echo -e "${BLUE}🚀 Iniciando servicios...${NC}"
docker compose up -d

echo ""
echo -e "${YELLOW}⏳ Esperando a que los servicios estén listos...${NC}"
echo ""

# Esperar a que Ollama esté listo
echo "   Esperando Ollama..."
timeout=120
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if docker exec aguiai-ollama curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Ollama está listo${NC}"
        break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
done

if [ $elapsed -ge $timeout ]; then
    echo -e "${YELLOW}   ⚠️  Ollama tardó más de lo esperado${NC}"
fi

# Esperar a que el backend esté listo
echo "   Esperando Backend API..."
timeout=60
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}   ✅ Backend API está listo${NC}"
        break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
done

if [ $elapsed -ge $timeout ]; then
    echo -e "${YELLOW}   ⚠️  Backend API tardó más de lo esperado${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 AguiAI está listo para usar!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "📍 URLs de acceso:"
echo ""
echo "   🌐 Frontend:    http://localhost:5173"
echo "   🔌 Backend API: http://localhost:3000"
echo "   🤖 Ollama:      http://localhost:11434"
echo ""
echo "📊 Ver logs:"
echo "   docker compose logs -f"
echo ""
echo "🛑 Detener servicios:"
echo "   docker compose down"
echo ""
echo "📋 Ver estado de contenedores:"
echo "   docker compose ps"
echo ""
