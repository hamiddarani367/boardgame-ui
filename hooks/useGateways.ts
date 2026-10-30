import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { Gateway } from "@/types/gateway";

export function useGateways() {
  return useQuery<Gateway[]>({
    queryKey: ["gateways"],
    queryFn: async () => {
      const { data } = await apiClient.get<Gateway[]>("/gateways/active");
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}