import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials) => {
    // FastAPI OAuth2 expects form data with 'username' field
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
};

export const tripsAPI = {
  create: (data) => api.post('/trips', data),
  getAll: () => api.get('/trips'),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
};

export const citiesAPI = {
  search: (query) => api.get('/cities/search', { params: { q: query } }),
  getById: (id) => api.get(`/cities/${id}`),
};

export const itineraryAPI = {
  getStops: (tripId) => api.get(`/trips/${tripId}/itinerary`),
  addStop: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  updateStop: (stopId, data) => api.put(`/stops/${stopId}`, data),
  deleteStop: (stopId) => api.delete(`/stops/${stopId}`),
  addActivity: (stopId, data) => api.post(`/stops/${stopId}/activities`, data),
  removeActivity: (stopId, activityId) => api.delete(`/stops/${stopId}/activities/${activityId}`),
};

export const activitiesAPI = {
  search: (query, category) => {
    const params = {};
    if (query) params.q = query;
    if (category) params.category = category;
    return api.get('/activities/search', { params });
  },
  getById: (id) => api.get(`/activities/${id}`),
};

export const budgetAPI = {
  getSummary: (tripId) => api.get(`/trips/${tripId}/budget`),
  updateBudget: (tripId, data) => api.put(`/trips/${tripId}/budget`, data),
};

export default api;
