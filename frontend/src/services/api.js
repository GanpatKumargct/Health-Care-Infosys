import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Profile APIs
export const getUserProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// Activity APIs
export const logActivity = (data) => api.post('/patient/activities', data);
export const getActivities = () => api.get('/patient/activities');

export default api;
