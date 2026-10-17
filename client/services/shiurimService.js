import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/shiurim`;

//get all shiurim
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


//get shiur by id
const getShiurById = async (id) => {
    const response = await fetch(`${URL}/${id}`);
    return await handleResponse(response);
};

const getTitlesSuggestions = async (query) => {
// Check if the query is empty or only whitespace
    if (!query || query.trim() === '') return [];
    
    const response = await fetch(`${URL}/suggestions?search=${encodeURIComponent(query.trim())}`);
    return await handleResponse(response);
};

export { getAllShiurim, getShiurById, getTitlesSuggestions };