import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';
import { getAuthHeaders } from './authService.js';

const URL = `${API_URL}/shiurim`;

/**
 * @param {Object} [filters={}] - Optional filters object for searching.
 * @returns {Promise<Object>} A promise resolving to the list of shiurim from the server.
 * Fetches all shiurim from the server based on the requested filters.
 */
const getAllShiurim = async (filters = {}) => {
    const params = new URLSearchParams();
    
// Append only non-empty filter values to the query parameters
    Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            params.append(key, filters[key]);
        }
    });

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${URL}${queryString}`);
    return await handleResponse(response);
};

/**
 * @param {string} id - The unique identifier of the shiur.
 * @returns {Promise<Object>} A promise resolving to the specific shiur data.
 * Fetches a single shiur by its unique ID from the server.
 */
const getShiurById = async (id) => {
    const response = await fetch(`${URL}/${id}`);
    return await handleResponse(response);
};

/**
 * @param {string} query - The search query string for title suggestions.
 * @returns {Promise<Array>} A promise resolving to an array of title suggestions, or an empty array.
 * Fetches title suggestions from the server matching the user's input query.
 */
const getTitlesSuggestions = async (query) => {
// Check if the query is empty or only whitespace
    if (!query || query.trim() === '') return [];
    
    const response = await fetch(`${URL}/suggestions?search=${encodeURIComponent(query.trim())}`);
    return await handleResponse(response);
};

/**
 * @param {string} id - The unique identifier of the shiur to delete.
 * @returns {Promise<Object>} A promise resolving to the server's deletion response.
 * Sends a delete request to the server for a specific shiur with auth headers.
 */
const deleteShiur = async (id) => {
    const response = await fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return await handleResponse(response); 
};

/**
 * @param {string} id - The unique identifier of the shiur to update.
 * @param {Object} data - The new data to update the shiur with.
 * @returns {Promise<Object>} A promise resolving to the server's update response.
 * Updates an existing shiur in the server for an authorized manager or the owning rabbi.
 */
const updateShiur = async (id, data) => {
    const response = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return await handleResponse(response); 
};

const addShiur = async (data) => {
    const response = await fetch(URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    return await handleResponse(response);
};

export { getAllShiurim, getShiurById, getTitlesSuggestions, deleteShiur, updateShiur,addShiur };