import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';

const URL = `${API_URL}/shiurim`;

//get all shiurim
const getAllShiurim = async () => {
    const response = await fetch(URL);
    return await handleResponse(response);
};

//get shiur by id
const getShiurById = async (id) => {
    const response = await fetch(`${URL}/${id}`);
    return await handleResponse(response);
};

export { getAllShiurim, getShiurById };