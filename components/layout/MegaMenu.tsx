"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors h-10 ${
          isOpen
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        دسته‌بندی‌ها
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-[720px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-1 invisible"
        }`}
      >
        <div className="p-5">
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${cat.color}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-xl">
                  {cat.icon}
                </span>
                <div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {cat.count} بازی
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 text-center">
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              مشاهده همهٔ دسته‌بندی‌ها ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}