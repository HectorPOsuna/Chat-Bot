import express from "express";
import cors from "cors";

import { buildPrompt } from "./promptBuilder.js";
import { formatResponse } from "./responseFormatter.js";

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
    // Extraer el mensaje del cuerpo de la petición
    const { message } = req.body;

    // Validar que el mensaje no esté vacío
    if (!message) {
        return res.status(400).json(formatResponse(false, "Falta 'message' en el body"));
    }

    try {
        // Construir el prompt con instrucciones del sistema
        const enhancedPrompt = buildPrompt(message);

        // Realizar la petición a la API de Ollama
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.1:latest", // Modelo a utilizar
                prompt: enhancedPrompt,   // Prompt enriquecido
                stream: false             // Desactivar streaming para recibir respuesta completa
            })
        });

        // Parsear la respuesta de Ollama a JSON
        const data = await response.json();

        // Validación por si Ollama devuelve un error o respuesta vacía
        if (!data || !data.response) {
            return res.status(500).json(formatResponse(false, {
                message: "Ollama no devolvió una respuesta válida",
                details: data
            }));
        }

        // Enviar la respuesta formateada al cliente
        res.json(formatResponse(true, data.response, "llama3.1:latest"));
        
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
