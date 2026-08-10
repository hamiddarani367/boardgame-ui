"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductGrid from "./ProductGrid";
import ProductSort from "./ProductSort";
import ProductPagination from "./ProductPagination";
import FilterContainer from "./FilterContainer";
import { useProducts } from "@/hooks/useProducts";

function ProductsContent({
  currentPage,
  currentSort,
}: {
  currentPage: number;
  currentSort: string;
}) {
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  // خواندن پارامترهای فیلتر از URL
  const category = searchParams.get("category") || "";
  const playerCount = searchParams.get("players") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000000;

  const { data, isLoading, error } = useProducts({
    page: currentPage,
    sort: currentSort,
    category,
    playerCount,
    minPrice,
    maxPrice,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb + دکمه فیلتر */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[130rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">خانه</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">محصولات</span>
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

            {isLoading ? (
              <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">خطا در بارگذاری محصولات</div>
            ) : (
              <>
                <ProductGrid products={data.products} />
                <ProductPagination currentPage={currentPage} totalPages={data.totalPages} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// این wrapper فقط برای Suspense است
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