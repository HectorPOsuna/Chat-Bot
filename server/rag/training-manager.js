import fs from 'fs/promises';
import path from 'path';

/**
 * Gestor de prompts de entrenamiento (CRUD)
 */
export class TrainingManager {
    constructor(trainingFile) {
        this.trainingFile = trainingFile;
    }

    /**
     * Lee todos los prompts
     */
    async getAll() {
        try {
            const content = await fs.readFile(this.trainingFile, 'utf-8');
            const data = JSON.parse(content);
            return data.prompts;
        } catch (error) {
            return [];
        }
    }

    /**
     * Obtiene un prompt por ID
     */
    async getById(id) {
        const prompts = await this.getAll();
        return prompts.find(p => p.id === id);
    }

    /**
     * Crea un nuevo prompt
     */
    async create(promptData) {
        const prompts = await this.getAll();
        
        // Generar ID único
        const id = `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newPrompt = {
            id,
            question: promptData.question,
            variations: promptData.variations || [],
            answer: promptData.answer,
            category: promptData.category || 'general',
            enabled: promptData.enabled !== undefined ? promptData.enabled : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        prompts.push(newPrompt);
        await this.save(prompts);

        return newPrompt;
    }

    /**
     * Actualiza un prompt existente
     */
    async update(id, updates) {
        const prompts = await this.getAll();
        const index = prompts.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error(`Prompt ${id} no encontrado`);
        }

        prompts[index] = {
            ...prompts[index],
            ...updates,
            id: prompts[index].id, // No permitir cambiar el ID
            createdAt: prompts[index].createdAt, // No permitir cambiar fecha de creación
            updatedAt: new Date().toISOString()
        };

        await this.save(prompts);
        return prompts[index];
    }

    /**
     * Elimina un prompt
     */
    async delete(id) {
        const prompts = await this.getAll();
        const filtered = prompts.filter(p => p.id !== id);

        if (filtered.length === prompts.length) {
            throw new Error(`Prompt ${id} no encontrado`);
        }

        await this.save(filtered);
        return true;
    }

    /**
     * Obtiene prompts por categoría
     */
    async getByCategory(category) {
        const prompts = await this.getAll();
        return prompts.filter(p => p.category === category);
    }

    /**
     * Obtiene todas las categorías
     */
    async getCategories() {
        const prompts = await this.getAll();
        const categories = [...new Set(prompts.map(p => p.category))];
        return categories;
    }

    /**
     * Guarda los prompts en el archivo
     */
    async save(prompts) {
        const data = {
            prompts,
            metadata: {
                version: '1.0.0',
                lastUpdated: new Date().toISOString(),
                totalPrompts: prompts.length
            }
        };

        await fs.writeFile(this.trainingFile, JSON.stringify(data, null, 2), 'utf-8');
    }

    /**
     * Obtiene estadísticas
     */
    async getStats() {
        const prompts = await this.getAll();
        const categories = await this.getCategories();

        return {
            total: prompts.length,
            enabled: prompts.filter(p => p.enabled).length,
            disabled: prompts.filter(p => !p.enabled).length,
            categories: categories.length,
            categoryBreakdown: categories.map(cat => ({
                category: cat,
                count: prompts.filter(p => p.category === cat).length
            }))
        };
    }
}
