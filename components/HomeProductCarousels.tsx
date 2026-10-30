"use client";

import { useApiQuery } from "@/hooks/useApi";
import ProductCarousel from "@/components/ProductCarousel";
import type { PaginatedProducts } from "@/types/product";

export default function HomeProductCarousels() {
  // پارامترها را مطابق API واقعی خود تنظیم کنید
  const discountQuery = useApiQuery<PaginatedProducts>(
    "/products",
    ["discount-products"],
    { filter: "discount", limit: 8 }
  );
  const bestsellerQuery = useApiQuery<PaginatedProducts>(
    "/products",
    ["bestseller-products"],
    { filter: "bestseller", limit: 8 }
  );
  const newQuery = useApiQuery<PaginatedProducts>(
    "/products",
    ["new-products"],
    { filter: "newest", limit: 8 }
  );

  const discountProducts = discountQuery.data?.products ?? [];
  const bestsellerProducts = bestsellerQuery.data?.products ?? [];
  const newProducts = newQuery.data?.products ?? [];

  return (
    <>
      {discountProducts.length > 0 && (
        <ProductCarousel
          title="تخفیف‌های ویژه"
          subtitle="با قیمت‌های استثنایی"
          icon="🔥"
          products={discountProducts}
          variant="discount"
        />
      )}
      {bestsellerProducts.length > 0 && (
        <ProductCarousel
          title="پرفروش‌ترین‌ها"
          subtitle="محبوب‌ترین بازی‌ها"
          icon="⭐"
          products={bestsellerProducts}
          variant="bestseller"
        />
      )}
      {newProducts.length > 0 && (
        <ProductCarousel
          title="جدیدترین‌ها"
          subtitle="تازه‌های فروشگاه"
          icon="✨"
          products={newProducts}
          variant="new"
        />
      )}
    </>
  );
}