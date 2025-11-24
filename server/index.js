import express from "express";
import cors from "cors";

import { buildPrompt } from "./promptBuilder.js";
import { formatResponse } from "./responseFormatter.js";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json(formatResponse(false, "Falta 'message' en el body"));
    }

    try {
        const enhancedPrompt = buildPrompt(message);

        const response = await fetch("http://ollama:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.1:latest",
                prompt: enhancedPrompt,
                stream: false
            })
        });

        const data = await response.json();

        if (!data || !data.response) {
            return res.status(500).json(formatResponse(false, {
                message: "Ollama no devolvió una respuesta válida",
                details: data
            }));
        }

        res.json(formatResponse(true, data.response, "llama3.1:latest"));
        
    } catch (error) {
        console.error("Error llamando a Ollama:", error);
        res.status(500).json(formatResponse(false, "Error al generar respuesta"));
    }
});

app.listen(3000, () => {
    console.log("API lista en http://localhost:3000");
});
