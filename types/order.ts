export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  price: number;
  discounted_price?: number;
  savings?: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "canceled" | "refunded";
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  gateway_id: number;
  address_id: number;
  total_savings: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}