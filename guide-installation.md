# 📘 Guía de Instalación y Uso - AguiAI

**Asistente Académico Inteligente para Consultas Estudiantiles**

Esta guía proporciona instrucciones completas para instalar, configurar, validar y usar el sistema AguiAI.

---

## 📑 Índice

1. [Requisitos del Sistema](#-requisitos-del-sistema)
2. [Instalación](#-instalación)
3. [Configuración Inicial](#-configuración-inicial)
4. [Sistemas Implementados](#-sistemas-implementados)
5. [Validación y Pruebas](#-validación-y-pruebas)
6. [Uso del Sistema](#-uso-del-sistema)
7. [Solución de Problemas](#-solución-de-problemas)

---

## 🖥️ Requisitos del Sistema

### Hardware Mínimo

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **RAM** | 8 GB | 16 GB |
| **CPU** | 4 cores | 8 cores |
| **Disco** | 10 GB libres | 20 GB libres |
| **GPU** | No requerida | Opcional (acelera Ollama) |

### Software Requerido

- ✅ **Node.js** v18 o superior → [Descargar](https://nodejs.org/)
- ✅ **Ollama** → [Descargar](https://ollama.ai/)
- ✅ **Git** → [Descargar](https://git-scm.com/)
- ⚠️ **Docker** (Opcional) → [Descargar](https://www.docker.com/)

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version
# Salida esperada: v18.x.x o superior

# Verificar npm
npm --version

# Verificar Ollama
ollama --version

# Verificar Git
git --version
```

---

## 📦 Instalación

Elige el método de instalación que prefieras:

<details>
<summary><b>Opción A: Instalación Local (Recomendado)</b></summary>

### Paso 1: Instalar y Configurar Ollama

```bash
# Windows/Mac/Linux: Descargar desde https://ollama.ai/
# Después de instalar, descargar modelos:

ollama pull llama3.2:3b
ollama pull nomic-embed-text
```

**Verificar modelos instalados:**
```bash
ollama list
```

### Paso 2: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/chat-bot.git
cd chat-bot
```

### Paso 3: Instalar Dependencias del Backend

```bash
cd server
npm install
```

**Dependencias instaladas:**
- `express` - Framework web
- `cors` - Manejo de CORS
- `pdf-parse` - Procesamiento de PDFs
- `multer` - Subida de archivos
- `natural` - Procesamiento de lenguaje natural

### Paso 4: Instalar Dependencias del Frontend

```bash
cd ../chat-frontend
npm install
```

**Dependencias instaladas:**
- `react` - Biblioteca UI
- `vite` - Build tool
- `axios` - Cliente HTTP
- `react-markdown` - Renderizado Markdown

### Paso 5: Iniciar el Sistema

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd chat-frontend
npm run dev
```

### Paso 6: Acceder al Sistema

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3000
- 🤖 **Ollama**: http://localhost:11434

</details>

<details>
<summary><b>Opción B: Instalación con Docker</b></summary>

> **Nota**: Docker es una alternativa a la instalación local de Ollama.

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/chat-bot.git
cd chat-bot
```

### Paso 2: Iniciar Servicios con Docker Compose

```bash
docker compose up -d --build
```

**Servicios iniciados:**
- `ollama` - Motor de IA
- `api` - Backend Node.js
- `frontend` - Aplicación React (opcional)

### Paso 3: Descargar Modelos en Contenedor

```bash
docker exec -it chat-bot-ollama-1 ollama pull llama3.2:3b
docker exec -it chat-bot-ollama-1 ollama pull nomic-embed-text
```

### Paso 4: Verificar Estado

```bash
docker ps
```

### Paso 5: Acceder al Sistema

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3000
- 🤖 **Ollama**: http://localhost:11434

</details>

---

## ⚙️ Configuración Inicial

### Variables de Entorno (Opcional)

Crea un archivo `.env` en la carpeta `server/`:

```env
# URL de Ollama
OLLAMA_URL=http://localhost:11434

# Puerto del servidor
PORT=3000
```

### Estructura de Carpetas

El sistema creará automáticamente estas carpetas al iniciar:

```
server/
├── data/
│   ├── pdfs/                    # PDFs originales subidos
│   ├── processed/               # Documentos procesados (JSON)
│   ├── embeddings/              # Vectores de embeddings
│   └── training-prompts.json    # Prompts de entrenamiento
```

### Verificar Instalación

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "success",
  "data": {
    "server": "running",
    "ollama": "http://localhost:11434",
    "rag": {
      "totalDocuments": 0,
      "totalChunks": 0
    },
    "training": {
      "totalPrompts": 5,
      "enabledPrompts": 5,
      "categories": 3
    }
  }
}
```

---

## 🎯 Sistemas Implementados

AguiAI incluye dos sistemas complementarios de entrenamiento:

### 1️⃣ Training Prompts (Respuestas Predefinidas)

**¿Qué es?**
Sistema de pares pregunta-respuesta con matching inteligente por similitud.

**Características:**
- ⚡ Respuestas instantáneas (<0.5s)
- 🎯 Matching por similitud de embeddings (≥85%)
- 📝 Soporte para variaciones de preguntas
- 🏷️ Categorización de prompts
- ✏️ CRUD completo mediante API

**Ejemplo de Prompt:**
```json
{
  "question": "¿A qué universidad perteneces?",
  "variations": [
    "¿De qué universidad eres?",
    "¿Cuál es tu institución?"
  ],
  "answer": "Soy parte de la Universidad Autónoma de Sinaloa...",
  "category": "institución"
}
```

**Endpoints Disponibles:**
- `GET /training` - Listar prompts
- `POST /training` - Crear prompt
- `PUT /training/:id` - Actualizar prompt
- `DELETE /training/:id` - Eliminar prompt
- `GET /training/stats` - Estadísticas

---

### 2️⃣ Sistema RAG (Documentos PDF)

**¿Qué es?**
Retrieval-Augmented Generation: entrena la IA con documentos institucionales.

**Pipeline de Procesamiento:**
```
PDF → Extracción → Limpieza → Chunking → Embeddings → Vector Store → Búsqueda
```

**Características:**
- 📄 Procesamiento automático de PDFs
- 🔍 Búsqueda semántica por similitud
- 📊 Chunks de ~1000 caracteres con overlap
- 💾 Almacenamiento en JSON
- 🎯 Top-K resultados más relevantes

**Endpoints Disponibles:**
- `POST /documents/upload` - Subir PDF
- `GET /documents` - Listar documentos
- `DELETE /documents/:id` - Eliminar documento
- `POST /documents/search` - Buscar contexto

---

### 🔄 Prioridad de Respuestas

El sistema sigue este orden automáticamente:

```
┌─────────────────────────────────────┐
│  1. Training Prompts                │
│     ├─ Match ≥85%? → Respuesta      │
│     └─ No match ↓                   │
├─────────────────────────────────────┤
│  2. Sistema RAG                     │
│     ├─ Documentos? → Contexto       │
│     └─ Sin docs ↓                   │
├─────────────────────────────────────┤
│  3. Ollama Básico                   │
│     └─ Conocimiento general         │
└─────────────────────────────────────┘
```

---

## ✅ Validación y Pruebas

### Reporte 1: Training Prompts

**Objetivo:** Verificar matching inteligente

**Prueba:**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿A qué universidad perteneces?", "useTraining": true}'
```

**Resultado Esperado:**
```json
{
  "status": "success",
  "data": {
    "reply": "Soy parte de la Universidad Autónoma de Sinaloa...",
    "source": "training",
    "similarity": "100%",
    "time": "0.12"
  }
}
```

**Tabla de Validación:**

| Pregunta | Match | Similitud | Estado |
|----------|-------|-----------|--------|
| "¿A qué universidad perteneces?" | prompt_001 | 100% | ✅ |
| "¿De qué escuela eres?" | prompt_001 | 92% | ✅ |
| "¿Cuál es tu institución?" | prompt_001 | 95% | ✅ |
| "¿Horario de atención?" | prompt_002 | 88% | ✅ |

---

### Reporte 2: Sistema RAG

**Objetivo:** Verificar procesamiento de PDFs

**Prueba 1 - Subir PDF:**
```bash
curl -X POST http://localhost:3000/documents/upload \
  -F "pdf=@manual_uas.pdf"
```

**Resultado:**
```json
{
  "status": "success",
  "data": {
    "id": "doc_1733445600000_manual",
    "filename": "manual_uas.pdf",
    "numPages": 45,
    "totalChunks": 89,
    "textLength": 125000
  }
}
```

**Prueba 2 - Búsqueda Semántica:**
```bash
curl -X POST http://localhost:3000/documents/search \
  -H "Content-Type: application/json" \
  -d '{"query": "requisitos de admisión", "topK": 3}'
```

**Resultados:**

| Chunk | Similitud | Preview |
|-------|-----------|---------|
| chunk_12 | 87.5% | "Los requisitos de admisión incluyen..." |
| chunk_34 | 82.3% | "Para ingresar a la facultad..." |
| chunk_56 | 79.1% | "Documentación necesaria..." |

---

### Reporte 3: Prioridades del Sistema

**Escenario 1:** Pregunta con match en Training
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿A qué universidad perteneces?", "useTraining": true, "useRAG": true}'
```
✅ **Resultado:** `source: "training"` (prioridad alta)

**Escenario 2:** Sin match, con RAG
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Requisitos de admisión?", "useTraining": true, "useRAG": true}'
```
✅ **Resultado:** `source: "rag"` (prioridad media)

**Escenario 3:** Sin match ni RAG
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Qué es la IA?", "useTraining": true, "useRAG": true}'
```
✅ **Resultado:** `source: "basic"` (prioridad baja)

---

### Reporte 4: Rendimiento

| Tipo de Respuesta | Tiempo Promedio | Observaciones |
|-------------------|-----------------|---------------|
| Training Prompt | **0.15s** | Instantáneo, sin Ollama |
| RAG (3 chunks) | **2.45s** | Búsqueda + generación |
| Ollama Básico | **1.80s** | Solo generación |
| Procesamiento PDF | **15-30s** | Depende del tamaño |

---

### Reporte 5: CRUD de Training Prompts

| Operación | Endpoint | Método | Estado |
|-----------|----------|--------|--------|
| Listar | `/training` | GET | ✅ |
| Crear | `/training` | POST | ✅ |
| Actualizar | `/training/:id` | PUT | ✅ |
| Eliminar | `/training/:id` | DELETE | ✅ |
| Estadísticas | `/training/stats` | GET | ✅ |

---

### Reporte 6: Integración Frontend-Backend

**Funcionalidades Validadas:**

- ✅ Envío de mensajes desde UI
- ✅ Recepción de respuestas con Markdown
- ✅ Visualización de fuentes (RAG)
- ✅ Toggle Training/RAG funcional
- ✅ Subida de PDFs desde interfaz
- ✅ Manejo de errores y loading states

---

## 🚀 Uso del Sistema

### Para Estudiantes

#### Hacer una Consulta

1. Abrir navegador en http://localhost:5173
2. Escribir pregunta en el chat
3. Presionar Enter o clic en "Enviar"
4. Recibir respuesta instantánea

**Ejemplo:**
```
Usuario: ¿Cuál es el horario de atención?
AguiAI: El horario de atención de la Facultad de Informática 
        Mazatlán es de lunes a viernes de 8:00 AM a 8:00 PM.
        
        Fuente: Training Prompt (100% similitud)
```

---

### Para Administradores

#### 1. Agregar Nuevo Prompt de Training

```bash
curl -X POST http://localhost:3000/training \
  -H "Content-Type: application/json" \
  -d '{
    "question": "¿Tienen biblioteca?",
    "variations": [
      "¿Hay biblioteca?",
      "¿Dónde está la biblioteca?",
      "¿Cuentan con biblioteca?"
    ],
    "answer": "Sí, contamos con biblioteca en el edificio principal, abierta de lunes a viernes de 7:00 AM a 9:00 PM.",
    "category": "instalaciones"
  }'
```

#### 2. Subir Documento Institucional

```bash
curl -X POST http://localhost:3000/documents/upload \
  -F "pdf=@reglamento_2024.pdf"
```

#### 3. Actualizar Prompt Existente

```bash
curl -X PUT http://localhost:3000/training/prompt_002 \
  -H "Content-Type: application/json" \
  -d '{
    "answer": "Nuevo horario: Lunes a viernes de 7:00 AM a 9:00 PM"
  }'
```

#### 4. Eliminar Prompt

```bash
curl -X DELETE http://localhost:3000/training/prompt_005
```

#### 5. Ver Estadísticas

```bash
curl http://localhost:3000/training/stats
```

**Respuesta:**
```json
{
  "total": 5,
  "enabled": 5,
  "disabled": 0,
  "categories": 3,
  "categoryBreakdown": [
    {"category": "institución", "count": 1},
    {"category": "horarios", "count": 1},
    {"category": "instalaciones", "count": 1}
  ]
}
```

#### 6. Monitorear Sistema

```bash
curl http://localhost:3000/health
```

---

## 🔧 Solución de Problemas

### Problema 1: "Cannot find module 'express'"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
cd server
npm install
```

---

### Problema 2: "Model not found: nomic-embed-text"

**Causa:** Modelo de embeddings no descargado

**Solución:**
```bash
ollama pull nomic-embed-text
ollama list  # Verificar
```

---

### Problema 3: "No hay documentos en el vector store"

**Causa:** No se han subido PDFs

**Solución:**
```bash
curl -X POST http://localhost:3000/documents/upload \
  -F "pdf=@tu_documento.pdf"
```

---

### Problema 4: El servidor no inicia

**Posibles causas:**

1. **Puerto 3000 ocupado**
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

2. **Ollama no está corriendo**
```bash
ollama list
# Si falla, reiniciar Ollama
```

3. **Node.js versión incorrecta**
```bash
node --version
# Debe ser v18 o superior
```

---

### Problema 5: Respuestas muy lentas

**Optimizaciones:**

1. **Reducir chunks recuperados**
   - Editar `rag-engine.js` línea 65
   - Cambiar `topK: 3` a `topK: 2`

2. **Reducir tamaño de chunks**
   - Editar `chunker.js`
   - Cambiar `chunkSize: 1000` a `chunkSize: 500`

3. **Verificar hardware**
   - Mínimo 8GB RAM
   - CPU con 4+ cores

---

### Problema 6: Error al subir PDF grande

**Causa:** Límite de tamaño (10MB por defecto)

**Solución:**
Editar `server/routes/documents.js`:

```javascript
limits: {
  fileSize: 20 * 1024 * 1024  // Cambiar a 20MB
}
```

---

### Problema 7: Training Prompts no funcionan

**Verificar:**

1. **Embeddings generados**
```bash
# Revisar logs del servidor al iniciar
# Debe mostrar: "✅ Prompt Matcher inicializado"
```

2. **Archivo de prompts existe**
```bash
ls server/data/training-prompts.json
```

3. **Umbral de similitud**
   - Editar `prompt-matcher.js` línea 15
   - Ajustar `similarityThreshold: 0.85`

---

## 📞 Soporte

Si encuentras problemas no listados aquí:

1. Revisa los logs del servidor
2. Verifica que Ollama esté corriendo
3. Consulta la documentación de Ollama: https://ollama.ai/
4. Revisa el README.md del proyecto

---

## 🎓 Recursos Adicionales

- 📖 [README Principal](./README.md) - Documentación académica completa
- 🔗 [Ollama Documentation](https://ollama.ai/)
- 🔗 [React Documentation](https://react.dev/)
- 🔗 [Node.js Documentation](https://nodejs.org/)

---

<div align="center">

**AguiAI - Asistente Académico Inteligente**

*Facultad de Informática Mazatlán*  
*Universidad Autónoma de Sinaloa*

🎉 **¡Sistema listo para usar!** 🎉

</div>
