export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  address: string;
  paymentMethod: string;
  trackingCode: string;
}

export async function getOrders(): Promise<Order[]> {
  return [
    {
      id: "ORD-001",
      date: "۱۴۰۴/۰۵/۰۶",
      status: "تحویل شده",
      total: 2450000,
      items: [
        { title: "کاتان", quantity: 1, price: 1350000, image: "/images/products/catan.jpg" },
        { title: "براس بیرمنگام", quantity: 1, price: 1100000, image: "/images/products/brass.jpg" },
      ],
      address: "تهران، خیابان ولیعصر، کوچه نسترن، پلاک ۱۲",
      paymentMethod: "پرداخت آنلاین (زرین‌پال)",
      trackingCode: "1234567890",
    },
    {
      id: "ORD-002",
      date: "۱۴۰۴/۰۵/۰۴",
      status: "در حال ارسال",
      total: 1350000,
      items: [
        { title: "وینگ‌اسپن", quantity: 1, price: 1350000, image: "/images/products/wingspan.jpg" },
      ],
      address: "تهران، سعادت‌آباد، بلوار دریا، پلاک ۴۵",
      paymentMethod: "پرداخت در محل",
      trackingCode: "0987654321",
    },
  ];
}

export interface PlaceOrderRequest {
  addressId: string;
  deliveryOptionId: string;
  discountCode?: string;
}

export interface PlaceOrderResponse {
  orderId: string;
  paymentUrl: string;
}

export async function submitOrder(data: PlaceOrderRequest): Promise<PlaceOrderResponse> {
  console.log("[Orders API] ثبت سفارش با داده:", data);
  // شبیه‌سازی تاخیر
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    orderId: `ORD-${Date.now()}`,
    paymentUrl: `https://payment.example.com/pay?order=${Date.now()}`,
  };
}