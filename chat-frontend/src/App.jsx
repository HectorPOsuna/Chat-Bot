import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  // Estado para los mensajes visibles en la UI
  const [messages, setMessages] = useState([
    { text: "Hola, ¿en qué puedo ayudarte hoy?", sender: "bot" },
  ]);
  
  // Estado para el historial en formato API (para enviar al servidor)
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Guardar mensaje del usuario en la UI
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Guardar el input antes de limpiarlo
    const userInput = input;
    setInput("");

    try {
      setLoading(true);
      const start = Date.now();

      // Realizar petición al servidor con historial conversacional
      const response = await axios.post("http://localhost:3000/chat", {
        message: userInput,
        history: conversationHistory, // Enviar historial previo
      });

      const end = Date.now();
      const seconds = ((end - start) / 1000).toFixed(2);
      setResponseTime(seconds);

      // Extraer respuesta del nuevo formato
      // Formato: { status: "success", data: { reply, model, timestamp } }
      const botReply = response.data.data?.reply || response.data.reply || "Error: no se recibió respuesta";

      // Guardar mensaje del bot en la UI
      const botMessage = { text: botReply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);

      // Actualizar historial conversacional para futuras peticiones
      // Nota: Este formato es compatible con RAG - se pueden insertar mensajes del sistema aquí
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: botReply },
      ]);

    } catch (error) {
      console.error("Error:", error);
      
      // Mostrar mensaje de error al usuario
      const errorMessage = {
        text: "❌ Error al conectar con el servidor. Por favor, verifica que el backend esté corriendo.",
        sender: "bot"
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar la conversación
  const handleClearChat = () => {
    setMessages([{ text: "Hola, ¿en qué puedo ayudarte hoy?", sender: "bot" }]);
    setConversationHistory([]);
    setResponseTime(null);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">
          <h2 className="title">🤖 Chat Bot IA</h2>
          <button className="clear-btn" onClick={handleClearChat} title="Limpiar conversación">
            🗑️
          </button>
        </div>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
            >
              {msg.sender === "bot" ? (
                // Renderizar Markdown para mensajes del bot
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              ) : (
                // Texto plano para mensajes del usuario
                <span>{msg.text}</span>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && <div className="loading">⏳ Esperando respuesta...</div>}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Tiempo de respuesta */}
        {responseTime && (
          <p className="response-time">⏱ Tiempo de respuesta: {responseTime} segundos</p>
        )}

        <div className="input-area">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
