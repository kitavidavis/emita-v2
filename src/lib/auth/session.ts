import type { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "emita_access_token";
export const REFRESH_TOKEN_COOKIE = "emita_refresh_token";
export const ADMIN_ACCESS_TOKEN_COOKIE = "emita_admin_access_token";

const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // matches the backend's default refresh-token TTL

const baseCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setSessionCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
  accessTokenTtlSeconds: number
) {
  res.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions,
    maxAge: accessTokenTtlSeconds,
  });
  res.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.delete(ACCESS_TOKEN_COOKIE);
  res.cookies.delete(REFRESH_TOKEN_COOKIE);
}

export function setAdminSessionCookie(res: NextResponse, accessToken: string, accessTokenTtlSeconds: number) {
  res.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions,
    maxAge: accessTokenTtlSeconds,
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.delete(ADMIN_ACCESS_TOKEN_COOKIE);
}
