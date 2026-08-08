import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { iranYekan } from "./fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Board Kingdom",
    template: "%s | Board Kingdom",
  },
  description: "Board Game Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${iranYekan.variable} bg-background text-foreground antialiased`}>
        <Providers>
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              {/* pb-16 برای فضای خالی بالای MobileBottomNav */}
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              {/* mb-16 برای فاصله از MobileBottomNav */}
              <div className="mb-16 md:mb-0">
                <Footer />
              </div>
              <MobileBottomNav />
            </div>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}