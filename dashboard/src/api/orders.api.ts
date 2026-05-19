import { api } from './client';
import { Order, OrderStatus, PaginatedResponse } from '@/types';

export const ordersApi = {
  list: async (params?: { status?: OrderStatus; page?: number; limit?: number }) => {
    const { data } = await api.get<Order[]>('/orders');
    let list = data;
    if (params?.status && params.status !== 'all' as any) {
      list = list.filter(o => o.status === params.status);
    }
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 12;
    const total = list.length;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);
    return { data: paginated, total, page, limit } as PaginatedResponse<Order>;
  },
  get: async (id: string) => {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },
  updateStatus: async (id: string, status: OrderStatus) => {
    const { data } = await api.patch<Order>(`/orders/${id}/status`, { status });
    return data;
  },
};
