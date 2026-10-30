import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { getGuestToken } from "@/lib/cart-token";
import type { Cart } from "@/types/cart";

interface UpdateVariables {
  itemId: number;
  quantity: number;
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, UpdateVariables, { previous?: Cart | null }>({
    mutationFn: async ({ itemId, quantity }) => {
      const guestToken = getGuestToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (guestToken) headers["X-Guest-Token"] = guestToken;

      const body = { quantity };
      console.log(`PUT /public/cart/items/${itemId} body:`, body);

      const { data } = await apiClient.put<Cart>(
        `/cart/items/${itemId}`,
        body,
        { headers }
      );

      console.log(`PUT /public/cart/items/${itemId} response:`, data);
      return data;
    },
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<Cart | null>(["cart"]);

      if (previous) {
        let updatedItems;
        if (quantity <= 0) {
          updatedItems = previous.items.filter((it) => it.id !== itemId);
        } else {
          updatedItems = previous.items.map((it) =>
            it.id === itemId
              ? { ...it, quantity, total_price: it.price * quantity }
              : it
          );
        }

        const totalItems = updatedItems.reduce((s, it) => s + it.quantity, 0);
        const totalAmount = updatedItems.reduce(
          (s, it) => s + it.total_price,
          0
        );

        queryClient.setQueryData<Cart>(["cart"], {
          ...previous,
          items: updatedItems,
          total_items: totalItems,
          total_amount: totalAmount,
          final_amount: totalAmount,
        });
      }

      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(["cart"], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}