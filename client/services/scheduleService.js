import { handleResponse, ApiError } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/api/schedule`;

// 1. שליפת הלוח הפעיל בלבד (מה שהמתפללים רואים באתר)
export const getActiveSchedule = async () => {
    try {
        const response = await fetch(`${URL}/active`);
        return await handleResponse(response);
 } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    console.error('Error fetching active schedule:', error);
    throw error;
}
};

// 2.מנהל - שליפת כל הלוחות (למנהל בלבד)
export const getAllSchedules = async () => {
    try {
        const response = await fetch(URL);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};
//מנהל
export const getScheduleById = async (id) => {

    try {
        const response = await fetch(`${URL}/${id}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching schedule with id ${id}:`, error);
        throw error;
    }
};
//מנהל
export const createSchedule = async (scheduleData) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
            
        });

        return await handleResponse(response);
    } catch (error) {
        console.error('Error adding schedule:', error);
        throw error;
    }
};
//מנהל
export const updateSchedule = async (id, scheduleData) => {
    try {
        const response = await fetch(`${URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error updating schedule with id ${id}:`, error);
        throw error;
    }
};
//מנהל
export const deleteSchedule = async (id) => {
    try {
        const response = await fetch(`${URL}/${id}`, {
            method: 'DELETE'
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error deleting schedule with id ${id}:`, error);
        throw error;
    }
};
//מנהל
export const removePrayerFromSchedule = async (scheduleId, prayerId) => {
    try {
        const response = await fetch(`${URL}/${scheduleId}/prayer/${prayerId}`, {
            method: 'DELETE'
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error removing prayer from schedule:`, error);
        throw error;
    }
};
export const addPrayerToSchedule = async (scheduleId, prayer) => {
    try {
        const response = await fetch(`${URL}/${scheduleId}/prayer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prayer)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error adding prayer to schedule:', error);
        throw error;
    }
};