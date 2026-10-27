// client/services/eventService.js
import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

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
        const response = await fetch(`${URL}/${id}`);
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
            headers: jsonHeaders,
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
            headers: jsonHeaders,
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
        const response = await fetch(`${URL}/${id}`, { method: 'DELETE' });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error deleting event with id ${id}:`, error);
        throw error;
    }
};