import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/rabbis`;
//get all rabbis
export const getAllRabbis = async () => {
    const response = await fetch(URL);
    return await handleResponse(response);
};
