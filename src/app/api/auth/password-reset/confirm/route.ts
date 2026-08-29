import { NextRequest, NextResponse } from "next/server";

const IDENTITY_API = process.env.EMITA_IDENTITY_API_URL ?? "https://api.emita.co.ke/identity";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const token = body?.token;
  const newPassword = body?.newPassword;

  if (!token || !newPassword) {
    return NextResponse.json({ message: "A reset token and new password are required." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${IDENTITY_API}/auth/password-reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the authentication service. Try again in a moment." },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    return NextResponse.json({ message: "That reset link is invalid or has expired." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
