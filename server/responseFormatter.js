/**
 * Da formato a la respuesta de la API para asegurar consistencia.
 * @param {boolean} success - Indica si la solicitud fue exitosa.
 * @param {object|string} data - Los datos a devolver (o mensaje de error).
 * @param {string} [model] - El modelo utilizado (opcional).
 * @returns {object} - El objeto de respuesta formateado.
 */
export const formatResponse = (success, data, model = null) => {
    const timestamp = new Date().toISOString();
    
    if (success) {
        return {
            status: "success",
            data: {
                reply: data,
                model: model,
                timestamp: timestamp
            }
        };
    } else {
        return {
            status: "error",
            error: {
                message: data.message || data,
                details: data.details || null,
                timestamp: timestamp
            }
        };
    }
};
