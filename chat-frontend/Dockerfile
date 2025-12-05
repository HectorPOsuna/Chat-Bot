# ============================================
# DOCKERFILE - Frontend (React + Vite)
# Multi-stage build para producción
# ============================================

# ==========================================
# STAGE 1: Build
# ==========================================
FROM node:18-alpine AS build

# Metadata
LABEL maintainer="Facultad de Informática Mazatlán - UAS"
LABEL description="AguiAI Frontend - Interfaz de Usuario"

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copiar código fuente
COPY . .

# Argumento de build para API URL
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

# Build de producción
RUN npm run build

# ==========================================
# STAGE 2: Production con Nginx
# ==========================================
FROM nginx:alpine AS production

# Metadata
LABEL maintainer="Facultad de Informática Mazatlán - UAS"
LABEL description="AguiAI Frontend - Production"
LABEL version="1.0.0"

# Copiar archivos build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
