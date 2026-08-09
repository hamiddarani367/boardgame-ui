import AccountMobileLogout from "@/components/layout/AccountMobileLogout";
import AccountSidebar from "./_components/AccountSidebar";
import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb + دکمه خروج موبایل */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[130rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors"
            >
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              حساب کاربری
            </span>
          </nav>

          {/* فقط در موبایل نمایش داده می‌شود */}
          <AccountMobileLogout />
        </div>
      </div>

      <div className="max-w-[130rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-5">
          <AccountSidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}