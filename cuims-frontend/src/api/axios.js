import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cuims_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Don't redirect if it's the login or register page itself failing
    const isAuthRequest = err.config?.url?.includes('/auth/login') || err.config?.url?.includes('/auth/register');
    
    if (err.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('cuims_token');
      localStorage.removeItem('cuims_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;