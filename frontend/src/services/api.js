import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
