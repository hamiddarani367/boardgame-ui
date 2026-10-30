import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { getGuestToken } from "@/lib/cart-token";

export interface Address {
  id: number;
  title: string;
  full_address: string;
  city: { id: number; name: string };
  province: { id: number; name: string };
  postal_code: string;
  is_default: boolean;
}

export function useAddresses() {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: async () => {
      const { data } = await apiClient.get<Address[]>("/addresses/me");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}