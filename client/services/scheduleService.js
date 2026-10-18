import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/api/schedules`;

// 1. שליפת הלוח הפעיל בלבד (מה שהמתפללים רואים באתר)
export const getActiveSchedule = async () => {
    try {
        const response = await fetch(`${URL}/active`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching active schedule:', error);
        throw error;
    }
};

// 2. אופציונלי: שליפת כל הלוחות (אם הלקוח יכול לבחור לוח ארכיון לצפייה)
export const getAllSchedules = async () => {
    try {
        const response = await fetch(URL);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};