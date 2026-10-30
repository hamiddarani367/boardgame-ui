import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { Address } from "@/types/address";

interface UpdateAddressBody {
  title?: string;
  full_address?: string;
  province_id?: number;
  city_id?: number;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}

interface UpdateAddressVariables {
  id: number;
  body: UpdateAddressBody;
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation<Address, Error, UpdateAddressVariables>({
    mutationFn: async ({ id, body }) => {
      const { data } = await apiClient.put<Address>(
        `/public/addresses/${id}`,
        body
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}