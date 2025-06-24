import axios from 'axios';
import { SurpriseItem, NewSurpriseItem } from '../types';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://memory-lane-eight.vercel.app/api'
  : 'http://localhost:8000/api';

export const api = {
  // Get all items
  getAllItems: async (): Promise<SurpriseItem[]> => {
    const response = await axios.get(`${API_URL}/surprises/`);
    return response.data;
  },

  // Add a new item
  addItem: async (item: NewSurpriseItem): Promise<SurpriseItem> => {
    const response = await axios.post(`${API_URL}/surprises/`, item);
    return response.data;
  },

  // Get a random surprise
  getRandomSurprise: async (): Promise<SurpriseItem> => {
    const response = await axios.get(`${API_URL}/surprises/random/`);
    return response.data;
  },

  // Mark a surprise as viewed
  markSurpriseAsViewed: async (surpriseId: number): Promise<void> => {
    await axios.post(`${API_URL}/surprises/${surpriseId}/view/`);
  },
}; 