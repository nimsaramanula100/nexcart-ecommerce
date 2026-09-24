import axios from 'axios';

let rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  '/api';

if (!rawBaseUrl || rawBaseUrl === 'undefined' || rawBaseUrl.trim() === '') {
  rawBaseUrl = '/api';
}

// Normalize trailing slashes and ensure /api path prefix if missing from absolute backend URL
if (rawBaseUrl.startsWith('http')) {
  rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
  if (!rawBaseUrl.endsWith('/api')) {
    rawBaseUrl += '/api';
  }
}

const API = axios.create({
  baseURL: rawBaseUrl,
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
