export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;                 // قیمت اصلی
  discounted_price: number | null; // قیمت با تخفیف (null = بدون تخفیف)
  quantity: number;
  total_price: number;           // قیمت فروش × تعداد
  savings: number;               // سود مشتری برای این آیتم
}

export interface Cart {
  order_id: number;
  guest_token?: string;
  items: CartItem[];
  total_items: number;
  total_amount: number;          // جمع قیمت اصلی
  total_savings: number;         // مجموع تخفیف محصولات
  discount_id?: number;          // شناسه کد تخفیف اعمال‌شده
  discount_code?: string;        // کد تخفیف اعمال‌شده
  discount_amount: number;       // تخفیف کد
  final_amount: number;          // مبلغ نهایی (بدون ارسال)
}

export interface ApplyDiscountResponse {
  discount_id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  total_amount: number;
  total_savings: number;
  discount_amount: number;
  final_amount: number;
}