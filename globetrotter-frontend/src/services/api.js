import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', new URLSearchParams(data), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getCurrentUser: () => api.get('/users/me'),
};

export const tripsAPI = {
  getAll: () => api.get('/trips/'),
  create: (data) => api.post('/trips/', data),
  getById: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
};

export const citiesAPI = {
  search: (query = '') => api.get(`/cities/?q=${query}`),
  getById: (id) => api.get(`/cities/${id}`),
};

export const activitiesAPI = {
  search: (query = '', category = '') => api.get(`/activities/?q=${query}&category=${category}`),
  getById: (id) => api.get(`/activities/${id}`),
};

export const itineraryAPI = {
  getStops: (tripId) => api.get(`/itinerary/${tripId}/stops`),
  addStop: (tripId, data) => api.post(`/itinerary/${tripId}/stops`, data),
  deleteStop: (stopId) => api.delete(`/itinerary/stops/${stopId}`),
  addActivity: (stopId, data) => api.post(`/itinerary/stops/${stopId}/activities`, data),
};

export const budgetAPI = {
  getAll: (tripId) => api.get(`/budget/${tripId}`),
  add: (tripId, data) => api.post(`/budget/${tripId}`, data),
  getSummary: (tripId) => api.get(`/budget/${tripId}/summary`),
};

export default api;
