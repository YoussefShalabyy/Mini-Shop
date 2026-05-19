// All shared TypeScript types for the mobile app

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  categories?: Category;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: { id: string; name: string; image_url: string | null };
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  order_items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
