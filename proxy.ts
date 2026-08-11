import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // فقط مسیرهایی که با /account شروع می‌شوند را بررسی کن
  if (request.nextUrl.pathname.startsWith("/account")) {
    const token = request.cookies.get("auth_token")?.value;

    // اگر توکن وجود نداشت، به صفحهٔ ورود هدایت کن
    if (!token) {
      const signinUrl = new URL("/auth/signin", request.url);
      signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}

// تنظیمات matcher بدون تغییر
export const config = {
  matcher: "/account/:path*",
};