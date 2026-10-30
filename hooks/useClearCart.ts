import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { getGuestToken } from "@/lib/cart-token";

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error>({
    mutationFn: async () => {
      const guestToken = getGuestToken();
      const headers: Record<string, string> = {};
      if (guestToken) headers["X-Guest-Token"] = guestToken;

      const { data } = await apiClient.delete<{ message: string }>(
        "/cart",
        { headers }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}