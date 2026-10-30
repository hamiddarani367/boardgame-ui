"use client";

import Link from "next/link";
import {
  Users,
  Clock,
  Baby,
  Palette,
  Crown,
  Tag,
  Puzzle,
} from "lucide-react";

function toPersianDigits(input: number | string | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/\d/g, (d) => persianDigits[Number(d)]);
}

// ✅ همه فیلدها optional
interface InfoPanelProps {
  game?: {
    designers?: { id: number; name: string }[];
    artists?: { id: number; name: string }[];
    publishers?: { id: number; name: string }[];
    categories?: { id: number; name: string }[];
    mechanics?: { id: number; name: string }[];
    min_players?: number;
    max_players?: number;
    playing_time?: number;
    min_age?: number;
  };
}

export function InfoPanel({ game }: InfoPanelProps) {
  const safe = game ?? {};
  const minPlayers = safe.min_players ?? 0;
  const maxPlayers = safe.max_players ?? 0;
  const playingTime = safe.playing_time ?? 0;
  const minAge = safe.min_age ?? 0;

  const infoItems = [
    {
      icon: Users,
      label: "تعداد بازیکن",
      value:
        minPlayers > 0
          ? maxPlayers > 0 && maxPlayers !== minPlayers
            ? `${toPersianDigits(minPlayers)}–${toPersianDigits(maxPlayers)} نفر`
            : `${toPersianDigits(minPlayers)} نفر`
          : null,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/40",
    },
    {
      icon: Clock,
      label: "زمان بازی",
      value:
        playingTime > 0 ? `${toPersianDigits(playingTime)} دقیقه` : null,
      color: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-950/40",
    },
    {
      icon: Baby,
      label: "رده سنی",
      value: minAge > 0 ? `${toPersianDigits(minAge)}+ سال` : null,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
  ].filter((i) => i.value);

  const hasContent =
    infoItems.length > 0 ||
    (safe.designers?.length ?? 0) > 0 ||
    (safe.publishers?.length ?? 0) > 0 ||
    (safe.categories?.length ?? 0) > 0 ||
    (safe.mechanics?.length ?? 0) > 0;

  if (!hasContent) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 text-center">
        <p className="text-sm text-gray-400">اطلاعاتی ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {infoItems.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-5 space-y-3">
            {infoItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <span className="text-sm text-gray-500 truncate">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {safe.designers && safe.designers.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-bold">طراحان</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safe.designers.map((d) => (
              <Link
                key={d.id}
                href={`/designers/${d.id}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {d.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {safe.publishers && safe.publishers.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold">ناشران</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safe.publishers.map((p) => (
              <Link
                key={p.id}
                href={`/publishers/${p.id}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {safe.categories && safe.categories.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-pink-500" />
            <h3 className="text-sm font-bold">دسته‌بندی</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safe.categories.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {safe.mechanics && safe.mechanics.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Puzzle className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-bold">مکانیزم‌ها</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safe.mechanics.map((m) => (
              <span
                key={m.id}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-xs text-indigo-700 dark:text-indigo-300"
              >
                {m.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}