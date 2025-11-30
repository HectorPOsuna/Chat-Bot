# 🤖 Chatbot IA con Node.js + Ollama (Dockerizado)

Este proyecto implementa un **chatbot de Inteligencia Artificial** completamente funcional con soporte para **contexto conversacional**, utilizando:

- **Ollama** → Ejecuta modelos LLM localmente (llama3.1, phi3, mistral, etc.)
- **Node.js + Express** → API REST del chatbot con gestión de contexto
- **Docker + Docker Compose** → Despliegue simplificado sin instalaciones locales

El entorno completo corre en contenedores, garantizando portabilidad, facilidad de uso y despliegue sencillo.

---

## 🚀 Características

✅ **Chatbot IA completamente funcional** con respuestas en formato Markdown  
✅ **Contexto conversacional** - Mantiene el historial de la conversación  
✅ **Respuestas estructuradas** - Formato JSON estandarizado  
✅ **Detección automática de entorno** - Docker o local  
✅ **API REST** lista para consumir desde cualquier cliente  
✅ **Retrocompatible** - Funciona con y sin historial  
✅ **Stateless** - No requiere base de datos ni sesiones  
✅ **Compatible** con Windows / Linux / Mac  
✅ **100% local y gratuito**

---

## 🏗 Arquitectura del Proyecto

```
chat-bot/
├── docker-compose.yml          # Orquestación de servicios
├── server/
│   ├── Dockerfile
│   ├── index.js                # Servidor principal
│   ├── contextManager.js       # Gestión de historial
│   ├── promptBuilder.js        # Construcción de prompts
│   ├── responseFormatter.js    # Formato de respuestas
│   ├── package.json
│   └── package-lock.json
└── ollama/
    ├── Dockerfile
    └── entrypoint.sh
```

### Servicios

| Servicio | Puerto | Descripción |
|---------|--------|-------------|
| **Ollama** | 11434 | Ejecuta el modelo LLM (llama3.1:latest) |
| **API Server** | 3000 | API REST con soporte de contexto conversacional |

---

## 🧩 Requisitos Previos

Antes de iniciar, necesitas:

- **Docker**: https://www.docker.com/get-started  
- **Docker Compose** (incluido en Docker Desktop)

**No necesitas instalar:**

❌ Node.js  
❌ Ollama  
❌ NPM  
❌ Modelos adicionales  

Todo está dentro de Docker.

---

## ⚙️ Instalación y Uso

### 🔧 PASO 1 — Clonar el repositorio
```bash
git clone https://github.com/HectorPOsuna/Chat-Bot
cd Chat-Bot
```

### 🐳 PASO 2 — Iniciar el servicio de Ollama
```bash
docker compose up -d ollama
```

Verificar el estado:
```bash
docker logs -f ollama
```

### ⏳ PASO 3 — Esperar a que Ollama esté listo
```bash
until docker exec ollama curl -s http://localhost:11434/api/tags > /dev/null 2>&1; do
  echo "Ollama no responde todavía... reintentando...";
  sleep 3;
done
```

### 🧠 PASO 4 — Precargar el modelo (llama3.1:latest)
```bash
docker exec -it ollama ollama pull llama3.1:latest
```

Verificar que se descargó correctamente:
```bash
docker exec -it ollama ollama list
```

Debería aparecer: `llama3.1:latest`

### 🚀 PASO 5 — Construir e iniciar todos los servicios
```bash
docker compose up -d --build
```

Verificar que ambos contenedores están activos:
```bash
docker ps
```

---

## 📡 Documentación de la API

### Endpoint Principal

**URL:** `POST http://localhost:3000/chat`  
**Content-Type:** `application/json`

### Formato de Request

#### Sin Contexto (Mensaje Simple)
```json
{
  "message": "¿Qué es Node.js?"
}
```

#### Con Contexto (Conversación Continua)
```json
{
  "message": "¿Cuál fue el segundo consejo?",
  "history": [
    {
      "role": "user",
      "content": "Dame 3 consejos para programar mejor"
    },
    {
      "role": "assistant",
      "content": "1. **Escribe código limpio**\n2. **Usa control de versiones**\n3. **Escribe tests**"
    }
  ]
}
```

### Formato de Response

#### Respuesta Exitosa
```json
{
  "status": "success",
  "data": {
    "reply": "**Node.js** es un entorno de ejecución...",
    "model": "llama3.1:latest",
    "timestamp": "2025-11-30T12:00:00.000Z"
  }
}
```

#### Respuesta de Error
```json
{
  "status": "error",
  "error": {
    "message": "Falta 'message' en el body",
    "details": null,
    "timestamp": "2025-11-30T12:00:00.000Z"
  }
}
```

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `message` | string | ✅ Sí | El mensaje del usuario |
| `history` | array | ❌ No | Historial de mensajes previos |

### Formato del Historial

El array `history` debe contener objetos con:

- **`role`**: `"user"` o `"assistant"`
- **`content`**: Texto del mensaje

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Mensaje Simple (Sin Contexto)

**Request:**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explícame qué es Docker"}'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "reply": "**Docker** es una plataforma de contenedores...",
    "model": "llama3.1:latest",
    "timestamp": "2025-11-30T12:00:00.000Z"
  }
}
```

### Ejemplo 2: Conversación con Contexto

**Primera petición:**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Dame 5 lenguajes de programación populares"}'
```

**Segunda petición (con historial):**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuál de esos es mejor para backend?",
    "history": [
      {"role": "user", "content": "Dame 5 lenguajes de programación populares"},
      {"role": "assistant", "content": "1. Python\n2. JavaScript\n3. Java\n4. C++\n5. Go"}
    ]
  }'
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `OLLAMA_URL` | `http://localhost:11434` | URL del servicio Ollama |

### Cambiar el Modelo

Edita `server/index.js` y cambia:
```javascript
model: "llama3.1:latest"
```

Por el modelo que prefieras (debe estar descargado en Ollama).

---

## 🛠 Desarrollo Local (Sin Docker)

Si prefieres ejecutar sin Docker:

1. **Instala Ollama**: https://ollama.ai/
2. **Descarga el modelo**:
   ```bash
   ollama pull llama3.1:latest
   ```
3. **Instala dependencias**:
   ```bash
   cd server
   npm install
   ```
4. **Ejecuta el servidor**:
   ```bash
   node index.js
   ```

El servidor detectará automáticamente `http://localhost:11434`.

---

## 📚 Módulos del Servidor

### `index.js`
Servidor principal que maneja las peticiones HTTP y coordina los módulos.

### `contextManager.js`
Gestiona el historial de conversación:
- `validateHistory()` - Valida el formato del historial
- `buildMessages()` - Construye el array de mensajes para Ollama

### `promptBuilder.js`
Construye los prompts con instrucciones del sistema:
- `getSystemInstructions()` - Retorna las instrucciones del sistema
- `buildPrompt()` - Crea prompts para modo sin contexto

### `responseFormatter.js`
Estandariza las respuestas de la API:
- `formatResponse()` - Formatea respuestas exitosas y de error

---

## 🐛 Solución de Problemas

### El contenedor de Ollama no inicia
```bash
docker logs ollama
```

### La API no responde
```bash
docker logs server
```

### Reiniciar todo
```bash
docker compose down
docker compose up -d --build
```

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👨‍💻 Autores

**Héctor P. Osuna**  
GitHub: [@HectorPOsuna](https://github.com/HectorPOsuna)
