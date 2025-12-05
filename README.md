# Asistente Académico Inteligente "AguiAI" para Consultas Estudiantiles

<div align="center">

![AguiAI](https://img.shields.io/badge/AguiAI-Asistente%20Acad%C3%A9mico-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v19-blue)
![Ollama](https://img.shields.io/badge/Ollama-llama3.2-orange)
![Docker](https://img.shields.io/badge/Docker-Opcional-blue)

**Sistema de asistencia académica inteligente con capacidades de RAG y entrenamiento por prompts**

</div>

---

## 📋 Tabla de Contenidos

1. [Definición del Modelo](#definición-del-modelo)
   - [Antecedentes](#antecedentes)
   - [Metodología Previa](#metodología-previa)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Funcionamiento del Sistema](#funcionamiento-del-sistema)
4. [Arquitectura e Integración](#arquitectura-e-integración)
5. [Instalación](#instalación)
6. [Validación de Funcionalidades](#validación-de-funcionalidades)
7. [Uso del Sistema](#uso-del-sistema)

---

## 🎓 Definición del Modelo

### Antecedentes

#### Semblanza

**AguiAI** (Asistente de Guía Inteligente con IA) es un sistema de asistencia académica desarrollado para la **Facultad de Informática Mazatlán** de la **Universidad Autónoma de Sinaloa**. El proyecto surge como respuesta a la necesidad de proporcionar información institucional precisa, consistente y accesible las 24 horas del día a estudiantes, aspirantes y visitantes.

El sistema integra tecnologías de inteligencia artificial de última generación, específicamente modelos de lenguaje grandes (LLMs) ejecutados localmente mediante Ollama, combinados con técnicas avanzadas de recuperación de información (RAG - Retrieval-Augmented Generation) y entrenamiento por prompts predefinidos.

#### Motivación

La motivación principal para el desarrollo de AguiAI incluye:

1. **Accesibilidad de Información**: Proporcionar acceso inmediato a información institucional sin depender de horarios de atención administrativa.

2. **Consistencia en Respuestas**: Garantizar que las preguntas frecuentes reciban respuestas uniformes y precisas mediante el sistema de training prompts.

3. **Escalabilidad**: Capacidad de manejar múltiples consultas simultáneas sin degradación del servicio.

4. **Actualización Dinámica**: Facilitar la actualización de información mediante la carga de documentos PDF (manuales, reglamentos) y la gestión de prompts de entrenamiento.

5. **Privacidad y Soberanía de Datos**: Ejecutar el modelo de IA localmente sin depender de servicios externos, garantizando la privacidad de las consultas estudiantiles.

6. **Reducción de Carga Administrativa**: Automatizar respuestas a consultas repetitivas, permitiendo al personal administrativo enfocarse en tareas más complejas.

### Metodología Previa

El desarrollo de AguiAI se fundamenta en una arquitectura de tres capas que integra múltiples tecnologías modernas:

#### Tecnologías Utilizadas

##### Frontend
- **React 19**: Biblioteca de JavaScript para construir interfaces de usuario interactivas
- **Vite**: Herramienta de construcción rápida para desarrollo frontend
- **Axios**: Cliente HTTP para comunicación con el backend
- **React-Markdown**: Renderizado de respuestas formateadas en Markdown

##### Backend
- **Node.js 18+**: Entorno de ejecución de JavaScript del lado del servidor
- **Express**: Framework web minimalista para Node.js
- **Multer**: Middleware para manejo de archivos multipart/form-data
- **PDF-Parse**: Extracción de texto de documentos PDF
- **Natural**: Procesamiento de lenguaje natural para tokenización

##### Inteligencia Artificial
- **Ollama**: Plataforma para ejecutar modelos de lenguaje grandes localmente
  - **llama3.2:3b**: Modelo principal para generación de respuestas
  - **nomic-embed-text**: Modelo para generación de embeddings vectoriales

##### Infraestructura (Opcional)
- **Docker**: Containerización de servicios
  - **Nota Importante**: La implementación en Docker es una **alternativa** a hospedar Ollama localmente. El sistema puede ejecutarse completamente en la máquina local sin Docker, simplemente instalando Ollama directamente en el sistema operativo.

##### Almacenamiento
- **Sistema de Archivos**: Almacenamiento de documentos procesados y embeddings en formato JSON
- **Estructura de Datos**: Organización jerárquica de PDFs, documentos procesados y vectores de embeddings

---

## 🔧 Tecnologías Utilizadas

### 1. React (Frontend)

**Función**: Interfaz de usuario interactiva para el chatbot.

**Características Implementadas**:
- Componentes funcionales con Hooks (useState, useEffect, useRef)
- Gestión de estado para mensajes, historial conversacional y configuración
- Renderizado condicional de respuestas en Markdown
- Auto-scroll a nuevos mensajes
- Toggle para activar/desactivar RAG y Training

**Integración**: Se comunica con el backend mediante peticiones HTTP (Axios) al endpoint `/chat`.

### 2. Vite (Build Tool)

**Función**: Herramienta de construcción y desarrollo para el frontend.

**Ventajas**:
- Hot Module Replacement (HMR) instantáneo
- Build optimizado para producción
- Configuración mínima
- Soporte nativo para ES modules

**Uso**: `npm run dev` para desarrollo, `npm run build` para producción.

### 3. Node.js + Express (Backend)

**Función**: Servidor API que coordina todas las operaciones del sistema.

**Responsabilidades**:
- Gestión de endpoints REST
- Procesamiento de PDFs
- Coordinación entre Training Prompts, RAG y Ollama
- Manejo de archivos y almacenamiento
- Gestión de CORS para comunicación con frontend

**Arquitectura**:
```
index.js (Servidor principal)
├── routes/
│   ├── documents.js (Gestión de PDFs)
│   └── training.js (Gestión de prompts)
└── rag/
    ├── pdf-processor.js
    ├── chunker.js
    ├── embeddings.js
    ├── vector-store.js
    ├── rag-engine.js
    ├── prompt-matcher.js
    └── training-manager.js
```

### 4. Ollama (Motor de IA)

**Función**: Ejecuta modelos de lenguaje grandes localmente sin requerir conexión a internet.

**Modelos Utilizados**:

#### llama3.2:3b
- **Propósito**: Generación de respuestas conversacionales
- **Parámetros**: 3 mil millones
- **Uso**: Respuestas a preguntas generales y contextualizadas

#### nomic-embed-text
- **Propósito**: Generación de embeddings vectoriales (768 dimensiones)
- **Uso**: 
  - Matching de similitud para Training Prompts
  - Búsqueda semántica en documentos RAG

**Ventajas**:
- Ejecución local (privacidad garantizada)
- Sin costos por uso
- Sin límites de rate
- Respuestas rápidas (optimizado para hardware local)

**Nota sobre Docker**: Ollama puede ejecutarse de dos formas:
1. **Instalación Local** (Recomendado para desarrollo): Instalar Ollama directamente en Windows/Linux/macOS
2. **Docker Container** (Alternativa): Ejecutar Ollama en un contenedor Docker para aislamiento

### 5. Docker (Opcional)

**Función**: Containerización de servicios para despliegue consistente.

**Servicios Containerizados**:
- `ollama`: Servicio de IA
- `api`: Backend Node.js
- `frontend`: Aplicación React (opcional)

**Ventajas**:
- Entorno reproducible
- Fácil despliegue en diferentes sistemas
- Aislamiento de dependencias

**Importante**: Docker es **opcional**. El sistema funciona perfectamente sin Docker instalando Ollama y Node.js directamente en el sistema operativo.

### 6. Sistema RAG (Retrieval-Augmented Generation)

**Función**: Permite entrenar la IA con documentos PDF institucionales.

**Pipeline de Procesamiento**:
```
PDF → Extracción de Texto → Limpieza → Chunking → Embeddings → Vector Store
```

**Componentes**:
1. **PDF Processor**: Extrae texto de PDFs usando pdf-parse
2. **Chunker**: Divide texto en fragmentos de ~1000 caracteres con overlap
3. **Embeddings Generator**: Genera vectores usando nomic-embed-text
4. **Vector Store**: Almacena y busca por similitud coseno
5. **RAG Engine**: Coordina búsqueda y generación de respuestas

### 7. Training Prompts

**Función**: Sistema de respuestas predefinidas con matching inteligente.

**Características**:
- Matching por similitud de embeddings (umbral 85%)
- Soporte para variaciones de preguntas
- Categorización de prompts
- CRUD completo mediante API REST
- Prioridad sobre RAG y Ollama

**Almacenamiento**: JSON en `server/data/training-prompts.json`

---

## ⚙️ Funcionamiento del Sistema

### Flujo de Procesamiento de Consultas

```
Usuario → Frontend (React) → Backend (Express) → Procesamiento Inteligente → Respuesta
                                                          ↓
                                    ┌─────────────────────┴─────────────────────┐
                                    │                                           │
                            1. Training Prompts                          2. RAG System
                            (Prioridad Alta)                         (Prioridad Media)
                                    │                                           │
                            Matching ≥85%?                              Documentos?
                                    │                                           │
                                   Sí                                          Sí
                                    │                                           │
                            Respuesta Instantánea                    Búsqueda Semántica
                                    │                                           │
                                    └─────────────────────┬─────────────────────┘
                                                          │
                                                    3. Ollama Básico
                                                   (Prioridad Baja)
                                                          │
                                                  Conocimiento General
```

### 1. Training Prompts (Primera Prioridad)

**Proceso**:
1. Usuario envía pregunta
2. Sistema genera embedding de la pregunta
3. Compara con embeddings de prompts almacenados
4. Si similitud ≥ 85%, retorna respuesta predefinida
5. Tiempo de respuesta: <0.5 segundos

**Ventajas**:
- Respuestas instantáneas
- Consistencia garantizada
- No consume recursos de Ollama

### 2. Sistema RAG (Segunda Prioridad)

**Proceso**:
1. Si no hay match en Training Prompts
2. Genera embedding de la pregunta
3. Busca top-3 chunks más similares en documentos
4. Construye prompt con contexto recuperado
5. Envía a Ollama con contexto
6. Retorna respuesta contextualizada

**Ventajas**:
- Respuestas basadas en documentos oficiales
- Actualizable mediante carga de PDFs
- Cita fuentes de información

### 3. Ollama Básico (Tercera Prioridad)

**Proceso**:
1. Si no hay match en Training ni contexto en RAG
2. Envía pregunta con prompt básico institucional
3. Ollama genera respuesta con conocimiento general
4. Retorna respuesta

**Uso**: Preguntas generales no cubiertas por Training o RAG.

---

## 🏗️ Arquitectura e Integración

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Chat UI    │  │ PDF Uploader │  │   Settings   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │ HTTP (Axios)                         │
└────────────────────────────┼──────────────────────────────────────┘
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                    │
│                            │                                       │
│  ┌─────────────────────────┴─────────────────────────┐           │
│  │              API Routes (Express)                  │           │
│  │  /chat  /training  /documents  /health            │           │
│  └─────────────────────┬───────────────────────────┬─┘           │
│                        │                           │              │
│  ┌─────────────────────┴──────┐    ┌──────────────┴────────┐    │
│  │   Training Matcher         │    │    RAG Engine          │    │
│  │  - prompt-matcher.js       │    │  - pdf-processor.js    │    │
│  │  - training-manager.js     │    │  - chunker.js          │    │
│  │  - Similarity Search       │    │  - embeddings.js       │    │
│  └────────────┬───────────────┘    │  - vector-store.js     │    │
│               │                     └──────────┬─────────────┘    │
│               │                                │                   │
│               └────────────────┬───────────────┘                   │
│                                │                                   │
└────────────────────────────────┼───────────────────────────────────┘
                                 │ HTTP API
┌────────────────────────────────┼───────────────────────────────────┐
│                         OLLAMA (Motor IA)                          │
│                                │                                    │
│  ┌─────────────────────────────┴──────────────────────────┐       │
│  │                    API Endpoints                        │       │
│  │  /api/chat  /api/generate  /api/embeddings            │       │
│  └─────────────────────────┬────────────────────────────┬─┘       │
│                            │                            │          │
│  ┌─────────────────────────┴──────┐    ┌──────────────┴────────┐ │
│  │      llama3.2:3b               │    │  nomic-embed-text      │ │
│  │  (Generación de Respuestas)    │    │  (Embeddings 768D)     │ │
│  └────────────────────────────────┘    └───────────────────────┘ │
│                                                                    │
│  Ejecutándose: Local o Docker Container                           │
└────────────────────────────────────────────────────────────────────┘
```

### Integración entre Tecnologías

#### Frontend ↔ Backend
- **Protocolo**: HTTP/REST
- **Formato**: JSON
- **Cliente**: Axios
- **Endpoints**: `/chat`, `/training`, `/documents`

#### Backend ↔ Ollama
- **Protocolo**: HTTP
- **Endpoints Ollama**:
  - `/api/chat`: Conversaciones con contexto
  - `/api/generate`: Generación simple
  - `/api/embeddings`: Generación de vectores
- **Formato**: JSON con streaming opcional

#### Flujo de Datos RAG
```
PDF File → pdf-parse → Text → Natural (Tokenizer) → Chunks
                                                       ↓
                                              Ollama (embeddings)
                                                       ↓
                                              Vector Store (JSON)
                                                       ↓
                                              Similarity Search
                                                       ↓
                                              Context → Ollama (chat)
```

#### Flujo de Training Prompts
```
User Question → Ollama (embedding) → Similarity Comparison
                                            ↓
                                    Training Prompts (JSON)
                                            ↓
                                    Match ≥85%? → Predefined Answer
```

---

## � Documentación Adicional

Para información detallada sobre instalación, validación de funcionalidades y uso del sistema, consulta:

📖 **[Guía de Instalación y Uso Completa](./guide-installation.md)**

Esta guía incluye:
- Instalación paso a paso (local y con Docker)
- Configuración del sistema
- Pruebas completas de Training Prompts y RAG
- Validación de funcionalidades
- Ejemplos de uso con Postman y cURL
- Integración con Frontend
- Solución de problemas

---

## 📊 Conclusiones

**AguiAI** representa una solución integral para asistencia académica que:

✅ **Garantiza privacidad** mediante ejecución local de IA  
✅ **Proporciona respuestas consistentes** con Training Prompts  
✅ **Se actualiza fácilmente** mediante carga de PDFs  
✅ **Escala eficientemente** con arquitectura modular  
✅ **Funciona 24/7** sin intervención humana  
✅ **Reduce carga administrativa** automatizando consultas frecuentes  

El sistema ha sido validado exitosamente en todas sus funcionalidades y está listo para despliegue en producción.

---

## 📚 Referencias

- [Ollama Documentation](https://ollama.ai/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/)
- [RAG Paper](https://arxiv.org/abs/2005.11401)
- [Llama 3.2 Model Card](https://ollama.ai/library/llama3.2)

---

## 👥 Autores

**Facultad de Informática Mazatlán**  
Universidad Autónoma de Sinaloa

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
