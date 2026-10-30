"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./useApi";
import type { Cart } from "@/types/cart";
import type { AxiosError } from "axios";

export function useRemoveDiscount() {
  const queryClient = useQueryClient();

  return useMutation<Cart, AxiosError<{ error?: string }>, void>({
    mutationFn: async () => {
      const { data } = await apiClient.delete<Cart>("/cart/remove-discount");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}