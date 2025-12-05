import { processPDF, deleteDocument as deletePDFDocument } from './pdf-processor.js';
import { processDocumentChunks } from './chunker.js';
import { generateChunkEmbeddings } from './embeddings.js';
import { VectorStore } from './vector-store.js';
import path from 'path';

/**
 * Motor principal de RAG que coordina todo el pipeline
 */
export class RAGEngine {
    constructor(config) {
        this.pdfsDir = config.pdfsDir;
        this.processedDir = config.processedDir;
        this.embeddingsDir = config.embeddingsDir;
        this.ollamaUrl = config.ollamaUrl || 'http://localhost:11434';
        this.vectorStore = new VectorStore(this.embeddingsDir);
    }

    /**
     * Procesa un PDF completo: extracción, chunking y embeddings
     * @param {string} pdfPath - Ruta al PDF
     * @returns {Promise<Object>} - Información del documento procesado
     */
    async processPDFComplete(pdfPath) {
        console.log('\n🚀 Iniciando procesamiento completo de PDF...\n');

        // 1. Extraer texto del PDF
        const processedDoc = await processPDF(pdfPath, this.processedDir);
        
        // 2. Cargar el documento procesado
        const docPath = path.join(this.processedDir, `${processedDoc.id}.json`);
        const fs = await import('fs/promises');
        const docContent = await fs.readFile(docPath, 'utf-8');
        const document = JSON.parse(docContent);

        // 3. Dividir en chunks
        const documentWithChunks = processDocumentChunks(document);

        // 4. Generar embeddings
        const chunksWithEmbeddings = await generateChunkEmbeddings(
            documentWithChunks.chunks,
            this.ollamaUrl
        );

        // 5. Guardar en vector store
        const finalDocument = {
            ...documentWithChunks,
            chunks: chunksWithEmbeddings
        };

        await this.vectorStore.saveDocument(finalDocument);

        console.log('\n✅ Procesamiento completo finalizado\n');

        return {
            id: finalDocument.id,
            filename: finalDocument.filename,
            numPages: finalDocument.numPages,
            totalChunks: chunksWithEmbeddings.length,
            textLength: finalDocument.textLength
        };
    }

    /**
     * Busca contexto relevante para una query
     * @param {string} query - Pregunta del usuario
     * @param {number} topK - Número de chunks a recuperar
     * @returns {Promise<Array<Object>>} - Chunks relevantes
     */
    async searchContext(query, topK = 3) {
        return await this.vectorStore.search(query, topK, this.ollamaUrl);
    }

    /**
     * Construye el prompt del sistema con contexto RAG
     * @param {Array<Object>} relevantChunks - Chunks relevantes
     * @returns {string} - Prompt del sistema
     */
    buildSystemPrompt(relevantChunks) {
        if (relevantChunks.length === 0) {
            return `Eres un asistente académico profesional y claro de la Universidad Autónoma de Sinaloa, específicamente de la Facultad de Informática Mazatlán.
Responde con buena estructura, explicación si hace falta, y usa Markdown cuando sea apropiado.`;
        }

        const contextText = relevantChunks
            .map((chunk, i) => `[Documento ${i + 1}]:\n${chunk.text}`)
            .join('\n\n---\n\n');

        return `Eres un asistente académico profesional y claro de la Universidad Autónoma de Sinaloa, específicamente de la Facultad de Informática Mazatlán.

Tienes acceso a la siguiente información relevante de documentos institucionales:

${contextText}

---

Instrucciones:
- Usa la información proporcionada para responder preguntas
- Si la información no está en los documentos, indícalo claramente
- Responde con buena estructura y usa Markdown cuando sea apropiado
- Sé preciso y profesional`;
    }

    /**
     * Genera una respuesta usando RAG
     * @param {string} query - Pregunta del usuario
     * @param {Array} history - Historial de conversación
     * @returns {Promise<Object>} - Respuesta con contexto
     */
    async generateResponse(query, history = []) {
        // 1. Buscar contexto relevante
        const relevantChunks = await this.searchContext(query, 3);

        // 2. Construir prompt del sistema
        const systemPrompt = this.buildSystemPrompt(relevantChunks);

        // 3. Construir mensajes para Ollama
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: query }
        ];

        // 4. Llamar a Ollama
        const response = await fetch(`${this.ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:3b',
                messages,
                stream: false
            })
        });

        const data = await response.json();

        return {
            reply: data.message.content,
            contextsUsed: relevantChunks.length,
            sources: relevantChunks.map(c => ({
                docFilename: c.docFilename,
                similarity: (c.similarity * 100).toFixed(2) + '%',
                preview: c.text.substring(0, 100) + '...'
            }))
        };
    }

    /**
     * Elimina un documento completamente
     * @param {string} docId - ID del documento
     * @returns {Promise<boolean>} - True si se eliminó correctamente
     */
    async deleteDocument(docId) {
        // Eliminar del procesado
        await deletePDFDocument(docId, this.processedDir);
        
        // Eliminar del vector store
        await this.vectorStore.deleteDocument(docId);
        
        return true;
    }

    /**
     * Obtiene estadísticas del sistema RAG
     * @returns {Promise<Object>} - Estadísticas
     */
    async getStats() {
        return await this.vectorStore.getStats();
    }
}
