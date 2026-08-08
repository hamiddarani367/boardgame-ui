"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import ProductGrid from "./ProductGrid";
import ProductSort from "./ProductSort";
import ProductPagination from "./ProductPagination";
import FilterContainer from "./FilterContainer";

interface ProductsPageContentProps {
  products: any[]; // می‌توانید تایپ دقیق Product را جایگزین کنید
  totalPages: number;
  currentPage: number;
  currentSort: string;
}

export default function ProductsPageContent({
  products,
  totalPages,
  currentPage,
  currentSort,
}: ProductsPageContentProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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

          {/* متن آبی «فیلتر» فقط در موبایل */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
          >
            فیلتر
          </button>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-[130rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* بخش فیلترها با عرض ثابت در دسکتاپ */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterContainer
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
            />
          </div>

          {/* بخش محصولات */}
          <div className="flex-1 min-w-0">
            <div id="products-top" className="scroll-mt-24" />

            <ProductSort currentSort={currentSort} />

            <Suspense
              fallback={
                <div className="animate-pulse grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl"
                    />
                  ))}
                </div>
              }
            >
              <ProductGrid products={products} />
            </Suspense>

            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}