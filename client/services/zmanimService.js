import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/api/zmanim`;

/**
 * שליפת זמני השבת והיום עבור הערים מהשרת
 * @returns {Promise<Array>} מערך אובייקטים של זמנים לכל עיר
 */
export const getZmanim = async () => {
    try {
        const response = await fetch(URL);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching zmanim:', error);
        throw error;
    }
};