import express from "express";
import cors from "cors";

import { buildPrompt, getSystemInstructions } from "./promptBuilder.js";
import { formatResponse } from "./responseFormatter.js";
import { buildMessages, validateHistory } from "./contextManager.js";

// Inicializar la aplicación Express
const app = express();

// Habilitar CORS para permitir peticiones desde otros dominios
app.use(cors());

// Habilitar el parseo de JSON en el cuerpo de las peticiones
app.use(express.json());

/**
 * Configuración de la URL de Ollama.
 * Prioridad:
 * 1. Variable de entorno OLLAMA_URL (usada en Docker).
 * 2. Valor por defecto "http://localhost:11434" (usado en local).
 */
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

console.log(`Conectando a Ollama en: ${OLLAMA_URL}`);

// Endpoint principal para el chat
app.post("/chat", async (req, res) => {
    // Extraer el mensaje y el historial opcional del cuerpo de la petición
    const { message, history } = req.body;

    // Validar que el mensaje no esté vacío
    if (!message) {
        return res.status(400).json(formatResponse(false, "Falta 'message' en el body"));
    }

    // Validar el historial si se proporciona
    if (history && !validateHistory(history)) {
        return res.status(400).json(formatResponse(false, "El formato del historial es inválido. Debe ser un array de objetos con 'role' y 'content'."));
    }

    try {
        let ollamaResponse;

        // Si hay historial, usar el endpoint /api/chat con contexto
        if (history && history.length > 0) {
            const systemInstructions = getSystemInstructions();
            const messages = buildMessages(systemInstructions, history, message);

            // Realizar la petición a la API de Ollama con contexto
            ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama3.1:latest",
                    messages: messages,
                    stream: false
                })
            });
        } else {
            // Sin historial, usar el endpoint /api/generate (modo legacy)
            const enhancedPrompt = buildPrompt(message);

            ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama3.1:latest",
                    prompt: enhancedPrompt,
                    stream: false
                })
            });
        }

        // Parsear la respuesta de Ollama a JSON
        const data = await ollamaResponse.json();

        // Validación por si Ollama devuelve un error o respuesta vacía
        // El endpoint /api/chat devuelve data.message.content
        // El endpoint /api/generate devuelve data.response
        const aiReply = data.message?.content || data.response;

        if (!aiReply) {
            return res.status(500).json(formatResponse(false, {
                message: "Ollama no devolvió una respuesta válida",
                details: data
            }));
        }

        // Enviar la respuesta formateada al cliente
        res.json(formatResponse(true, aiReply, "llama3.1:latest"));
        
    } catch (error) {
        // Manejo de errores de red o ejecución
        console.error("Error llamando a Ollama:", error);
        res.status(500).json(formatResponse(false, "Error al generar respuesta"));
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("API lista en http://localhost:3000");
});
