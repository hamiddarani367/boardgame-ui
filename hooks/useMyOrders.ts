import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { Order } from "@/types/order";

interface UseMyOrdersParams {
  page?: number;
  page_size?: number;
}

export function useMyOrders(params: UseMyOrdersParams = {}) {
  const { page = 1, page_size = 20 } = params;

  return useQuery<Order[]>({
    queryKey: ["my-orders", page, page_size],
    queryFn: async () => {
      const { data } = await apiClient.get<Order[]>("/orders/my", {
        params: { page, page_size },
      });
      return data;
    },
    staleTime: 60 * 1000,
  });
}