import { useQuery } from '@tanstack/react-query';
import { productsApi, ProductParams } from '@/api/products.api';

export const useProducts = (params: ProductParams = {}) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories,
    staleTime: 1000 * 60 * 10, // categories rarely change — cache 10 min
  });
