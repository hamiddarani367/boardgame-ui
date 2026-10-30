"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/useApi";
import { BlogCard, type BlogPost } from "@/components/blog/BlogCard";
import {
  BookOpen,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ==================== تایپ‌ها ====================
interface ContentsResponse {
  contents: BlogPost[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface Category {
  id: number;
  name: string;
}

// ==================== کامپوننت محتوا ====================
function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const categoryId = searchParams.get("category_id") ?? "";
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const limit = 9;

  const { data, isLoading } = useApiQuery<ContentsResponse>(
    "/contents",
    ["public-contents", String(page), categoryId, search],
    {
      page,
      limit,
      category_id: categoryId || undefined,
      search: search || undefined,
    }
  );

  const { data: categoriesData } = useApiQuery<Category[]>(
    "/contents/categories",
    ["public-categories"]
  );

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput, page: 1 });
  };

  const posts = data?.contents ?? [];
  const isDefaultView = page === 1 && !categoryId && !search;
  const featuredPost = isDefaultView ? posts[0] : null;
  const restPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ==================== هدر ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        {/* الگوی تزئینی */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">وبلاگ ما</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              دنیای بازی‌های رومیزی
            </h1>

            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
              جدیدترین مقالات، اخبار، آموزش‌ها و راهنماهای تخصصی در حوزه
              بازی‌های رومیزی و سرگرمی‌های فکری
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* ==================== جستجو و فیلتر ==================== */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          {/* جستجو */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="جستجو در مقالات..."
                className="w-full h-12 pr-12 pl-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* ==================== تب‌های دسته‌بندی ==================== */}
        <div className="flex flex-wrap items-center gap-2 mb-8 md:mb-10">
          <button
            onClick={() => updateParams({ category_id: null, page: 1 })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categoryId
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            همه مقالات
          </button>

          {(categoriesData ?? []).map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams({ category_id: cat.id, page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryId === String(cat.id)
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ==================== محتوا ==================== */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              مقاله‌ای یافت نشد
            </h3>
            <p className="text-gray-500 mb-6">
              {search
                ? `نتیجه‌ای برای «${search}» پیدا نشد`
                : "هنوز مقاله‌ای در این بخش منتشر نشده است"}
            </p>
            {(search || categoryId) && (
              <button
                onClick={() =>
                  updateParams({ search: null, category_id: null, page: 1 })
                }
                className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                نمایش همه مقالات
              </button>
            )}
          </div>
        ) : (
          <>
            {/* مقاله شاخص */}
            {featuredPost && (
              <div className="mb-10 md:mb-16">
                <BlogCard post={featuredPost} variant="featured" />
              </div>
            )}

            {/* گرید مقالات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {restPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* ==================== صفحه‌بندی ==================== */}
            {data && data.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
                <button
                  onClick={() => updateParams({ page: page - 1 })}
                  disabled={page <= 1}
                  className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600 transition-colors"
                  title="صفحه قبل"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {Array.from({ length: data.total_pages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (data.total_pages <= 7) return true;
                    if (p === 1 || p === data.total_pages) return true;
                    if (Math.abs(p - page) <= 1) return true;
                    return false;
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showDots = prev !== undefined && p - prev > 1;
                    return (
                      <span key={p} className="flex items-center gap-2">
                        {showDots && (
                          <span className="text-gray-400 px-1">...</span>
                        )}
                        <button
                          onClick={() => updateParams({ page: p })}
                          className={`inline-flex items-center justify-center h-11 min-w-11 px-4 rounded-xl text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 hover:text-blue-600"
                          }`}
                        >
                          {p.toLocaleString("fa-IR")}
                        </button>
                      </span>
                    );
                  })}

                <button
                  onClick={() => updateParams({ page: page + 1 })}
                  disabled={page >= data.total_pages}
                  className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600 transition-colors"
                  title="صفحه بعد"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ==================== صفحه ====================
export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}