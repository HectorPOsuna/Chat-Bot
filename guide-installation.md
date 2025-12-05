# Guía de Instalación y Uso del Sistema RAG + Training

Esta guía te ayudará a configurar, usar y probar el sistema completo de IA que incluye:
- **RAG (Retrieval-Augmented Generation)**: Entrenamiento con documentos PDF
- **Training Prompts**: Entrenamiento con pares pregunta-respuesta predefinidos

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Sistema de Training Prompts](#sistema-de-training-prompts)
5. [Sistema RAG](#sistema-rag)
6. [Pruebas con Postman](#pruebas-con-postman)
7. [Pruebas con cURL](#pruebas-con-curl)
8. [Integración con Frontend](#integración-con-frontend)
9. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js** (v18 o superior)
- ✅ **Ollama** (https://ollama.ai/)
- ✅ **Modelo llama3.2:3b** para chat
- ✅ **Modelo nomic-embed-text** para embeddings

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version

# Verificar Ollama
ollama --version

# Listar modelos instalados
ollama list
```

---

## 📦 Instalación

### 1. Instalar Dependencias del Servidor

```bash
cd d:\GITHUB\chat-bot\server
npm install
```

Esto instalará:
- `express` - Framework web
- `cors` - Manejo de CORS
- `pdf-parse` - Procesamiento de PDFs
- `multer` - Subida de archivos
- `natural` - Procesamiento de lenguaje natural

### 2. Descargar Modelos de Ollama

```bash
# Modelo para chat (si no lo tienes)
ollama pull llama3.2:3b

# Modelo para embeddings (REQUERIDO para RAG)
ollama pull nomic-embed-text
```

### 3. Verificar Estructura de Carpetas

El servidor creará automáticamente estas carpetas al iniciar:

```
server/
├── data/
│   ├── pdfs/         # PDFs originales
│   ├── processed/    # Documentos procesados (JSON)
│   └── embeddings/   # Vectores de embeddings
```

### 4. Iniciar el Servidor

```bash
node index.js
```

Deberías ver:

```
🚀 API lista en http://localhost:3000
🧠 RAG Engine configurado con Ollama en http://localhost:11434

Endpoints disponibles:
  POST   /chat                - Chat con RAG
  POST   /documents/upload    - Subir PDF
  GET    /documents           - Listar documentos
  DELETE /documents/:id       - Eliminar documento
  POST   /documents/search    - Buscar contexto
  GET    /health              - Estado del sistema
```

---

## ⚙️ Configuración

### Variables de Entorno (Opcional)

Crea un archivo `.env` en `server/`:

```env
OLLAMA_URL=http://localhost:11434
PORT=3000
```

---

## 🎯 Sistema de Training Prompts

El sistema de Training Prompts permite entrenar la IA con pares pregunta-respuesta predefinidos que tienen **prioridad sobre RAG y Ollama**.

### ¿Qué es Training Prompts?

- **Respuestas instantáneas**: No requiere llamar a Ollama
- **Consistencia**: Siempre la misma respuesta para preguntas similares
- **Matching inteligente**: Usa embeddings para detectar similitud (85% mínimo)
- **Expandible**: Fácil agregar, editar o eliminar prompts

### Archivo de Training

El sistema viene con 5 prompts de ejemplo en `server/data/training-prompts.json`:

```json
{
  "prompts": [
    {
      "id": "prompt_001",
      "question": "¿A qué universidad perteneces?",
      "variations": [
        "¿De qué universidad eres?",
        "¿Cuál es tu institución?",
        "¿A qué institución perteneces?"
      ],
      "answer": "Soy parte de la Universidad Autónoma de Sinaloa...",
      "category": "institución",
      "enabled": true
    }
  ]
}
```

### Gestión de Prompts

#### Listar Todos los Prompts

```bash
GET /training
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "prompts": [...],
    "total": 5
  }
}
```

#### Agregar Nuevo Prompt

```bash
POST /training
{
  "question": "¿Tienen estacionamiento?",
  "variations": [
    "¿Hay dónde estacionarse?",
    "¿Dónde puedo estacionar?"
  ],
  "answer": "Sí, la facultad cuenta con estacionamiento gratuito.",
  "category": "instalaciones"
}
```

#### Actualizar Prompt

```bash
PUT /training/prompt_001
{
  "answer": "Nueva respuesta actualizada"
}
```

#### Eliminar Prompt

```bash
DELETE /training/prompt_001
```

#### Estadísticas

```bash
GET /training/stats
```

**Response:**
```json
{
  "total": 5,
  "enabled": 5,
  "disabled": 0,
  "categories": 3,
  "categoryBreakdown": [
    {"category": "institución", "count": 1},
    {"category": "horarios", "count": 1}
  ]
}
```

### Prioridad de Respuestas

El sistema sigue este orden:

```
1. Training Prompts (si hay match ≥85%)
   ↓ No match
2. RAG (si useRAG=true y hay documentos)
   ↓ No contexto
3. Ollama básico
```

### Ejemplo de Uso

```bash
# Pregunta que coincide con training
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿De qué universidad eres?",
    "useTraining": true
  }'
```

**Response (Training Match):**
```json
{
  "status": "success",
  "data": {
    "reply": "Soy parte de la Universidad Autónoma de Sinaloa...",
    "source": "training",
    "matchedPrompt": "¿A qué universidad perteneces?",
    "similarity": "92.5%",
    "category": "institución",
    "time": "0.15"
  }
}
```

---

## 📄 Sistema RAG

### 1. Verificar Estado del Sistema

**Request:**
- **Método:** GET
- **URL:** `http://localhost:3000/health`

**Response esperada:**
```json
{
  "status": "success",
  "data": {
    "server": "running",
    "ollama": "http://localhost:11434",
    "rag": {
      "totalDocuments": 0,
      "totalChunks": 0,
      "documentsInCache": 0
    }
  }
}
```

### 2. Subir un PDF

**Request:**
- **Método:** POST
- **URL:** `http://localhost:3000/documents/upload`
- **Body:** form-data
  - Key: `pdf`
  - Type: File
  - Value: Selecciona un archivo PDF

**Response esperada:**
```json
{
  "status": "success",
  "data": {
    "message": "PDF procesado exitosamente",
    "document": {
      "id": "doc_1733368800000_manual",
      "filename": "manual_uas.pdf",
      "numPages": 45,
      "totalChunks": 89,
      "textLength": 125000
    }
  }
}
```

### 3. Chat SIN RAG (Modo Normal)

**Request:**
- **Método:** POST
- **URL:** `http://localhost:3000/chat`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "message": "¿A qué universidad perteneces?",
  "useRAG": false
}
```

**Response esperada:**
```json
{
  "status": "success",
  "data": {
    "reply": "Soy parte de la Universidad Autónoma de Sinaloa, específicamente de la Facultad de Informática Mazatlán.",
    "time": "1.23",
    "ragEnabled": false
  }
}
```

### 4. Chat CON RAG (Usando Documentos)

**Request:**
- **Método:** POST
- **URL:** `http://localhost:3000/chat`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "message": "¿Cuáles son los requisitos de admisión?",
  "useRAG": true
}
```

**Response esperada:**
```json
{
  "status": "success",
  "data": {
    "reply": "Según los documentos de la facultad, los requisitos de admisión son...",
    "time": "2.45",
    "ragEnabled": true,
    "sources": [
      {
        "docFilename": "manual_uas.pdf",
        "similarity": "87.5%",
        "preview": "Los requisitos de admisión incluyen..."
      }
    ]
  }
}
```

### 5. Buscar Contexto

**Request:**
- **Método:** POST
- **URL:** `http://localhost:3000/documents/search`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "query": "horarios de atención",
  "topK": 3
}
```

### 6. Listar Documentos

**Request:**
- **Método:** GET
- **URL:** `http://localhost:3000/documents`

### 7. Eliminar Documento

**Request:**
- **Método:** DELETE
- **URL:** `http://localhost:3000/documents/doc_1733368800000_manual`

---

## 💻 Pruebas con cURL

### 1. Verificar Estado

```bash
curl http://localhost:3000/health
```

### 2. Subir PDF

```bash
curl -X POST http://localhost:3000/documents/upload \
  -F "pdf=@ruta/al/documento.pdf"
```

**Windows PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/documents/upload `
  -F "pdf=@C:\ruta\al\documento.pdf"
```

### 3. Chat sin RAG

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿A qué universidad perteneces?",
    "useRAG": false
  }'
```

**Windows PowerShell:**
```powershell
curl.exe -X POST http://localhost:3000/chat `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"¿A qué universidad perteneces?\", \"useRAG\": false}'
```

### 4. Chat con RAG

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuáles son los requisitos de admisión?",
    "useRAG": true
  }'
```

### 5. Buscar Contexto

```bash
curl -X POST http://localhost:3000/documents/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "horarios de atención",
    "topK": 3
  }'
```

### 6. Listar Documentos

```bash
curl http://localhost:3000/documents
```

### 7. Eliminar Documento

```bash
curl -X DELETE http://localhost:3000/documents/doc_1733368800000_manual
```

---

## 🎨 Integración con Frontend

### Actualizar App.jsx

```javascript
import { useState } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [useRAG, setUseRAG] = useState(true); // Toggle RAG
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const userInput = input;
    setInput("");

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3000/chat", {
        message: userInput,
        useRAG: useRAG, // Activar/desactivar RAG
      });

      const botReply = response.data.data.reply;
      const sources = response.data.data.sources;

      const botMessage = { 
        text: botReply, 
        sender: "bot",
        sources: sources // Fuentes del RAG
      };
      
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Toggle RAG */}
      <div className="rag-toggle">
        <label>
          <input
            type="checkbox"
            checked={useRAG}
            onChange={(e) => setUseRAG(e.target.checked)}
          />
          Usar RAG (documentos)
        </label>
      </div>

      {/* Mensajes */}
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="text">{msg.text}</div>
            
            {/* Mostrar fuentes si existen */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                <strong>Fuentes:</strong>
                {msg.sources.map((source, i) => (
                  <div key={i} className="source-item">
                    📄 {source.docFilename} ({source.similarity})
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}
```

### Agregar Componente de Subida de PDFs

```javascript
function DocumentUploader() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:3000/documents/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(`PDF procesado: ${response.data.data.document.filename}`);
    } catch (error) {
      alert("Error subiendo PDF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="uploader">
      <input
        type="file"
        accept=".pdf"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <span>Procesando...</span>}
    </div>
  );
}
```

### Estilos CSS para Fuentes

```css
.sources {
  margin-top: 8px;
  padding: 8px;
  background: #2d2d2d;
  border-radius: 4px;
  font-size: 12px;
}

.source-item {
  margin: 4px 0;
  color: #4caf50;
}

.rag-toggle {
  padding: 12px;
  background: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.rag-toggle label {
  color: white;
  cursor: pointer;
}
```

---

## 🚨 Solución de Problemas

### Error: "Cannot find module 'pdf-parse'"

```bash
cd server
npm install
```

### Error: "Model not found: nomic-embed-text"

```bash
ollama pull nomic-embed-text
```

### Error: "No hay documentos en el vector store"

Primero sube un PDF usando `/documents/upload`

### El servidor no inicia

```bash
# Verificar que Ollama esté corriendo
ollama list

# Verificar puerto 3000 disponible
netstat -ano | findstr :3000
```

### Respuestas muy lentas

- La primera vez que procesas un PDF tarda más (genera embeddings)
- Los embeddings se cachean para futuras consultas
- Considera reducir el tamaño del PDF o el número de chunks

### Error al subir PDF grande

El límite es 10MB. Para cambiarlo, edita `routes/documents.js`:

```javascript
limits: {
  fileSize: 20 * 1024 * 1024 // 20MB
}
```

---

## 📊 Flujo Completo de Prueba

### Escenario: Agregar Manual de la Facultad

1. **Subir el PDF**
```bash
curl -X POST http://localhost:3000/documents/upload \
  -F "pdf=@manual_facultad.pdf"
```

2. **Verificar que se procesó**
```bash
curl http://localhost:3000/documents
```

3. **Hacer pregunta con RAG**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuál es el horario de atención de la facultad?",
    "useRAG": true
  }'
```

4. **Comparar con respuesta sin RAG**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Cuál es el horario de atención de la facultad?",
    "useRAG": false
  }'
```

---

## 🎯 Próximos Pasos

1. ✅ Sube tus primeros PDFs (manuales, reglamentos, etc.)
2. ✅ Prueba preguntas específicas sobre los documentos
3. ✅ Integra el toggle de RAG en el frontend
4. ✅ Agrega componente de subida de PDFs en la UI
5. ✅ Ajusta parámetros según necesites (tamaño de chunks, topK, etc.)

---

## 📚 Recursos Adicionales

- **Documentación de Ollama:** https://ollama.ai/
- **Modelo nomic-embed-text:** https://ollama.ai/library/nomic-embed-text
- **PDF-Parse:** https://www.npmjs.com/package/pdf-parse

---

¡El sistema RAG está listo para usar! 🎉
