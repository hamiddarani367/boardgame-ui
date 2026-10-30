import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/hooks/useApi";

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/public/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}