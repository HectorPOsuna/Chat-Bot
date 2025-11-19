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

🔧 🟦 PASO 1 — Clonar el repositorio
git clone https://github.com/HectorPOsuna/Chat-Bot
cd Chat-Bot

🐳 🟦 PASO 2 — Iniciar únicamente el servicio de Ollama
docker compose up -d ollama

Verificar el estado inicial:
docker logs -f ollama

⏳ 🟦 PASO 3 — Esperar a que Ollama esté listo
until docker exec ollama curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
  echo "Ollama no responde todavía... reintentando...";
  sleep 3;
done

🧠 🟦 PASO 4 — Precargar el modelo (llama3.2:3b)
docker exec -it ollama ollama pull llama3.2:3b

Verificar que se descargó correctamente:
docker exec -it ollama ollama list

Debería aparecer:
llama3.2:3b

🚀 🟦 PASO 5 — Construir e iniciar todos los servicios
docker compose up -d --build

Verificar que ambos contenedores están activos:
docker ps

📡 🟦 PASO 6 — Probar la API del chatbot
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hola chatbot, ¿estás funcionando?"}'


