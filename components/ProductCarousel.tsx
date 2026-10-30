"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  icon?: string;
  products: Product[];
  variant?: "default" | "new" | "discount" | "bestseller";
}

const variantClasses: Record<
  "default" | "new" | "discount" | "bestseller",
  string
> = {
  default: "bg-white dark:bg-gray-950",
  new: "bg-gradient-to-b from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-gray-950 dark:to-gray-950",
  discount:
    "bg-gradient-to-b from-red-50 via-white to-white dark:from-red-950/30 dark:via-gray-950 dark:to-gray-950",
  bestseller:
    "bg-gradient-to-b from-amber-50 via-white to-white dark:from-amber-950/30 dark:via-gray-950 dark:to-gray-950",
};

export default function ProductCarousel({
  title,
  subtitle,
  icon,
  products,
  variant = "default",
}: ProductCarouselProps) {
  const sectionBg = variantClasses[variant];

  return (
    <div className={`w-full px-6 md:px-10 lg:px-16 py-8 ${sectionBg}`}>
      <div className="mx-auto max-w-[130rem]">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
              {icon && <span className="ml-2">{icon}</span>}
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href="/products"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            مشاهده همه
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price ?? 0}
              sale_price={product.discounted_price ?? undefined}
              main_image={product.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}