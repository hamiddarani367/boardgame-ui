"use client";

import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";

export interface ProductCardProps {
  slug: string;
  name?: string;           // English title
  persian_title?: string;   // Persian title
  price: number;
  sale_price?: number | null;
  main_image?: string;
  players?: string;
  time?: string;
  age?: string;
  badge?: string;
  badgeColor?: string;
  href?: string;
}

export default function ProductCard({
  slug,
  name,
  persian_title,
  price,
  sale_price,
  main_image,
  players,
  time,
  age,
  badge,
  badgeColor = "bg-red-500",
  href,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const finalHref = href || `/products/${slug}`;
  const salePrice = sale_price ?? undefined;
  const imageSrc =
    main_image && main_image.trim() !== "" ? main_image : PLACEHOLDER_IMAGE;
  const displayName = persian_title || name || "محصول";
  const altText = displayName;

  const cardContent = (
    <div
      className={`group relative bg-white dark:bg-gray-900 overflow-hidden border border-gray-100 dark:border-gray-800 transition-all cursor-pointer ${
        isHovered ? "border-gray-300 dark:border-gray-600" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {badge && (
        <div className={`absolute top-2 right-2 z-10 ${badgeColor} text-white text-[10px] font-bold px-2 py-0.5`}>
          {badge}
        </div>
      )}

      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={imageSrc}
          alt={altText}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className="p-2">
        <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">
          {displayName}
        </h3>

        {(players || time || age) && (
          <div className="flex items-center gap-2 text-[9px] text-gray-400 dark:text-gray-500 mt-1">
            {players && <span>👥 {players}</span>}
            {time && <span>⏱️ {time}</span>}
            {age && <span>🎂 {age}</span>}
          </div>
        )}

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-baseline gap-1">
            {salePrice ? (
              <>
                <span className="text-sm font-black text-red-600 dark:text-red-400">
                  {formatPrice(salePrice)}
                </span>
                <span className="text-[10px] text-gray-400 line-through">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-black text-gray-900 dark:text-white">
                {formatPrice(price)}
              </span>
            )}
            <span className="text-[10px] text-gray-400">تومان</span>
          </div>
          {salePrice && (
            <span className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-[9px] font-bold px-1.5 py-0.5">
              ٪{Math.round(((price - salePrice) / price) * 100)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return <Link href={finalHref}>{cardContent}</Link>;
}