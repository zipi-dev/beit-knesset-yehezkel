// client/services/eventService.js
import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';
import { getAuthHeaders } from './authService.js';

// חייב להתאים ל-app.js בשרת: app.use('/api/event', ...)
const URL = `${API_URL}/api/event`;

const jsonHeaders = { 'Content-Type': 'application/json' };

// ---------- לקוחות ----------

// כל האירועים (ממוינים לפי תאריך מהשרת)
export const getEvents = async () => {
    try {
        const response = await fetch(URL);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

// ---------- מנהל ----------

// אירוע בודד לפי מזהה (לטופס עריכה)
export const getEventById = async (id) => {
    try {
        const response = await fetch(`${URL}/${id}`, { headers: getAuthHeaders() });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching event with id ${id}:`, error);
        throw error;
    }
};

// הוספת אירוע. eventData: { name, eventDate, description: { text }, photographer, mediaUrl }
export const addEvent = async (eventData) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(eventData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error adding event:', error);
        throw error;
    }
};

// עדכון אירוע - שולחים את כל פרטי האירוע (השרת מאמת את כולם)
export const updateEvent = async (id, eventData) => {
    try {
        const response = await fetch(`${URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(eventData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error updating event with id ${id}:`, error);
        throw error;
    }
};

// מחיקת אירוע
export const deleteEvent = async (id) => {
    try {
        const response = await fetch(`${URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error deleting event with id ${id}:`, error);
        throw error;
    }
};
// העלאת תמונה לשרת (שמעלה אותה ל-Cloudinary). מחזיר { url, publicId }
// שימי לב: כאן לא שולחים Content-Type - הדפדפן מגדיר אותו לבד כשהגוף הוא FormData
export const uploadEventImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file); // השם 'image' חייב להתאים ל-.single('image') בשרת
        const token = localStorage.getItem('token');
        const response = await fetch(`${URL}/upload-image`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error uploading event image:', error);
        throw error;
    }
};
