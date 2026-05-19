import { api } from './client';
import { Category } from '@/types';

export const categoriesApi = {
  list: async () => {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },
  create: async (name: string) => {
    const { data } = await api.post<Category>('/categories', { name });
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },
};
