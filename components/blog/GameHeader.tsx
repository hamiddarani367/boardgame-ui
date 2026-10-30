// components/blog/GameHeader.tsx
"use client";

import { Star, Heart, Share2, Users, Clock, Baby, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ==================== تابع تبدیل ارقام ====================
function toPersianDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/\d/g, (d) => persianDigits[Number(d)]);
}

// ==================== تایپ‌ها ====================
interface GameHeaderProps {
  game: {
    id: number;
    title: string;
    title_en?: string;
    year?: number;              // ← optional
    cover_image?: string;
    background_image?: string;
    min_players?: number;       // ← optional
    max_players?: number;       // ← optional
    playing_time?: number;      // ← optional
    min_age?: number;           // ← optional
    average_rating?: number;    // ← optional
    rank?: number;              // ← optional
    designers?: { id: number; name: string }[];
    publishers?: { id: number; name: string }[];
    categories?: { id: number; name: string }[];
  };
}

// ==================== کامپوننت ====================
export function GameHeader({ game }: GameHeaderProps) {
  // ✅ مقادیر امن با fallback
  const year = game.year ?? null;
  const minPlayers = game.min_players ?? null;
  const maxPlayers = game.max_players ?? null;
  const playingTime = game.playing_time ?? null;
  const minAge = game.min_age ?? null;
  const averageRating = game.average_rating ?? 0;
  const rank = game.rank ?? null;

  return (
    <div className="relative overflow-hidden">
      {/* تصویر پس‌زمینه */}
      {game.background_image && (
        <div className="absolute inset-0">
          <img
            src={game.background_image}
            alt=""
            className="w-full h-full object-cover blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-gray-900/85" />
        </div>
      )}

      {/* اگه background_image نیست، یه گرادیانت تیره بذار */}
      {!game.background_image && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* ✅ تصویر جلد بازی */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-40 md:w-56 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10">
              {game.cover_image ? (
                <img
                  src={game.cover_image}
                  alt={game.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[3/4] bg-gray-800 flex items-center justify-center">
                  <Award className="h-12 w-12 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* ✅ اطلاعات بازی */}
          <div className="flex-1 text-white">
            {/* عنوان */}
            <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">
              {game.title || "بدون عنوان"}
            </h1>
            {game.title_en && (
              <p className="text-lg md:text-xl text-gray-300 mb-4" dir="ltr">
                {game.title_en}
              </p>
            )}

            {/* سال و اطلاعات کوتاه */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              {/* ✅ year با چک کردن null */}
              {year && (
                <span>({toPersianDigits(year)})</span>
              )}

              {minPlayers !== null && minPlayers > 0 && (
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {maxPlayers !== null && maxPlayers !== minPlayers
                    ? `${toPersianDigits(minPlayers)}–${toPersianDigits(
                        maxPlayers
                      )} بازیکن`
                    : `${toPersianDigits(minPlayers)} بازیکن`}
                </span>
              )}

              {playingTime !== null && playingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {toPersianDigits(playingTime)} دقیقه
                </span>
              )}

              {minAge !== null && minAge > 0 && (
                <span className="flex items-center gap-1.5">
                  <Baby className="h-4 w-4" />
                  {toPersianDigits(minAge)}+ سال
                </span>
              )}
            </div>

            {/* دسته‌بندی‌ها */}
            {game.categories && game.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {game.categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    className="bg-white/10 text-white hover:bg-white/20 backdrop-blur"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* امتیاز و رتبه */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              {/* ✅ فقط اگه امتیاز داریم */}
              {averageRating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-2xl font-black text-yellow-950">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">میانگین امتیاز</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(averageRating / 2)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {rank !== null && rank > 0 && (
                <div>
                  <p className="text-sm text-gray-300">رتبه کلی</p>
                  <p className="text-2xl font-black">
                    #{toPersianDigits(rank)}
                  </p>
                </div>
              )}
            </div>

            {/* دکمه‌ها — بدون AppButton */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
              >
                <Star className="h-4 w-4" />
                ثبت امتیاز
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 font-medium text-sm transition-colors"
              >
                <Heart className="h-4 w-4" />
                افزودن به علاقه‌مندی‌ها
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-white hover:bg-white/10 transition-colors"
                title="اشتراک‌گذاری"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}