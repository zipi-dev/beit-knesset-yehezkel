import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/users`;

// Log in, and keep the token and the user details in the browser
export const login = async (username, password) => {
    const response = await fetch(`${URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(response); // { username, role, rabbiProfile, token }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
        username: data.username,
        role: data.role,
        rabbiProfile: data.rabbiProfile
    }));
    return data;
};

// Log out: remove everything that was saved at login
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// The logged-in user, or null if nobody is logged in
export const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
};

// Headers for requests that need a logged-in user
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};