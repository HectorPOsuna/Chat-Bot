import natural from 'natural';

const { SentenceTokenizer } = natural;
const tokenizer = new SentenceTokenizer();

/**
 * Divide el texto en chunks de tamaño aproximado
 * @param {string} text - Texto a dividir
 * @param {number} chunkSize - Tamaño aproximado de cada chunk en caracteres
 * @param {number} overlap - Overlap entre chunks en caracteres
 * @returns {Array<Object>} - Array de chunks con metadata
 */
export function chunkText(text, chunkSize = 1000, overlap = 200) {
    const sentences = tokenizer.tokenize(text);
    const chunks = [];
    let currentChunk = '';
    let chunkIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        
        // Si agregar la oración excede el tamaño del chunk
        if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
            chunks.push({
                id: `chunk_${chunkIndex}`,
                text: currentChunk.trim(),
                index: chunkIndex,
                length: currentChunk.length
            });
            
            chunkIndex++;
            
            // Crear overlap: tomar las últimas oraciones del chunk anterior
            const overlapText = getOverlapText(currentChunk, overlap);
            currentChunk = overlapText + ' ' + sentence;
        } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
    }

    // Agregar el último chunk si existe
    if (currentChunk.trim().length > 0) {
        chunks.push({
            id: `chunk_${chunkIndex}`,
            text: currentChunk.trim(),
            index: chunkIndex,
            length: currentChunk.length
        });
    }

    return chunks;
}

/**
 * Obtiene el texto de overlap del final de un chunk
 * @param {string} text - Texto del chunk
 * @param {number} overlapSize - Tamaño del overlap
 * @returns {string} - Texto de overlap
 */
function getOverlapText(text, overlapSize) {
    if (text.length <= overlapSize) {
        return text;
    }
    
    // Tomar los últimos N caracteres y buscar el inicio de la última oración completa
    const overlapText = text.slice(-overlapSize);
    const lastPeriod = overlapText.lastIndexOf('. ');
    
    if (lastPeriod !== -1) {
        return overlapText.slice(lastPeriod + 2);
    }
    
    return overlapText;
}

/**
 * Procesa un documento y genera chunks con embeddings
 * @param {Object} document - Documento procesado
 * @param {number} chunkSize - Tamaño de cada chunk
 * @param {number} overlap - Overlap entre chunks
 * @returns {Object} - Documento con chunks
 */
export function processDocumentChunks(document, chunkSize = 1000, overlap = 200) {
    console.log(`✂️ Dividiendo documento en chunks: ${document.filename}`);
    
    const chunks = chunkText(document.text, chunkSize, overlap);
    
    console.log(`✅ Generados ${chunks.length} chunks`);
    
    return {
        ...document,
        chunks: chunks.map(chunk => ({
            ...chunk,
            docId: document.id,
            docFilename: document.filename
        })),
        chunkingConfig: {
            chunkSize,
            overlap,
            totalChunks: chunks.length
        }
    };
}

/**
 * Estadísticas de chunking
 * @param {Array<Object>} chunks - Array de chunks
 * @returns {Object} - Estadísticas
 */
export function getChunkStats(chunks) {
    const lengths = chunks.map(c => c.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const minLength = Math.min(...lengths);
    const maxLength = Math.max(...lengths);
    
    return {
        totalChunks: chunks.length,
        avgLength: Math.round(avgLength),
        minLength,
        maxLength
    };
}
