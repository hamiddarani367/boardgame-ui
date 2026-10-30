import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { getGuestToken, setGuestToken } from "@/lib/cart-token";
import type { Cart } from "@/types/cart";

interface AddToCartVariables {
  product_id: number;
  quantity: number;
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, AddToCartVariables>({
    mutationFn: async ({ product_id, quantity }) => {
      const guestToken = getGuestToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (guestToken) headers["X-Guest-Token"] = guestToken;

      // ✅ body ساده
      const body = { product_id, quantity };

      // 🔍 برای دیباگ
      console.log("POST /public/cart body:", body);

      const { data } = await apiClient.post<Cart>("/cart", body, {
        headers,
      });

      // 🔍 برای دیباگ
      console.log("POST /public/cart response:", data);

      if (data.guest_token) setGuestToken(data.guest_token);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
    },
  });
}