"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Plus, Minus, Check } from "lucide-react";
import { useState } from "react";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useCart } from "@/hooks/useCart";
import { useUpdateCartItem } from "@/hooks/useUpdateCartItem";
import { useRemoveCartItem } from "@/hooks/useRemoveCartItem";

interface AddToCartButtonProps {
  id: number;
  stock_count?: number;
}

export default function AddToCartButton({
  id,
  stock_count,
}: AddToCartButtonProps) {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveCartItem();

  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart?.items?.find((item) => item.product_id === id);
  const quantity = cartItem?.quantity ?? 0;

  const isOutOfStock = stock_count === 0;
  const isMaxed =
    typeof stock_count === "number" && quantity >= stock_count;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(
      { product_id: id, quantity: 1 },
      {
        onSuccess: () => {
          setJustAdded(true);
          setTimeout(() => setJustAdded(false), 1500);
        },
        onError: (err) => console.error("Add error:", err),
      }
    );
  };

  const handleIncrement = () => {
    if (!cartItem || isMaxed) return;
    updateItem(
      { itemId: cartItem.id, quantity: quantity + 1 },
      { onError: (err) => console.error("Update error:", err) }
    );
  };

  // ✅ منطق کاهش: اگر quantity = 1 بود، حذف کن
  const handleDecrement = () => {
    if (!cartItem) return;

    if (quantity <= 1) {
      // حذف آیتم (چون backend با quantity=0 خطا می‌دهد)
      removeItem(cartItem.id, {
        onError: (err) => console.error("Remove error:", err),
      });
      return;
    }

    updateItem(
      { itemId: cartItem.id, quantity: quantity - 1 },
      { onError: (err) => console.error("Update error:", err) }
    );
  };

  if (cartLoading) {
    return (
      <div className="w-full h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isOutOfStock) {
    return (
      <Button
        disabled
        className="w-full h-12 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-500 font-bold text-base cursor-not-allowed"
      >
        ناموجود
      </Button>
    );
  }

  if (!cartItem) {
    return (
      <Button
        disabled={isAdding}
        onClick={handleAdd}
        className={`w-full h-12 rounded-xl text-white font-bold text-base shadow-sm hover:shadow-md transition-all ${
          justAdded
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isAdding ? (
          <>
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            در حال افزودن...
          </>
        ) : justAdded ? (
          <>
            <Check className="ml-2 h-5 w-5" strokeWidth={2.5} />
            به سبد اضافه شد
          </>
        ) : (
          <>
            <ShoppingCart className="ml-2 h-5 w-5" />
            افزودن به سبد خرید
          </>
        )}
      </Button>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full h-12 rounded-xl bg-blue-600 text-white overflow-hidden shadow-sm">
        <button
          onClick={handleIncrement}
          disabled={isMaxed}
          className={`h-full w-14 flex items-center justify-center transition-colors ${
            isMaxed
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-blue-700 active:bg-blue-800"
          }`}
          aria-label="افزودن"
        >
          <Plus className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <span className="flex-1 text-center text-lg font-black tabular-nums">
          {quantity}
        </span>

        <button
          onClick={handleDecrement}
          className="h-full w-14 flex items-center justify-center hover:bg-blue-700 active:bg-blue-800 transition-colors"
          aria-label={quantity <= 1 ? "حذف از سبد" : "کاهش"}
          title={quantity <= 1 ? "حذف از سبد خرید" : "کاهش تعداد"}
        >
          <Minus className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>

      {isMaxed && typeof stock_count === "number" && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center mt-2">
          حداکثر موجودی ({stock_count} عدد) در سبد شماست
        </p>
      )}
    </div>
  );
}