/**
 * Genera embeddings usando Ollama
 * @param {string} text - Texto para generar embedding
 * @param {string} ollamaUrl - URL de Ollama
 * @returns {Promise<Array<number>>} - Vector de embedding
 */
export async function generateEmbedding(text, ollamaUrl = 'http://localhost:11434') {
    try {
        const response = await fetch(`${ollamaUrl}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'nomic-embed-text',
                prompt: text
            })
        });

        const data = await response.json();
        return data.embedding;
    } catch (error) {
        console.error('Error generando embedding:', error);
        throw new Error(`Error al generar embedding: ${error.message}`);
    }
}

/**
 * Genera embeddings para múltiples chunks
 * @param {Array<Object>} chunks - Array de chunks
 * @param {string} ollamaUrl - URL de Ollama
 * @returns {Promise<Array<Object>>} - Chunks con embeddings
 */
export async function generateChunkEmbeddings(chunks, ollamaUrl = 'http://localhost:11434') {
    console.log(`🧠 Generando embeddings para ${chunks.length} chunks...`);
    
    const chunksWithEmbeddings = [];
    
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`  Procesando chunk ${i + 1}/${chunks.length}...`);
        
        try {
            const embedding = await generateEmbedding(chunk.text, ollamaUrl);
            chunksWithEmbeddings.push({
                ...chunk,
                embedding
            });
        } catch (error) {
            console.error(`Error en chunk ${i}:`, error);
            // Continuar con el siguiente chunk
        }
    }
    
    console.log(`✅ Embeddings generados: ${chunksWithEmbeddings.length}/${chunks.length}`);
    
    return chunksWithEmbeddings;
}

/**
 * Calcula similitud coseno entre dos vectores
 * @param {Array<number>} vecA - Vector A
 * @param {Array<number>} vecB - Vector B
 * @returns {number} - Similitud coseno (0-1)
 */
export function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('Los vectores deben tener la misma longitud');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (normA * normB);
}

/**
 * Busca los chunks más similares a una query
 * @param {string} query - Texto de búsqueda
 * @param {Array<Object>} chunks - Chunks con embeddings
 * @param {number} topK - Número de resultados a retornar
 * @param {string} ollamaUrl - URL de Ollama
 * @returns {Promise<Array<Object>>} - Top K chunks más similares
 */
export async function searchSimilarChunks(query, chunks, topK = 3, ollamaUrl = 'http://localhost:11434') {
    console.log(`🔍 Buscando chunks similares a: "${query.substring(0, 50)}..."`);
    
    // Generar embedding de la query
    const queryEmbedding = await generateEmbedding(query, ollamaUrl);
    
    // Calcular similitudes
    const chunksWithScores = chunks.map(chunk => ({
        ...chunk,
        similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));
    
    // Ordenar por similitud descendente y tomar top K
    const topChunks = chunksWithScores
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
    
    console.log(`✅ Encontrados ${topChunks.length} chunks relevantes`);
    topChunks.forEach((chunk, i) => {
        console.log(`  ${i + 1}. Similitud: ${(chunk.similarity * 100).toFixed(2)}% - ${chunk.text.substring(0, 60)}...`);
    });
    
    return topChunks;
}
