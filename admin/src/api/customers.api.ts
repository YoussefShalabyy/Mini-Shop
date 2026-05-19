import { api } from './client';
import { User, PaginatedResponse } from '@/types';

export const customersApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const { data } = await api.get<User[]>('/auth/users');
    let list = data;
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(u => u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 15;
    const total = list.length;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);
    return { data: paginated, total, page, limit } as PaginatedResponse<User>;
  },
};
