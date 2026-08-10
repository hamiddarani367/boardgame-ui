import type { Metadata } from "next";
import "./globals.css";
import { iranYekan } from "./fonts";
import { Providers } from "./providers";
import { MainLayout } from "@/components/layout/MainLayout";

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
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}