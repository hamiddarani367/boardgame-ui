import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";

interface CheckoutVariables {
  address_id: number;
  gateway_id: number;
}

interface CheckoutResponse {
  order_id: number;
  authority: string;
  redirect_url: string; // برای پرداخت نقدی ممکن است خالی باشد
}

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponse, Error, CheckoutVariables>({
    mutationFn: async (variables) => {
      const { data } = await apiClient.post<CheckoutResponse>(
        "/checkout",
        variables
      );
      return data;
    },
    onSuccess: () => {
      // ✅ پاک کردن سبد از کش
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}