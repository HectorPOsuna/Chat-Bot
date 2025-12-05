import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';

/**
 * Procesa un archivo PDF y extrae su texto
 * @param {string} pdfPath - Ruta al archivo PDF
 * @returns {Promise<Object>} - Objeto con texto y metadata
 */
export async function extractTextFromPDF(pdfPath) {
    try {
        const dataBuffer = await fs.readFile(pdfPath);
        const data = await pdfParse(dataBuffer);

        return {
            text: data.text,
            numPages: data.numpages,
            info: data.info,
            metadata: data.metadata
        };
    } catch (error) {
        console.error(`Error procesando PDF ${pdfPath}:`, error);
        throw new Error(`Error al procesar PDF: ${error.message}`);
    }
}

/**
 * Limpia y normaliza el texto extraído
 * @param {string} text - Texto a limpiar
 * @returns {string} - Texto limpio
 */
export function cleanText(text) {
    return text
        // Eliminar múltiples espacios en blanco
        .replace(/\s+/g, ' ')
        // Eliminar espacios al inicio y final de líneas
        .replace(/^\s+|\s+$/gm, '')
        // Normalizar saltos de línea
        .replace(/\n{3,}/g, '\n\n')
        // Eliminar caracteres especiales problemáticos
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
        .trim();
}

/**
 * Procesa un PDF y guarda el resultado en JSON
 * @param {string} pdfPath - Ruta al PDF
 * @param {string} outputDir - Directorio de salida
 * @returns {Promise<Object>} - Información del documento procesado
 */
export async function processPDF(pdfPath, outputDir) {
    const filename = path.basename(pdfPath, '.pdf');
    const docId = `doc_${Date.now()}_${filename}`;

    console.log(`📄 Procesando PDF: ${filename}`);

    // Extraer texto
    const extracted = await extractTextFromPDF(pdfPath);
    const cleanedText = cleanText(extracted.text);

    // Crear documento procesado
    const processedDoc = {
        id: docId,
        filename: path.basename(pdfPath),
        uploadedAt: new Date().toISOString(),
        numPages: extracted.numPages,
        textLength: cleanedText.length,
        text: cleanedText,
        metadata: {
            info: extracted.info,
            pdfMetadata: extracted.metadata
        }
    };

    // Guardar JSON
    const outputPath = path.join(outputDir, `${docId}.json`);
    await fs.writeFile(outputPath, JSON.stringify(processedDoc, null, 2), 'utf-8');

    console.log(`✅ PDF procesado: ${outputPath}`);

    return {
        id: docId,
        filename: processedDoc.filename,
        numPages: processedDoc.numPages,
        textLength: processedDoc.textLength,
        outputPath
    };
}

/**
 * Lista todos los documentos procesados
 * @param {string} processedDir - Directorio de documentos procesados
 * @returns {Promise<Array>} - Lista de documentos
 */
export async function listProcessedDocuments(processedDir) {
    try {
        const files = await fs.readdir(processedDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        const documents = await Promise.all(
            jsonFiles.map(async (file) => {
                const content = await fs.readFile(path.join(processedDir, file), 'utf-8');
                const doc = JSON.parse(content);
                return {
                    id: doc.id,
                    filename: doc.filename,
                    uploadedAt: doc.uploadedAt,
                    numPages: doc.numPages,
                    textLength: doc.textLength
                };
            })
        );

        return documents;
    } catch (error) {
        console.error('Error listando documentos:', error);
        return [];
    }
}

/**
 * Elimina un documento procesado
 * @param {string} docId - ID del documento
 * @param {string} processedDir - Directorio de documentos procesados
 * @returns {Promise<boolean>} - True si se eliminó correctamente
 */
export async function deleteDocument(docId, processedDir) {
    try {
        const filePath = path.join(processedDir, `${docId}.json`);
        await fs.unlink(filePath);
        console.log(`🗑️ Documento eliminado: ${docId}`);
        return true;
    } catch (error) {
        console.error(`Error eliminando documento ${docId}:`, error);
        return false;
    }
}
