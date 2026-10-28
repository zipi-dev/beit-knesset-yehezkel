import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';
import { getAuthHeaders } from './authService.js';

const URL = `${API_URL}/blessings`;

// השרת מחזיר { success: true, data: [...] } - כאן מחלצים את המערך
const extractList = (result) => (Array.isArray(result) ? result : (result?.data ?? []));

// לקוחות: הברכות האחרונות
export const getBlessings = async () => {
    try {
        const response = await fetch(URL);
        return extractList(await handleResponse(response));
    } catch (error) {
        console.error('Error fetching blessings:', error);
        throw error;
    }
};

// לקוחות: הוספת בקשת ברכה { name, motherName, blessingType }
export const createBlessing = async (blessingData) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blessingData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error creating blessing:', error);
        throw error;
    }
};

// ---------- מנהל ----------
export const getAllBlessingsAdmin = async () => {
    const response = await fetch(`${URL}/admin/all`, { headers: getAuthHeaders() });
    return extractList(await handleResponse(response));
};

export const deleteBlessing = async (id) => {
    const response = await fetch(`${URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    return await handleResponse(response);
};
