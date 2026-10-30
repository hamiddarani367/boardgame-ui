"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductGrid from "./ProductGrid";
import ProductSort from "./ProductSort";
import ProductPagination from "./ProductPagination";
import FilterContainer from "./FilterContainer";
import { useApiQuery } from "@/hooks/useApi";
import type { Product } from "@/types/product";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

function ProductsContent({
  currentPage,
  currentSort,
}: {
  currentPage: number;
  currentSort: string;
}) {
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const playerCount = searchParams.get("players") || "";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const minPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const queryParams: Record<string, unknown> = {
    page: currentPage,
    sort: currentSort,
  };
  if (category) queryParams.category = category;
  if (playerCount) queryParams.playerCount = playerCount;
  if (minPrice !== undefined) queryParams.minPrice = minPrice;
  if (maxPrice !== undefined) queryParams.maxPrice = maxPrice;

  const { data, isLoading, error } = useApiQuery<ProductsResponse>(
    "/products",
    [
      "products-list",
      currentPage,
      currentSort,
      category,
      playerCount,
      minPrice ?? "",
      maxPrice ?? "",
    ],
    queryParams
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb + دکمهٔ فیلتر موبایل */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[130rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              محصولات
            </span>
          </nav>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
          >
            فیلتر
          </button>
        </div>
      </div>

      <div className="max-w-[130rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="lg:w-80 flex-shrink-0">
            <FilterContainer
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div id="products-top" className="scroll-mt-24" />
            <ProductSort currentSort={currentSort} />

            <div className="mt-4">
              {isLoading || !data ? (
                <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">
                  خطا در بارگذاری محصولات
                </div>
              ) : data.products.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  محصولی با این فیلترها یافت نشد
                </div>
              ) : (
                <>
                  <ProductGrid products={data.products} />
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={data.total_pages}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPageContent(props: {
  currentPage: number;
  currentSort: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      }
    >
      <ProductsContent {...props} />
    </Suspense>
  );
}