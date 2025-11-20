import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { text: "Hola, ¿en qué puedo ayudarte hoy?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Guardar mensaje del usuario
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Limpiar input
    setInput("");

    try {
      setLoading(true);
      const start = Date.now();

      const response = await axios.post("http://localhost:3000/chat", {
        message: userMessage.text,
      });

      // Tu API responde así:
      // { reply: "texto aquí" }
      const botReply = response.data.reply;

      const end = Date.now();
      const seconds = ((end - start) / 1000).toFixed(2);
      setResponseTime(seconds);

      // Guardar mensaje del bot
      const botMessage = { text: botReply, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h2 className="title">Chat Bot</h2>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}>
              {msg.text}
            </div>
          ))}

          {/* Loading */}
          {loading && <div className="loading">⏳ Esperando respuesta...</div>}
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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default App;
