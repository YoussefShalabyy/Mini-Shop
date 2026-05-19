import { client } from './client';
import { Product, ProductsResponse, Category } from '@/types';

export interface ProductParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  getAll: async (params: ProductParams = {}) => {
    const res = await client.get('/products', { params });
    return res.data as ProductsResponse;
  },

  getById: async (id: string) => {
    const res = await client.get(`/products/${id}`);
    return res.data as Product;
  },

  getCategories: async () => {
    const res = await client.get('/products/categories');
    return res.data as Category[];
  },
};
