/**
 * Gestiona el contexto de conversación para la API.
 * Construye el array de mensajes en el formato requerido por Ollama.
 */

/**
 * Valida que el historial tenga el formato correcto.
 * @param {Array} history - Array de mensajes del historial.
 * @returns {boolean} - True si el formato es válido.
 */
export const validateHistory = (history) => {
    if (!Array.isArray(history)) {
        return false;
    }

    // Validar que cada mensaje tenga role y content
    return history.every(msg => 
        msg && 
        typeof msg === 'object' && 
        typeof msg.role === 'string' && 
        typeof msg.content === 'string' &&
        ['user', 'assistant', 'system'].includes(msg.role)
    );
};

/**
 * Construye el array de mensajes completo para enviar a Ollama.
 * @param {string} systemMessage - Mensaje del sistema con instrucciones.
 * @param {Array} history - Historial de mensajes previos (opcional).
 * @param {string} userMessage - Mensaje actual del usuario.
 * @returns {Array} - Array de mensajes en formato Ollama.
 */
export const buildMessages = (systemMessage, history, userMessage) => {
    const messages = [];

    // Agregar mensaje del sistema
    messages.push({
        role: "system",
        content: systemMessage
    });

    // Agregar historial si existe y es válido
    if (history && Array.isArray(history) && history.length > 0) {
        messages.push(...history);
    }

    // Agregar mensaje actual del usuario
    messages.push({
        role: "user",
        content: userMessage
    });

    return messages;
};
