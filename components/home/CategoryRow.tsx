"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useApiQuery } from "@/hooks/useApi";
import type { Category } from "@/types/category";

export default function CategoryRow() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading, error } = useApiQuery<Category[]>(
    "/categories/menu",
    ["categories-menu"]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-10 md:py-14 bg-white dark:bg-gray-950 overflow-hidden w-full"
    >
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[130rem]">
          <div
            className={`text-center mb-7 md:mb-10 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              🎯 دسته‌بندی بازی‌ها
            </h2>
          </div>

          {isLoading && (
            <div className="text-center py-10 text-gray-500">
              در حال بارگذاری دسته‌بندی‌ها...
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-500">
              خطا در دریافت دسته‌بندی‌ها
            </div>
          )}

          {!isLoading && !error && categories && categories.length > 0 && (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
              {categories.map((cat, index) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`group flex flex-col items-center justify-center gap-1 md:gap-1.5 p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-500 ${
                    cat.light_bg || "bg-gray-50 dark:bg-gray-900"
                  } ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  } ${cat.color || ""} hover:shadow-lg hover:-translate-y-1`}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <span className="text-lg md:text-2xl transition-transform duration-300 group-hover:scale-125">
                    {cat.icon || "🎮"}
                  </span>
                  <span
                    className={`text-[11px] md:text-sm font-bold ${
                      cat.light_text || "text-gray-700 dark:text-gray-300"
                    } text-center leading-tight`}
                  >
                    {cat.name}
                  </span>
                  <span className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400">
                    {cat.count ? `${cat.count} بازی` : "بازی‌ها"}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && categories?.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              دسته‌بندی موجود نیست
            </div>
          )}
        </div>
      </div>
    </section>
  );
}