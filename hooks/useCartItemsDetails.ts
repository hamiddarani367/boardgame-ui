import { useQueries } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

/**
 * برای هر آیتم سبد، اطلاعات کامل محصول را می‌گیرد
 * و یک Map برمی‌گرداند: product_id → Product
 */
export function useCartItemsDetails(cartItems: CartItem[]) {
  const queries = useQueries({
    queries: cartItems.map((item) => ({
      queryKey: ["product", item.product_id],
      queryFn: async () => {
        const { data } = await apiClient.get<Product>(
          `/products/detail/${item.product_id}`
        );
        return data;
      },
      staleTime: 5 * 60 * 1000,
      enabled: !!item.product_id,
    })),
  });

  const detailsMap = new Map<number, Product>();
  let isLoading = false;

  queries.forEach((q, index) => {
    if (q.isLoading) isLoading = true;
    if (q.data) {
      detailsMap.set(cartItems[index].product_id, q.data);
    }
  });

  return { detailsMap, isLoading };
}