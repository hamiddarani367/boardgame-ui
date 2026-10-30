import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { WishlistCountResponse } from "@/types/wishlist";

export function useWishlistCount() {
  return useQuery<WishlistCountResponse>({
    queryKey: ["wishlist-count"],
    queryFn: async () => {
      const { data } = await apiClient.get<WishlistCountResponse>(
        "/wishlist/count"
      );
      return data;
    },
    staleTime: 30 * 1000,
  });
}