# ============================================
# DOCKERFILE - Backend API (Node.js)
# Multi-stage build para optimización
# ============================================

# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM node:18-alpine AS dependencies

WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ==========================================
# STAGE 2: Build
# ==========================================
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copiar dependencias del stage anterior
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Crear directorios necesarios
RUN mkdir -p data/pdfs data/processed data/embeddings logs

# ==========================================
# STAGE 3: Production
# ==========================================
FROM node:18-alpine AS production

# Metadata
LABEL maintainer="Facultad de Informática Mazatlán - UAS"
LABEL description="AguiAI Backend API - Sistema de Asistente Académico"
LABEL version="1.0.0"

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /usr/src/app

# Copiar node_modules y código desde build stage
COPY --from=build --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /usr/src/app .

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=3000 \
    OLLAMA_URL=http://ollama:11434

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -sf http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["node", "index.js"]
