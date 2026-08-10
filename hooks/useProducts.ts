import { useApi } from "./useApi";
import { useQuery } from "@tanstack/react-query";

interface UseProductsParams {
  page?: number;
  sort?: string;
  category?: string;
  playerCount?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export function useProducts(params: UseProductsParams) {
  const api = useApi();

  const queryString = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, val]) => {
      if (val !== undefined && val !== "") acc[key] = String(val);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      api(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${queryString}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        }),
    // staleTime از defaultOptions ارث‌بری می‌کند
  });
}