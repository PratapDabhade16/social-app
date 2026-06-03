import axios from 'axios';

export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const IMAGE_BASE = API_BASE.replace(/\/api$/, '');

const API = axios.create({
  baseURL: API_BASE
});

// Attach token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;