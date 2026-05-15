import axios from 'axios';

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3000/api';

export const api = axios.create({ baseURL });

// Anexa o JWT em toda requisição se houver token salvo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Em caso de 401, derruba a sessão
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);
