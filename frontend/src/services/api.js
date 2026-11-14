import axios from 'axios';

// API service: resolve the Vite-configured backend base URL and share one Axios client.
// API සේවාව: Vite backend URL තෝරා පොදු Axios client එකක් නිර්මාණය කරයි.
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

// Request interceptor reads the cached AuthContext session and attaches its bearer token.
// Request interceptor සුරැකි AuthContext සැසිය කියවා bearer token එක එක් කරයි.
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
