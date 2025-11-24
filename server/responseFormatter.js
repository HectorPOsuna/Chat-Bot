/**
 * Formats the API response to ensure consistency.
 * @param {boolean} success - Whether the request was successful.
 * @param {object|string} data - The data to return (or error message).
 * @param {string} [model] - The model used (optional).
 * @returns {object} - The formatted response object.
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
