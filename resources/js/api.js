// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // replace with your base API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch products with optional page param
export const fetchProducts = (page = 1) => {
  return api.get('/products', { params: { page } });
};

export default api;
