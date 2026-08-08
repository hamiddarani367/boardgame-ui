export interface WishlistItem {
  id: string;
  title: string;
  image: string;
  price: number;
  discountedPrice?: number;
  stockCount: number;
}

export async function getWishlistItems(): Promise<WishlistItem[]> {
  // فعلاً داده‌های نمونه – بعداً با fetch به API تغییر می‌کند
  return [
    {
      id: "catan",
      title: "کاتان",
      image: "/images/products/catan.jpg",
      price: 1800000,
      discountedPrice: 1350000,
      stockCount: 5,
    },
    {
      id: "wingspan",
      title: "وینگ‌اسپن",
      image: "/images/products/wingspan.jpg",
      price: 1900000,
      discountedPrice: 1450000,
      stockCount: 3,
    },
  ];
}

export async function removeWishlistItem(id: string): Promise<void> {
  // ارسال درخواست به API برای حذف
  console.log(`حذف آیتم ${id} از علاقه‌مندی‌ها`);
}