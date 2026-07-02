import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      const isAdminRequest = error.config?.url?.startsWith('/admin/');
      window.location.href = isAdminRequest ? '/admin-login' : '/signin';
    }
    return Promise.reject(error);
  }
);

export default API;