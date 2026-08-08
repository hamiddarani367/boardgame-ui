"use client";

import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  title: string;
  persianTitle: string;
  price: number;
  discountedPrice?: number;
  image: string;
  players?: string;
  time?: string;
  age?: string;
  badge?: string;
  badgeColor?: string;
}

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  icon?: string;
  products: Product[];
  variant?: "discount" | "bestseller" | "new";
}

function CustomCarouselButtons() {
  const { scrollPrev, scrollNext } = useCarousel();
  return (
    <>
      <button
        onClick={scrollPrev}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
        aria-label="اسلاید قبلی"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100"
        aria-label="اسلاید بعدی"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </>
  );
}

export default function ProductCarousel({
  title,
  subtitle,
  icon,
  products,
  variant = "new",
}: ProductCarouselProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const variantStyles = {
    discount: {
      titleColor: "text-red-600 dark:text-red-400",
      lineColor: "bg-red-500",
      bgGradient: "from-red-50 to-transparent dark:from-red-950/20",
    },
    bestseller: {
      titleColor: "text-amber-600 dark:text-amber-400",
      lineColor: "bg-amber-500",
      bgGradient: "from-amber-50 to-transparent dark:from-amber-950/20",
    },
    new: {
      titleColor: "text-blue-600 dark:text-blue-400",
      lineColor: "bg-blue-500",
      bgGradient: "from-blue-50 to-transparent dark:from-blue-950/20",
    },
  };

  const styles = variantStyles[variant];

  return (
    <section
      ref={ref}
      className={`py-10 lg:px-10 md:py-14 bg-gradient-to-b ${styles.bgGradient} dark:bg-gray-950 overflow-hidden`}
    >
      <div className="px-2 sm:px-4 lg:px-6">
        <div
          className={`flex items-center justify-between mb-6 md:mb-8 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-8 md:h-10 ${styles.lineColor} rounded-full`} />
            <div>
              <div className="flex items-center gap-2">
                {icon && <span className="text-xl md:text-2xl">{icon}</span>}
                <h2 className={`text-xl md:text-2xl font-black ${styles.titleColor}`}>
                  {title}
                </h2>
              </div>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button className={`hidden sm:flex items-center gap-1.5 text-sm font-bold ${styles.titleColor} hover:opacity-80 transition-opacity`}>
            مشاهده همه
            <span className="text-lg">←</span>
          </button>
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Carousel
            dir="rtl"
            opts={{
              align: "start",
              loop: false,
              direction: "rtl",
              dragFree: true,
            }}
            className="group relative"
          >
            <CarouselContent className="gap-0">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-0 basis-[37%] md:basis-[30%] lg:basis-[23%] xl:basis-[15.38%]"
                >
                  <ProductCard
                    {...product}
                    href={`/products/${product.id}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CustomCarouselButtons />
          </Carousel>
        </div>

        <div className="flex sm:hidden justify-center mt-6">
          <button className={`flex items-center gap-1.5 text-sm font-bold ${styles.titleColor} hover:opacity-80 transition-opacity`}>
            مشاهده همه
            <span className="text-lg">←</span>
          </button>
        </div>
      </div>
    </section>
  );
}