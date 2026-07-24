import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:5000/api'),
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      try {
        const { token } = JSON.parse(user);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse user from storage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
