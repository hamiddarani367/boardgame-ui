import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import { Province } from "@/types/address";

export function useProvinces() {
  return useQuery<Province[]>({
    queryKey: ["provinces"],
    queryFn: async () => {
      const { data } = await apiClient.get<Province[]>("/provinces/all");
      return data;
    },
    staleTime: 60 * 60 * 1000, // ۱ ساعت (لیست استان‌ها کم تغییر می‌کند)
  });
}