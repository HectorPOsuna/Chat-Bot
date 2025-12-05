# ============================================
# DOCKERFILE - Ollama Service
# Optimizado para AguiAI
# ============================================

FROM ollama/ollama:latest

# Metadata
LABEL maintainer="Facultad de Informática Mazatlán - UAS"
LABEL description="Ollama AI Engine para AguiAI"
LABEL version="1.0.0"

# Instalar dependencias necesarias
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copiar script de inicio
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Crear directorio para modelos
RUN mkdir -p /models

# Exponer puerto
EXPOSE 11434

# Variables de entorno
ENV OLLAMA_HOST=0.0.0.0 \
    OLLAMA_KEEP_ALIVE=24h \
    OLLAMA_NUM_PARALLEL=2

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=12 \
    CMD curl -sf http://localhost:11434/api/tags || exit 1

# Punto de entrada
ENTRYPOINT ["/entrypoint.sh"]
