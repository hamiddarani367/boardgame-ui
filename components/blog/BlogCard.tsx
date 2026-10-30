import Link from "next/link";
import { Calendar, Clock, Eye, User, ArrowLeft } from "lucide-react";
import { toPersianDate } from "@/lib/date";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  type: string;
  cover_image?: string;
  cover_alt?: string;
  author?: {
    id: number;
    full_name: string;
    image?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: { id: number; name: string; slug: string }[];
  view_count: number;
  reading_time: number;
  published_at?: string;
}

const TYPE_LABELS: Record<string, string> = {
  article: "مقاله",
  news: "خبر",
  guide: "راهنما",
  review: "بررسی",
  tutorial: "آموزش",
};

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  // ==================== Featured ====================
  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block overflow-hidden rounded-3xl bg-gray-900 min-h-[360px] md:min-h-[440px]"
      >
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.cover_alt ?? post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative flex flex-col justify-end h-full p-6 md:p-10 text-white">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-medium">
              {TYPE_LABELS[post.type] ?? post.type}
            </span>
            {post.category && (
              <span className="px-3 py-1 rounded-full bg-blue-600 text-xs font-medium">
                {post.category.name}
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-4xl font-black leading-tight mb-3 md:mb-4 group-hover:text-blue-300 transition-colors line-clamp-3">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-white/80 leading-relaxed mb-6 line-clamp-2 max-w-2xl">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            {post.author && (
              <span className="flex items-center gap-2">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.full_name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                {post.author.full_name}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {toPersianDate(post.published_at)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.reading_time} دقیقه
            </span>
            <span className="mr-auto flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
              خواندن مقاله
              <ArrowLeft className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // ==================== Default (افقی) ====================
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-3 sm:gap-4 p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
    >
      {/* ✅ تصویر سمت راست */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.cover_alt ?? post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Eye className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* ✅ محتوا سمت چپ */}
      <div className="flex flex-col flex-1 min-w-0 py-0.5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-medium">
            {TYPE_LABELS[post.type] ?? post.type}
          </span>
          {post.category && (
            <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-medium">
              {post.category.name}
            </span>
          )}
        </div>

        {/* عنوان */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>

        {/* خلاصه — فقط در دسکتاپ */}
        {post.excerpt && (
          <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-2">
            {post.excerpt}
          </p>
        )}

        {/* متادیتا */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 mt-auto">
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[100px]">
                {post.author.full_name}
              </span>
            </span>
          )}
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {toPersianDate(post.published_at)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.reading_time} دقیقه
          </span>
        </div>
      </div>
    </Link>
  );
}