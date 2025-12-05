#!/bin/bash
# ============================================
# ENTRYPOINT - Ollama Service
# Inicia Ollama y descarga modelos automáticamente
# ============================================

set -e

echo "🚀 Iniciando Ollama Service..."

# Iniciar Ollama en background
ollama serve &
OLLAMA_PID=$!

echo "⏳ Esperando a que Ollama esté listo..."

# Esperar a que Ollama esté disponible
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama está listo!"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Intento $attempt/$max_attempts..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Error: Ollama no respondió después de $max_attempts intentos"
    exit 1
fi

# Función para verificar si un modelo está instalado
model_exists() {
    ollama list | grep -q "$1"
}

# Descargar modelos necesarios si no existen
echo "📦 Verificando modelos necesarios..."

if ! model_exists "llama3.2:3b"; then
    echo "⬇️  Descargando llama3.2:3b (esto puede tardar varios minutos)..."
    ollama pull llama3.2:3b
    echo "✅ llama3.2:3b descargado"
else
    echo "✅ llama3.2:3b ya está instalado"
fi

if ! model_exists "nomic-embed-text"; then
    echo "⬇️  Descargando nomic-embed-text..."
    ollama pull nomic-embed-text
    echo "✅ nomic-embed-text descargado"
else
    echo "✅ nomic-embed-text ya está instalado"
fi

echo ""
echo "🎉 Ollama configurado correctamente con todos los modelos"
echo "📊 Modelos disponibles:"
ollama list
echo ""
echo "🔗 Ollama API disponible en http://localhost:11434"
echo ""

# Mantener el contenedor corriendo
wait $OLLAMA_PID
