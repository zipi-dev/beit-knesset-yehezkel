import { handleResponse } from './apiClient.js';
import { getAuthHeaders } from './authService.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/rabbis`;

//get all rabbis
export const getAllRabbis = async () => {
    const response = await fetch(URL);
    return await handleResponse(response);
};

// Update a rabbi's details (name, imageUrl, bio) - the server checks the permission
export const updateRabbi = async (id, data) => {
    const response = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return await handleResponse(response);
};