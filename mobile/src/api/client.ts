import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/store/auth.store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT to every request
client.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);
