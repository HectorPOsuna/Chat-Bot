import { buildPrompt } from "./promptBuilder.js";
import { formatResponse } from "./responseFormatter.js";

console.log("--- Testing promptBuilder ---");
const userMsg = "Hola";
const prompt = buildPrompt(userMsg);
console.log("Prompt created:", prompt.includes("ALWAYS use Markdown") && prompt.includes(userMsg) ? "PASS" : "FAIL");

console.log("\n--- Testing responseFormatter ---");
const successResp = formatResponse(true, "Respuesta exitosa", "model-test");
console.log("Success Response:", successResp.status === "success" && successResp.data.reply === "Respuesta exitosa" ? "PASS" : "FAIL");

const errorResp = formatResponse(false, "Error ocurrido");
console.log("Error Response:", errorResp.status === "error" && errorResp.error.message === "Error ocurrido" ? "PASS" : "FAIL");
