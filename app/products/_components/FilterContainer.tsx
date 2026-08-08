"use client";

import ProductFilters from "./ProductFilters";

interface FilterContainerProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function FilterContainer({
  mobileOpen,
  onMobileClose,
}: FilterContainerProps) {
  return (
    <>
      {/* دسکتاپ: سایدبار همیشگی */}
      <aside className="hidden lg:block">
        <ProductFilters />
      </aside>

      {/* موبایل: دیالوگ تمام‌صفحه */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white dark:bg-gray-900 overflow-y-auto">
          {/* دکمه بستن – حالا در موقعیت پایان منطقی (چپ در RTL) */}
          <button
            onClick={onMobileClose}
            className="absolute top-4 end-4 z-10 p-2 rounded-full bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
            aria-label="بستن"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* محتوای فیلترها */}
          <div className="pt-4 px-4">
            <ProductFilters />
          </div>
        </div>
      )}
    </>
  );
}