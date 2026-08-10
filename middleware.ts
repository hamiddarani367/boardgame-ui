import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/account")) {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      const signinUrl = new URL("/auth/signin", request.url);
      signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/account/:path*",
};