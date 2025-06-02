import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // update if needed
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const loginUser = (credentials) => {
  return api.post('/login', credentials);
};

export const logoutUser = () => {
  return api.post('/logout');
};

// Order functions
export const getOrder = (orderId) => {
  return api.get(`/orders/${orderId}`);
};

export const updateOrderItem = (orderId, productId, data) => {
  return api.put(`/orders/${orderId}/items/${productId}`, data);
};

export const removeOrderItem = (orderId, productId) => {
  return api.delete(`/orders/${orderId}/items/${productId}`);
};

export const confirmOrder = (orderId) => {
  return api.post(`/orders/${orderId}/confirm`);
};

// Product functions
export const getProducts = (params = {}) => {
  return api.get('/products', { params });
};

export const getProduct = (productId) => {
  return api.get(`/products/${productId}`);
};

// User functions
export const getUserProfile = () => {
  return api.get('/user/profile');
};

export const updateUserProfile = (data) => {
  return api.put('/user/profile', data);
};

// Cart/Order creation functions
export const createOrder = (data) => {
  return api.post('/orders', data);
};

export const addToCart = (orderId, productData) => {
  return api.post(`/orders/${orderId}/items`, productData);
};

// Export the api instance as default for direct use
export default api;
