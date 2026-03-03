import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your local machine IP for iOS simulator to connect to backend
const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const farmerAPI = {
  getAll: (params?: any) => api.get('/farmers', { params }),
  getById: (id: string) => api.get(`/farmers/${id}`),
  create: (data: any) => api.post('/farmers', data),
  update: (id: string, data: any) => api.put(`/farmers/${id}`, data),
  verify: (id: string, status: string) =>
    api.patch(`/farmers/${id}/verify`, { verificationStatus: status }),
};

export const farmAPI = {
  getAll: (params?: any) => api.get('/farms', { params }),
  getById: (id: string) => api.get(`/farms/${id}`),
  create: (data: any) => api.post('/farms', data),
  update: (id: string, data: any) => api.put(`/farms/${id}`, data),
};

export const fispAPI = {
  checkEligibility: (data: any) => api.post('/fisp/check-eligibility', data),
  apply: (data: any) => api.post('/fisp/apply', data),
  getAll: (params?: any) => api.get('/fisp', { params }),
  generateVoucher: (id: string, data: any) =>
    api.post(`/fisp/${id}/vouchers`, data),
  redeemVoucher: (data: any) => api.post('/fisp/vouchers/redeem', data),
};

export const paymentAPI = {
  getAll: (params?: any) => api.get('/payments', { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  create: (data: any) => api.post('/payments', data),
  process: (id: string) => api.post(`/payments/${id}/process`),
};

export const logisticsAPI = {
  getAll: (params?: any) => api.get('/logistics', { params }),
  create: (data: any) => api.post('/logistics', data),
  updateStatus: (id: string, data: any) =>
    api.patch(`/logistics/${id}/logistics`, data),
  track: (trackingCode: string) => api.get(`/logistics/track/${trackingCode}`),
};

export const storageAPI = {
  getAll: (params?: any) => api.get('/storage', { params }),
  create: (data: any) => api.post('/storage', data),
  store: (id: string, data: any) => api.post(`/storage/${id}/store`, data),
  getInventory: (id: string) => api.get(`/storage/${id}/inventory`),
};

export const reportsAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getPayments: (params?: any) => api.get('/reports/payments', { params }),
  exportFarmers: () => api.get('/reports/farmers/export'),
};

export default api;
