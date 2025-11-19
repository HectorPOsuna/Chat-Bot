#!/bin/sh
set -e

echo "🔵 Iniciando servidor Ollama..."
ollama serve &

echo "⏳ Esperando a que el servidor esté listo..."
sleep 5

echo "⬇️ Descargando modelo llama3.1..."
ollama pull llama3.1 || {
    echo "❌ Error descargando el modelo"
    exit 1
}

echo "✅ Modelo listo, esperando peticiones"
wait
