// hooks/useSearch.ts
import { useApi } from "./useApi";
import { useQuery } from "@tanstack/react-query";

export function useSearch(query: string) {
  const api = useApi();

  return useQuery({
    queryKey: ["search", query],
    queryFn: () =>
      api(`/api/products/search?q=${encodeURIComponent(query)}`).then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      }).then((data) => data.results),
    enabled: query.trim().length > 0,
  });
}