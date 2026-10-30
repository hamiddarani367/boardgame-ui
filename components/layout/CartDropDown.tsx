"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUpdateCartItem } from "@/hooks/useUpdateCartItem";
import { useRemoveCartItem } from "@/hooks/useRemoveCartItem";
import { useCartItemsDetails } from "@/hooks/useCartItemsDetails";
import { formatPrice } from "@/lib/utils";

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: cart, isLoading } = useCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  const cartItems = cart?.items ?? [];

  // دریافت جزئیات محصولات برای stock_count
  const { detailsMap } = useCartItemsDetails(cartItems);

  const totalItems = cart?.total_items ?? 0;
  const totalPrice = cart?.final_amount ?? 0;

  const closeDropdown = () => setIsOpen(false);

  const getMaxAllowed = (productId: number): number => {
    const product = detailsMap.get(productId);
    if (!product || typeof product.stock_count !== "number") {
      return Infinity;
    }
    return product.stock_count;
  };

  // ✅ تابع کاهش تعداد: اگر quantity = 1 بود، حذف کن
  const handleDecrement = (item: { id: number; quantity: number }) => {
    if (item.quantity <= 1) {
      // حذف آیتم
      removeItem(item.id);
    } else {
      // کاهش تعداد
      updateItem({
        itemId: item.id,
        quantity: item.quantity - 1,
      });
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/checkout/cart"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-blue-50 transition-colors"
        onClick={closeDropdown}
      >
        <ShoppingCart className="size-5" />
        {totalItems > 0 && (
          <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {totalItems}
          </span>
        )}
      </Link>

      <div
        className={`absolute left-0 top-full mt-2 w-80 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-1 invisible"
        }`}
      >
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <ShoppingCart className="mx-auto h-8 w-8 mb-2 text-gray-300" />
              <p className="text-sm">سبد خرید خالی است</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-72 overflow-y-auto">
                {cartItems.map((item) => {
                  const maxAllowed = getMaxAllowed(item.product_id);
                  const isMaxed =
                    maxAllowed !== Infinity && item.quantity >= maxAllowed;

                  return (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product_id}`}
                          className="text-sm font-bold text-gray-900 dark:text-white hover:text-blue-600 truncate block"
                          onClick={closeDropdown}
                        >
                          {item.product_name}
                        </Link>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1">
                            {/* ✅ کاهش با منطق حذف */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDecrement({
                                  id: item.id,
                                  quantity: item.quantity,
                                });
                              }}
                              className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                              aria-label={
                                item.quantity <= 1 ? "حذف" : "کاهش"
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </button>

                            <span className="text-xs font-bold w-5 text-center">
                              {item.quantity}
                            </span>

                            {/* افزایش با محدودیت */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (isMaxed) return;
                                updateItem({
                                  itemId: item.id,
                                  quantity: item.quantity + 1,
                                });
                              }}
                              disabled={isMaxed}
                              className={`p-0.5 rounded transition-colors ${
                                isMaxed
                                  ? "opacity-40 cursor-not-allowed"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                              title={
                                isMaxed
                                  ? `حداکثر موجودی ${maxAllowed} عدد است`
                                  : ""
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="text-xs font-bold">
                            {formatPrice(item.price)} تومان
                          </span>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeItem(item.id);
                            }}
                            className="text-red-500 hover:text-red-600 p-0.5"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        {isMaxed && (
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                            حداکثر موجودی: {maxAllowed} عدد
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center justify-between text-sm font-bold">
                <span>جمع کل</span>
                <span className="text-blue-600">
                  {formatPrice(totalPrice)} تومان
                </span>
              </div>
              <Link
                href="/checkout/cart"
                className="mt-3 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-sm transition-colors"
                onClick={closeDropdown}
              >
                مشاهده سبد خرید
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}