import { NextRequest, NextResponse } from "next/server";
import { setSessionCookies } from "@/lib/auth/session";

const IDENTITY_API = process.env.EMITA_IDENTITY_API_URL ?? "https://api.emita.co.ke/identity";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const accountSlug = body?.accountSlug?.trim();
  const email = body?.email?.trim();
  const password = body?.password;

  if (!accountSlug || !email || !password) {
    return NextResponse.json(
      { message: "Workspace, email and password are all required." },
      { status: 400 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${IDENTITY_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountSlug, email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the authentication service. Try again in a moment." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { message: "That workspace, email or password is incorrect." },
      { status: 401 }
    );
  }

  const data = await upstream.json();

  if (data.mfaRequired) {
    return NextResponse.json({ mfaRequired: true, mfaChallengeToken: data.mfaChallengeToken });
  }

  const res = NextResponse.json({ mfaRequired: false });
  setSessionCookies(res, data.accessToken, data.refreshToken, data.expiresInSeconds);
  return res;
}
