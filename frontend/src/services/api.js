import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Attach Auth JWT Token
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('nexcart_user')
      ? JSON.parse(localStorage.getItem('nexcart_user'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
