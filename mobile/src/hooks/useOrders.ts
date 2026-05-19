import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrderItemInput } from '@/api/orders.api';

export const useMyOrders = () =>
  useQuery({
    queryKey: ['orders', 'my'],
    queryFn: ordersApi.getMyOrders,
  });

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: OrderItemInput[]) => ordersApi.create(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
