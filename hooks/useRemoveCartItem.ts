import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { getGuestToken } from "@/lib/cart-token";
import type { Cart } from "@/types/cart";

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, number>({
    mutationFn: async (itemId) => {
      const guestToken = getGuestToken();
      const headers: Record<string, string> = {};
      if (guestToken) headers["X-Guest-Token"] = guestToken;

      const { data } = await apiClient.delete<Cart>(
        `/cart/items/${itemId}`,
        { headers }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}