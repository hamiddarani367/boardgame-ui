import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (productId) => {
      await apiClient.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist-count"] });
    },
  });
}