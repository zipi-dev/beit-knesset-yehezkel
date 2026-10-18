import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/api/opinions`; 

// 1. קבלת כל חוות הדעת מהשרת
export const getOpinions = async () => {
    try {
        const response = await fetch(URL);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching opinions:', error);
        throw error;
    }
};

// 2. הוספת חוות דעת חדשה (POST)
export const addOpinion = async (opinionData) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(opinionData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error adding opinion:', error);
        throw error;
    }
};