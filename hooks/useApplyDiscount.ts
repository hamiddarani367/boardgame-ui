"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./useApi";
import type { ApplyDiscountResponse } from "@/types/cart";
import type { AxiosError } from "axios";

interface ApplyDiscountRequest {
  code: string;
}

export function useApplyDiscount() {
  const queryClient = useQueryClient();

  return useMutation<
    ApplyDiscountResponse,
    AxiosError<{ error?: string }>,
    ApplyDiscountRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<ApplyDiscountResponse>(
        "/cart/apply-discount",
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}