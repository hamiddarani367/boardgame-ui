import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { getGuestToken } from "@/lib/cart-token";
import type { Cart } from "@/types/cart";

export function useCart() {
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const guestToken = getGuestToken();
      const headers: Record<string, string> = {};
      if (guestToken) {
        headers["X-Guest-Token"] = guestToken;
      }

      const { data } = await apiClient.get<Cart>("/cart", { headers });
      return data;
    },
    staleTime: 30_000,
  });
}