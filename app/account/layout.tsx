import type { Metadata } from "next";
import Link from "next/link";
import AccountSidebar from "./_components/AccountSidebar";

export const metadata: Metadata = {
  title: "حساب کاربری | Board Kingdom",
  description: "پنل کاربری فروشگاه Board Kingdom",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 py-6">
        <div className="mx-auto max-w-[130rem]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">حساب کاربری</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            <AccountSidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}