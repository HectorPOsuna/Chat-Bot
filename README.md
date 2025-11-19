# 🤖 Chatbot IA con Node.js + Ollama (Dockerizado)

Este proyecto implementa un **chatbot de Inteligencia Artificial** utilizando:

- **Ollama** → para ejecutar modelos LLM localmente (phi3, llama3, mistral, etc.)
- **Node.js + Express** → como API REST del chatbot
- **Docker + Docker Compose** → para que cualquier persona pueda ejecutarlo sin instalar Ollama ni Node.js localmente

El entorno completo corre en contenedores, lo que permite facilidad de uso, portabilidad y despliegue sencillo.

---

# 🚀 Características

- Chatbot IA completamente funcional
- Backend en Node.js consumiendo Ollama por medio de HTTP
- Docker Compose para levantar ambos servicios simultáneamente
- Ollama con modelo `phi3` incluido
- API REST lista para consumir desde Postman, frontend o móvil
- Compatible con Windows / Linux / Mac (solo usa Docker)
- Totalmente local y gratuito

---

# 🏗 Arquitectura del Proyecto

chatbot/
├── docker-compose.yml
├── backend/
│ ├── Dockerfile
│ ├── index.js
│ ├── package.json
│ └── package-lock.json
├── ollama/
│ └── Dockerfile


### Servicios

| Servicio | Puerto | Descripción |
|---------|--------|-------------|
| **Ollama** | 11434 | Ejecuta el modelo LLM dentro de Docker |
| **Backend Node.js** | 3000 | API REST que recibe mensajes y responde con la IA |

---

# 🧩 Requisitos previos

Antes de iniciar, necesitas:

- **Docker**: https://www.docker.com/get-started  
- **Docker Compose** (ya viene incluido en Docker Desktop)

No necesitas instalar:

❌ Node.js  
❌ Ollama  
❌ NPM  
❌ Modelos adicionales  

Todo está dentro de Docker.

---

# ⚙ Instalación y uso

#!/bin/bash

echo "=== 📦 1) Clonando repositorio ==="
git clone https://github.com/HectorPOsuna/Chat-Bot && cd Chat-Bot

echo "=== 🐋 2) Iniciando solo el contenedor de Ollama ==="
docker compose up -d ollama

echo "=== ⏳ 3) Esperando a que el servidor Ollama esté listo ==="
until docker exec ollama curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
  echo "   → Ollama aún no responde, reintentando..."
  sleep 3
done

echo "=== 🧠 4) Precargando modelo llama3.2:3b ==="
docker exec -it ollama ollama pull llama3.2:3b

echo "=== 🔍 5) Verificando modelos instalados ==="
docker exec -it ollama ollama list

echo "=== 🚀 6) Construyendo e iniciando todos los servicios ==="
docker compose up -d --build

echo "=== 📡 7) Verificando estado de contenedores ==="
docker ps

echo "=== 🧪 8) Probando conexión al API del chatbot ==="
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hola, ¿estás funcionando?"}'

echo "=== ✔ Instalación finalizada ==="

