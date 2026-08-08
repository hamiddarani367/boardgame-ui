"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function ProductPagination({
  currentPage,
  totalPages,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activePage, setActivePage] = useState(currentPage);

  // همگام‌سازی activePage با URL بعد از hydration
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || currentPage;
    setActivePage(pageFromUrl);
  }, [searchParams, currentPage]);

  const handlePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // اسکرول نرم به بالای صفحه با تغییر activePage
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [activePage]);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (activePage > 3) pages.push("ellipsis");
      const start = Math.max(2, activePage - 1);
      const end = Math.min(totalPages - 1, activePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (activePage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent className="flex items-center gap-1">
        <button
          onClick={() => handlePage(activePage - 1)}
          disabled={activePage === 1}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 gap-1.5"
        >
          <ChevronRight className="h-4 w-4" />
          قبلی
        </button>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <button
                onClick={() => handlePage(page as number)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 w-9 ${
                  page === activePage
                    ? "!bg-blue-100 !text-blue-700 font-bold hover:!bg-blue-200"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {page}
              </button>
            )}
          </PaginationItem>
        ))}

        <button
          onClick={() => handlePage(activePage + 1)}
          disabled={activePage === totalPages}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 gap-1.5"
        >
          بعدی
          <ChevronLeft className="h-4 w-4" />
        </button>
      </PaginationContent>
    </Pagination>
  );
}