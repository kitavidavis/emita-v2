import { NextRequest, NextResponse } from "next/server";
import { setSessionCookies } from "@/lib/auth/session";

const IDENTITY_API = process.env.EMITA_IDENTITY_API_URL ?? "https://api.emita.co.ke/identity";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const mfaChallengeToken = body?.mfaChallengeToken;
  const code = body?.code?.trim();

  if (!mfaChallengeToken || !code) {
    return NextResponse.json({ message: "Enter the six-digit code to continue." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${IDENTITY_API}/auth/mfa/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mfaChallengeToken, code }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the authentication service. Try again in a moment." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json({ message: "That code isn't right." }, { status: 401 });
  }

  const data = await upstream.json();
  const res = NextResponse.json({ ok: true });
  setSessionCookies(res, data.accessToken, data.refreshToken, data.expiresInSeconds);
  return res;
}
