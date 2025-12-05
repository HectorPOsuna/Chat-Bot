import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { RAGEngine } from "./rag/rag-engine.js";
import { PromptMatcher } from "./rag/prompt-matcher.js";
import documentsRouter from "./routes/documents.js";
import trainingRouter from "./routes/training.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Configurar RAG Engine
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const ragEngine = new RAGEngine({
  pdfsDir: path.join(__dirname, 'data', 'pdfs'),
  processedDir: path.join(__dirname, 'data', 'processed'),
  embeddingsDir: path.join(__dirname, 'data', 'embeddings'),
  ollamaUrl: OLLAMA_URL
});

// Configurar Prompt Matcher
const trainingFile = path.join(__dirname, 'data', 'training-prompts.json');
const promptMatcher = new PromptMatcher(trainingFile, OLLAMA_URL);

// Inicializar Prompt Matcher
(async () => {
  await promptMatcher.load();
  await promptMatcher.generateEmbeddings();
  console.log('✅ Prompt Matcher inicializado');
})();

// Hacer disponibles en toda la app
app.locals.ragEngine = ragEngine;
app.locals.promptMatcher = promptMatcher;

// Rutas
app.use('/documents', documentsRouter);
app.use('/training', trainingRouter);

// Endpoint principal de chat con RAG y Training
app.post("/chat", async (req, res) => {
  const { message, history = [], useRAG = true, useTraining = true } = req.body;
  
  if (!message) {
    return res.status(400).json({ 
      status: "error",
      error: "Falta 'message' en el body" 
    });
  }

  try {
    const start = performance.now();

    let reply, sources = [], responseSource = "ollama";

    // 1. PRIORIDAD: Intentar match con prompts de entrenamiento
    if (useTraining) {
      const trainedMatch = await promptMatcher.findMatch(message);
      if (trainedMatch) {
        const end = performance.now();
        const seconds = ((end - start) / 1000).toFixed(2);

        return res.json({
          status: "success",
          data: {
            reply: trainedMatch.answer,
            time: seconds,
            source: "training",
            matchedPrompt: trainedMatch.question,
            similarity: (trainedMatch.similarity * 100).toFixed(2) + '%',
            category: trainedMatch.category
          }
        });
      }
    }

    // 2. Si no hay match en training, usar RAG
    if (useRAG) {
      const ragResponse = await ragEngine.generateResponse(message, history);
      reply = ragResponse.reply;
      sources = ragResponse.sources;
      responseSource = "rag";
    } else {
      // 3. Modo sin RAG ni Training (solo prompt básico)
      const trainingData = `
Información base de la institución:
- Universidad: Universidad Autónoma de Sinaloa
- Facultad: Facultad de Informática Mazatlán
- Ubicación: Mazatlán, Sinaloa, México

Eres un asistente académico profesional y claro.
Responde con buena estructura, explicación si hace falta, y usa Markdown solo cuando des código.
`;

      const finalPrompt = `${trainingData}\n\nMensaje del usuario:\n${message}`;

      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2:3b",
          prompt: finalPrompt,
          stream: false,
        }),
      });

      const data = await response.json();
      reply = data.response;
      responseSource = "basic";
    }

    const end = performance.now();
    const seconds = ((end - start) / 1000).toFixed(2);

    return res.json({
      status: "success",
      data: {
        reply,
        time: seconds,
        source: responseSource,
        ragEnabled: useRAG,
        trainingEnabled: useTraining,
        sources: useRAG ? sources : undefined
      }
    });

  } catch (error) {
    console.error("Error llamando a Ollama:", error);
    return res.status(500).json({
      status: "error",
      error: "Error al generar respuesta",
      details: error.message
    });
  }
});

// Endpoint de salud
app.get("/health", async (req, res) => {
  try {
    const ragStats = await ragEngine.getStats();
    const trainingPrompts = promptMatcher.getAll();
    const trainingCategories = promptMatcher.getCategories();

    res.json({
      status: "success",
      data: {
        server: "running",
        ollama: OLLAMA_URL,
        rag: ragStats,
        training: {
          totalPrompts: trainingPrompts.length,
          enabledPrompts: trainingPrompts.filter(p => p.enabled).length,
          categories: trainingCategories.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("🚀 API lista en http://localhost:3000");
  console.log(`🧠 RAG Engine configurado con Ollama en ${OLLAMA_URL}`);
  console.log("\nEndpoints disponibles:");
  console.log("  POST   /chat                - Chat con RAG y Training");
  console.log("  POST   /documents/upload    - Subir PDF");
  console.log("  GET    /documents           - Listar documentos");
  console.log("  DELETE /documents/:id       - Eliminar documento");
  console.log("  POST   /documents/search    - Buscar contexto");
  console.log("  GET    /training            - Listar prompts de entrenamiento");
  console.log("  POST   /training            - Agregar prompt");
  console.log("  PUT    /training/:id        - Actualizar prompt");
  console.log("  DELETE /training/:id        - Eliminar prompt");
  console.log("  GET    /training/stats      - Estadísticas de training");
  console.log("  GET    /health              - Estado del sistema");
});
