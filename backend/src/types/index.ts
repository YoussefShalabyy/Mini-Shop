// ── Auth ──────────────────────────────────────────────────────────────────
export interface JWTPayload {
  sub: string;       // Supabase user UUID
  email: string;
  aud: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'customer' | 'admin';
  created_at: string;
}

// ── Products ──────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// ── Orders ────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface OrderItemInput {
  product_id: string;
  quantity: number;
}
