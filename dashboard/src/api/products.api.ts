import { api } from './client';
import { Product, PaginatedResponse } from '@/types';

export const productsApi = {
  list: async (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', { params });
    return data;
  },
  get: async (id: string) => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },
  create: async (payload: Partial<Product>) => {
    const { data } = await api.post<Product>('/products', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Product>) => {
    const { data } = await api.put<Product>(`/products/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
