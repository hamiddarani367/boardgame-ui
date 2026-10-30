"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  Play,
  Star,
  MessageSquare,
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

// ==================== تایپ ====================

interface Stats {
  owners?: number;
  players?: number;
  ratings?: number;
  comments?: number;
}

interface StatsSectionProps {
  stats?: Stats;
}

// ==================== Component ====================

export function StatsSection({
  stats,
}: StatsSectionProps) {
  const owners = stats?.owners ?? 0;
  const players = stats?.players ?? 0;
  const ratings = stats?.ratings ?? 0;
  const comments = stats?.comments ?? 0;

  const items = [
    {
      icon: Users,
      label: "مالکین",
      value: owners,
      iconClass: "text-blue-600",
      bgClass:
        "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Play,
      label: "بازی‌های ثبت‌شده",
      value: players,
      iconClass: "text-green-600",
      bgClass:
        "bg-green-50 dark:bg-green-950/30",
    },
    {
      icon: Star,
      label: "تعداد امتیاز",
      value: ratings,
      iconClass: "text-yellow-600",
      bgClass:
        "bg-yellow-50 dark:bg-yellow-950/30",
    },
    {
      icon: MessageSquare,
      label: "نظرات",
      value: comments,
      iconClass: "text-purple-600",
      bgClass:
        "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  const hasAnyData =
    owners > 0 ||
    players > 0 ||
    ratings > 0 ||
    comments > 0;

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          آمار جامعه
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!hasAnyData ? (
          <div className="py-8 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />

            <p className="text-sm text-gray-500">
              هنوز آماری برای این بازی ثبت نشده است
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`rounded-xl p-4 ${item.bgClass}`}
                >
                  <div className="mb-3">
                    <Icon
                      className={`h-5 w-5 ${item.iconClass}`}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xl font-bold">
                    {toPersianDigits(item.value)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}