"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  Gift,
  Heart,
  Newspaper,
  Percent,
  Search,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "./MegaMenu";
import { CartDropdown } from "./CartDropDown";
import { getSiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { title: "تخفیف‌ها", href: "/products?sort=discount", icon: Percent },
  { title: "آموزش بازی‌ها", href: "/guides", icon: BookOpen },
  { title: "وبلاگ", href: "/blog", icon: Newspaper },
];

const POPULAR_SEARCHES = [
  "کاتان",
  "مونوپولی",
  "فکری",
  "کارتی",
  "مهمانی",
  "استراتژیک",
];

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2_000_000);

  useEffect(() => {
    getSiteSettings().then((s) => {
      setFreeShippingThreshold(s.freeShippingThreshold);
    });
  }, []);

  // ---- search states ----
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // جستجوهای اخیر (lazy initializer)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // جستجوی زنده با React Query (useSearch جدید)
  const { data: searchData, isLoading: isSearching } = useSearch(searchQuery);
  const results = searchData?.results ?? []; // Product[]

  const searchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const saveRecentSearch = useCallback(
    (query: string) => {
      const updated = [
        query,
        ...recentSearches.filter((item) => item !== query),
      ].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    },
    [recentSearches]
  );

  // بستن dropdown دسکتاپ با کلیک خارج
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // فوکوس خودکار
  useEffect(() => {
    if (showDropdown && desktopInputRef.current) {
      desktopInputRef.current.focus();
    }
  }, [showDropdown]);

  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // ---- handlers ----
  const handleResultClick = (slug: string, productName?: string) => {
    if (productName) saveRecentSearch(productName);
    router.push(`/products/${slug}`);
    closeAll();
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    saveRecentSearch(searchQuery.trim());
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    closeAll();
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
    router.push(`/products?search=${encodeURIComponent(query)}`);
    closeAll();
  };

  const closeAll = () => {
    setShowDropdown(false);
    setMobileSearchOpen(false);
    setSearchQuery("");
  };

  const clearDesktopInput = () => {
    setSearchQuery("");
    desktopInputRef.current?.focus();
  };

  // ---- توابع کمکی ----
  const RecentAndPopular = () => (
    <div className="p-4">
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">
              جستجوهای اخیر
            </h3>
          </div>
          <div className="space-y-1">
            {recentSearches.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleRecentSearchClick(query)}
                className="flex w-full items-center gap-3 px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {query}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">
            جستجوهای محبوب
          </h3>
        </div>
        <div className="space-y-1">
          {POPULAR_SEARCHES.map((query, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(query);
                handleSearchSubmit();
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
            >
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {query}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const SearchResultsList = () => (
    <div className="p-4">
      {isSearching && (
        <div className="py-8 text-center text-sm text-gray-500">
          در حال جستجو...
        </div>
      )}
      {!isSearching && results.length === 0 && searchQuery.trim() !== "" && (
        <div className="py-8 text-center text-sm text-gray-500">
          نتیجه‌ای یافت نشد
        </div>
      )}
      {results.length > 0 && (
        <div className="space-y-1">
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() =>
                handleResultClick(product.slug, product.name)
              }
              className="flex w-full items-center gap-3 px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {formatPrice(product.discounted_price ?? product.price)} تومان
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl w-full">
      {/* Top bar */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[130rem]">
          <div className="flex h-16 md:h-20 items-center gap-4 md:gap-8">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-[15px] md:text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Board Kingdom
                  </h1>
                  <p className="text-[10px] md:text-xs text-gray-500">
                    دنیای بازی‌های رومیزی
                  </p>
                </div>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                <input
                  ref={desktopInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!showDropdown) setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="جستجو میان بردگیم‌ها..."
                  className="w-full h-11 rounded-2xl border border-gray-200 bg-gray-50 pr-12 pl-10 text-sm outline-none transition-all focus-visible:border-blue-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={clearDesktopInput}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              {showDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                  {searchQuery.trim() === "" ? RecentAndPopular() : SearchResultsList()}
                </div>
              )}
            </div>

            {/* Mobile Trigger */}
            <div className="lg:hidden flex-1">
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="w-full flex items-center gap-2 h-11 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-400"
              >
                <Search className="size-5" />
                جستجو میان بردگیم‌ها...
              </button>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-blue-50"
              >
                <Heart className="size-5" />
              </Button>
              <CartDropdown />
              {user ? (
                <Link href="/account">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl hover:bg-blue-50"
                  >
                    <User className="size-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl border-gray-200 px-5 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <User className="ml-2 size-4" />
                    ورود / ثبت‌نام
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar (desktop) */}
      <div className="hidden lg:block border-t border-gray-100 w-full">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[130rem]">
            <div className="flex h-14 md:h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <MegaMenu />
                <nav className="flex items-center">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Icon className="size-4" />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <Gift className="size-4" />
                ارسال رایگان برای سفارش‌های بالای{" "}
                {formatPrice(freeShippingThreshold)} تومان
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div
          className="lg:hidden"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 bg-white">
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-1 -m-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    mobileInputRef.current?.focus();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-900">
            {searchQuery.trim() === "" ? RecentAndPopular() : SearchResultsList()}
          </div>
        </div>
      )}
    </header>
  );
}