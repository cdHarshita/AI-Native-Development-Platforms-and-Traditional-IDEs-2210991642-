export type Role = "buyer" | "seller";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: string;
}

export interface JWTPayload {
  sub: string;       // user id
  email: string;
  name: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface Product {
  id: string;
  seller_id: string;
  seller_name?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
}

export type OrderStatus = "pending" | "shipped" | "delivered";

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: string;
  order_id: string;
  product_id: string;
  buyer_id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  buyer_name?: string;
  buyer_email?: string;
  seller_id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  total_products: number;
  recent_orders: Order[];
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
