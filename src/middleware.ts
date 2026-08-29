import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, ADMIN_ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/backoffice")) {
    if (pathname === "/backoffice/login") {
      return NextResponse.next();
    }
    if (req.cookies.has(ADMIN_ACCESS_TOKEN_COOKIE)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/backoffice/login", req.url));
  }

  if (req.cookies.has(ACCESS_TOKEN_COOKIE)) {
    return NextResponse.next();
  }
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/backoffice/:path*"],
};
