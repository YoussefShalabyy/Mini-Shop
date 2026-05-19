import { client } from './client';
import { Order } from '@/types';

export interface OrderItemInput {
  product_id: string;
  quantity: number;
}

export const ordersApi = {
  create: async (items: OrderItemInput[]) => {
    const res = await client.post('/orders', { items });
    return res.data as Order;
  },

  getMyOrders: async () => {
    const res = await client.get('/orders/my');
    return res.data as Order[];
  },
};
