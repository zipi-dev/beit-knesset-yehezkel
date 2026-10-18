// client/services/eventService.js

import { handleResponse } from './apiClient.js';
import { API_URL } from '../config.js';
const URL = `${API_URL}/api/events`; 

export const getEvents = async () => {
  try {
    const response = await fetch(URL);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
export const getEventById = async (id) => {
  try {
    const response = await fetch(`${URL}/${id}`);
    return handleResponse(response);
    } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
    }
};
