import fs from 'fs/promises';
import path from 'path';
import { generateEmbedding, cosineSimilarity } from './embeddings.js';

/**
 * Gestor de prompts de entrenamiento con matching por similitud
 */
export class PromptMatcher {
    constructor(trainingFile, ollamaUrl = 'http://localhost:11434') {
        this.trainingFile = trainingFile;
        this.ollamaUrl = ollamaUrl;
        this.prompts = [];
        this.embeddings = new Map(); // Cache de embeddings
        this.similarityThreshold = 0.85; // 85% de similitud mínima
    }

    /**
     * Carga los prompts de entrenamiento
     */
    async load() {
        try {
            const content = await fs.readFile(this.trainingFile, 'utf-8');
            const data = JSON.parse(content);
            this.prompts = data.prompts.filter(p => p.enabled);
            console.log(`📚 Cargados ${this.prompts.length} prompts de entrenamiento`);
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar prompts de entrenamiento:', error.message);
            this.prompts = [];
        }
    }

    /**
     * Genera embeddings para todos los prompts y sus variaciones
     */
    async generateEmbeddings() {
        console.log('🧠 Generando embeddings para prompts de entrenamiento...');
        
        for (const prompt of this.prompts) {
            // Embedding de la pregunta principal
            const questionEmbedding = await generateEmbedding(prompt.question, this.ollamaUrl);
            this.embeddings.set(`${prompt.id}_question`, questionEmbedding);

            // Embeddings de las variaciones
            for (let i = 0; i < prompt.variations.length; i++) {
                const varEmbedding = await generateEmbedding(prompt.variations[i], this.ollamaUrl);
                this.embeddings.set(`${prompt.id}_var_${i}`, varEmbedding);
            }
        }

        console.log(`✅ Generados ${this.embeddings.size} embeddings`);
    }

    /**
     * Busca un prompt que coincida con la pregunta del usuario
     * @param {string} userQuestion - Pregunta del usuario
     * @returns {Promise<Object|null>} - Prompt coincidente o null
     */
    async findMatch(userQuestion) {
        if (this.prompts.length === 0) {
            return null;
        }

        // Generar embedding de la pregunta del usuario
        const userEmbedding = await generateEmbedding(userQuestion, this.ollamaUrl);

        let bestMatch = null;
        let bestSimilarity = 0;

        // Comparar con todos los prompts
        for (const prompt of this.prompts) {
            // Comparar con pregunta principal
            const questionEmbedding = this.embeddings.get(`${prompt.id}_question`);
            if (questionEmbedding) {
                const similarity = cosineSimilarity(userEmbedding, questionEmbedding);
                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity;
                    bestMatch = prompt;
                }
            }

            // Comparar con variaciones
            for (let i = 0; i < prompt.variations.length; i++) {
                const varEmbedding = this.embeddings.get(`${prompt.id}_var_${i}`);
                if (varEmbedding) {
                    const similarity = cosineSimilarity(userEmbedding, varEmbedding);
                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestMatch = prompt;
                    }
                }
            }
        }

        // Solo retornar si supera el umbral de similitud
        if (bestSimilarity >= this.similarityThreshold) {
            console.log(`✅ Match encontrado: "${bestMatch.question}" (${(bestSimilarity * 100).toFixed(2)}%)`);
            return {
                ...bestMatch,
                similarity: bestSimilarity
            };
        }

        console.log(`❌ No se encontró match (mejor: ${(bestSimilarity * 100).toFixed(2)}%)`);
        return null;
    }

    /**
     * Recarga los prompts y regenera embeddings
     */
    async reload() {
        await this.load();
        await this.generateEmbeddings();
    }

    /**
     * Obtiene todos los prompts
     */
    getAll() {
        return this.prompts;
    }

    /**
     * Obtiene prompts por categoría
     */
    getByCategory(category) {
        return this.prompts.filter(p => p.category === category);
    }

    /**
     * Obtiene todas las categorías únicas
     */
    getCategories() {
        return [...new Set(this.prompts.map(p => p.category))];
    }
}
