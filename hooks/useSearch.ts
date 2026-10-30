import { useApiQuery } from "./useApi";
import type { Product } from "@/types/product";

export function useSearch(query: string) {
  return useApiQuery<{ results: Product[] }>(
    "/products/search",
    ["search", query],
    { q: query },
    { enabled: query.trim().length > 0 }
  );
}