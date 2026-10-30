import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { WishlistListResponse } from "@/types/wishlist";

interface UseWishlistParams {
  page?: number;
  page_size?: number;
}

export function useWishlist(params: UseWishlistParams = {}) {
  const { page = 1, page_size = 20 } = params;

  return useQuery<WishlistListResponse>({
    queryKey: ["wishlist", page, page_size],
    queryFn: async () => {
      const { data } = await apiClient.get<WishlistListResponse>(
        "/wishlist",
        { params: { page, page_size } }
      );
      return data;
    },
    staleTime: 30 * 1000,
  });
}