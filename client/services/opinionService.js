import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';
import { getVisitorId } from './visitor.js';
const URL = `${API_URL}/api/opinion`; 

const visitorHeaders = () => ({ 'x-visitor-id': getVisitorId() });


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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opinionData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error adding opinion:', error);
        throw error;
    }
};

// 3. לייק (פעם אחת לכל מבקר). אם כבר נתן, השרת מחזיר 409.
export const addLikeToOpinion = async (id) => {
    try {
        const response = await fetch(`${URL}/${id}/likes`, {
            method: 'POST',
            headers: visitorHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error adding like:', error);
        throw error;
    }
};