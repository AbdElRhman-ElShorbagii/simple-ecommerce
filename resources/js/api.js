import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // update if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login function
export const loginUser = (credentials) => {
  return api.post('/login', credentials);
};
