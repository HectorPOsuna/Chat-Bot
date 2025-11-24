/**
 * Construye un prompt con instrucciones del sistema para fomentar respuestas estructuradas y bien formateadas.
 * @param {string} userMessage - El mensaje ingresado por el usuario.
 * @returns {string} - El prompt mejorado.
 */
export const buildPrompt = (userMessage) => {
    const systemInstruction = `
Eres un asistente de IA útil e inteligente.
Tu objetivo es proporcionar respuestas claras, concisas y bien estructuradas.
USA SIEMPRE formato Markdown para mejorar la legibilidad:
- Utiliza **negritas** para términos clave.
- Usa listas (viñetas o numeradas) para pasos o elementos múltiples.
- Usa encabezados (###) para organizar secciones si la respuesta es larga.
- Usa \`bloques de código\` para fragmentos de código.

Mensaje del usuario:
`;
    return `${systemInstruction}${userMessage}`;
};
