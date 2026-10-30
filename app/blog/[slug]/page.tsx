"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useApiQuery } from "@/hooks/useApi";
import {
  Loader2,
  ArrowRight,
  BookOpen,
  Calendar,
  Eye,
  Clock,
  User as UserIcon,
  Tag as TagIcon,
  ShoppingCart,
} from "lucide-react";

/* ---------------------------------------------------------------
 * تایپ‌ها
 * --------------------------------------------------------------- */
interface Author {
  id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface AttributeValue {
  attribute_id: number;
  attribute_slug: string;
  attribute_name: string;
  icon: string;
  unit: string;
  value: string;
}

interface LinkedProduct {
  id: number;
  name: string;
  persian_title: string;
  slug: string;
  sku: string;
  description: string;
  full_description: string;
  price: number;
  discounted_price: number | null;
  stock_count: number;
  image: string;
  images: string[];
  enabled: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  category_id: number;
  brand_id: number | null;
  attribute_values: AttributeValue[];
  tags: Tag[];
}

interface ContentDetail {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  type?: string;
  status?: string;
  cover_image?: string;
  cover_alt?: string;
  author?: Author;
  category?: Category;
  tags?: Tag[];
  view_count?: number;
  like_count?: number;
  reading_time?: number;
  featured?: boolean;
  is_featured?: boolean;
  enabled?: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  allow_comments?: boolean;
  product_id?: number;
  product?: LinkedProduct;
}

/* ---------------------------------------------------------------
 * ابزارها
 * --------------------------------------------------------------- */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function formatPrice(price: number): string {
  return price.toLocaleString("fa-IR");
}

/* ---------------------------------------------------------------
 * کامپوننت اصلی
 * --------------------------------------------------------------- */
export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const { data, isLoading, isError } = useApiQuery<ContentDetail>(
    `/contents/${slug}`,
    ["public-content", slug],
    undefined,
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md">
          <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            محتوا یافت نشد
          </h1>
          <p className="text-gray-500 mb-6">
            متأسفانه محتوای مورد نظر پیدا نشد یا حذف شده است.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به وبلاگ
          </Link>
        </div>
      </div>
    );
  }

  const contentHtml = data.content ?? data.excerpt ?? "";
  const publishedDate = formatDate(data.published_at || data.created_at);
  const authorName =
    data.author?.full_name ||
    [data.author?.first_name, data.author?.last_name]
      .filter(Boolean)
      .join(" ") ||
    "";
  const product = data.product;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            خانه
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-600">
            وبلاگ
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[240px]">
            {data.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ستون اصلی محتوا */}
          <main className="lg:col-span-8">
            <article className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* کاور */}
              {data.cover_image && (
                <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={data.cover_image}
                    alt={data.cover_alt || data.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              )}

              {/* هدر */}
              <header className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4">
                  {data.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                  {authorName && (
                    <span className="flex items-center gap-1.5">
                      <UserIcon className="h-4 w-4" />
                      {authorName}
                    </span>
                  )}
                  {publishedDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {publishedDate}
                    </span>
                  )}
                  {typeof data.view_count === "number" && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      {data.view_count.toLocaleString("fa-IR")} بازدید
                    </span>
                  )}
                  {typeof data.reading_time === "number" &&
                    data.reading_time > 0 && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {data.reading_time} دقیقه مطالعه
                      </span>
                    )}
                </div>

                {(data.category || (data.tags && data.tags.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {data.category && (
                      <Link
                        href={`/blog?category=${data.category.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                      >
                        {data.category.name}
                      </Link>
                    )}
                    {data.tags?.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/blog?tag=${tag.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                {data.excerpt && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {data.excerpt}
                  </p>
                )}
              </header>

              {/* بدنه — رندر مستقیم HTML */}
              <div className="p-6 md:p-8">
                {contentHtml ? (
                  <div
                    className="
                      max-w-none
                      text-gray-700 dark:text-gray-300 leading-8

                      [&_h1]:text-2xl [&_h1]:font-black [&_h1]:mt-8 [&_h1]:mb-4
                      [&_h1]:text-gray-900 dark:[&_h1]:text-white
                      [&_h1]:pb-3 [&_h1]:border-b [&_h1]:border-gray-200 dark:[&_h1]:border-gray-800

                      [&_h2]:text-xl [&_h2]:font-black [&_h2]:mt-7 [&_h2]:mb-3
                      [&_h2]:text-gray-900 dark:[&_h2]:text-white

                      [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-2
                      [&_h3]:text-gray-900 dark:[&_h3]:text-white

                      [&_h4]:text-base [&_h4]:font-bold [&_h4]:mt-5 [&_h4]:mb-2

                      [&_p]:my-4 [&_p]:leading-8

                      [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline
                      [&_a]:underline-offset-2

                      [&_strong]:font-bold [&_strong]:text-gray-900 dark:[&_strong]:text-white

                      [&_em]:italic

                      [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:my-4 [&_ul]:space-y-1
                      [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:my-4 [&_ol]:space-y-1
                      [&_li]:leading-7

                      [&_blockquote]:border-r-4 [&_blockquote]:border-blue-500
                      [&_blockquote]:bg-blue-50 dark:[&_blockquote]:bg-blue-950/30
                      [&_blockquote]:py-3 [&_blockquote]:px-4 [&_blockquote]:my-5
                      [&_blockquote]:rounded-lg
                      [&_blockquote]:text-gray-700 dark:[&_blockquote]:text-gray-300

                      [&_hr]:my-8 [&_hr]:border-gray-200 dark:[&_hr]:border-gray-800

                      [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800
                      [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                      [&_code]:font-mono

                      [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-800
                      [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:my-4 [&_pre]:overflow-x-auto

                      [&_img]:block [&_img]:mx-auto [&_img]:my-6
                      [&_img]:max-w-full [&_img]:h-auto
                      [&_img]:rounded-xl
                      [&_img]:shadow-md

                      [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse
                      [&_th]:border [&_th]:border-gray-200 dark:[&_th]:border-gray-700
                      [&_th]:bg-gray-50 dark:[&_th]:bg-gray-800 [&_th]:p-2 [&_th]:text-right
                      [&_td]:border [&_td]:border-gray-200 dark:[&_td]:border-gray-700 [&_td]:p-2
                    "
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">محتوایی برای نمایش وجود ندارد</p>
                  </div>
                )}
              </div>
            </article>
          </main>

          {/* ستون کناری */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* کارت محصول مرتبط */}
              {product && (
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800"
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    )}

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      {product.is_new && (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          جدید
                        </span>
                      )}
                      {product.is_best_seller && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          پرفروش
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-[11px] text-gray-500 mb-1">
                        محصول مرتبط
                      </p>
                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-lg font-black text-gray-900 dark:text-white hover:text-blue-600 transition-colors"
                      >
                        {product.persian_title || product.name}
                      </Link>
                    </div>

                    {product.attribute_values?.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {product.attribute_values.map((av) => (
                          <div
                            key={av.attribute_id}
                            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2"
                          >
                            <span className="text-base shrink-0">
                              {av.icon}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                                {av.attribute_name}
                              </p>
                              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {av.value}
                                {av.unit ? ` ${av.unit}` : ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                      {product.discounted_price ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                              ٪
                              {Math.round(
                                ((product.price - product.discounted_price) /
                                  product.price) *
                                  100
                              )}{" "}
                              تخفیف
                            </span>
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="text-xl font-black text-red-600 dark:text-red-400">
                              {formatPrice(product.discounted_price)}
                            </span>
                            <span className="text-xs text-gray-500 mb-0.5">
                              تومان
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-black text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs text-gray-500 mb-0.5">
                            تومان
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      مشاهده و خرید محصول
                    </Link>

                    {product.stock_count === 0 && (
                      <p className="text-center text-xs text-red-500">
                        ⚠️ ناموجود
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* اطلاعات مقاله */}
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="font-bold text-sm mb-3 text-gray-900 dark:text-white">
                  اطلاعات مقاله
                </h3>
                <dl className="space-y-2.5 text-sm">
                  {data.type && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">نوع</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">
                        {data.type}
                      </dd>
                    </div>
                  )}
                  {publishedDate && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">انتشار</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">
                        {publishedDate}
                      </dd>
                    </div>
                  )}
                  {typeof data.view_count === "number" && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">بازدید</dt>
                      <dd className="font-medium text-gray-900 dark:text-white">
                        {data.view_count.toLocaleString("fa-IR")}
                      </dd>
                    </div>
                  )}
                  {typeof data.reading_time === "number" &&
                    data.reading_time > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">زمان مطالعه</dt>
                        <dd className="font-medium text-gray-900 dark:text-white">
                          {data.reading_time} دقیقه
                        </dd>
                      </div>
                    )}
                </dl>
              </div>

              {/* بازگشت */}
              <Link
                href="/blog"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به وبلاگ
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}