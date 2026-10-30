"use client";

import { Heart, Bell, Share2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { apiClient } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useAddToWishlist } from "@/hooks/useAddToWishlist";
import { useRemoveFromWishlist } from "@/hooks/useRemoveFromWishlist";
import type { WishlistCheckResponse } from "@/types/wishlist";

interface ProductActionsProps {
  productId?: number;
}

export function ProductActions({ productId }: ProductActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);

  const { data: checkData, isLoading: isChecking } =
    useQuery<WishlistCheckResponse>({
      queryKey: ["wishlist-check", productId],
      queryFn: async () => {
        const { data } = await apiClient.get<WishlistCheckResponse>(
          `/wishlist/${productId}/check`
        );
        return data;
      },
      enabled: !!user && !!productId,
      staleTime: 30 * 1000,
    });

  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const serverState = checkData?.is_favorite ?? false;
  const isInWishlist =
    optimisticState !== null ? optimisticState : serverState;

  const handleWishlistClick = () => {
    if (!productId) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "شناسه محصول موجود نیست!",
        confirmButtonText: "باشه",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (!user) {
      Swal.fire({
        icon: "info",
        title: "ورود لازم است",
        text: "برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید",
        showCancelButton: true,
        confirmButtonText: "ورود / ثبت‌نام",
        cancelButtonText: "انصراف",
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/auth/signin?callbackUrl=/products/${productId}`);
        }
      });
      return;
    }

    const newState = !isInWishlist;
    setOptimisticState(newState);

    // ✅ آپدیت کش مستقیماً تا optimisticState و serverState هم‌راستا شوند
    queryClient.setQueryData<WishlistCheckResponse>(
      ["wishlist-check", productId],
      { is_favorite: newState }
    );

    const onSuccess = () => {
      // ✅ بعد از موفقیت، optimistic را پاک کن
      // اما کش از قبل آپدیت شده، پس serverState هم درست است
      setOptimisticState(null);
    };

    const onError = () => {
      // برگردان کش به حالت قبل
      queryClient.setQueryData<WishlistCheckResponse>(
        ["wishlist-check", productId],
        { is_favorite: !newState }
      );
      setOptimisticState(null);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: newState
          ? "خطا در افزودن به علاقه‌مندی‌ها"
          : "خطا در حذف از علاقه‌مندی‌ها",
        confirmButtonText: "باشه",
        confirmButtonColor: "#2563eb",
      });
    };

    if (newState) {
      addToWishlist(productId, { onSuccess, onError });
    } else {
      removeFromWishlist(productId, { onSuccess, onError });
    }
  };

  return (
    <div className="flex md:flex-col gap-3">
      <button
        type="button"
        onClick={handleWishlistClick}
        disabled={isChecking && optimisticState === null}
        title={isInWishlist ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
          isInWishlist
            ? "text-red-500 hover:text-red-600 hover:bg-red-50"
            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        <Heart
          className={`h-5 w-5 transition-all duration-200 ${
            isInWishlist
              ? "fill-red-500 text-red-500 scale-110"
              : "fill-transparent text-gray-500 scale-100"
          }`}
          strokeWidth={2}
        />
      </button>

      <button
        type="button"
        title="اطلاع‌رسانی تخفیف"
        className="h-10 w-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <Bell className="h-5 w-5" />
      </button>

      <button
        type="button"
        title="اشتراک‌گذاری محصول"
        className="h-10 w-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
}