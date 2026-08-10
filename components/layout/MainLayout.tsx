"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import { TooltipProvider } from "@/components/ui/tooltip";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  // اگر در مسیر auth بودیم، فقط children را بدون Layout برگردان
  if (isAuthPage) {
    return <>{children}</>;
  }

  // در غیر این صورت Layout کامل را رندر کن
  return (
    <TooltipProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <div className="mb-16 md:mb-0">
          <Footer />
        </div>
        <MobileBottomNav />
      </div>
    </TooltipProvider>
  );
}