import { SupabaseClient } from '@supabase/supabase-js';
import { CreateOrderInput, UpdateOrderStatusInput } from './orders.schema';

export const ordersService = {

  async create(supabase: SupabaseClient, userId: string, input: CreateOrderInput) {
    // 1. Fetch all products to get their current prices
    const productIds = input.items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, price, name, is_active')
      .in('id', productIds);

    if (productsError) throw new Error(productsError.message);

    // 2. Validate all products exist and are active
    for (const item of input.items) {
      const product = products?.find((p) => p.id === item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      if (!product.is_active) throw new Error(`Product "${product.name}" is no longer available`);
    }

    // 3. Calculate total
    const total_amount = input.items.reduce((sum, item) => {
      const product = products!.find((p) => p.id === item.product_id)!;
      return sum + product.price * item.quantity;
    }, 0);

    // 4. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, total_amount, status: 'pending' })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    // 5. Insert order items
    const orderItems = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: products!.find((p) => p.id === item.product_id)!.price,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    return { ...order, items: orderItems };
  },

  async getMyOrders(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(id, name, image_url))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getAllOrders(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(id, name))')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async updateStatus(
    supabase: SupabaseClient,
    orderId: string,
    input: UpdateOrderStatusInput
  ) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: input.status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};
