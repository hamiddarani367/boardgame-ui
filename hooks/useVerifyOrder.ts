import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";

export type VerifyOrderStatus = "paid" | "failed" | "error";

export interface VerifyOrderResponse {
  order_id: number;
  status: VerifyOrderStatus;
  ref_id?: string;
  message?: string;
  error?: string;
}

export function useVerifyOrder(orderId: string | number | null | undefined) {
  return useQuery<VerifyOrderResponse>({
    queryKey: ["verify-order", orderId],
    queryFn: async () => {
      const { data } = await apiClient.get<VerifyOrderResponse>(
        "/payment/verify",
        { params: { order_id: orderId } }
      );
      return data;
    },
    // ✅ فقط وقتی orderId داریم اجرا کن
    enabled: !!orderId,
    // ✅ فقط یه بار verify کن، نه هر بار focus/refresh
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}