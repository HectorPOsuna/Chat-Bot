import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const pdfsDir = path.join(process.cwd(), 'data', 'pdfs');
        await fs.mkdir(pdfsDir, { recursive: true });
        cb(null, pdfsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    }
});

/**
 * POST /documents/upload
 * Sube y procesa un PDF
 */
router.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                error: 'No se proporcionó ningún archivo PDF'
            });
        }

        const { ragEngine } = req.app.locals;
        
        console.log(`📤 Subiendo PDF: ${req.file.originalname}`);
        
        // Procesar el PDF completo
        const result = await ragEngine.processPDFComplete(req.file.path);

        res.json({
            status: 'success',
            data: {
                message: 'PDF procesado exitosamente',
                document: result
            }
        });

    } catch (error) {
        console.error('Error procesando PDF:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error al procesar el PDF',
            details: error.message
        });
    }
});

/**
 * GET /documents
 * Lista todos los documentos procesados
 */
router.get('/', async (req, res) => {
    try {
        const { ragEngine } = req.app.locals;
        const stats = await ragEngine.getStats();

        res.json({
            status: 'success',
            data: stats
        });

    } catch (error) {
        console.error('Error obteniendo documentos:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error al obtener documentos',
            details: error.message
        });
    }
});

/**
 * DELETE /documents/:id
 * Elimina un documento
 */
router.delete('/:id', async (req, res) => {
    try {
        const { ragEngine } = req.app.locals;
        const { id } = req.params;

        const deleted = await ragEngine.deleteDocument(id);

        if (deleted) {
            res.json({
                status: 'success',
                data: {
                    message: 'Documento eliminado exitosamente',
                    id
                }
            });
        } else {
            res.status(404).json({
                status: 'error',
                error: 'Documento no encontrado'
            });
        }

    } catch (error) {
        console.error('Error eliminando documento:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error al eliminar documento',
            details: error.message
        });
    }
});

/**
 * POST /documents/search
 * Busca contexto relevante para una query
 */
router.post('/search', async (req, res) => {
    try {
        const { query, topK = 3 } = req.body;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                error: 'Falta el parámetro "query"'
            });
        }

        const { ragEngine } = req.app.locals;
        const results = await ragEngine.searchContext(query, topK);

        res.json({
            status: 'success',
            data: {
                query,
                results: results.map(r => ({
                    text: r.text,
                    similarity: (r.similarity * 100).toFixed(2) + '%',
                    docFilename: r.docFilename,
                    chunkId: r.id
                }))
            }
        });

    } catch (error) {
        console.error('Error buscando contexto:', error);
        res.status(500).json({
            status: 'error',
            error: 'Error al buscar contexto',
            details: error.message
        });
    }
});

export default router;
