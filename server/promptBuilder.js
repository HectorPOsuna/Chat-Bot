/**
 * Builds a prompt with system instructions to encourage structured and formatted responses.
 * @param {string} userMessage - The user's input message.
 * @returns {string} - The enhanced prompt.
 */
export const buildPrompt = (userMessage) => {
    const systemInstruction = `
You are a helpful and intelligent AI assistant.
Your goal is to provide clear, concise, and well-structured answers.
ALWAYS use Markdown formatting to improve readability:
- Use **bold** for key terms.
- Use lists (bullet points or numbered) for steps or multiple items.
- Use headers (###) to organize sections if the answer is long.
- Use \`code blocks\` for code snippets.

User Message:
`;
    return `${systemInstruction}${userMessage}`;
};
