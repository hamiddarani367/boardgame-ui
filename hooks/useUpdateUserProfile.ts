import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";
import type { UserProfile, UpdateUserProfileBody } from "@/types/user";

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserProfileBody>({
    mutationFn: async (body) => {
      const { data } = await apiClient.put<UserProfile>("/users/me", body);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user-profile"], data);
    },
  });
}