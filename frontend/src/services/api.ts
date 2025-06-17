import axios from 'axios';
import { SurpriseItem } from '../types';

const API_URL = 'http://localhost:8000/api';

export const api = {
  // Get all items
  getAllItems: async (): Promise<SurpriseItem[]> => {
    const response = await axios.get(`${API_URL}/surprise-items/`);
    return response.data;
  },

  // Add a new item
  addItem: async (item: Omit<SurpriseItem, 'id' | 'created_at'>): Promise<SurpriseItem> => {
    const response = await axios.post(`${API_URL}/surprise-items/`, item);
    return response.data;
  },

  // Get a random surprise
  getRandomSurprise: async (): Promise<SurpriseItem> => {
    const response = await axios.get(`${API_URL}/surprise-items/random/`);
    return response.data;
  },

  // Mark a surprise as viewed
  markSurpriseAsViewed: async (surpriseId: number): Promise<void> => {
    await axios.post(`${API_URL}/surprise-items/${surpriseId}/view/`);
  },
}; 