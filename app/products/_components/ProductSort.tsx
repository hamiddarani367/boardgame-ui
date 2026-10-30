"use client";

import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "bestseller", label: "پرفروش‌ترین" },
  { value: "cheapest", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "discount", label: "تخفیف" },
];

export default function ProductSort({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // مستقیماً از URL می‌خوانیم، بدون state
  const activeSort = searchParams.get("sort") || currentSort;

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-1.5 mb-4">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSort(option.value)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            activeSort === option.value
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}