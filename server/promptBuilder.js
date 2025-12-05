/**
 * Obtiene las instrucciones del sistema para el asistente.
 * @returns {string} - Las instrucciones del sistema.
 */
export const getSystemInstructions = () => {
    return `Eres un asistente de IA útil e inteligente.
Tu objetivo es proporcionar respuestas claras, concisas y bien estructuradas.
USA SIEMPRE formato Markdown para mejorar la legibilidad:
- Utiliza **negritas** para términos clave.
- Usa listas (viñetas o numeradas) para pasos o elementos múltiples.
- Usa encabezados (###) para organizar secciones si la respuesta es larga.
- Usa \`bloques de código\` para fragmentos de código.`;
};

/**
 * Construye un prompt con instrucciones del sistema para fomentar respuestas estructuradas y bien formateadas.
 * (Función legacy para compatibilidad con el endpoint sin contexto)
 * @param {string} userMessage - El mensaje ingresado por el usuario.
 * @returns {string} - El prompt mejorado.
 */
export const buildPrompt = (userMessage) => {
    const systemInstruction = getSystemInstructions();
    return `${systemInstruction}\n\nMensaje del usuario:\n${userMessage}`;
};
