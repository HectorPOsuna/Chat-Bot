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

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/chatbot-ollama.git
cd Chat-Bot
