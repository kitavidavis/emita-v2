import { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE, ADMIN_ACCESS_TOKEN_COOKIE } from "./session";

const IDENTITY_API = process.env.EMITA_IDENTITY_API_URL ?? "https://api.emita.co.ke/identity";

/** Forwards a request to Identity with the caller's session as a Bearer token. Null means "not signed in." */
export async function callIdentity(req: NextRequest, path: string, init?: RequestInit): Promise<Response | null> {
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  return fetch(`${IDENTITY_API}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

/** Forwards a request to Identity with the caller's platform-admin session as a Bearer token. Null means "not signed in." */
export async function callIdentityAsAdmin(req: NextRequest, path: string, init?: RequestInit): Promise<Response | null> {
  const token = req.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  return fetch(`${IDENTITY_API}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}
