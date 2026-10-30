import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { Address } from "@/types/address";

interface CreateAddressBody {
  title: string;
  full_address: string;
  province_id: number;
  city_id: number;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, CreateAddressBody>({
    mutationFn: async (body) => {
      const { data } = await apiClient.post<Address>(
        "/addresses",
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}