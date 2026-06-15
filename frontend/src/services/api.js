import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
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
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      toast.error(error.response.data.message || 'An error occurred');
    } else {
      toast.error('Network Error');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
};

export const accountAPI = {
  getProfile: () => API.get('/account/profile'),
  updateProfile: (data) => API.put('/account/update', data),
};

export const transactionAPI = {
  deposit: (data) => API.post('/transactions/deposit', data),
  withdraw: (data) => API.post('/transactions/withdraw', data),
  transfer: (data) => API.post('/transactions/transfer', data),
  getStatement: () => API.get('/transactions/statement'),
};

export default API;
