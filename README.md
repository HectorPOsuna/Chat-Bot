# 🎓 Asistente Académico Inteligente "AguiAI"

<div align="center">

![AguiAI](https://img.shields.io/badge/AguiAI-Asistente%20Acad%C3%A9mico-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-v19-blue?style=for-the-badge&logo=react)
![Ollama](https://img.shields.io/badge/Ollama-llama3.2-orange?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Opcional-blue?style=for-the-badge&logo=docker)

**Sistema Inteligente de Asistencia Académica con RAG y Training Prompts**

*Facultad de Informática Mazatlán - Universidad Autónoma de Sinaloa*

[📖 Guía de Instalación](./guide-installation.md) • [🐳 Docker](./guide-installation.md#-instalación) • [📚 Documentación](#-documentación-adicional)

</div>

---

## 📑 Contenido

- [Definición del Modelo](#-definición-del-modelo)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Funcionamiento](#-funcionamiento)
- [Documentación](#-documentación-adicional)

---

## 🎯 Definición del Modelo

### Antecedentes

#### 📜 Semblanza

**AguiAI** (Asistente de Guía Inteligente con IA) es un sistema de asistencia académica desarrollado para la **Facultad de Informática Mazatlán** de la **Universidad Autónoma de Sinaloa**.

El proyecto integra:
- 🤖 **Modelos de lenguaje grandes (LLMs)** ejecutados localmente
- 📄 **RAG (Retrieval-Augmented Generation)** para documentos PDF
- 🎯 **Training Prompts** para respuestas predefinidas
- 🔒 **Privacidad garantizada** mediante ejecución local

#### 💡 Motivación

| Objetivo | Descripción |
|----------|-------------|
| **Accesibilidad 24/7** | Información institucional disponible sin horarios de atención |
| **Consistencia** | Respuestas uniformes mediante training prompts |
| **Escalabilidad** | Múltiples consultas simultáneas sin degradación |
| **Actualización Dinámica** | Fácil actualización mediante PDFs y prompts |
| **Privacidad** | Ejecución local sin servicios externos |
| **Reducción de Carga** | Automatización de consultas repetitivas |

---

### Metodología Previa

#### Stack Tecnológico

<table>
<tr>
<td width="50%">

**Frontend**
- ⚛️ React 19
- ⚡ Vite
- 📡 Axios
- 📝 React-Markdown

</td>
<td width="50%">

**Backend**
- 🟢 Node.js 18+
- 🚀 Express
- 📄 PDF-Parse
- 🔤 Natural (NLP)

</td>
</tr>
<tr>
<td width="50%">

**Inteligencia Artificial**
- 🤖 Ollama
- 🦙 llama3.2:3b
- 🧠 nomic-embed-text

</td>
<td width="50%">

**Infraestructura**
- 🐳 Docker (Opcional)
- 📦 Docker Compose
- 🌐 Nginx (Frontend)

</td>
</tr>
</table>

> **💡 Nota Importante**: Docker es una **alternativa opcional** a la instalación local. El sistema funciona perfectamente instalando Ollama directamente en el sistema operativo.

---

## 🔧 Tecnologías Utilizadas

### 1. React (Frontend)

**Función**: Interfaz de usuario interactiva

**Características**:
- ✅ Componentes funcionales con Hooks
- ✅ Gestión de estado (mensajes, historial)
- ✅ Renderizado de Markdown
- ✅ Auto-scroll y loading states
- ✅ Toggles para RAG y Training

**Integración**: HTTP/REST con Axios → Backend API

---

### 2. Vite (Build Tool)

**Función**: Herramienta de desarrollo y construcción

**Ventajas**:
- ⚡ Hot Module Replacement instantáneo
- 📦 Build optimizado para producción
- ⚙️ Configuración mínima
- 🎯 Soporte nativo ES modules

---

### 3. Node.js + Express (Backend)

**Función**: Servidor API coordinador

**Responsabilidades**:
```
┌─────────────────────────────────┐
│     Express Server (API)        │
├─────────────────────────────────┤
│ • Gestión de endpoints REST     │
│ • Procesamiento de PDFs         │
│ • Coordinación Training/RAG     │
│ • Manejo de archivos            │
│ • Gestión de CORS               │
└─────────────────────────────────┘
```

**Estructura**:
```
server/
├── index.js              # Servidor principal
├── routes/
│   ├── documents.js      # Gestión PDFs
│   └── training.js       # Gestión prompts
└── rag/
    ├── pdf-processor.js  # Extracción PDF
    ├── chunker.js        # División texto
    ├── embeddings.js     # Generación vectores
    ├── vector-store.js   # Almacenamiento
    ├── rag-engine.js     # Motor RAG
    ├── prompt-matcher.js # Matching prompts
    └── training-manager.js # CRUD prompts
```

---

### 4. Ollama (Motor de IA)

**Función**: Ejecuta LLMs localmente sin internet

#### Modelos Utilizados

| Modelo | Propósito | Parámetros | Uso |
|--------|-----------|------------|-----|
| **llama3.2:3b** | Generación de respuestas | 3B | Chat conversacional |
| **nomic-embed-text** | Embeddings vectoriales | 768D | Búsqueda semántica |

**Ventajas**:
- 🔒 Privacidad total (ejecución local)
- 💰 Sin costos por uso
- ⚡ Sin límites de rate
- 🚀 Respuestas rápidas

**Opciones de Instalación**:
1. **Local** (Recomendado): Instalar Ollama en Windows/Linux/macOS
2. **Docker** (Alternativa): Ejecutar en contenedor para aislamiento

---

### 5. Sistema RAG

**Función**: Entrena la IA con documentos PDF

**Pipeline**:
```
PDF → Extracción → Limpieza → Chunking → Embeddings → Vector Store → Búsqueda
```

**Componentes**:

| Componente | Función |
|------------|---------|
| **PDF Processor** | Extrae texto con pdf-parse |
| **Chunker** | Divide en fragmentos ~1000 chars |
| **Embeddings** | Genera vectores con nomic-embed-text |
| **Vector Store** | Almacena y busca por similitud coseno |
| **RAG Engine** | Coordina búsqueda y generación |

---

### 6. Training Prompts

**Función**: Respuestas predefinidas con matching inteligente

**Características**:
- 🎯 Matching por similitud ≥85%
- 📝 Soporte para variaciones
- 🏷️ Categorización
- ✏️ CRUD completo
- ⚡ Prioridad sobre RAG

**Ejemplo**:
```json
{
  "question": "¿A qué universidad perteneces?",
  "variations": [
    "¿De qué universidad eres?",
    "¿Cuál es tu institución?"
  ],
  "answer": "Soy parte de la UAS...",
  "category": "institución"
}
```

---

### 7. Docker (Infraestructura Opcional)

**Función**: Containerización para despliegue consistente

**Servicios**:
- 🤖 `aguiai-ollama` - Motor de IA
- 🔌 `aguiai-backend` - API Node.js
- 🌐 `aguiai-frontend` - React + Nginx

**Mejoras Implementadas**:
- ✅ Multi-stage builds (imágenes optimizadas)
- ✅ Health checks automáticos
- ✅ Límites de recursos
- ✅ Usuario no-root (seguridad)
- ✅ Descarga automática de modelos
- ✅ Scripts de inicio

---

## 🏗️ Arquitectura del Sistema

### Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Chat UI    │  │ PDF Uploader │  │   Settings   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         └──────────────────┴──────────────────┘                  │
│                      │ HTTP/REST (Axios)                         │
└──────────────────────┼──────────────────────────────────────────┘
                       │
┌──────────────────────┼──────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                         │
│                      │                                           │
│  ┌───────────────────┴────────────────────────┐                 │
│  │         API Routes (Express)               │                 │
│  │  /chat  /training  /documents  /health    │                 │
│  └───────────┬──────────────────────┬─────────┘                 │
│              │                      │                            │
│  ┌───────────┴──────┐    ┌─────────┴──────────┐                │
│  │ Training Matcher │    │    RAG Engine      │                │
│  │  - Similarity    │    │  - PDF Processing  │                │
│  │  - CRUD Prompts  │    │  - Vector Search   │                │
│  └───────────┬──────┘    └─────────┬──────────┘                │
│              └────────────┬─────────┘                            │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTP API
┌───────────────────────────┼──────────────────────────────────────┐
│                    OLLAMA (Motor IA)                             │
│                            │                                      │
│  ┌─────────────────────────┴──────────────────────┐             │
│  │         API Endpoints                          │             │
│  │  /api/chat  /api/generate  /api/embeddings   │             │
│  └─────────────┬──────────────────────┬──────────┘             │
│                │                      │                          │
│  ┌─────────────┴──────┐    ┌─────────┴──────────┐              │
│  │   llama3.2:3b      │    │ nomic-embed-text   │              │
│  │   (Respuestas)     │    │  (Embeddings)      │              │
│  └────────────────────┘    └────────────────────┘              │
│                                                                  │
│  🖥️  Local o 🐳 Docker Container                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Funcionamiento

### Flujo de Procesamiento de Consultas

```
┌─────────────────────────────────────────────────────────┐
│                   Usuario hace pregunta                  │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌────────▼────────┐
│ 1. Training    │      │ 2. RAG System   │
│    Prompts     │      │   (Documentos)  │
│                │      │                 │
│ Match ≥85%?    │      │ Contexto en     │
│                │      │ documentos?     │
└───────┬────────┘      └────────┬────────┘
        │                        │
        │ Sí                     │ Sí
        │                        │
┌───────▼────────┐      ┌────────▼────────┐
│   Respuesta    │      │   Respuesta     │
│  Predefinida   │      │  con Contexto   │
│   (<0.5s)      │      │    (~2.5s)      │
└────────────────┘      └─────────────────┘
        │                        │
        └────────────┬───────────┘
                     │ No match
            ┌────────▼────────┐
            │ 3. Ollama       │
            │    Básico       │
            │                 │
            │ Conocimiento    │
            │   General       │
            │   (~1.8s)       │
            └─────────────────┘
```

### Prioridades del Sistema

| Prioridad | Sistema | Tiempo | Uso |
|-----------|---------|--------|-----|
| 🥇 **Alta** | Training Prompts | <0.5s | Preguntas frecuentes |
| 🥈 **Media** | RAG (Documentos) | ~2.5s | Información en PDFs |
| 🥉 **Baja** | Ollama Básico | ~1.8s | Conocimiento general |

---

## 📚 Documentación Adicional

### 📖 Guías Disponibles

| Documento | Descripción | Enlace |
|-----------|-------------|--------|
| **Guía de Instalación** | Instalación completa (local y Docker) | [guide-installation.md](./guide-installation.md) |
| **Validación** | Reportes de pruebas y validación | [guide-installation.md#-validación-y-pruebas](./guide-installation.md#-validación-y-pruebas) |
| **Uso del Sistema** | Guía para estudiantes y administradores | [guide-installation.md#-uso-del-sistema](./guide-installation.md#-uso-del-sistema) |
| **Docker** | Despliegue con Docker mejorado | [guide-installation.md#-instalación](./guide-installation.md#-instalación) |

### 🔗 Recursos Externos

- [Ollama Documentation](https://ollama.ai/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/)
- [RAG Paper (arXiv)](https://arxiv.org/abs/2005.11401)
- [Llama 3.2 Model Card](https://ollama.ai/library/llama3.2)

---

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado para Producción)

```bash
# Linux/Mac
./docker-start.sh

# Windows
.\docker-start.ps1
```

### Opción 2: Local (Recomendado para Desarrollo)

```bash
# 1. Instalar Ollama y modelos
ollama pull llama3.2:3b
ollama pull nomic-embed-text

# 2. Instalar dependencias
cd server && npm install
cd ../chat-frontend && npm install

# 3. Iniciar servicios
cd ../server && node index.js        # Terminal 1
cd ../chat-frontend && npm run dev   # Terminal 2
```

**Acceso**:
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:3000
- 🤖 Ollama: http://localhost:11434

---

## 📊 Conclusiones

**AguiAI** representa una solución integral para asistencia académica que:

<table>
<tr>
<td width="50%">

**Beneficios Técnicos**
- ✅ Privacidad garantizada (local)
- ✅ Respuestas consistentes
- ✅ Actualización dinámica
- ✅ Arquitectura modular

</td>
<td width="50%">

**Beneficios Operativos**
- ✅ Disponibilidad 24/7
- ✅ Escalabilidad eficiente
- ✅ Reducción de carga administrativa
- ✅ Sin costos por uso

</td>
</tr>
</table>

El sistema ha sido validado exitosamente en todas sus funcionalidades y está listo para despliegue en producción.

---

## 👥 Autores

**Facultad de Informática Mazatlán**  
Universidad Autónoma de Sinaloa

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

<div align="center">

**[⬆ Volver arriba](#-asistente-académico-inteligente-aguiai)**

Made with ❤️ by Facultad de Informática Mazatlán - UAS

</div>
