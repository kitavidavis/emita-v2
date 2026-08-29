import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/auth/session";

const IDENTITY_API = process.env.EMITA_IDENTITY_API_URL ?? "https://api.emita.co.ke/identity";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are both required." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${IDENTITY_API}/auth/platform/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the authentication service. Try again in a moment." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json({ message: "That email or password is incorrect." }, { status: 401 });
  }

  const data = await upstream.json();
  const res = NextResponse.json({ ok: true });
  setAdminSessionCookie(res, data.accessToken, data.expiresInSeconds);
  return res;
}
