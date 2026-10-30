"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";
import { useWishlist } from "@/hooks/useWishlist";
import { useRemoveFromWishlist } from "@/hooks/useRemoveFromWishlist";

export default function WishlistPage() {
  const { data, isLoading, isError } = useWishlist({ page: 1, page_size: 20 });
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveFromWishlist();

  const items = data?.wishlists ?? [];

  const handleRemove = (productId: number) => {
    removeFromWishlist(productId);
  };

  // ---- Loading ----
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i} className="border-gray-200 dark:border-gray-800">
            <CardContent className="p-3">
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-14 w-14 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ---- Error ----
  if (isError) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-8 text-center">
          <p className="text-red-500">خطا در دریافت لیست علاقه‌مندی‌ها</p>
        </CardContent>
      </Card>
    );
  }

  // ---- Empty ----
  if (items.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-8 text-center text-gray-500">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-4">
            لیست علاقه‌مندی‌های شما خالی است
          </p>
          <Link href="/products">
            <Button
              variant="outline"
              className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <ShoppingBag className="h-4 w-4 ml-1" />
              مشاهده محصولات
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // ---- List ----
  return (
    <div>
      {/* هدر با تعداد */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {data?.total ?? 0} محصول در لیست علاقه‌مندی‌ها
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;

          const hasDiscount =
            product.discounted_price != null &&
            product.discounted_price > 0 &&
            product.discounted_price < product.price;

          return (
            <Card
              key={item.id}
              className="border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-3">
                <div className="grid grid-cols-[56px_1fr_auto] lg:grid-cols-[56px_1fr_auto_auto] gap-3 items-center">
                  {/* تصویر */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* اطلاعات محصول */}
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-sm text-gray-900 dark:text-white truncate block hover:text-blue-600"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {hasDiscount ? (
                        <>
                          <span className="text-blue-600 font-bold text-sm">
                            {formatPrice(product.discounted_price!)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">تومان</span>
                    </div>

                    {/* وضعیت موجودی */}
                    {!product.enabled || product.stock_count === 0 ? (
                      <p className="text-[11px] text-red-500 mt-1">
                        ⚠️ این محصول ناموجود است
                      </p>
                    ) : product.stock_count < 5 ? (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                        تنها {product.stock_count} عدد باقی مانده
                      </p>
                    ) : null}
                  </div>

                  {/* دکمه حذف (موبایل) */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={isRemoving}
                    className="text-red-500 hover:text-red-600 p-1 lg:hidden cursor-pointer disabled:opacity-50"
                    aria-label="حذف از علاقه‌مندی‌ها"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* دکمه افزودن به سبد (دسکتاپ) */}
                  <div className="hidden lg:block w-[180px]">
                    <AddToCartButton
                      id={product.id}
                      stock_count={product.stock_count}
                    />
                  </div>

                  {/* دکمه حذف (دسکتاپ) */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={isRemoving}
                    className="hidden lg:flex items-center justify-center text-red-500 hover:text-red-600 p-1 cursor-pointer disabled:opacity-50"
                    aria-label="حذف از علاقه‌مندی‌ها"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* دکمه افزودن به سبد (موبایل) */}
                <div className="mt-3 lg:hidden">
                  <AddToCartButton
                    id={product.id}
                    stock_count={product.stock_count}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}