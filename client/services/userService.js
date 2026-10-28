import { handleResponse } from './apiClient.js';
import { getAuthHeaders } from './authService.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/users`;

// Register a new user. Only the main manager may do this (the server checks the token)
const registerUser = async (data) => {
    const response = await fetch(`${URL}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return await handleResponse(response); // returns the new user
};

// All the users (only the main manager may do this)
const getAllUsers = async () => {
    const response = await fetch(URL, { headers: getAuthHeaders() });
    return await handleResponse(response);
};

// Delete a user (the server also deletes his rabbi profile and his shiurim)
const deleteUser = async (id) => {
    const response = await fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return await handleResponse(response);
};

export { registerUser, getAllUsers, deleteUser };

