import fs from 'fs/promises';
import path from 'path';
import { generateChunkEmbeddings, searchSimilarChunks } from './embeddings.js';

/**
 * Almacena y gestiona vectores de embeddings
 */
export class VectorStore {
    constructor(embeddingsDir) {
        this.embeddingsDir = embeddingsDir;
        this.cache = new Map(); // Cache en memoria
    }

    /**
     * Guarda un documento con embeddings
     * @param {Object} document - Documento con chunks y embeddings
     * @returns {Promise<void>}
     */
    async saveDocument(document) {
        const filePath = path.join(this.embeddingsDir, `${document.id}_embeddings.json`);
        await fs.writeFile(filePath, JSON.stringify(document, null, 2), 'utf-8');
        
        // Actualizar cache
        this.cache.set(document.id, document);
        
        console.log(`💾 Embeddings guardados: ${document.id}`);
    }

    /**
     * Carga un documento con embeddings
     * @param {string} docId - ID del documento
     * @returns {Promise<Object|null>} - Documento o null si no existe
     */
    async loadDocument(docId) {
        // Verificar cache primero
        if (this.cache.has(docId)) {
            return this.cache.get(docId);
        }

        try {
            const filePath = path.join(this.embeddingsDir, `${docId}_embeddings.json`);
            const content = await fs.readFile(filePath, 'utf-8');
            const document = JSON.parse(content);
            
            // Guardar en cache
            this.cache.set(docId, document);
            
            return document;
        } catch (error) {
            return null;
        }
    }

    /**
     * Carga todos los documentos con embeddings
     * @returns {Promise<Array<Object>>} - Array de documentos
     */
    async loadAllDocuments() {
        try {
            const files = await fs.readdir(this.embeddingsDir);
            const embeddingFiles = files.filter(f => f.endsWith('_embeddings.json'));

            const documents = await Promise.all(
                embeddingFiles.map(async (file) => {
                    const content = await fs.readFile(path.join(this.embeddingsDir, file), 'utf-8');
                    const doc = JSON.parse(content);
                    this.cache.set(doc.id, doc);
                    return doc;
                })
            );

            return documents;
        } catch (error) {
            console.error('Error cargando documentos:', error);
            return [];
        }
    }

    /**
     * Obtiene todos los chunks de todos los documentos
     * @returns {Promise<Array<Object>>} - Array de chunks con embeddings
     */
    async getAllChunks() {
        const documents = await this.loadAllDocuments();
        const allChunks = [];

        for (const doc of documents) {
            if (doc.chunks) {
                allChunks.push(...doc.chunks);
            }
        }

        return allChunks;
    }

    /**
     * Busca chunks similares en todos los documentos
     * @param {string} query - Texto de búsqueda
     * @param {number} topK - Número de resultados
     * @param {string} ollamaUrl - URL de Ollama
     * @returns {Promise<Array<Object>>} - Chunks más similares
     */
    async search(query, topK = 3, ollamaUrl = 'http://localhost:11434') {
        const allChunks = await this.getAllChunks();
        
        if (allChunks.length === 0) {
            console.log('⚠️ No hay documentos en el vector store');
            return [];
        }

        return await searchSimilarChunks(query, allChunks, topK, ollamaUrl);
    }

    /**
     * Elimina un documento del vector store
     * @param {string} docId - ID del documento
     * @returns {Promise<boolean>} - True si se eliminó correctamente
     */
    async deleteDocument(docId) {
        try {
            const filePath = path.join(this.embeddingsDir, `${docId}_embeddings.json`);
            await fs.unlink(filePath);
            
            // Eliminar del cache
            this.cache.delete(docId);
            
            console.log(`🗑️ Embeddings eliminados: ${docId}`);
            return true;
        } catch (error) {
            console.error(`Error eliminando embeddings ${docId}:`, error);
            return false;
        }
    }

    /**
     * Obtiene estadísticas del vector store
     * @returns {Promise<Object>} - Estadísticas
     */
    async getStats() {
        const documents = await this.loadAllDocuments();
        const totalChunks = documents.reduce((sum, doc) => sum + (doc.chunks?.length || 0), 0);

        return {
            totalDocuments: documents.length,
            totalChunks,
            documentsInCache: this.cache.size
        };
    }
}
