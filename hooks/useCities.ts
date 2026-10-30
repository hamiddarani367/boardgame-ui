import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { City } from "@/types/address";

export function useCities(provinceId: number | null) {
  return useQuery<City[]>({
    queryKey: ["cities", provinceId],
    queryFn: async () => {
      const { data } = await apiClient.get<City[]>(
        `/provinces/${provinceId}/cities`
      );
      return data;
    },
    enabled: !!provinceId,
    staleTime: 60 * 60 * 1000,
  });
}