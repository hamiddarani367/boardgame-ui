"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  LayoutDashboard,
  MapPin,
  Settings,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: boolean;
}

const mainNavItems: NavItem[] = [
  { href: "/", icon: Home, label: "خانه" },
  { href: "/products", icon: ShoppingBag, label: "محصولات" },
  { href: "/checkout/cart", icon: ShoppingCart, label: "سبد خرید", badge: true },
  { href: "/wishlist", icon: Heart, label: "علاقه‌مندی" },
  { href: "/account", icon: User, label: "حساب کاربری" },
];

const accountNavItems: NavItem[] = [
  { href: "/account", icon: LayoutDashboard, label: "داشبورد" },
  { href: "/account/orders", icon: ShoppingBag, label: "سفارشات" },
  { href: "/account/addresses", icon: MapPin, label: "آدرس‌ها" },
  { href: "/account/wishlist", icon: Heart, label: "علاقه‌مندی" },
  { href: "/account/settings", icon: Settings, label: "تنظیمات" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // ✅ استفاده از React Query به‌جای Redux
  const { data: cart } = useCart();
  const totalItems = cart?.total_items ?? 0;

  const isAccountPage = pathname.startsWith("/account");
  const items = isAccountPage ? accountNavItems : mainNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-around h-16 px-2 overflow-x-auto">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" &&
              item.href !== "/account" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-colors relative flex-shrink-0 ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <item.icon className="h-5 w-5" />

              {/* ✅ badge سبد خرید */}
              {item.badge && !isAccountPage && totalItems > 0 && (
                <span className="absolute -top-0.5 right-1/4 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white px-1">
                  {totalItems.toLocaleString("fa-IR")}
                </span>
              )}

              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}