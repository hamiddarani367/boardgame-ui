import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { UserProfile } from "@/types/user";

export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await apiClient.get<UserProfile>("/users/me");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}