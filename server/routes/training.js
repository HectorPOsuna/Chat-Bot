import express from 'express';
import { TrainingManager } from '../rag/training-manager.js';
import path from 'path';

const router = express.Router();

// Inicializar Training Manager
const trainingFile = path.join(process.cwd(), 'data', 'training-prompts.json');
const trainingManager = new TrainingManager(trainingFile);

/**
 * GET /training
 * Lista todos los prompts de entrenamiento
 */
router.get('/', async (req, res) => {
    try {
        const prompts = await trainingManager.getAll();
        res.json({
            status: 'success',
            data: {
                prompts,
                total: prompts.length
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error al obtener prompts',
            details: error.message
        });
    }
});

/**
 * GET /training/stats
 * Obtiene estadísticas de prompts
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await trainingManager.getStats();
        res.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error al obtener estadísticas',
            details: error.message
        });
    }
});

/**
 * GET /training/categories
 * Lista todas las categorías
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await trainingManager.getCategories();
        res.json({
            status: 'success',
            data: { categories }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error al obtener categorías',
            details: error.message
        });
    }
});

/**
 * GET /training/:id
 * Obtiene un prompt específico
 */
router.get('/:id', async (req, res) => {
    try {
        const prompt = await trainingManager.getById(req.params.id);
        if (!prompt) {
            return res.status(404).json({
                status: 'error',
                error: 'Prompt no encontrado'
            });
        }
        res.json({
            status: 'success',
            data: prompt
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error al obtener prompt',
            details: error.message
        });
    }
});

/**
 * POST /training
 * Crea un nuevo prompt
 */
router.post('/', async (req, res) => {
    try {
        const { question, variations, answer, category, enabled } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                status: 'error',
                error: 'Faltan campos requeridos: question, answer'
            });
        }

        const newPrompt = await trainingManager.create({
            question,
            variations: variations || [],
            answer,
            category: category || 'general',
            enabled: enabled !== undefined ? enabled : true
        });

        // Recargar prompt matcher
        const { promptMatcher } = req.app.locals;
        if (promptMatcher) {
            await promptMatcher.reload();
        }

        res.status(201).json({
            status: 'success',
            data: {
                message: 'Prompt creado exitosamente',
                prompt: newPrompt
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Error al crear prompt',
            details: error.message
        });
    }
});

/**
 * PUT /training/:id
 * Actualiza un prompt existente
 */
router.put('/:id', async (req, res) => {
    try {
        const { question, variations, answer, category, enabled } = req.body;

        const updates = {};
        if (question !== undefined) updates.question = question;
        if (variations !== undefined) updates.variations = variations;
        if (answer !== undefined) updates.answer = answer;
        if (category !== undefined) updates.category = category;
        if (enabled !== undefined) updates.enabled = enabled;

        const updatedPrompt = await trainingManager.update(req.params.id, updates);

        // Recargar prompt matcher
        const { promptMatcher } = req.app.locals;
        if (promptMatcher) {
            await promptMatcher.reload();
        }

        res.json({
            status: 'success',
            data: {
                message: 'Prompt actualizado exitosamente',
                prompt: updatedPrompt
            }
        });
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            return res.status(404).json({
                status: 'error',
                error: error.message
            });
        }
        res.status(500).json({
            status: 'error',
            error: 'Error al actualizar prompt',
            details: error.message
        });
    }
});

/**
 * DELETE /training/:id
 * Elimina un prompt
 */
router.delete('/:id', async (req, res) => {
    try {
        await trainingManager.delete(req.params.id);

        // Recargar prompt matcher
        const { promptMatcher } = req.app.locals;
        if (promptMatcher) {
            await promptMatcher.reload();
        }

        res.json({
            status: 'success',
            data: {
                message: 'Prompt eliminado exitosamente',
                id: req.params.id
            }
        });
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            return res.status(404).json({
                status: 'error',
                error: error.message
            });
        }
        res.status(500).json({
            status: 'error',
            error: 'Error al eliminar prompt',
            details: error.message
        });
    }
});

export default router;
