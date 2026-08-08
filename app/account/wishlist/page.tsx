"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/utils";
import { getWishlistItems, removeWishlistItem, type WishlistItem } from "@/lib/wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlistItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (id: string) => {
    await removeWishlistItem(id);          // فراخوانی متد حذف
    setItems((prev) => prev.filter((item) => item.id !== id)); // حذف از UI
  };

  if (loading) {
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

  return (
    <div>
      {items.length === 0 ? (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-8 text-center text-gray-500">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">لیست علاقه‌مندی‌های شما خالی است</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="border-gray-200 dark:border-gray-800 overflow-hidden">
              <CardContent className="p-3">
                <div className="grid grid-cols-[56px_1fr_auto] lg:grid-cols-[56px_1fr_auto_auto] gap-3 items-center">
                  
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.discountedPrice ? (
                        <>
                          <span className="text-blue-600 font-bold text-sm">
                            {formatPrice(item.discountedPrice)} تومان
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(item.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {formatPrice(item.price)} تومان
                        </span>
                      )}
                    </div>
                  </div>

                  {/* دکمه حذف (موبایل) */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-600 p-1 lg:hidden cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* دکمه افزودن به سبد (دسکتاپ) */}
                  <div className="hidden lg:block w-[180px]">
                    <AddToCartButton
                      id={item.id}
                      title={item.title}
                      persianTitle={item.title}
                      image={item.image}
                      price={item.price}
                      discountedPrice={item.discountedPrice}
                      stockCount={item.stockCount}
                    />
                  </div>

                  {/* دکمه حذف (دسکتاپ) */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="hidden lg:flex items-center justify-center text-red-500 hover:text-red-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 lg:hidden">
                  <AddToCartButton
                    id={item.id}
                    title={item.title}
                    persianTitle={item.title}
                    image={item.image}
                    price={item.price}
                    discountedPrice={item.discountedPrice}
                    stockCount={item.stockCount}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}