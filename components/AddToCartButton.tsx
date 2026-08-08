"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity, removeItem } from "@/store/cartSlice";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  id: string;
  title: string;
  persianTitle: string;
  image: string;
  price: number;
  discountedPrice?: number;
  stockCount: number;
}

export function AddToCartButton({
  id,
  title,
  persianTitle,
  image,
  price,
  discountedPrice,
  stockCount,
}: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === id)
  );
  const quantity = cartItem?.quantity || 0;
  const isOutOfStock = stockCount === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    dispatch(
      addToCart({
        id,
        title,
        persianTitle,
        image,
        price,
        discountedPrice,
        quantity: 1,
        stockCount,
      })
    );
  };

  const handleIncrease = () => {
    if (quantity < stockCount) {
      dispatch(updateQuantity({ id, delta: 1 }));
    }
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      dispatch(removeItem(id));
    } else {
      dispatch(updateQuantity({ id, delta: -1 }));
    }
  };

  // ناموجود
  if (isOutOfStock) {
    return (
      <Button
        disabled
        className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold h-12 text-base rounded-xl cursor-not-allowed"
      >
        ⚠️ ناموجود
      </Button>
    );
  }

  // افزودن به سبد
  if (quantity === 0) {
    return (
      <Button
        onClick={handleAdd}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-base rounded-xl"
      >
        <ShoppingCart className="ml-2 h-5 w-5" />
        افزودن به سبد خرید
      </Button>
    );
  }

  // شمارنده (counter)
  const isMaxReached = quantity >= stockCount;

  return (
    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 rounded-xl px-2 h-12">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        onClick={handleDecrease}
      >
        {quantity === 1 ? <ShoppingCart className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </Button>

      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-lg transition-colors ${
          isMaxReached
            ? "text-gray-400 cursor-not-allowed hover:bg-transparent"
            : "hover:bg-blue-100 hover:text-blue-700"
        }`}
        onClick={handleIncrease}
        disabled={isMaxReached}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}