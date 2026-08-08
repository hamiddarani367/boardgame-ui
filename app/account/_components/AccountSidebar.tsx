"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  { href: "/account", icon: LayoutDashboard, label: "داشبورد" },
  { href: "/account/orders", icon: ShoppingBag, label: "سفارشات گذشته" },
  { href: "/account/addresses", icon: MapPin, label: "آدرس‌ها" },
  { href: "/account/wishlist", icon: Heart, label: "علاقه‌مندی‌ها" },
  { href: "/account/settings", icon: Settings, label: "تنظیمات" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block lg:w-80 flex-shrink-0">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 lg:p-5">
        <h2 className="text-lg font-black mb-5 hidden lg:block">حساب کاربری</h2>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
                {isActive && (
                  <ChevronLeft className="h-4 w-4 mr-auto hidden lg:block" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}