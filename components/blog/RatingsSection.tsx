"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Star,
  Trophy,
} from "lucide-react";

// ==================== تبدیل ارقام ====================

function toPersianDigits(
  input: number | string | null | undefined
): string {
  if (input === null || input === undefined) {
    return "۰";
  }

  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

  return String(input).replace(
    /\d/g,
    (d) => persianDigits[Number(d)]
  );
}

// ==================== تایپ‌ها ====================

interface RatingItem {
  rating: number;
  count: number;
}

interface RatingsSectionProps {
  /**
   * امتیاز API از 10 است.
   *
   * مثال:
   * 7 => 3.5 / 5
   * 8.6 => 4.3 / 5
   */
  averageRating?: number;

  rank?: number;

  usersRated?: number;

  ratingDistribution?: RatingItem[];
}

// ==================== Star Rating ====================

function StarRating({
  rating,
}: {
  rating: number;
}) {
  const safeRating = Math.max(
    0,
    Math.min(5, rating)
  );

  return (
    <div
      className="flex items-center gap-1"
      dir="ltr"
      aria-label={`امتیاز ${safeRating.toFixed(1)} از 5`}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fill = Math.max(
          0,
          Math.min(1, safeRating - index)
        );

        return (
          <div
            key={index}
            className="relative h-5 w-5"
          >
            {/* ستاره خالی */}
            <Star
              className="absolute inset-0 h-5 w-5 text-gray-300 dark:text-gray-700"
              strokeWidth={1.8}
            />

            {/* ستاره پر شده */}
            {fill > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${fill * 100}%`,
                }}
              >
                <Star
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  strokeWidth={1.8}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== Component ====================

export function RatingsSection({
  averageRating = 0,
  rank,
  usersRated = 0,
  ratingDistribution = [],
}: RatingsSectionProps) {
  // API rating از 10 است
  const ratingOutOfFive = averageRating / 2;

  const safeDistribution = Array.isArray(
    ratingDistribution
  )
    ? ratingDistribution
    : [];

  const sortedDistribution = [
    ...safeDistribution,
  ].sort(
    (a, b) =>
      (b.rating ?? 0) -
      (a.rating ?? 0)
  );

  const maxCount =
    sortedDistribution.length > 0
      ? Math.max(
          ...sortedDistribution.map(
            (item) => item.count ?? 0
          )
        )
      : 0;

  const hasRating = averageRating > 0;

  const hasDistribution =
    sortedDistribution.length > 0 &&
    maxCount > 0;

  const hasRank =
    rank !== undefined &&
    rank !== null &&
    rank > 0;

  const hasUsersRated =
    usersRated > 0;

  const hasAnyData =
    hasRating ||
    hasDistribution ||
    hasRank ||
    hasUsersRated;

  // ==================== بدون داده ====================

  if (!hasAnyData) {
    return (
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">
            امتیازات
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="py-8 text-center">
            <Star className="mx-auto mb-3 h-10 w-10 text-gray-300" />

            <p className="text-sm text-gray-500">
              هنوز امتیازی برای این بازی ثبت نشده است
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          امتیازات
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ==================== خلاصه ==================== */}

        <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
          {/* امتیاز اصلی */}

          {hasRating && (
            <div className="flex min-w-[190px] flex-col items-center justify-center rounded-2xl bg-gray-50 p-5 dark:bg-gray-900">
              <div
                className="text-4xl font-black tracking-tight"
                dir="ltr"
              >
                {ratingOutOfFive.toFixed(1)}

                <span className="text-lg font-medium text-gray-400">
                  {" "}
                  / 5
                </span>
              </div>

              <div className="mt-3">
                <StarRating
                  rating={ratingOutOfFive}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                میانگین امتیاز
              </p>
            </div>
          )}

          {/* اطلاعات */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {hasRank && (
              <div className="flex items-center gap-3 rounded-xl border bg-white p-4 dark:bg-gray-950">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    رتبه بازی
                  </p>

                  <p className="mt-1 font-bold">
                    #{toPersianDigits(rank)}
                  </p>
                </div>
              </div>
            )}

            {hasUsersRated && (
              <div className="flex items-center gap-3 rounded-xl border bg-white p-4 dark:bg-gray-950">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    تعداد رأی
                  </p>

                  <p className="mt-1 font-bold">
                    {toPersianDigits(usersRated)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== توزیع ==================== */}

        {hasDistribution && (
          <div className="border-t pt-6">
            <div className="mb-4">
              <h4 className="font-semibold">
                توزیع امتیازات
              </h4>

              <p className="mt-1 text-xs text-gray-500">
                تعداد رأی‌های ثبت‌شده برای هر امتیاز
              </p>
            </div>

            <div className="space-y-3">
              {sortedDistribution.map(
                (item, index) => {
                  const count =
                    item.count ?? 0;

                  const percentage =
                    maxCount > 0
                      ? (count / maxCount) * 100
                      : 0;

                  return (
                    <div
                      key={`${item.rating}-${index}`}
                      className="flex items-center gap-3"
                    >
                      {/* Rating */}

                      <div
                        className="flex w-10 shrink-0 items-center justify-end gap-1"
                        dir="ltr"
                      >
                        <span className="text-sm font-medium">
                          {toPersianDigits(
                            item.rating
                          )}
                        </span>

                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      </div>

                      {/* Progress */}

                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      {/* Count */}

                      <span className="w-10 shrink-0 text-left text-xs text-gray-500">
                        {toPersianDigits(count)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}