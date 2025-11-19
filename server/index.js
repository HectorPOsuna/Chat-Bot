import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

//Endpoint
app.post("/chat", async (req, res) =>{
    const { message } = req.body;

    if(!message){
        req.status(400).json({error: "Falta 'message' en el body"});
    }

    try {
        const response = await fetch("http://localhost:11434/api/generate",{
            method: "POST",
            body: JSON.stringify({
                model: "llama3.1",
                prompt: message,
                stream: false
            }),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        res.json({ reply: data.response});
    
    } catch (error) {
        console.error("Error llamando a Ollama", error);
        res.status(500).json({ error: "Error al generar respuesta" });
    }
});

app.listen(3000, () =>{
    console.log("API lista en http://localhost:3000");
});